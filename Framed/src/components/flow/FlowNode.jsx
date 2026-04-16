import { X } from 'lucide-react';
import clsx from 'clsx';
import s from './FlowNode.module.css';

export default function FlowNode({
  block,
  x,
  y,
  isDragging,
  onMouseDown,
  onPortMouseDown,
  onPortMouseUp,
  onDelete,
}) {
  if (!block) return null;

  const elCount = (block.elements || []).length;
  const actionType = block.action?.type || 'click';

  return (
    <div
      className={clsx(s.node, isDragging && s.nodeDragging)}
      style={{ left: x, top: y }}
      onMouseDown={onMouseDown}
    >
      {/* Input port */}
      <div
        className={clsx(s.port, s.portIn)}
        onMouseUp={(e) => {
          e.stopPropagation();
          onPortMouseUp();
        }}
      />

      {/* Output port */}
      <div
        className={clsx(s.port, s.portOut)}
        onMouseDown={(e) => {
          e.stopPropagation();
          onPortMouseDown();
        }}
      />

      {/* Delete button */}
      <button
        className={s.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <X size={10} />
      </button>

      <div className={s.title}>{block.title || 'Untitled Block'}</div>
      <div className={s.meta}>
        <span className={s.badge}>{actionType}</span>
        {elCount > 0 && (
          <span className={clsx(s.badge, s.badgeGreen)}>{elCount} el</span>
        )}
      </div>
    </div>
  );
}
