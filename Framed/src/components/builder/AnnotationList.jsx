import { ArrowUpRight, Circle, StickyNote, X } from 'lucide-react';
import PillButton from '../shared/PillButton';
import s from './AnnotationList.module.css';

const ANNOTATION_ICONS = {
  arrow: ArrowUpRight,
  circle: Circle,
  note: StickyNote,
};

export default function AnnotationList({ annotations, onRemove, onClearAll }) {
  if (annotations.length === 0) return null;

  return (
    <section>
      <div className={s.header}>
        <label style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}>
          Annotations ({annotations.length})
        </label>
        <PillButton variant="danger" size="small" onClick={onClearAll}>
          Clear All
        </PillButton>
      </div>
      <div className={s.chips}>
        {annotations.map((a) => {
          const Icon = ANNOTATION_ICONS[a.type];
          return (
            <span key={a.id} className={s.chip}>
              {Icon && (
                <span className={s.chipIcon}><Icon size={10} /></span>
              )}
              {a.type}
              <button
                className={s.chipDelete}
                onClick={() => onRemove(a.id)}
              >
                <X size={10} />
              </button>
            </span>
          );
        })}
      </div>
    </section>
  );
}
