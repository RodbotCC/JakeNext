import { useState, useRef, useCallback, useEffect } from "react";

const ACCENT = "#00e5a0";
const ACCENT_DIM = "#00e5a033";
const BG = "#0a0e14";
const SURFACE = "#111820";
const SURFACE2 = "#1a2230";
const BORDER = "#253040";
const TEXT = "#c8d6e5";
const TEXT_DIM = "#6b7f96";
const DANGER = "#ff4757";
const WARN = "#ffa502";

const TOOLS = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "mark", label: "Mark Point", icon: "◎" },
  { id: "box", label: "Bounding Box", icon: "▢" },
  { id: "arrow", label: "Arrow", icon: "→" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "note", label: "Sticky Note", icon: "📌" },
];

const ACTION_TYPES = ["click", "type", "hotkey", "wait", "script", "curl", "agent"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function ToolButton({ tool, active, onClick }) {
  return (
    <button
      onClick={() => onClick(tool.id)}
      style={{
        background: active ? ACCENT_DIM : "transparent",
        border: `1px solid ${active ? ACCENT : BORDER}`,
        color: active ? ACCENT : TEXT_DIM,
        borderRadius: 6,
        padding: "8px 10px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        fontSize: 11,
        fontFamily: "inherit",
        transition: "all 0.15s ease",
        minWidth: 56,
      }}
      title={tool.label}
    >
      <span style={{ fontSize: 18 }}>{tool.icon}</span>
      <span>{tool.label}</span>
    </button>
  );
}

function ElementTag({ el, selected, onClick, onDelete }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? ACCENT_DIM : SURFACE2,
        border: `1px solid ${selected ? ACCENT : BORDER}`,
        borderRadius: 6,
        padding: "6px 10px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: selected ? ACCENT : TEXT, fontSize: 13, fontWeight: 600 }}>
          {el.label || "Unlabeled"}
        </span>
        <span style={{ color: TEXT_DIM, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
          ({el.x}, {el.y})
          {el.w ? ` → ${el.w}×${el.h}` : ""}
        </span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        style={{
          background: "transparent", border: "none", color: DANGER,
          cursor: "pointer", fontSize: 14, padding: "2px 4px", opacity: 0.6,
        }}
      >✕</button>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`,
      background: BG, position: "sticky", top: 0, zIndex: 100,
    }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            background: active === t.id ? SURFACE : "transparent",
            border: "none",
            borderBottom: active === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
            color: active === t.id ? ACCENT : TEXT_DIM,
            padding: "14px 24px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            transition: "all 0.2s ease",
          }}
        >
          {t.icon} {t.label}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{
        display: "flex", alignItems: "center", padding: "0 20px",
        color: TEXT_DIM, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
      }}>
        FRAMEFORGE v0.1
      </div>
    </div>
  );
}

function JsonPreview({ block }) {
  const json = JSON.stringify(block, null, 2);
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => { navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{
          position: "absolute", top: 8, right: 8, background: ACCENT_DIM,
          border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: 4,
          padding: "4px 10px", cursor: "pointer", fontSize: 11, fontFamily: "inherit",
        }}
      >{copied ? "Copied!" : "Copy JSON"}</button>
      <pre style={{
        background: BG, border: `1px solid ${BORDER}`, borderRadius: 8,
        padding: 16, margin: 0, color: TEXT, fontSize: 11, lineHeight: 1.6,
        fontFamily: "'JetBrains Mono', monospace", overflow: "auto", maxHeight: 500,
        whiteSpace: "pre-wrap", wordBreak: "break-all",
      }}>{json}</pre>
    </div>
  );
}

// ─── BLOCK BUILDER ───────────────────────────────────────────
function BlockBuilder({ blockData, setBlockData, appIndex, setAppIndex }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileRef = useRef(null);
  const [tool, setTool] = useState("mark");
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [selectedEl, setSelectedEl] = useState(null);
  const [labelInput, setLabelInput] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [noteInput, setNoteInput] = useState(blockData.notes?.user_note || "");
  const [canvasScale, setCanvasScale] = useState(1);

  const elements = blockData.elements || [];
  const annotations = blockData.annotations || [];

  const setElements = (fn) => {
    setBlockData((d) => ({ ...d, elements: typeof fn === "function" ? fn(d.elements || []) : fn }));
  };
  const setAnnotations = (fn) => {
    setBlockData((d) => ({ ...d, annotations: typeof fn === "function" ? fn(d.annotations || []) : fn }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(ev.target.result);
        setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
        setBlockData((d) => ({
          ...d,
          source_frame: { ...d.source_frame, screenshot_loaded: true, original_size: { w: img.naturalWidth, h: img.naturalHeight } },
        }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getImageCoords = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.round((e.clientX - rect.left) / canvasScale);
    const y = Math.round((e.clientY - rect.top) / canvasScale);
    return { x, y };
  };

  const handleCanvasMouseDown = (e) => {
    if (!image) return;
    const coords = getImageCoords(e);
    if (!coords) return;

    if (tool === "mark") {
      const newEl = { element_id: uid(), label: "", x: coords.x, y: coords.y, saved_to_app_index: false };
      setElements((prev) => [...prev, newEl]);
      setSelectedEl(newEl.element_id);
      setLabelInput("");
    } else if (tool === "box" || tool === "arrow" || tool === "circle") {
      setDragStart(coords);
      setDragCurrent(coords);
    } else if (tool === "note") {
      const newNote = {
        id: uid(), type: "note", x: coords.x, y: coords.y,
        text: "Double-click to edit", color: WARN,
      };
      setAnnotations((prev) => [...prev, newNote]);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!dragStart) return;
    const coords = getImageCoords(e);
    if (coords) setDragCurrent(coords);
  };

  const handleCanvasMouseUp = () => {
    if (dragStart && dragCurrent) {
      if (tool === "box") {
        const x = Math.min(dragStart.x, dragCurrent.x);
        const y = Math.min(dragStart.y, dragCurrent.y);
        const w = Math.abs(dragCurrent.x - dragStart.x);
        const h = Math.abs(dragCurrent.y - dragStart.y);
        if (w > 5 && h > 5) {
          const newEl = { element_id: uid(), label: "", x: x + Math.round(w / 2), y: y + Math.round(h / 2), w, h, saved_to_app_index: false };
          setElements((prev) => [...prev, newEl]);
          setSelectedEl(newEl.element_id);
          setLabelInput("");
        }
      } else if (tool === "arrow") {
        setAnnotations((prev) => [...prev, {
          id: uid(), type: "arrow",
          x1: dragStart.x, y1: dragStart.y, x2: dragCurrent.x, y2: dragCurrent.y,
        }]);
      } else if (tool === "circle") {
        const cx = (dragStart.x + dragCurrent.x) / 2;
        const cy = (dragStart.y + dragCurrent.y) / 2;
        const rx = Math.abs(dragCurrent.x - dragStart.x) / 2;
        const ry = Math.abs(dragCurrent.y - dragStart.y) / 2;
        setAnnotations((prev) => [...prev, { id: uid(), type: "circle", cx, cy, rx, ry }]);
      }
    }
    setDragStart(null);
    setDragCurrent(null);
  };

  useEffect(() => {
    if (!containerRef.current || !imageSize.w) return;
    const cw = containerRef.current.clientWidth - 32;
    const scale = Math.min(1, cw / imageSize.w);
    setCanvasScale(scale);
  }, [imageSize, image]);

  const updateElementLabel = (id, label) => {
    setElements((prev) => prev.map((el) => el.element_id === id ? { ...el, label } : el));
  };

  const saveToIndex = (el) => {
    const app = blockData.application?.app_id || "default";
    setAppIndex((prev) => {
      const existing = prev[app] || [];
      if (existing.find((e) => e.label === el.label)) return prev;
      return { ...prev, [app]: [...existing, { label: el.label, last_x: el.x, last_y: el.y }] };
    });
    setElements((prev) => prev.map((e) => e.element_id === el.element_id ? { ...e, saved_to_app_index: true } : e));
  };

  const compileBlock = () => {
    return {
      block_id: blockData.block_id || uid(),
      title: blockData.title || "Untitled Block",
      application: blockData.application || { app_id: "unknown", screen_name: "unknown" },
      source_frame: blockData.source_frame || {},
      elements: elements.map(({ element_id, label, x, y, w, h, saved_to_app_index }) => ({
        element_id, label, click_point: { x, y },
        ...(w ? { bounding_box: { x: x - Math.round(w / 2), y: y - Math.round(h / 2), w, h } } : {}),
        saved_to_app_index,
      })),
      notes: {
        user_note: noteInput,
        ai_refined_note: "",
        keep_mode: "user",
      },
      action: blockData.action || { type: "click", payload: {} },
      validation: blockData.validation || { success_conditions: [], failure_conditions: [] },
      post_processing: { enabled: false, steps: [] },
      audit: { enabled: false, checks: [], score_weight: 1 },
      deliverable: { enabled: false, type: "json", spec: {} },
      transitions: { next_blocks: [] },
      metrics: { success_count: 0, failure_count: 0, rating: 0 },
    };
  };

  const appId = blockData.application?.app_id || "default";
  const savedElements = appIndex[appId] || [];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 52px)", overflow: "hidden" }}>
      {/* LEFT: Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          display: "flex", gap: 6, padding: "10px 16px",
          borderBottom: `1px solid ${BORDER}`, background: SURFACE,
          flexWrap: "wrap", alignItems: "center",
        }}>
          {TOOLS.map((t) => (
            <ToolButton key={t.id} tool={t} active={tool === t.id} onClick={setTool} />
          ))}
          <div style={{ width: 1, height: 36, background: BORDER, margin: "0 8px" }} />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              background: ACCENT, border: "none", color: BG, borderRadius: 6,
              padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700,
              fontFamily: "inherit", letterSpacing: "0.3px",
            }}
          >
            {image ? "Replace Screenshot" : "Load Screenshot"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          style={{
            flex: 1, overflow: "auto", padding: 16,
            background: `repeating-conic-gradient(${SURFACE} 0% 25%, ${BG} 0% 50%) 0 0 / 20px 20px`,
            display: "flex", justifyContent: "center", alignItems: image ? "flex-start" : "center",
          }}
        >
          {!image ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${BORDER}`, borderRadius: 12,
                padding: "80px 60px", cursor: "pointer", textAlign: "center",
                color: TEXT_DIM, maxWidth: 500,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>◎</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Load a screenshot to begin</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                Import a full-screen capture of the application state you want to document.
                The frame becomes the foundation for your automation block.
              </div>
            </div>
          ) : (
            <div
              style={{ position: "relative", cursor: tool === "select" ? "default" : "crosshair" }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            >
              <img
                ref={canvasRef}
                src={image}
                alt="Frame"
                style={{
                  display: "block",
                  width: imageSize.w * canvasScale,
                  height: imageSize.h * canvasScale,
                  borderRadius: 4,
                  boxShadow: `0 0 0 1px ${BORDER}`,
                }}
                draggable={false}
              />
              {/* SVG overlay */}
              <svg
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: imageSize.w * canvasScale, height: imageSize.h * canvasScale,
                  pointerEvents: "none",
                }}
                viewBox={`0 0 ${imageSize.w} ${imageSize.h}`}
              >
                {/* Bounding boxes */}
                {elements.filter((e) => e.w).map((el) => (
                  <g key={el.element_id}>
                    <rect
                      x={el.x - el.w / 2} y={el.y - el.h / 2} width={el.w} height={el.h}
                      fill={selectedEl === el.element_id ? `${ACCENT}15` : `${ACCENT}08`}
                      stroke={selectedEl === el.element_id ? ACCENT : `${ACCENT}88`}
                      strokeWidth={2} strokeDasharray="6 3" rx={3}
                    />
                    {el.label && (
                      <text x={el.x - el.w / 2 + 4} y={el.y - el.h / 2 - 6}
                        fill={ACCENT} fontSize={12} fontFamily="JetBrains Mono, monospace" fontWeight="600"
                      >{el.label}</text>
                    )}
                  </g>
                ))}
                {/* Point markers */}
                {elements.filter((e) => !e.w).map((el) => (
                  <g key={el.element_id}>
                    <circle cx={el.x} cy={el.y} r={14} fill={`${ACCENT}20`}
                      stroke={selectedEl === el.element_id ? ACCENT : `${ACCENT}aa`} strokeWidth={2} />
                    <circle cx={el.x} cy={el.y} r={3} fill={ACCENT} />
                    <line x1={el.x - 20} y1={el.y} x2={el.x + 20} y2={el.y}
                      stroke={`${ACCENT}44`} strokeWidth={1} />
                    <line x1={el.x} y1={el.y - 20} x2={el.x} y2={el.y + 20}
                      stroke={`${ACCENT}44`} strokeWidth={1} />
                    {el.label && (
                      <>
                        <rect x={el.x + 16} y={el.y - 10} width={el.label.length * 7.5 + 12}
                          height={20} rx={4} fill={SURFACE} stroke={ACCENT} strokeWidth={1} />
                        <text x={el.x + 22} y={el.y + 4}
                          fill={ACCENT} fontSize={11} fontFamily="JetBrains Mono, monospace" fontWeight="600"
                        >{el.label}</text>
                      </>
                    )}
                  </g>
                ))}
                {/* Annotations */}
                {annotations.map((a) => {
                  if (a.type === "arrow") {
                    const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
                    const headLen = 12;
                    return (
                      <g key={a.id}>
                        <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                          stroke={WARN} strokeWidth={2.5} />
                        <polygon
                          points={`${a.x2},${a.y2} ${a.x2 - headLen * Math.cos(angle - 0.4)},${a.y2 - headLen * Math.sin(angle - 0.4)} ${a.x2 - headLen * Math.cos(angle + 0.4)},${a.y2 - headLen * Math.sin(angle + 0.4)}`}
                          fill={WARN}
                        />
                      </g>
                    );
                  }
                  if (a.type === "circle") {
                    return (
                      <ellipse key={a.id} cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry}
                        fill="none" stroke={DANGER} strokeWidth={2.5} strokeDasharray="8 4" />
                    );
                  }
                  if (a.type === "note") {
                    return (
                      <g key={a.id}>
                        <rect x={a.x} y={a.y} width={140} height={36} rx={4}
                          fill={`${WARN}22`} stroke={WARN} strokeWidth={1} />
                        <text x={a.x + 8} y={a.y + 22} fill={WARN} fontSize={10}
                          fontFamily="JetBrains Mono, monospace">{a.text}</text>
                      </g>
                    );
                  }
                  return null;
                })}
                {/* Drag preview */}
                {dragStart && dragCurrent && tool === "box" && (
                  <rect
                    x={Math.min(dragStart.x, dragCurrent.x)} y={Math.min(dragStart.y, dragCurrent.y)}
                    width={Math.abs(dragCurrent.x - dragStart.x)} height={Math.abs(dragCurrent.y - dragStart.y)}
                    fill={`${ACCENT}10`} stroke={ACCENT} strokeWidth={2} strokeDasharray="6 3"
                  />
                )}
                {dragStart && dragCurrent && tool === "arrow" && (
                  <line x1={dragStart.x} y1={dragStart.y} x2={dragCurrent.x} y2={dragCurrent.y}
                    stroke={WARN} strokeWidth={2.5} strokeDasharray="6 3" />
                )}
                {dragStart && dragCurrent && tool === "circle" && (
                  <ellipse
                    cx={(dragStart.x + dragCurrent.x) / 2} cy={(dragStart.y + dragCurrent.y) / 2}
                    rx={Math.abs(dragCurrent.x - dragStart.x) / 2} ry={Math.abs(dragCurrent.y - dragStart.y) / 2}
                    fill="none" stroke={DANGER} strokeWidth={2.5} strokeDasharray="6 3"
                  />
                )}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Panel */}
      <div style={{
        width: 360, borderLeft: `1px solid ${BORDER}`, background: SURFACE,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Block meta */}
          <section>
            <label style={sLabel}>Block Title</label>
            <input
              value={blockData.title || ""}
              onChange={(e) => setBlockData((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Navigate to Customers Tab"
              style={sInput}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={sLabel}>App ID</label>
                <input
                  value={blockData.application?.app_id || ""}
                  onChange={(e) => setBlockData((d) => ({ ...d, application: { ...d.application, app_id: e.target.value } }))}
                  placeholder="e.g. salesforce"
                  style={sInput}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={sLabel}>Screen</label>
                <input
                  value={blockData.application?.screen_name || ""}
                  onChange={(e) => setBlockData((d) => ({ ...d, application: { ...d.application, screen_name: e.target.value } }))}
                  placeholder="e.g. dashboard"
                  style={sInput}
                />
              </div>
            </div>
          </section>

          {/* Elements */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ ...sLabel, margin: 0 }}>Elements ({elements.length})</label>
              {savedElements.length > 0 && (
                <select
                  onChange={(e) => {
                    const saved = savedElements.find((s) => s.label === e.target.value);
                    if (saved) {
                      const newEl = { element_id: uid(), label: saved.label, x: saved.last_x, y: saved.last_y, saved_to_app_index: true };
                      setElements((prev) => [...prev, newEl]);
                      setSelectedEl(newEl.element_id);
                    }
                    e.target.value = "";
                  }}
                  style={{ ...sInput, width: "auto", padding: "4px 8px", fontSize: 11 }}
                >
                  <option value="">+ From library</option>
                  {savedElements.map((s) => (
                    <option key={s.label} value={s.label}>{s.label} ({s.last_x}, {s.last_y})</option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {elements.length === 0 && (
                <div style={{ color: TEXT_DIM, fontSize: 12, padding: "12px 0", textAlign: "center" }}>
                  Use Mark Point or Bounding Box tool to add elements
                </div>
              )}
              {elements.map((el) => (
                <div key={el.element_id}>
                  <ElementTag
                    el={el}
                    selected={selectedEl === el.element_id}
                    onClick={() => { setSelectedEl(el.element_id); setLabelInput(el.label); }}
                    onDelete={() => {
                      setElements((prev) => prev.filter((e) => e.element_id !== el.element_id));
                      if (selectedEl === el.element_id) setSelectedEl(null);
                    }}
                  />
                  {selectedEl === el.element_id && (
                    <div style={{ display: "flex", gap: 6, marginTop: 6, paddingLeft: 4 }}>
                      <input
                        value={labelInput}
                        onChange={(e) => { setLabelInput(e.target.value); updateElementLabel(el.element_id, e.target.value); }}
                        placeholder="Label this element"
                        style={{ ...sInput, flex: 1, fontSize: 12 }}
                        autoFocus
                      />
                      {el.label && !el.saved_to_app_index && (
                        <button
                          onClick={() => saveToIndex(el)}
                          style={{
                            background: ACCENT_DIM, border: `1px solid ${ACCENT}`, color: ACCENT,
                            borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 10,
                            fontFamily: "inherit", whiteSpace: "nowrap",
                          }}
                        >Save to Library</button>
                      )}
                      {el.saved_to_app_index && (
                        <span style={{ color: ACCENT, fontSize: 10, display: "flex", alignItems: "center" }}>✓ Saved</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Action */}
          <section>
            <label style={sLabel}>Action Type</label>
            <select
              value={blockData.action?.type || "click"}
              onChange={(e) => setBlockData((d) => ({ ...d, action: { ...d.action, type: e.target.value } }))}
              style={sInput}
            >
              {ACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </section>

          {/* Notes */}
          <section>
            <label style={sLabel}>Operator Notes</label>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Describe what is happening in this frame, what the action should accomplish, and any conditions that need to hold..."
              style={{ ...sInput, minHeight: 100, resize: "vertical", lineHeight: 1.5 }}
            />
          </section>

          {/* Annotations list */}
          {annotations.length > 0 && (
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ ...sLabel, margin: 0 }}>Annotations ({annotations.length})</label>
                <button
                  onClick={() => setAnnotations([])}
                  style={{ background: "transparent", border: "none", color: DANGER, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}
                >Clear All</button>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                {annotations.map((a) => (
                  <span key={a.id} style={{
                    background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 4,
                    padding: "3px 8px", fontSize: 10, color: TEXT_DIM,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {a.type}
                    <button
                      onClick={() => setAnnotations((prev) => prev.filter((x) => x.id !== a.id))}
                      style={{ background: "transparent", border: "none", color: DANGER, cursor: "pointer", fontSize: 10, marginLeft: 4 }}
                    >✕</button>
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Compile button */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => setShowJson(!showJson)}
            style={{
              background: showJson ? SURFACE2 : ACCENT, border: "none",
              color: showJson ? TEXT : BG, borderRadius: 6, padding: "10px 16px",
              cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              letterSpacing: "0.3px", width: "100%",
            }}
          >
            {showJson ? "Close JSON Preview" : "⚡ Compile Block"}
          </button>
        </div>

        {showJson && (
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: 12, maxHeight: 400, overflow: "auto" }}>
            <JsonPreview block={compileBlock()} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FLOW BUILDER ────────────────────────────────────────────
function FlowBuilder() {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 40, color: TEXT_DIM,
    }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>⟁</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Flow Builder</div>
        <div style={{ fontSize: 13, lineHeight: 1.7 }}>
          Connect blocks into executable workflows. Define transitions, branching logic,
          and insert specialist actions between frames. Build blocks first, then wire them here.
        </div>
        <div style={{
          marginTop: 24, padding: 16, background: SURFACE2, borderRadius: 8,
          border: `1px solid ${BORDER}`, fontSize: 12, lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace", textAlign: "left",
        }}>
          <div style={{ color: ACCENT, marginBottom: 8 }}>// Ready for implementation</div>
          <div>→ Block-to-block linking</div>
          <div>→ Conditional branching</div>
          <div>→ Script / cURL injection points</div>
          <div>→ Visual flow path inspection</div>
        </div>
      </div>
    </div>
  );
}

// ─── STATISTICS ──────────────────────────────────────────────
function Statistics() {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 40, color: TEXT_DIM,
    }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>◈</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Statistics & Performance</div>
        <div style={{ fontSize: 13, lineHeight: 1.7 }}>
          Track success rates, audit scores, and execution history across every block.
          The manual becomes operationally intelligent as blocks accumulate performance data.
        </div>
        <div style={{
          marginTop: 24, padding: 16, background: SURFACE2, borderRadius: 8,
          border: `1px solid ${BORDER}`, fontSize: 12, lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace", textAlign: "left",
        }}>
          <div style={{ color: ACCENT, marginBottom: 8 }}>// Ready for implementation</div>
          <div>→ Block success/failure rates</div>
          <div>→ Confidence scoring</div>
          <div>→ Audit pass rate tracking</div>
          <div>→ Score history over time</div>
          <div>→ Strategy performance comparison</div>
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const sLabel = {
  display: "block", fontSize: 10, fontWeight: 700, color: TEXT_DIM,
  textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6,
};
const sInput = {
  width: "100%", background: BG, border: `1px solid ${BORDER}`,
  borderRadius: 6, padding: "8px 10px", color: TEXT, fontSize: 13,
  fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};

// ─── MAIN APP ────────────────────────────────────────────────
const TABS = [
  { id: "builder", label: "Block Builder", icon: "◎" },
  { id: "flow", label: "Flow Builder", icon: "⟁" },
  { id: "stats", label: "Statistics", icon: "◈" },
];

export default function FrameForge() {
  const [tab, setTab] = useState("builder");
  const [blockData, setBlockData] = useState({
    block_id: uid(),
    title: "",
    application: { app_id: "", screen_name: "" },
    source_frame: {},
    elements: [],
    annotations: [],
    notes: { user_note: "", ai_refined_note: "", keep_mode: "user" },
    action: { type: "click", payload: {} },
    validation: { success_conditions: [], failure_conditions: [] },
  });
  const [appIndex, setAppIndex] = useState({});

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: BG, color: TEXT, height: "100vh",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === "builder" && (
        <BlockBuilder blockData={blockData} setBlockData={setBlockData} appIndex={appIndex} setAppIndex={setAppIndex} />
      )}
      {tab === "flow" && <FlowBuilder />}
      {tab === "stats" && <Statistics />}
    </div>
  );
}
