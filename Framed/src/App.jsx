import { useCallback } from 'react';
import { TABS } from './utils/constants';
import { uid } from './utils/uid';
import { deleteImage } from './utils/db';
import useLocalStorage from './hooks/useLocalStorage';
import useCommandBridge from './hooks/useCommandBridge';
import useAISettings from './hooks/useAISettings';
import useToolSettings from './hooks/useToolSettings';
import AppShell from './components/layout/AppShell';
import TabNav from './components/layout/TabNav';
import BlockBuilder from './components/builder/BlockBuilder';
import FlowBuilder from './components/flow/FlowBuilder';
import ManualView from './components/manual/ManualView';
import Statistics from './components/stats/Statistics';
import SettingsPage from './components/settings/SettingsPage';

function newBlock() {
  return {
    block_id: uid(),
    title: '',
    application: { app_id: '', screen_name: '' },
    source_frame: {},
    elements: [],
    annotations: [],
    notes: { user_note: '', ai_refined_note: '', keep_mode: 'user' },
    action: { type: 'click', payload: {} },
    validation: { success_conditions: [], failure_conditions: [] },
    post_processing: { enabled: false, steps: [] },
    audit: { enabled: false, checks: [], score_weight: 1 },
    deliverable: { enabled: false, type: 'json', spec: '' },
  };
}

export default function App() {
  const [tab, setTab] = useLocalStorage('framed:tab', 'builder');
  const [blocks, setBlocks] = useLocalStorage('framed:blocks', {});
  const [activeBlockId, setActiveBlockId] = useLocalStorage('framed:activeBlock', null);
  const [appIndex, setAppIndex] = useLocalStorage('framed:appIndex', {});
  const [flow, setFlow] = useLocalStorage('framed:flow', { nodes: [], edges: [] });
  const [aiSettings, setAISettings] = useAISettings();
  const [toolSettings, setToolColor, markerScale, setMarkerScale] = useToolSettings();

  const blockData = activeBlockId ? blocks[activeBlockId] || null : null;

  const setBlockData = useCallback((fn) => {
    setBlocks((prev) => {
      if (!activeBlockId || !prev[activeBlockId]) return prev;
      const updated = typeof fn === 'function' ? fn(prev[activeBlockId]) : fn;
      return { ...prev, [activeBlockId]: updated };
    });
  }, [activeBlockId, setBlocks]);

  const createBlock = useCallback(() => {
    const block = newBlock();
    setBlocks((prev) => ({ ...prev, [block.block_id]: block }));
    setActiveBlockId(block.block_id);
  }, [setBlocks, setActiveBlockId]);

  const deleteBlock = useCallback((id) => {
    setBlocks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeBlockId === id) {
      setActiveBlockId((prev) => {
        const remaining = Object.keys(blocks).filter((k) => k !== id);
        return remaining.length > 0 ? remaining[0] : null;
      });
    }
    // Clean up IndexedDB image
    deleteImage(id);
    // Also remove from flow
    setFlow((prev) => ({
      nodes: prev.nodes.filter((n) => n.block_id !== id),
      edges: prev.edges.filter((e) => e.from_block_id !== id && e.to_block_id !== id),
    }));
  }, [activeBlockId, blocks, setBlocks, setActiveBlockId, setFlow]);

  const switchBlock = useCallback((id) => {
    setActiveBlockId(id);
  }, [setActiveBlockId]);

  // Command bridge: polls for commands from Claude Code, syncs state to .framed/
  useCommandBridge({
    blocks, setBlocks,
    flow, setFlow,
    appIndex, setAppIndex,
    activeBlockId, setActiveBlockId,
    createBlock,
    deleteBlock,
  });

  return (
    <AppShell>
      <TabNav tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'builder' && (
        <BlockBuilder
          blocks={blocks}
          activeBlockId={activeBlockId}
          blockData={blockData}
          setBlockData={setBlockData}
          appIndex={appIndex}
          setAppIndex={setAppIndex}
          onCreateBlock={createBlock}
          onDeleteBlock={deleteBlock}
          onSwitchBlock={switchBlock}
        />
      )}
      {tab === 'flow' && (
        <FlowBuilder
          blocks={blocks}
          flow={flow}
          setFlow={setFlow}
        />
      )}
      {tab === 'manual' && (
        <ManualView blocks={blocks} flow={flow} />
      )}
      {tab === 'stats' && <Statistics blocks={blocks} />}
      {tab === 'settings' && (
        <SettingsPage
          aiSettings={aiSettings}
          onAISettingsUpdate={setAISettings}
          toolSettings={toolSettings}
          onToolColorChange={setToolColor}
          scale={markerScale}
          onScaleChange={setMarkerScale}
        />
      )}
    </AppShell>
  );
}
