import { FormField, FormInput, FormRow } from '../shared/FormField';

export default function BlockMetaForm({ blockData, setBlockData }) {
  return (
    <section>
      <FormField label="Block Title">
        <FormInput
          value={blockData.title || ''}
          onChange={(e) => setBlockData((d) => ({ ...d, title: e.target.value }))}
          placeholder="e.g. Navigate to Customers Tab"
        />
      </FormField>
      <FormRow>
        <FormField label="App ID">
          <FormInput
            value={blockData.application?.app_id || ''}
            onChange={(e) =>
              setBlockData((d) => ({
                ...d,
                application: { ...d.application, app_id: e.target.value },
              }))
            }
            placeholder="e.g. salesforce"
          />
        </FormField>
        <FormField label="Screen">
          <FormInput
            value={blockData.application?.screen_name || ''}
            onChange={(e) =>
              setBlockData((d) => ({
                ...d,
                application: { ...d.application, screen_name: e.target.value },
              }))
            }
            placeholder="e.g. dashboard"
          />
        </FormField>
      </FormRow>
    </section>
  );
}
