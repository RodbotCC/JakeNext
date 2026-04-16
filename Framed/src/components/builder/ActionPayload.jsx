import { FormField, FormInput, FormSelect, FormTextarea } from '../shared/FormField';
import s from './ActionPayload.module.css';

const PAYLOAD_FIELDS = {
  click: [
    { key: 'target_element', type: 'element-select', label: 'Target Element' },
    { key: 'click_type', type: 'select', label: 'Click Type', options: ['single', 'double', 'right'] },
  ],
  type: [
    { key: 'target_element', type: 'element-select', label: 'Target Element' },
    { key: 'text', type: 'text', label: 'Text Value', placeholder: 'Text to type...' },
    { key: 'submit_after', type: 'toggle', label: 'Submit After Typing' },
  ],
  hotkey: [
    { key: 'combo', type: 'text', label: 'Key Combo', placeholder: 'e.g. Ctrl+Shift+S' },
  ],
  wait: [
    { key: 'duration_ms', type: 'number', label: 'Duration (ms)', placeholder: '1000' },
    { key: 'wait_for', type: 'text', label: 'Wait For Condition', placeholder: 'e.g. element visible' },
  ],
  script: [
    { key: 'body', type: 'textarea', label: 'Script Body', placeholder: '// your script here...' },
  ],
  curl: [
    { key: 'method', type: 'select', label: 'Method', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    { key: 'url', type: 'text', label: 'URL', placeholder: 'https://...' },
    { key: 'headers', type: 'textarea', label: 'Headers (JSON)', placeholder: '{"Authorization": "Bearer ..."}' },
    { key: 'body', type: 'textarea', label: 'Request Body', placeholder: '{}' },
  ],
  agent: [
    { key: 'prompt', type: 'textarea', label: 'Agent Prompt', placeholder: 'Describe what the agent should do...' },
    { key: 'model', type: 'select', label: 'Model', options: ['claude-sonnet', 'claude-opus', 'gpt-4o'] },
  ],
};

export default function ActionPayload({ blockData, setBlockData }) {
  const actionType = blockData.action?.type || 'click';
  const payload = blockData.action?.payload || {};
  const elements = blockData.elements || [];
  const fields = PAYLOAD_FIELDS[actionType];

  if (!fields || fields.length === 0) return null;

  const updatePayload = (key, value) => {
    setBlockData((d) => ({
      ...d,
      action: {
        ...d.action,
        payload: { ...(d.action?.payload || {}), [key]: value },
      },
    }));
  };

  return (
    <div className={s.fields}>
      {fields.map((field) => {
        if (field.type === 'element-select') {
          return (
            <FormField key={field.key} label={field.label}>
              <FormSelect
                value={payload[field.key] || ''}
                onChange={(e) => updatePayload(field.key, e.target.value)}
              >
                <option value="">Select element...</option>
                {elements.map((el) => (
                  <option key={el.element_id} value={el.element_id}>
                    {el.label || `Point (${el.x}, ${el.y})`}
                  </option>
                ))}
              </FormSelect>
            </FormField>
          );
        }
        if (field.type === 'select') {
          return (
            <FormField key={field.key} label={field.label}>
              <FormSelect
                value={payload[field.key] || field.options[0]}
                onChange={(e) => updatePayload(field.key, e.target.value)}
              >
                {field.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </FormSelect>
            </FormField>
          );
        }
        if (field.type === 'textarea') {
          return (
            <FormField key={field.key} label={field.label}>
              <FormTextarea
                value={payload[field.key] || ''}
                onChange={(e) => updatePayload(field.key, e.target.value)}
                placeholder={field.placeholder}
                style={{ minHeight: 60, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
              />
            </FormField>
          );
        }
        if (field.type === 'toggle') {
          return (
            <div key={field.key} className={s.toggleRow}>
              <input
                type="checkbox"
                className={s.checkbox}
                checked={!!payload[field.key]}
                onChange={(e) => updatePayload(field.key, e.target.checked)}
              />
              <span className={s.toggleLabel}>{field.label}</span>
            </div>
          );
        }
        if (field.type === 'number') {
          return (
            <FormField key={field.key} label={field.label}>
              <FormInput
                type="number"
                value={payload[field.key] || ''}
                onChange={(e) => updatePayload(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </FormField>
          );
        }
        return (
          <FormField key={field.key} label={field.label}>
            <FormInput
              value={payload[field.key] || ''}
              onChange={(e) => updatePayload(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </FormField>
        );
      })}
    </div>
  );
}
