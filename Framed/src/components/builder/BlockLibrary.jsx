import { Layers, Plus, Trash2 } from 'lucide-react';
import WidgetCard from '../shared/WidgetCard';
import PillButton from '../shared/PillButton';
import IconButton from '../shared/IconButton';
import s from './BlockLibrary.module.css';

export default function BlockLibrary({
  blocks,
  activeBlockId,
  onCreate,
  onDelete,
  onSwitch,
}) {
  const blockList = Object.values(blocks);

  return (
    <div className={s.sidebar}>
      <div className={s.header}>
        <span className={s.title}>Blocks</span>
        <PillButton size="small" onClick={onCreate}>
          <Plus size={12} />
          New
        </PillButton>
      </div>

      {blockList.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIcon}>
            <Layers size={40} strokeWidth={1} />
          </div>
          <div className={s.emptyText}>
            No blocks yet. Create your first block to start building automation frames.
          </div>
          <PillButton onClick={onCreate}>
            <Plus size={14} />
            Create Block
          </PillButton>
        </div>
      ) : (
        <div className={s.list}>
          {blockList.map((block) => {
            const elCount = (block.elements || []).length;
            const badges = [];
            if (block.action?.type) {
              badges.push({ label: block.action.type, color: 'gold' });
            }
            if (elCount > 0) {
              badges.push({ label: `${elCount} el`, color: 'green' });
            }

            return (
              <WidgetCard
                key={block.block_id}
                title={block.title || 'Untitled Block'}
                subtitle={block.application?.app_id || undefined}
                badges={badges.length > 0 ? badges : undefined}
                selected={activeBlockId === block.block_id}
                onClick={() => onSwitch(block.block_id)}
                actions={
                  <IconButton
                    icon={Trash2}
                    size={14}
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(block.block_id);
                    }}
                  />
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
