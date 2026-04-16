// Pure handler functions for each command type.
// These run server-side (Node) inside the Vite plugin.
// They read/write JSON files in .framed/state/ and .framed/responses/.

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

function readState(stateDir) {
  const read = (name) => {
    const p = join(stateDir, name);
    if (!existsSync(p)) return null;
    try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return null; }
  };
  return {
    blocks: read('blocks.json') || {},
    flow: read('flow.json') || { nodes: [], edges: [] },
    appIndex: read('app_index.json') || {},
    relationships: read('relationships.json') || [],
  };
}

function writeState(stateDir, key, data) {
  writeFileSync(join(stateDir, key), JSON.stringify(data, null, 2));
}

export function handleCommand(command, stateDir) {
  const { type, payload } = command;
  const state = readState(stateDir);

  switch (type) {
    case 'get_state': {
      return { status: 'completed', result: state };
    }

    case 'get_blocks': {
      return { status: 'completed', result: state.blocks };
    }

    case 'get_flow': {
      return { status: 'completed', result: state.flow };
    }

    case 'get_suggestions': {
      // Read from relationships data
      const blockId = payload?.block_id;
      if (!blockId) return { status: 'error', error: 'block_id required' };

      const edges = state.relationships.filter(
        (e) => e.source_id === blockId && e.transition_count > 0
      );
      const scored = edges
        .map((e) => ({
          ...e,
          score: (e.success_count / (e.success_count + e.failure_count + 1)) * e.transition_count,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, payload?.limit || 5);

      return { status: 'completed', result: scored };
    }

    case 'export_state': {
      // State is already exported by the client — this is a no-op acknowledgment
      return { status: 'completed', result: { message: 'State files are in .framed/state/' } };
    }

    default: {
      // Commands that modify state are handled client-side (browser).
      // The server just queues them for the polling hook to pick up.
      return { status: 'queued', message: `Command "${type}" queued for client execution` };
    }
  }
}
