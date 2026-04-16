import { useState } from 'react';
import { FormSelect } from '../shared/FormField';
import BlockMetaForm from './BlockMetaForm';
import ElementTag from './ElementTag';
import ActionConfig from './ActionConfig';
import ActionPayload from './ActionPayload';
import ValidationEditor from './ValidationEditor';
import PostProcessing from './PostProcessing';
import AuditConfig from './AuditConfig';
import DeliverableConfig from './DeliverableConfig';
import NotesEditor from './NotesEditor';
import AnnotationList from './AnnotationList';
import CompileButton from './CompileButton';
import { uid } from '../../utils/uid';
import s from './ElementPanel.module.css';

export default function ElementPanel({
  blockData,
  setBlockData,
  appIndex,
  setAppIndex,
  selectedEl,
  setSelectedEl,
  labelInput,
  setLabelInput,
  noteInput,
  onAIRefine,
  aiLoading,
  aiError,
  setNoteInput,
}) {
  const elements = blockData.elements || [];
  const annotations = blockData.annotations || [];
  const appId = blockData.application?.app_id || 'default';
  const savedElements = appIndex[appId] || [];

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

  const updateElementLabel = (id, label) => {
    setElements((prev) =>
      prev.map((el) => (el.element_id === id ? { ...el, label } : el))
    );
  };

  const saveToIndex = (el) => {
    const app = blockData.application?.app_id || 'default';
    setAppIndex((prev) => {
      const existing = prev[app] || [];
      if (existing.find((e) => e.label === el.label)) return prev;
      return { ...prev, [app]: [...existing, { label: el.label, last_x: el.x, last_y: el.y }] };
    });
    setElements((prev) =>
      prev.map((e) =>
        e.element_id === el.element_id ? { ...e, saved_to_app_index: true } : e
      )
    );
  };

  const addFromLibrary = (label) => {
    const saved = savedElements.find((s) => s.label === label);
    if (saved) {
      const newEl = {
        element_id: uid(),
        label: saved.label,
        x: saved.last_x,
        y: saved.last_y,
        saved_to_app_index: true,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedEl(newEl.element_id);
    }
  };

  return (
    <div className={s.panel}>
      <div className={s.scroll}>
        <BlockMetaForm blockData={blockData} setBlockData={setBlockData} />

        {/* Elements */}
        <section>
          <div className={s.sectionHeader}>
            <span className={s.sectionLabel}>Elements ({elements.length})</span>
            {savedElements.length > 0 && (
              <FormSelect
                className={s.librarySelect}
                onChange={(e) => {
                  if (e.target.value) addFromLibrary(e.target.value);
                  e.target.value = '';
                }}
              >
                <option value="">+ From library</option>
                {savedElements.map((se) => (
                  <option key={se.label} value={se.label}>
                    {se.label} ({se.last_x}, {se.last_y})
                  </option>
                ))}
              </FormSelect>
            )}
          </div>
          <div className={s.elementList}>
            {elements.length === 0 && (
              <div className={s.emptyHint}>
                Use Mark Point or Bounding Box tool to add elements
              </div>
            )}
            {elements.map((el) => (
              <ElementTag
                key={el.element_id}
                el={el}
                selected={selectedEl === el.element_id}
                labelInput={selectedEl === el.element_id ? labelInput : el.label}
                onClick={() => {
                  setSelectedEl(el.element_id);
                  setLabelInput(el.label);
                }}
                onDelete={() => {
                  setElements((prev) =>
                    prev.filter((e) => e.element_id !== el.element_id)
                  );
                  if (selectedEl === el.element_id) setSelectedEl(null);
                }}
                onLabelChange={(val) => {
                  setLabelInput(val);
                  updateElementLabel(el.element_id, val);
                }}
                onSaveToIndex={() => saveToIndex(el)}
              />
            ))}
          </div>
        </section>

        <ActionConfig blockData={blockData} setBlockData={setBlockData} />
        <ActionPayload blockData={blockData} setBlockData={setBlockData} />

        <ValidationEditor blockData={blockData} setBlockData={setBlockData} />
        <PostProcessing blockData={blockData} setBlockData={setBlockData} />
        <AuditConfig blockData={blockData} setBlockData={setBlockData} />
        <DeliverableConfig blockData={blockData} setBlockData={setBlockData} />

        <NotesEditor
          value={noteInput}
          onChange={setNoteInput}
          aiRefinedNote={blockData.notes?.ai_refined_note}
          keepMode={blockData.notes?.keep_mode || 'user'}
          onKeepModeChange={(mode) =>
            setBlockData((d) => ({
              ...d,
              notes: { ...d.notes, keep_mode: mode },
            }))
          }
          onAIRefine={onAIRefine}
          aiLoading={aiLoading}
          aiError={aiError}
        />

        <AnnotationList
          annotations={annotations}
          onRemove={(id) =>
            setAnnotations((prev) => prev.filter((a) => a.id !== id))
          }
          onClearAll={() => setAnnotations([])}
        />

      </div>

      <CompileButton blockData={blockData} noteInput={noteInput} />
    </div>
  );
}
