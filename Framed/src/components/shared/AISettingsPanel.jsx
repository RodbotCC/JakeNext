import { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import { FormField, FormInput, FormSelect } from './FormField';
import PillButton from './PillButton';
import { AI_MODELS } from '../../hooks/useAISettings';
import s from './AISettingsPanel.module.css';

const MODEL_FIELDS = [
  { key: 'textModel', category: 'text' },
  { key: 'imageModel', category: 'image' },
  { key: 'ttsModel', category: 'tts' },
  { key: 'transcriptionModel', category: 'transcription' },
];

export default function AISettingsPanel({ settings, onUpdate }) {
  const [testStatus, setTestStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!settings.apiKey) {
      setTestStatus({ ok: false, msg: 'No API key entered' });
      return;
    }
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${settings.apiKey}` },
      });
      if (res.ok) {
        setTestStatus({ ok: true, msg: 'Connected' });
      } else {
        const err = await res.json().catch(() => ({}));
        setTestStatus({ ok: false, msg: err.error?.message || `Error ${res.status}` });
      }
    } catch (err) {
      setTestStatus({ ok: false, msg: err.message });
    }
    setTesting(false);
  };

  return (
    <CollapsibleSection title="AI Settings" icon={Bot}>
      <FormField label="OpenAI API Key">
        <FormInput
          type="password"
          value={settings.apiKey || ''}
          onChange={(e) => onUpdate({ ...settings, apiKey: e.target.value })}
          placeholder="sk-..."
        />
      </FormField>

      <div className={s.testRow}>
        <PillButton variant="secondary" size="small" onClick={testConnection} disabled={testing}>
          <Zap size={12} />
          {testing ? 'Testing...' : 'Test Connection'}
        </PillButton>
        {testStatus && (
          <span className={`${s.status} ${testStatus.ok ? s.success : s.error}`}>
            {testStatus.msg}
          </span>
        )}
      </div>

      {MODEL_FIELDS.map(({ key, category }) => {
        const cat = AI_MODELS[category];
        return (
          <FormField key={key} label={cat.label}>
            <FormSelect
              value={settings[key] || cat.models[0].id}
              onChange={(e) => onUpdate({ ...settings, [key]: e.target.value })}
            >
              {cat.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} — {m.description}
                </option>
              ))}
            </FormSelect>
          </FormField>
        );
      })}
    </CollapsibleSection>
  );
}
