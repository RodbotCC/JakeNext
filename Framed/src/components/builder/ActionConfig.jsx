import { FormField, FormSelect } from '../shared/FormField';
import { ACTION_TYPES } from '../../utils/constants';

export default function ActionConfig({ blockData, setBlockData }) {
  return (
    <section>
      <FormField label="Action Type">
        <FormSelect
          value={blockData.action?.type || 'click'}
          onChange={(e) =>
            setBlockData((d) => ({ ...d, action: { ...d.action, type: e.target.value } }))
          }
        >
          {ACTION_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </FormSelect>
      </FormField>
    </section>
  );
}
