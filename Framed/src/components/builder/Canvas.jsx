import { ImagePlus } from 'lucide-react';
import clsx from 'clsx';
import { colors, withAlpha } from '../../tokens/colorValues';
import s from './Canvas.module.css';

export default function Canvas({
  image,
  imageSize,
  canvasScale,
  canvasRef,
  containerRef,
  fileRef,
  tool,
  elements,
  annotations,
  selectedEl,
  dragStart,
  dragCurrent,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onDrop,
  onDragOver,
  toolSettings,
  markerScale = 1.5,
}) {
  const ms = markerScale;
  return (
    <div
      ref={containerRef}
      className={clsx(s.container, image ? s.containerLoaded : s.containerEmpty)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {!image ? (
        <div className={s.dropzone} onClick={() => fileRef.current?.click()}>
          <div className={s.dropzoneIcon}>
            <ImagePlus size={48} strokeWidth={1.2} />
          </div>
          <div className={s.dropzoneTitle}>Load a screenshot to begin</div>
          <div className={s.dropzoneText}>
            Import a full-screen capture of the application state you want to document.
            The frame becomes the foundation for your automation block.
          </div>
        </div>
      ) : (
        <div
          className={s.canvasWrapper}
          style={{ cursor: tool === 'select' ? 'default' : 'crosshair' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <img
            ref={canvasRef}
            src={image}
            alt="Frame"
            className={s.canvasImage}
            style={{
              width: imageSize.w * canvasScale,
              height: imageSize.h * canvasScale,
            }}
            draggable={false}
          />
          <svg
            className={s.svgOverlay}
            style={{
              width: imageSize.w * canvasScale,
              height: imageSize.h * canvasScale,
            }}
            viewBox={`0 0 ${imageSize.w} ${imageSize.h}`}
          >
            {/* Bounding boxes */}
            {elements.filter((e) => e.w).map((el) => {
              const c = el.color || colors.primary;
              return (
                <g key={el.element_id}>
                  <rect
                    x={el.x - el.w / 2}
                    y={el.y - el.h / 2}
                    width={el.w}
                    height={el.h}
                    fill={selectedEl === el.element_id ? withAlpha(c, 0.08) : withAlpha(c, 0.03)}
                    stroke={selectedEl === el.element_id ? c : withAlpha(c, 0.5)}
                    strokeWidth={2 * ms}
                    strokeDasharray={`${6 * ms} ${3 * ms}`}
                    rx={3 * ms}
                  />
                  {el.label && (
                    <text
                      x={el.x - el.w / 2 + 4 * ms}
                      y={el.y - el.h / 2 - 6 * ms}
                      fill={c}
                      fontSize={12 * ms}
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                    >
                      {el.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Point markers */}
            {elements.filter((e) => !e.w).map((el) => {
              const c = el.color || colors.primary;
              return (
              <g key={el.element_id}>
                <circle
                  cx={el.x}
                  cy={el.y}
                  r={14 * ms}
                  fill={withAlpha(c, 0.12)}
                  stroke={selectedEl === el.element_id ? c : withAlpha(c, 0.65)}
                  strokeWidth={2 * ms}
                />
                <circle cx={el.x} cy={el.y} r={3 * ms} fill={c} />
                <line
                  x1={el.x - 20 * ms} y1={el.y}
                  x2={el.x + 20 * ms} y2={el.y}
                  stroke={withAlpha(c, 0.25)}
                  strokeWidth={1 * ms}
                />
                <line
                  x1={el.x} y1={el.y - 20 * ms}
                  x2={el.x} y2={el.y + 20 * ms}
                  stroke={withAlpha(c, 0.25)}
                  strokeWidth={1 * ms}
                />
                {el.label && (
                  <>
                    <rect
                      x={el.x + 16 * ms}
                      y={el.y - 10 * ms}
                      width={el.label.length * 7.5 * ms + 12 * ms}
                      height={20 * ms}
                      rx={4 * ms}
                      fill={colors.surface}
                      stroke={c}
                      strokeWidth={1 * ms}
                    />
                    <text
                      x={el.x + 22 * ms}
                      y={el.y + 4 * ms}
                      fill={c}
                      fontSize={11 * ms}
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                    >
                      {el.label}
                    </text>
                  </>
                )}
              </g>
              );
            })}

            {/* Annotations */}
            {annotations.map((a) => {
              if (a.type === 'arrow') {
                const ac = a.color || colors.accentGold;
                const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
                const headLen = 12 * ms;
                return (
                  <g key={a.id}>
                    <line
                      x1={a.x1} y1={a.y1}
                      x2={a.x2} y2={a.y2}
                      stroke={ac}
                      strokeWidth={2.5 * ms}
                    />
                    <polygon
                      points={`${a.x2},${a.y2} ${a.x2 - headLen * Math.cos(angle - 0.4)},${a.y2 - headLen * Math.sin(angle - 0.4)} ${a.x2 - headLen * Math.cos(angle + 0.4)},${a.y2 - headLen * Math.sin(angle + 0.4)}`}
                      fill={ac}
                    />
                  </g>
                );
              }
              if (a.type === 'circle') {
                const ac = a.color || colors.accentCoral;
                return (
                  <ellipse
                    key={a.id}
                    cx={a.cx}
                    cy={a.cy}
                    rx={a.rx}
                    ry={a.ry}
                    fill="none"
                    stroke={ac}
                    strokeWidth={2.5 * ms}
                    strokeDasharray={`${8 * ms} ${4 * ms}`}
                  />
                );
              }
              if (a.type === 'note') {
                const ac = a.color || colors.accentGold;
                return (
                  <g key={a.id}>
                    <rect
                      x={a.x}
                      y={a.y}
                      width={140 * ms}
                      height={36 * ms}
                      rx={6 * ms}
                      fill={withAlpha(ac, 0.15)}
                      stroke={ac}
                      strokeWidth={1 * ms}
                    />
                    <text
                      x={a.x + 8 * ms}
                      y={a.y + 22 * ms}
                      fill={ac}
                      fontSize={10 * ms}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {a.text}
                    </text>
                  </g>
                );
              }
              return null;
            })}

            {/* Drag previews */}
            {dragStart && dragCurrent && tool === 'box' && (
              <rect
                x={Math.min(dragStart.x, dragCurrent.x)}
                y={Math.min(dragStart.y, dragCurrent.y)}
                width={Math.abs(dragCurrent.x - dragStart.x)}
                height={Math.abs(dragCurrent.y - dragStart.y)}
                fill={withAlpha(colors.primary, 0.06)}
                stroke={colors.primary}
                strokeWidth={2 * ms}
                strokeDasharray={`${6 * ms} ${3 * ms}`}
              />
            )}
            {dragStart && dragCurrent && tool === 'arrow' && (
              <line
                x1={dragStart.x} y1={dragStart.y}
                x2={dragCurrent.x} y2={dragCurrent.y}
                stroke={colors.accentGold}
                strokeWidth={2.5 * ms}
                strokeDasharray={`${6 * ms} ${3 * ms}`}
              />
            )}
            {dragStart && dragCurrent && tool === 'circle' && (
              <ellipse
                cx={(dragStart.x + dragCurrent.x) / 2}
                cy={(dragStart.y + dragCurrent.y) / 2}
                rx={Math.abs(dragCurrent.x - dragStart.x) / 2}
                ry={Math.abs(dragCurrent.y - dragStart.y) / 2}
                fill="none"
                stroke={colors.accentCoral}
                strokeWidth={2.5 * ms}
                strokeDasharray={`${6 * ms} ${3 * ms}`}
              />
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
