import { colors } from '../../tokens/colorValues';

export default function FlowEdge({ fromX, fromY, toX, toY, onClick }) {
  const dx = Math.abs(toX - fromX) * 0.5;
  const d = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`;

  return (
    <g>
      {/* Fat invisible hitbox for click-to-delete */}
      <path
        d={d}
        stroke="transparent"
        strokeWidth={14}
        fill="none"
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        onClick={onClick}
      />
      {/* Visible edge */}
      <path
        d={d}
        stroke={colors.primary}
        strokeWidth={2}
        fill="none"
        opacity={0.5}
        style={{ pointerEvents: 'none' }}
      />
      {/* Arrow at midpoint */}
      <circle
        cx={(fromX + toX) / 2}
        cy={(fromY + toY) / 2}
        r={3}
        fill={colors.primary}
        opacity={0.5}
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
}
