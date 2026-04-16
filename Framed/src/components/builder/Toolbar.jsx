import {
  MousePointer,
  Crosshair,
  Square,
  ArrowUpRight,
  Circle,
  StickyNote,
  ImagePlus,
} from 'lucide-react';
import clsx from 'clsx';
import PillButton from '../shared/PillButton';
import ToolColorPicker from './ToolColorPicker';
import { SCALE_PRESETS } from '../../hooks/useToolSettings';
import s from './Toolbar.module.css';

const TOOL_ICONS = {
  select: MousePointer,
  mark: Crosshair,
  box: Square,
  arrow: ArrowUpRight,
  circle: Circle,
  note: StickyNote,
};

const DRAWING_TOOLS = new Set(['mark', 'box', 'arrow', 'circle', 'note']);

export default function Toolbar({
  tools,
  activeTool,
  onToolChange,
  onLoadImage,
  hasImage,
  fileRef,
  toolSettings,
  onToolColorChange,
  scale,
  onScaleChange,
}) {
  const showPicker = DRAWING_TOOLS.has(activeTool) && toolSettings;

  return (
    <div className={s.toolbar}>
      {tools.map((t) => {
        const Icon = TOOL_ICONS[t.id];
        const color = toolSettings?.[t.id]?.color;
        const isDrawing = DRAWING_TOOLS.has(t.id);
        return (
          <button
            key={t.id}
            className={clsx(s.toolButton, activeTool === t.id && s.toolButtonActive)}
            onClick={() => onToolChange(t.id)}
            title={t.label}
          >
            <span className={s.toolIcon}>
              {Icon && <Icon size={18} />}
            </span>
            <span className={s.toolLabel}>
              {t.label}
              {isDrawing && color && (
                <span
                  className={s.colorDot}
                  style={{ background: color }}
                />
              )}
            </span>
          </button>
        );
      })}
      {showPicker && (
        <>
          <div className={s.divider} />
          <ToolColorPicker
            currentColor={toolSettings[activeTool]?.color}
            onColorChange={(color) => onToolColorChange(activeTool, color)}
          />
        </>
      )}
      <div className={s.divider} />
      <div className={s.scaleGroup}>
        <span className={s.scaleLabel}>Size</span>
        {SCALE_PRESETS.map((p) => (
          <button
            key={p.value}
            className={clsx(s.scaleBtn, scale === p.value && s.scaleBtnActive)}
            onClick={() => onScaleChange(p.value)}
            title={`Marker size: ${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className={s.divider} />
      <PillButton onClick={() => fileRef.current?.click()}>
        <ImagePlus size={14} />
        {hasImage ? 'Replace Screenshot' : 'Load Screenshot'}
      </PillButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onLoadImage}
        style={{ display: 'none' }}
      />
    </div>
  );
}
