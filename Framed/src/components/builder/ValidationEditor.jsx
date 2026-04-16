import { ShieldCheck, Plus } from 'lucide-react';
import CollapsibleSection from '../shared/CollapsibleSection';
import { FormInput } from '../shared/FormField';
import IconButton from '../shared/IconButton';
import PillButton from '../shared/PillButton';
import { X } from 'lucide-react';
import s from './ValidationEditor.module.css';

function ConditionList({ label, items, onChange }) {
  const add = () => onChange([...items, '']);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, val) => onChange(items.map((v, idx) => (idx === i ? val : v)));

  return (
    <div className={s.group}>
      <span className={s.groupLabel}>{label}</span>
      {items.map((item, i) => (
        <div key={i} className={s.row}>
          <FormInput
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder="e.g. Element visible on screen"
          />
          <IconButton icon={X} size={14} variant="danger" onClick={() => remove(i)} />
        </div>
      ))}
      <PillButton variant="ghost" size="small" onClick={add}>
        <Plus size={12} /> Add condition
      </PillButton>
    </div>
  );
}

export default function ValidationEditor({ blockData, setBlockData }) {
  const validation = blockData.validation || { success_conditions: [], failure_conditions: [] };
  const total = (validation.success_conditions?.length || 0) + (validation.failure_conditions?.length || 0);

  const updateValidation = (key, value) => {
    setBlockData((d) => ({
      ...d,
      validation: { ...d.validation, [key]: value },
    }));
  };

  return (
    <CollapsibleSection
      title="Validation"
      icon={ShieldCheck}
      badge={total > 0 ? total : undefined}
    >
      <ConditionList
        label="Success Conditions"
        items={validation.success_conditions || []}
        onChange={(v) => updateValidation('success_conditions', v)}
      />
      <ConditionList
        label="Failure Conditions"
        items={validation.failure_conditions || []}
        onChange={(v) => updateValidation('failure_conditions', v)}
      />
    </CollapsibleSection>
  );
}
