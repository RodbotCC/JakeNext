import { Sparkles } from 'lucide-react';
import s from './FlowSuggestions.module.css';

export default function FlowSuggestions({ suggestions, blocks, onAdd }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={s.container}>
      <Sparkles size={12} style={{ color: 'var(--color-accent-green)', flexShrink: 0 }} />
      <span className={s.label}>Suggested:</span>
      <div className={s.chips}>
        {suggestions.map((sug) => {
          const block = blocks[sug.target_id];
          if (!block) return null;
          return (
            <button
              key={sug.edge_id}
              className={s.chip}
              onClick={() => onAdd(sug.target_id)}
              title={`${sug.transition_count} transitions, ${sug.success_count} successes`}
            >
              {block.title || 'Untitled'}
              <span className={s.score}>{sug.transition_count}x</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
