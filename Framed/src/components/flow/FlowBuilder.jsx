import { useState, useCallback } from 'react';
import { Plus, GitBranch, Play, CheckCircle2, XCircle } from 'lucide-react';
import { FormSelect } from '../shared/FormField';
import PillButton from '../shared/PillButton';
import Admonition from '../shared/Admonition';
import FlowCanvas from './FlowCanvas';
import FlowSuggestions from './FlowSuggestions';
import useRelationships from '../../hooks/useRelationships';
import s from './FlowBuilder.module.css';

export default function FlowBuilder({ blocks = {}, flow, setFlow }) {
  const [selectedBlockId, setSelectedBlockId] = useState('');

  // Get the last added node for suggestions
  const lastNodeId = flow.nodes.length > 0 ? flow.nodes[flow.nodes.length - 1].block_id : null;
  const { suggestions, topPairs, recordRun } = useRelationships(lastNodeId);

  const blockList = Object.values(blocks);
  const nodesInFlow = new Set(flow.nodes.map((n) => n.block_id));
  const availableBlocks = blockList.filter((b) => !nodesInFlow.has(b.block_id));

  const addBlockToFlow = useCallback((blockId) => {
    if (!blockId || nodesInFlow.has(blockId)) return;
    const existingXs = flow.nodes.map((n) => n.x);
    const maxX = existingXs.length > 0 ? Math.max(...existingXs) : -220;
    const newX = maxX + 260;
    const newY = 80 + (flow.nodes.length % 3) * 100;

    setFlow((prev) => ({
      ...prev,
      nodes: [...prev.nodes, { block_id: blockId, x: newX, y: newY }],
    }));
    setSelectedBlockId('');
  }, [flow.nodes, nodesInFlow, setFlow]);

  const handleRecordRun = useCallback((outcome) => {
    if (flow.nodes.length === 0) return;
    recordRun(flow, blocks, outcome);
  }, [flow, blocks, recordRun]);

  if (blockList.length === 0) {
    return (
      <div className={s.emptyPage}>
        <div className={s.emptyInner}>
          <GitBranch size={56} strokeWidth={1} style={{ color: 'var(--color-text-faint)' }} />
          <h2 className={s.emptyTitle}>Flow Builder</h2>
          <p className={s.emptyText}>
            Create blocks in the Block Builder first, then connect them here into executable workflows.
          </p>
          <Admonition variant="info" title="Getting Started">
            Switch to the Block Builder tab and create some blocks to populate the flow canvas.
          </Admonition>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <FormSelect
          value={selectedBlockId}
          onChange={(e) => setSelectedBlockId(e.target.value)}
          style={{ width: 220 }}
        >
          <option value="">Select a block...</option>
          {availableBlocks.map((b) => (
            <option key={b.block_id} value={b.block_id}>
              {b.title || 'Untitled Block'}
            </option>
          ))}
        </FormSelect>
        <PillButton
          onClick={() => addBlockToFlow(selectedBlockId)}
          disabled={!selectedBlockId}
          size="small"
        >
          <Plus size={14} />
          Add to Flow
        </PillButton>

        <div className={s.divider} />

        {flow.nodes.length > 0 && (
          <>
            <PillButton
              variant="secondary"
              size="small"
              onClick={() => handleRecordRun('success')}
              title="Record this flow as a successful run"
            >
              <CheckCircle2 size={14} />
              Success
            </PillButton>
            <PillButton
              variant="ghost"
              size="small"
              onClick={() => handleRecordRun('failure')}
              title="Record this flow as a failed run"
            >
              <XCircle size={14} />
              Failure
            </PillButton>
          </>
        )}

        <div className={s.toolbarInfo}>
          {flow.nodes.length} node{flow.nodes.length !== 1 ? 's' : ''}
          {' / '}
          {flow.edges.length} connection{flow.edges.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Suggestions bar */}
      {suggestions.length > 0 && (
        <div className={s.suggestionsBar}>
          <FlowSuggestions
            suggestions={suggestions}
            blocks={blocks}
            onAdd={addBlockToFlow}
          />
        </div>
      )}

      <FlowCanvas blocks={blocks} flow={flow} setFlow={setFlow} />
    </div>
  );
}
