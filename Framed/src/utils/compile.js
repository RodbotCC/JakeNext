import { uid } from './uid';

export function compileBlock(blockData, noteInput) {
  const elements = blockData.elements || [];
  return {
    block_id: blockData.block_id || uid(),
    title: blockData.title || 'Untitled Block',
    application: blockData.application || { app_id: 'unknown', screen_name: 'unknown' },
    source_frame: blockData.source_frame || {},
    elements: elements.map(({ element_id, label, x, y, w, h, saved_to_app_index }) => ({
      element_id,
      label,
      click_point: { x, y },
      ...(w ? { bounding_box: { x: x - Math.round(w / 2), y: y - Math.round(h / 2), w, h } } : {}),
      saved_to_app_index,
    })),
    notes: {
      user_note: noteInput,
      ai_refined_note: '',
      keep_mode: 'user',
    },
    action: blockData.action || { type: 'click', payload: {} },
    validation: blockData.validation || { success_conditions: [], failure_conditions: [] },
    post_processing: blockData.post_processing || { enabled: false, steps: [] },
    audit: blockData.audit || { enabled: false, checks: [], score_weight: 1 },
    deliverable: blockData.deliverable || { enabled: false, type: 'json', spec: '' },
    transitions: blockData.transitions || { next_blocks: [] },
    metrics: blockData.metrics || { success_count: 0, failure_count: 0, rating: 0 },
  };
}
