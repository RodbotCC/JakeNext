import { Crosshair, Square, X, Check, BookmarkPlus } from 'lucide-react';
import WidgetCard from '../shared/WidgetCard';
import IconButton from '../shared/IconButton';
import PillButton from '../shared/PillButton';
import { FormInput } from '../shared/FormField';
import s from './ElementTag.module.css';

export default function ElementTag({
  el,
  selected,
  labelInput,
  onClick,
  onDelete,
  onLabelChange,
  onSaveToIndex,
}) {
  const isBox = !!el.w;
  const Icon = isBox ? Square : Crosshair;
  const badges = [];

  if (isBox) {
    badges.push({ label: `${el.w}\u00d7${el.h}`, color: 'gold' });
  }

  return (
    <div>
      <WidgetCard
        icon={<Icon size={16} />}
        title={el.label || 'Unlabeled'}
        subtitle={`(${el.x}, ${el.y})${isBox ? ` \u2192 ${el.w}\u00d7${el.h}` : ''}`}
        badges={el.saved_to_app_index ? [{ label: 'Saved', color: 'green' }] : undefined}
        selected={selected}
        onClick={onClick}
        actions={
          <IconButton
            icon={X}
            size={14}
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        }
      />
      {selected && (
        <div className={s.editRow}>
          <FormInput
            value={labelInput}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Label this element"
            autoFocus
            style={{ flex: 1 }}
          />
          {el.label && !el.saved_to_app_index && (
            <PillButton variant="secondary" size="small" onClick={onSaveToIndex}>
              <BookmarkPlus size={12} />
              Save
            </PillButton>
          )}
          {el.saved_to_app_index && (
            <span className={s.savedIndicator}>
              <Check size={12} /> Saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
