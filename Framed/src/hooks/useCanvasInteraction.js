import { useState, useEffect, useRef, useCallback } from 'react';
import { uid } from '../utils/uid';

export default function useCanvasInteraction({
  tool,
  image,
  imageSize,
  setElements,
  setAnnotations,
  setSelectedEl,
  setLabelInput,
  toolSettings,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [canvasScale, setCanvasScale] = useState(1);

  const getImageCoords = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.round((e.clientX - rect.left) / canvasScale);
    const y = Math.round((e.clientY - rect.top) / canvasScale);
    return { x, y };
  }, [canvasScale]);

  const handleCanvasMouseDown = useCallback((e) => {
    if (!image) return;
    const coords = getImageCoords(e);
    if (!coords) return;

    if (tool === 'mark') {
      const newEl = {
        element_id: uid(),
        label: '',
        x: coords.x,
        y: coords.y,
        color: toolSettings?.mark?.color,
        saved_to_app_index: false,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedEl(newEl.element_id);
      setLabelInput('');
    } else if (tool === 'box' || tool === 'arrow' || tool === 'circle') {
      setDragStart(coords);
      setDragCurrent(coords);
    } else if (tool === 'note') {
      const newNote = {
        id: uid(),
        type: 'note',
        x: coords.x,
        y: coords.y,
        text: 'Double-click to edit',
        color: toolSettings?.note?.color,
      };
      setAnnotations((prev) => [...prev, newNote]);
    }
  }, [image, tool, toolSettings, getImageCoords, setElements, setAnnotations, setSelectedEl, setLabelInput]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (!dragStart) return;
    const coords = getImageCoords(e);
    if (coords) setDragCurrent(coords);
  }, [dragStart, getImageCoords]);

  const handleCanvasMouseUp = useCallback(() => {
    if (dragStart && dragCurrent) {
      if (tool === 'box') {
        const x = Math.min(dragStart.x, dragCurrent.x);
        const y = Math.min(dragStart.y, dragCurrent.y);
        const w = Math.abs(dragCurrent.x - dragStart.x);
        const h = Math.abs(dragCurrent.y - dragStart.y);
        if (w > 5 && h > 5) {
          const newEl = {
            element_id: uid(),
            label: '',
            x: x + Math.round(w / 2),
            y: y + Math.round(h / 2),
            w,
            h,
            color: toolSettings?.box?.color,
            saved_to_app_index: false,
          };
          setElements((prev) => [...prev, newEl]);
          setSelectedEl(newEl.element_id);
          setLabelInput('');
        }
      } else if (tool === 'arrow') {
        setAnnotations((prev) => [...prev, {
          id: uid(),
          type: 'arrow',
          x1: dragStart.x,
          y1: dragStart.y,
          x2: dragCurrent.x,
          y2: dragCurrent.y,
          color: toolSettings?.arrow?.color,
        }]);
      } else if (tool === 'circle') {
        const cx = (dragStart.x + dragCurrent.x) / 2;
        const cy = (dragStart.y + dragCurrent.y) / 2;
        const rx = Math.abs(dragCurrent.x - dragStart.x) / 2;
        const ry = Math.abs(dragCurrent.y - dragStart.y) / 2;
        setAnnotations((prev) => [...prev, {
          id: uid(),
          type: 'circle',
          cx,
          cy,
          rx,
          ry,
          color: toolSettings?.circle?.color,
        }]);
      }
    }
    setDragStart(null);
    setDragCurrent(null);
  }, [dragStart, dragCurrent, tool, setElements, setAnnotations, setSelectedEl, setLabelInput]);

  useEffect(() => {
    if (!containerRef.current || !imageSize.w) return;
    const cw = containerRef.current.clientWidth - 32;
    const scale = Math.min(1, cw / imageSize.w);
    setCanvasScale(scale);
  }, [imageSize, image]);

  return {
    canvasRef,
    containerRef,
    dragStart,
    dragCurrent,
    canvasScale,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  };
}
