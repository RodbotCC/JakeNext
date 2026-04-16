import clsx from 'clsx';
import { TOOL_PALETTE } from '../../hooks/useToolSettings';
import s from './ToolColorPicker.module.css';

export default function ToolColorPicker({ currentColor, onColorChange }) {
  return (
    <div className={s.picker}>
      {TOOL_PALETTE.map(({ color, label }) => (
        <button
          key={color}
          className={clsx(s.swatch, currentColor === color && s.swatchActive)}
          onClick={() => onColorChange(color)}
          title={label}
          aria-label={`Set color to ${label}`}
        >
          <div className={s.swatchInner} style={{ background: color }} />
        </button>
      ))}
    </div>
  );
}
