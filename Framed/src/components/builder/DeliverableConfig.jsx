import { Package } from 'lucide-react';
import CollapsibleSection from '../shared/CollapsibleSection';
import ToggleSwitch from '../shared/ToggleSwitch';
import { FormField, FormSelect, FormTextarea } from '../shared/FormField';

const DELIVERABLE_TYPES = ['file', 'json', 'email', 'webhook', 'report'];

export default function DeliverableConfig({ blockData, setBlockData }) {
  const deliverable = blockData.deliverable || { enabled: false, type: 'json', spec: '' };

  const update = (patch) => {
    setBlockData((d) => ({
      ...d,
      deliverable: { ...(d.deliverable || { enabled: false, type: 'json', spec: '' }), ...patch },
    }));
  };

  return (
    <CollapsibleSection title="Deliverable" icon={Package}>
      <ToggleSwitch
        checked={deliverable.enabled}
        onChange={(v) => update({ enabled: v })}
        label="Enabled"
      />
      {deliverable.enabled && (
        <>
          <FormField label="Type">
            <FormSelect
              value={deliverable.type}
              onChange={(e) => update({ type: e.target.value })}
            >
              {DELIVERABLE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </FormSelect>
          </FormField>
          <FormField label="Specification">
            <FormTextarea
              value={deliverable.spec || ''}
              onChange={(e) => update({ spec: e.target.value })}
              placeholder="Describe the expected deliverable output..."
              style={{ minHeight: 60 }}
            />
          </FormField>
        </>
      )}
    </CollapsibleSection>
  );
}
