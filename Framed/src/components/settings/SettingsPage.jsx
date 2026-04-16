import { Settings, Bot, Palette, Maximize2, Zap } from 'lucide-react';
import clsx from 'clsx';
import { FormField, FormInput, FormSelect } from '../shared/FormField';
import PillButton from '../shared/PillButton';
import ToolColorPicker from '../builder/ToolColorPicker';
import { AI_MODELS } from '../../hooks/useAISettings';
import { SCALE_PRESETS } from '../../hooks/useToolSettings';
import { useState } from 'react';
import s from './SettingsPage.module.css';

const DRAWING_TOOLS = ['mark', 'box', 'arrow', 'circle', 'note'];
const TOOL_LABELS = { mark: 'Mark Point', box: 'Bounding Box', arrow: 'Arrow', circle: 'Circle', note: 'Sticky Note' };
const MODEL_FIELDS = [
  { key: 'textModel', category: 'text' },
  { key: 'imageModel', category: 'image' },
  { key: 'ttsModel', category: 'tts' },
  { key: 'transcriptionModel', category: 'transcription' },
];

export default function SettingsPage({
  aiSettings,
  onAISettingsUpdate,
  toolSettings,
  onToolColorChange,
  scale,
  onScaleChange,
}) {
  const [testStatus, setTestStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!aiSettings.apiKey) {
      setTestStatus({ ok: false, msg: 'No API key entered' });
      return;
    }
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${aiSettings.apiKey}` },
      });
      if (res.ok) setTestStatus({ ok: true, msg: 'Connected' });
      else {
        const err = await res.json().catch(() => ({}));
        setTestStatus({ ok: false, msg: err.error?.message || `Error ${res.status}` });
      }
    } catch (err) {
      setTestStatus({ ok: false, msg: err.message });
    }
    setTesting(false);
  };

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div>
          <div className={s.header}>
            <Settings size={24} className={s.headerIcon} />
            <h2 className={s.title}>Settings</h2>
          </div>
          <p className={s.subtitle}>
            Configure AI models, tool appearance, and annotation sizing.
          </p>
        </div>

        {/* AI Settings */}
        <div className={s.section}>
          <div className={s.header}>
            <Bot size={18} className={s.headerIcon} />
            <h3 className={s.sectionTitle}>AI Configuration</h3>
          </div>

          <FormField label="OpenAI API Key">
            <FormInput
              type="password"
              value={aiSettings.apiKey || ''}
              onChange={(e) => onAISettingsUpdate({ ...aiSettings, apiKey: e.target.value })}
              placeholder="sk-..."
            />
          </FormField>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PillButton variant="secondary" size="small" onClick={testConnection} disabled={testing}>
              <Zap size={12} />
              {testing ? 'Testing...' : 'Test Connection'}
            </PillButton>
            {testStatus && (
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: testStatus.ok ? 'var(--color-accent-green)' : 'var(--color-accent-pink)',
              }}>
                {testStatus.msg}
              </span>
            )}
          </div>

          {MODEL_FIELDS.map(({ key, category }) => {
            const cat = AI_MODELS[category];
            return (
              <FormField key={key} label={cat.label}>
                <FormSelect
                  value={aiSettings[key] || cat.models[0].id}
                  onChange={(e) => onAISettingsUpdate({ ...aiSettings, [key]: e.target.value })}
                >
                  {cat.models.map((m) => (
                    <option key={m.id} value={m.id}>{m.label} -- {m.description}</option>
                  ))}
                </FormSelect>
              </FormField>
            );
          })}
        </div>

        {/* Tool Colors */}
        <div className={s.section}>
          <div className={s.header}>
            <Palette size={18} className={s.headerIcon} />
            <h3 className={s.sectionTitle}>Tool Colors</h3>
          </div>
          {DRAWING_TOOLS.map((toolId) => (
            <div key={toolId} className={s.colorRow}>
              <span className={s.colorToolName}>{TOOL_LABELS[toolId]}</span>
              <ToolColorPicker
                currentColor={toolSettings[toolId]?.color}
                onColorChange={(color) => onToolColorChange(toolId, color)}
              />
            </div>
          ))}
        </div>

        {/* Marker Size */}
        <div className={s.section}>
          <div className={s.header}>
            <Maximize2 size={18} className={s.headerIcon} />
            <h3 className={s.sectionTitle}>Annotation Size</h3>
          </div>
          <div className={s.scaleRow}>
            <span className={s.scaleLabel}>Marker Scale</span>
            {SCALE_PRESETS.map((p) => (
              <button
                key={p.value}
                className={clsx(s.scaleBtn, scale === p.value && s.scaleBtnActive)}
                onClick={() => onScaleChange(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
