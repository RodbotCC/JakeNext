import { Shield, Plus, X } from 'lucide-react';
import CollapsibleSection from '../shared/CollapsibleSection';
import ToggleSwitch from '../shared/ToggleSwitch';
import { FormField, FormInput } from '../shared/FormField';
import IconButton from '../shared/IconButton';
import PillButton from '../shared/PillButton';

export default function AuditConfig({ blockData, setBlockData }) {
  const audit = blockData.audit || { enabled: false, checks: [], score_weight: 1 };
  const checks = audit.checks || [];

  const update = (patch) => {
    setBlockData((d) => ({
      ...d,
      audit: { ...(d.audit || { enabled: false, checks: [], score_weight: 1 }), ...patch },
    }));
  };

  const addCheck = () => update({ checks: [...checks, ''] });
  const removeCheck = (i) => update({ checks: checks.filter((_, idx) => idx !== i) });
  const updateCheck = (i, val) =>
    update({ checks: checks.map((c, idx) => (idx === i ? val : c)) });

  return (
    <CollapsibleSection
      title="Audit"
      icon={Shield}
      badge={checks.length > 0 ? checks.length : undefined}
    >
      <ToggleSwitch
        checked={audit.enabled}
        onChange={(v) => update({ enabled: v })}
        label="Enabled"
      />
      {audit.enabled && (
        <>
          <FormField label="Score Weight (1-10)">
            <FormInput
              type="number"
              min={1}
              max={10}
              value={audit.score_weight}
              onChange={(e) => update({ score_weight: Number(e.target.value) || 1 })}
            />
          </FormField>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {checks.map((check, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <FormInput
                  value={check}
                  onChange={(e) => updateCheck(i, e.target.value)}
                  placeholder="e.g. Verify field was updated"
                  style={{ flex: 1 }}
                />
                <IconButton icon={X} size={14} variant="danger" onClick={() => removeCheck(i)} />
              </div>
            ))}
            <PillButton variant="ghost" size="small" onClick={addCheck}>
              <Plus size={12} /> Add check
            </PillButton>
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}
