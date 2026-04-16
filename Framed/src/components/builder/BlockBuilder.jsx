import { useState, useCallback } from 'react';
import { Layers, PanelLeft, PanelRight } from 'lucide-react';
import clsx from 'clsx';
import { TOOLS } from '../../utils/constants';
import useImageLoader from '../../hooks/useImageLoader';
import useCanvasInteraction from '../../hooks/useCanvasInteraction';
import useToolSettings from '../../hooks/useToolSettings';
import useAISettings from '../../hooks/useAISettings';
import useAI from '../../hooks/useAI';
import BlockLibrary from './BlockLibrary';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import ElementPanel from './ElementPanel';
import PillButton from '../shared/PillButton';
import s from './BlockBuilder.module.css';

function EmptyEditor({ onCreate }) {
  return (
    <div className={s.emptyEditor}>
      <div className={s.emptyIcon}>
        <Layers size={56} strokeWidth={1} />
      </div>
      <div className={s.emptyTitle}>Select or create a block</div>
      <div className={s.emptyText}>
        Choose a block from the library to start editing, or create a new one.
      </div>
      <PillButton onClick={onCreate}>Create Block</PillButton>
    </div>
  );
}

function ActiveEditor({
  blockData,
  setBlockData,
  appIndex,
  setAppIndex,
  showLibrary,
  setShowLibrary,
  showPanel,
  setShowPanel,
}) {
  const [tool, setTool] = useState('mark');
  const [selectedEl, setSelectedEl] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [noteInput, setNoteInputRaw] = useState(blockData.notes?.user_note || '');
  const setNoteInput = (val) => {
    setNoteInputRaw(val);
    setBlockData((d) => ({
      ...d,
      notes: { ...d.notes, user_note: val },
    }));
  };

  const { fileRef, image, imageSize, imageLoading, handleImage, handleDrop, handleDragOver } = useImageLoader(blockData.block_id, setBlockData);
  const [toolSettings, setToolColor, markerScale, setMarkerScale] = useToolSettings();
  const [aiSettings] = useAISettings();
  const { refineNotes, loading: aiLoading, error: aiError } = useAI(aiSettings);

  const handleAIRefine = useCallback(async () => {
    const refined = await refineNotes({
      userNote: noteInput,
      blockContext: blockData,
    });
    if (refined) {
      setBlockData((d) => ({
        ...d,
        notes: { ...d.notes, ai_refined_note: refined, keep_mode: 'ai' },
      }));
    }
  }, [refineNotes, noteInput, blockData, setBlockData]);

  const elements = blockData.elements || [];
  const annotations = blockData.annotations || [];

  const setElements = (fn) => {
    setBlockData((d) => ({
      ...d,
      elements: typeof fn === 'function' ? fn(d.elements || []) : fn,
    }));
  };
  const setAnnotations = (fn) => {
    setBlockData((d) => ({
      ...d,
      annotations: typeof fn === 'function' ? fn(d.annotations || []) : fn,
    }));
  };

  const {
    canvasRef,
    containerRef,
    dragStart,
    dragCurrent,
    canvasScale,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  } = useCanvasInteraction({
    tool,
    image,
    imageSize,
    setElements,
    setAnnotations,
    setSelectedEl,
    setLabelInput,
    toolSettings,
  });

  return (
    <div className={s.canvasColumn}>
      <Toolbar
        tools={TOOLS}
        activeTool={tool}
        onToolChange={setTool}
        onLoadImage={handleImage}
        hasImage={!!image}
        fileRef={fileRef}
        toolSettings={toolSettings}
        onToolColorChange={setToolColor}
        scale={markerScale}
        onScaleChange={setMarkerScale}
        showLibrary={showLibrary}
        onToggleLibrary={() => setShowLibrary(!showLibrary)}
        showPanel={showPanel}
        onTogglePanel={() => setShowPanel(!showPanel)}
      />
      <Canvas
        image={image}
        imageSize={imageSize}
        canvasScale={canvasScale}
        canvasRef={canvasRef}
        containerRef={containerRef}
        fileRef={fileRef}
        tool={tool}
        elements={elements}
        annotations={annotations}
        selectedEl={selectedEl}
        dragStart={dragStart}
        dragCurrent={dragCurrent}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        toolSettings={toolSettings}
        markerScale={markerScale}
      />
      {/* Right panel as overlay drawer */}
      <div className={clsx(s.drawer, s.drawerRight, showPanel && s.drawerRightOpen)}>
        <ElementPanel
          blockData={blockData}
          setBlockData={setBlockData}
          appIndex={appIndex}
          setAppIndex={setAppIndex}
          selectedEl={selectedEl}
          setSelectedEl={setSelectedEl}
          labelInput={labelInput}
          setLabelInput={setLabelInput}
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          onAIRefine={handleAIRefine}
          aiLoading={aiLoading}
          aiError={aiError}
        />
      </div>
    </div>
  );
}

export default function BlockBuilder({
  blocks,
  activeBlockId,
  blockData,
  setBlockData,
  appIndex,
  setAppIndex,
  onCreateBlock,
  onDeleteBlock,
  onSwitchBlock,
}) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className={s.builder}>
      {/* Backdrop */}
      <div
        className={clsx(s.backdrop, (showLibrary || showPanel) && s.backdropVisible)}
        onClick={() => { setShowLibrary(false); setShowPanel(false); }}
      />

      {/* Left drawer: Block Library */}
      <div className={clsx(s.drawer, s.drawerLeft, showLibrary && s.drawerLeftOpen)}>
        <BlockLibrary
          blocks={blocks}
          activeBlockId={activeBlockId}
          onCreate={onCreateBlock}
          onDelete={onDeleteBlock}
          onSwitch={(id) => { onSwitchBlock(id); setShowLibrary(false); }}
        />
      </div>

      {/* Main canvas area */}
      {blockData ? (
        <ActiveEditor
          key={activeBlockId}
          blockData={blockData}
          setBlockData={setBlockData}
          appIndex={appIndex}
          setAppIndex={setAppIndex}
          showLibrary={showLibrary}
          setShowLibrary={setShowLibrary}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
        />
      ) : (
        <div className={s.canvasColumn}>
          <EmptyEditor onCreate={onCreateBlock} />
        </div>
      )}
    </div>
  );
}
