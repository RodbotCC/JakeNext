import { useEffect, useRef, useCallback } from 'react';
import { uid } from '../utils/uid';
import { exportGraph } from '../utils/relationships';

const POLL_INTERVAL = 2000;
const SYNC_DEBOUNCE = 1500;

export default function useCommandBridge({
  blocks,
  setBlocks,
  flow,
  setFlow,
  appIndex,
  setAppIndex,
  activeBlockId,
  setActiveBlockId,
  createBlock,
  deleteBlock,
}) {
  const syncTimerRef = useRef(null);
  const pollRef = useRef(null);

  // Sync state to server (which writes to .framed/state/)
  const syncState = useCallback(async () => {
    try {
      const relationships = await exportGraph();
      await fetch('/api/state/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          flow,
          appIndex,
          relationships,
        }),
      });
    } catch {
      // Server may not be running (production build)
    }
  }, [blocks, flow, appIndex]);

  // Debounced sync on state changes
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(syncState, SYNC_DEBOUNCE);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [syncState]);

  // Process a single command
  const processCommand = useCallback(async (cmd) => {
    const { type, payload } = cmd;
    let result = null;

    switch (type) {
      case 'create_block': {
        const blockId = uid();
        const newBlock = {
          block_id: blockId,
          title: payload?.title || '',
          application: {
            app_id: payload?.app_id || '',
            screen_name: payload?.screen_name || '',
          },
          source_frame: {},
          elements: [],
          annotations: [],
          notes: { user_note: '', ai_refined_note: '', keep_mode: 'user' },
          action: { type: payload?.action_type || 'click', payload: {} },
          validation: { success_conditions: [], failure_conditions: [] },
          post_processing: { enabled: false, steps: [] },
          audit: { enabled: false, checks: [], score_weight: 1 },
          deliverable: { enabled: false, type: 'json', spec: '' },
        };
        setBlocks((prev) => ({ ...prev, [blockId]: newBlock }));
        setActiveBlockId(blockId);
        result = { block_id: blockId };
        break;
      }

      case 'update_block': {
        if (!payload?.block_id || !payload?.fields) break;
        setBlocks((prev) => {
          const existing = prev[payload.block_id];
          if (!existing) return prev;
          return { ...prev, [payload.block_id]: { ...existing, ...payload.fields } };
        });
        result = { updated: payload.block_id };
        break;
      }

      case 'delete_block': {
        if (payload?.block_id) {
          deleteBlock(payload.block_id);
          result = { deleted: payload.block_id };
        }
        break;
      }

      case 'add_element': {
        if (!payload?.block_id) break;
        const el = {
          element_id: uid(),
          label: payload.label || '',
          x: payload.x || 0,
          y: payload.y || 0,
          ...(payload.w ? { w: payload.w, h: payload.h } : {}),
          saved_to_app_index: false,
        };
        setBlocks((prev) => {
          const block = prev[payload.block_id];
          if (!block) return prev;
          return {
            ...prev,
            [payload.block_id]: {
              ...block,
              elements: [...(block.elements || []), el],
            },
          };
        });
        result = { element_id: el.element_id };
        break;
      }

      case 'add_to_flow': {
        if (!payload?.block_id) break;
        const existingXs = flow.nodes.map((n) => n.x);
        const maxX = existingXs.length > 0 ? Math.max(...existingXs) : -220;
        setFlow((prev) => ({
          ...prev,
          nodes: [...prev.nodes, {
            block_id: payload.block_id,
            x: payload.x || maxX + 260,
            y: payload.y || 80,
          }],
        }));
        result = { added: payload.block_id };
        break;
      }

      case 'connect_blocks': {
        if (!payload?.from_block_id || !payload?.to_block_id) break;
        setFlow((prev) => ({
          ...prev,
          edges: [...prev.edges, {
            from_block_id: payload.from_block_id,
            to_block_id: payload.to_block_id,
          }],
        }));
        result = { connected: true };
        break;
      }

      default: {
        result = { error: `Unknown command type: ${type}` };
      }
    }

    // Report completion
    try {
      await fetch(`/api/commands/${encodeURIComponent(cmd.id)}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result || {}),
      });
    } catch {}

    return result;
  }, [setBlocks, setFlow, setActiveBlockId, deleteBlock, flow.nodes]);

  // Poll for pending commands
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/commands/pending');
        if (!res.ok) return;
        const commands = await res.json();
        for (const cmd of commands) {
          await processCommand(cmd);
        }
      } catch {
        // Server not available
      }
    };

    pollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [processCommand]);
}
