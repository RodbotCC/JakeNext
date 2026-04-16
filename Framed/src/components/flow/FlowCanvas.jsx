import { useState, useRef, useCallback } from 'react';
import { GitBranch } from 'lucide-react';
import { colors } from '../../tokens/colorValues';
import { recordManualConnection } from '../../utils/relationships';
import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';
import s from './FlowCanvas.module.css';

const NODE_WIDTH = 200;
const PORT_OFFSET_Y = 30; // approx vertical center of node

export default function FlowCanvas({ blocks, flow, setFlow }) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null); // { nodeIndex, offsetX, offsetY }
  const [connecting, setConnecting] = useState(null); // { fromBlockId, mouseX, mouseY }

  const getCanvasCoords = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left + (canvasRef.current?.scrollLeft || 0),
      y: e.clientY - rect.top + (canvasRef.current?.scrollTop || 0),
    };
  }, []);

  const handleCanvasMouseMove = useCallback((e) => {
    if (dragging) {
      const coords = getCanvasCoords(e);
      setFlow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n, i) =>
          i === dragging.nodeIndex
            ? { ...n, x: coords.x - dragging.offsetX, y: coords.y - dragging.offsetY }
            : n
        ),
      }));
    } else if (connecting) {
      const coords = getCanvasCoords(e);
      setConnecting((prev) => prev ? { ...prev, mouseX: coords.x, mouseY: coords.y } : null);
    }
  }, [dragging, connecting, getCanvasCoords, setFlow]);

  const handleCanvasMouseUp = useCallback(() => {
    setDragging(null);
    setConnecting(null);
  }, []);

  const handleNodeMouseDown = useCallback((e, nodeIndex) => {
    const coords = getCanvasCoords(e);
    const node = flow.nodes[nodeIndex];
    setDragging({
      nodeIndex,
      offsetX: coords.x - node.x,
      offsetY: coords.y - node.y,
    });
  }, [flow.nodes, getCanvasCoords]);

  const handlePortOutputMouseDown = useCallback((blockId) => {
    const node = flow.nodes.find((n) => n.block_id === blockId);
    if (node) {
      const startX = node.x + NODE_WIDTH + 6;
      const startY = node.y + PORT_OFFSET_Y;
      setConnecting({
        fromBlockId: blockId,
        startX,
        startY,
        mouseX: startX,
        mouseY: startY,
      });
    }
  }, [flow.nodes]);

  const handlePortInputMouseUp = useCallback((blockId) => {
    if (connecting && connecting.fromBlockId !== blockId) {
      const exists = flow.edges.some(
        (e) => e.from_block_id === connecting.fromBlockId && e.to_block_id === blockId
      );
      if (!exists) {
        setFlow((prev) => ({
          ...prev,
          edges: [...prev.edges, { from_block_id: connecting.fromBlockId, to_block_id: blockId }],
        }));
        // Record to relationship graph
        const sourceBlock = blocks[connecting.fromBlockId];
        const appContext = sourceBlock?.application?.app_id || '_';
        recordManualConnection(connecting.fromBlockId, blockId, appContext);
      }
    }
    setConnecting(null);
  }, [connecting, flow.edges, setFlow]);

  const removeEdge = useCallback((fromId, toId) => {
    setFlow((prev) => ({
      ...prev,
      edges: prev.edges.filter(
        (e) => !(e.from_block_id === fromId && e.to_block_id === toId)
      ),
    }));
  }, [setFlow]);

  const removeNode = useCallback((blockId) => {
    setFlow((prev) => ({
      nodes: prev.nodes.filter((n) => n.block_id !== blockId),
      edges: prev.edges.filter(
        (e) => e.from_block_id !== blockId && e.to_block_id !== blockId
      ),
    }));
  }, [setFlow]);

  // Compute edge endpoints from node positions
  const edgeLines = flow.edges.map((edge) => {
    const fromNode = flow.nodes.find((n) => n.block_id === edge.from_block_id);
    const toNode = flow.nodes.find((n) => n.block_id === edge.to_block_id);
    if (!fromNode || !toNode) return null;
    return {
      ...edge,
      fromX: fromNode.x + NODE_WIDTH + 6,
      fromY: fromNode.y + PORT_OFFSET_Y,
      toX: toNode.x - 6,
      toY: toNode.y + PORT_OFFSET_Y,
    };
  }).filter(Boolean);

  return (
    <div
      ref={canvasRef}
      className={s.canvas}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      {flow.nodes.length === 0 && (
        <div className={s.emptyHint}>
          <div className={s.emptyIcon}>
            <GitBranch size={48} strokeWidth={1} />
          </div>
          <div className={s.emptyText}>
            Add blocks from the toolbar above to start building your flow.
          </div>
        </div>
      )}

      {/* SVG edges */}
      <svg className={s.svgLayer}>
        {edgeLines.map((edge) => (
          <FlowEdge
            key={`${edge.from_block_id}-${edge.to_block_id}`}
            fromX={edge.fromX}
            fromY={edge.fromY}
            toX={edge.toX}
            toY={edge.toY}
            onClick={() => removeEdge(edge.from_block_id, edge.to_block_id)}
          />
        ))}
        {/* Temporary connecting line */}
        {connecting && (
          <line
            className={s.tempEdge}
            x1={connecting.startX}
            y1={connecting.startY}
            x2={connecting.mouseX}
            y2={connecting.mouseY}
            stroke={colors.primary}
            strokeWidth={2}
            strokeDasharray="6 3"
            opacity={0.4}
          />
        )}
      </svg>

      {/* Nodes */}
      <div className={s.nodeLayer}>
        {flow.nodes.map((node, i) => (
          <FlowNode
            key={node.block_id}
            block={blocks[node.block_id]}
            x={node.x}
            y={node.y}
            isDragging={dragging?.nodeIndex === i}
            onMouseDown={(e) => handleNodeMouseDown(e, i)}
            onPortMouseDown={() => handlePortOutputMouseDown(node.block_id)}
            onPortMouseUp={() => handlePortInputMouseUp(node.block_id)}
            onDelete={() => removeNode(node.block_id)}
          />
        ))}
      </div>
    </div>
  );
}
