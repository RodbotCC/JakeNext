import { useState } from 'react';
import { Eye, PenLine, Sparkles, Loader2 } from 'lucide-react';
import { FormField, FormTextarea } from '../shared/FormField';
import MarkdownRenderer from '../shared/MarkdownRenderer';
import s from './NotesEditor.module.css';

export default function NotesEditor({
  value,
  onChange,
  aiRefinedNote,
  keepMode,
  onKeepModeChange,
  onAIRefine,
  aiLoading,
  aiError,
}) {
  const [preview, setPreview] = useState(false);
  const showAI = !!aiRefinedNote;
  const displayingAI = keepMode === 'ai' && showAI;
  const displayText = displayingAI ? aiRefinedNote : value;

  return (
    <section>
      <div className={s.header}>
        <FormField label="Operator Notes" />
        <div className={s.actions}>
          {onAIRefine && (
            <button
              className={s.toggle}
              onClick={onAIRefine}
              disabled={aiLoading || !value?.trim()}
              title="Refine notes with AI"
            >
              {aiLoading ? <Loader2 size={12} className={s.spin} /> : <Sparkles size={12} />}
              {aiLoading ? 'Refining...' : 'AI Refine'}
            </button>
          )}
          {showAI && (
            <div className={s.modeToggle}>
              <button
                className={`${s.modeBtn} ${keepMode !== 'ai' ? s.modeBtnActive : ''}`}
                onClick={() => onKeepModeChange('user')}
              >
                User
              </button>
              <button
                className={`${s.modeBtn} ${keepMode === 'ai' ? s.modeBtnActive : ''}`}
                onClick={() => onKeepModeChange('ai')}
              >
                AI
              </button>
            </div>
          )}
          {(value || displayingAI) && (
            <button
              className={s.toggle}
              onClick={() => setPreview(!preview)}
            >
              {preview ? <PenLine size={12} /> : <Eye size={12} />}
              {preview ? 'Edit' : 'Preview'}
            </button>
          )}
        </div>
      </div>
      {aiError && (
        <div className={s.error}>{aiError}</div>
      )}
      {preview ? (
        <div className={s.preview}>
          <MarkdownRenderer>{displayText}</MarkdownRenderer>
        </div>
      ) : displayingAI ? (
        <div className={s.preview}>
          <MarkdownRenderer>{aiRefinedNote}</MarkdownRenderer>
        </div>
      ) : (
        <FormTextarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe what is happening in this frame, what the action should accomplish, and any conditions that need to hold..."
          style={{ minHeight: 100 }}
        />
      )}
    </section>
  );
}
