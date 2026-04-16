import { getEdge, putEdge, getEdgesFrom, getAllEdges, edgeId } from './db';

// Record a direct A→B transition (from flow edge or manual connection)
export async function recordTransition(sourceId, targetId, appContext, outcome) {
  const id = edgeId(sourceId, targetId, appContext);
  const existing = await getEdge(sourceId, targetId, appContext);

  const edge = existing || {
    edge_id: id,
    source_id: sourceId,
    target_id: targetId,
    app_context: appContext || '_',
    transition_count: 0,
    co_occurrence_count: 0,
    success_count: 0,
    failure_count: 0,
    last_seen: 0,
  };

  edge.transition_count += 1;
  edge.last_seen = Date.now();

  if (outcome === 'success') edge.success_count += 1;
  if (outcome === 'failure') edge.failure_count += 1;

  await putEdge(edge);
  return edge;
}

// Record co-occurrence (both blocks appeared in same flow)
export async function recordCoOccurrence(blockIdA, blockIdB, appContext) {
  // Normalize order so A::B and B::A are the same edge
  const [a, b] = [blockIdA, blockIdB].sort();
  const id = edgeId(a, b, appContext);
  const existing = await getEdge(a, b, appContext);

  const edge = existing || {
    edge_id: id,
    source_id: a,
    target_id: b,
    app_context: appContext || '_',
    transition_count: 0,
    co_occurrence_count: 0,
    success_count: 0,
    failure_count: 0,
    last_seen: 0,
  };

  edge.co_occurrence_count += 1;
  edge.last_seen = Date.now();

  await putEdge(edge);
}

// Record a full flow run — walks edges + computes co-occurrence
export async function recordFlowRun(flow, blocks, outcome) {
  if (!flow?.nodes?.length) return;

  // Record direct transitions from flow edges
  for (const edge of flow.edges || []) {
    const sourceBlock = blocks[edge.from_block_id];
    const appContext = sourceBlock?.application?.app_id || '_';
    await recordTransition(edge.from_block_id, edge.to_block_id, appContext, outcome);
  }

  // Record co-occurrence for all pairs of blocks in the flow
  const nodeIds = flow.nodes.map((n) => n.block_id);
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const blockA = blocks[nodeIds[i]];
      const appContext = blockA?.application?.app_id || '_';
      await recordCoOccurrence(nodeIds[i], nodeIds[j], appContext);
    }
  }
}

// Record a manual connection (user dragged edge in flow builder)
export async function recordManualConnection(fromId, toId, appContext) {
  await recordTransition(fromId, toId, appContext || '_', null);
}

// Get suggested next blocks based on success-weighted transition strength
export async function getSuggestions(blockId, limit = 5) {
  const edges = await getEdgesFrom(blockId);

  const scored = edges
    .filter((e) => e.transition_count > 0)
    .map((e) => {
      const successRate = e.success_count / (e.success_count + e.failure_count + 1);
      const score = successRate * e.transition_count;
      return { ...e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

// Get blocks commonly used alongside a given block (co-occurrence)
export async function getRelatedBlocks(blockId, limit = 10) {
  const all = await getAllEdges();
  const related = all
    .filter((e) => (e.source_id === blockId || e.target_id === blockId) && e.co_occurrence_count > 0)
    .sort((a, b) => b.co_occurrence_count - a.co_occurrence_count)
    .slice(0, limit)
    .map((e) => ({
      block_id: e.source_id === blockId ? e.target_id : e.source_id,
      co_occurrence_count: e.co_occurrence_count,
      edge: e,
    }));

  return related;
}

// Get top block pairs by transition frequency
export async function getTopPairs(limit = 10) {
  const all = await getAllEdges();
  return all
    .filter((e) => e.transition_count > 0)
    .sort((a, b) => b.transition_count - a.transition_count)
    .slice(0, limit);
}

// Export the full graph as JSON
export async function exportGraph() {
  return getAllEdges();
}
