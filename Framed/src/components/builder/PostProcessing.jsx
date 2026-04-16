import { Workflow, Plus, X } from 'lucide-react';
import CollapsibleSection from '../shared/CollapsibleSection';
import ToggleSwitch from '../shared/ToggleSwitch';
import { FormInput, FormSelect } from '../shared/FormField';
import IconButton from '../shared/IconButton';
import PillButton from '../shared/PillButton';
import s from './PostProcessing.module.css';

const STEP_TYPES = ['transform', 'filter', 'map', 'validate', 'notify', 'custom'];

export default function PostProcessing({ blockData, setBlockData }) {
  const pp = blockData.post_processing || { enabled: false, steps: [] };
  const steps = pp.steps || [];

  const update = (patch) => {
    setBlockData((d) => ({
      ...d,
      post_processing: { ...(d.post_processing || { enabled: false, steps: [] }), ...patch },
    }));
  };

  const addStep = () => update({ steps: [...steps, { type: 'transform', config: '' }] });
  const removeStep = (i) => update({ steps: steps.filter((_, idx) => idx !== i) });
  const updateStep = (i, key, val) =>
    update({ steps: steps.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)) });

  return (
    <CollapsibleSection
      title="Post-Processing"
      icon={Workflow}
      badge={steps.length > 0 ? steps.length : undefined}
    >
      <ToggleSwitch
        checked={pp.enabled}
        onChange={(v) => update({ enabled: v })}
        label="Enabled"
      />
      {pp.enabled && (
        <div className={s.steps}>
          {steps.map((step, i) => (
            <div key={i} className={s.row}>
              <FormSelect
                value={step.type}
                onChange={(e) => updateStep(i, 'type', e.target.value)}
                style={{ width: 120, flexShrink: 0 }}
              >
                {STEP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </FormSelect>
              <FormInput
                value={step.config || ''}
                onChange={(e) => updateStep(i, 'config', e.target.value)}
                placeholder="Configuration..."
              />
              <IconButton icon={X} size={14} variant="danger" onClick={() => removeStep(i)} />
            </div>
          ))}
          <PillButton variant="ghost" size="small" onClick={addStep}>
            <Plus size={12} /> Add step
          </PillButton>
        </div>
      )}
    </CollapsibleSection>
  );
}
