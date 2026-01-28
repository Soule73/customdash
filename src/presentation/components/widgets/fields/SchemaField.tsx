import { Input, Select, Switch } from '@customdash/ui';
import type { SelectOption, MetricStyle } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';

interface SchemaFieldProps {
  fieldKey: string;
  schema: FieldSchema;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}

/**
 * Universal schema-driven field component for rendering form fields based on FieldSchema
 */
export function SchemaField({ fieldKey, schema, value, onChange }: SchemaFieldProps) {
  const handleChange = (newValue: unknown) => {
    onChange(fieldKey, newValue);
  };

  const currentValue = value ?? schema.default;

  switch (schema.inputType) {
    case 'text':
      return (
        <Input
          label={schema.label}
          value={String(currentValue || '')}
          onChange={e => handleChange(e.target.value)}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          label={schema.label}
          value={String(currentValue ?? '')}
          onChange={e => {
            const num = parseFloat(e.target.value);
            handleChange(isNaN(num) ? undefined : num);
          }}
        />
      );

    case 'color':
      return (
        <div className="space-y-1">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {schema.label}
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={String(currentValue || '#000000')}
              onChange={e => handleChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <Input
              value={String(currentValue || '')}
              onChange={e => handleChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <Switch
          label={schema.label}
          checked={Boolean(currentValue)}
          onChange={checked => handleChange(checked)}
        />
      );

    case 'select':
      return (
        <Select
          label={schema.label}
          value={String(currentValue || '')}
          onChange={e => handleChange(e.target.value)}
          options={(schema.options as SelectOption[]) || []}
        />
      );

    case 'color-array':
      return (
        <ColorArrayField
          label={schema.label}
          value={(currentValue as string[]) || []}
          onChange={handleChange}
        />
      );

    default:
      return null;
  }
}

interface ColorArrayFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}

function ColorArrayField({ label, value, onChange }: ColorArrayFieldProps) {
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...value];
    newColors[index] = color;
    onChange(newColors);
  };

  const handleAddColor = () => {
    onChange([...value, '#6366f1']);
  };

  const handleRemoveColor = (index: number) => {
    if (value.length <= 1) return;
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex flex-wrap gap-2">
        {value.map((color, index) => (
          <div key={index} className="relative group">
            <input
              type="color"
              value={color}
              onChange={e => handleColorChange(index, e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            {value.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs group-hover:flex"
              >
                x
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddColor}
          className="flex h-8 w-8 items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 dark:border-gray-600 dark:hover:border-gray-500"
        >
          +
        </button>
      </div>
    </div>
  );
}

interface MetricStyleFieldsProps {
  metricIndex: number;
  metricLabel: string;
  styles: MetricStyle;
  schema: Record<string, FieldSchema>;
  onChange: (index: number, updates: Partial<MetricStyle>) => void;
}

/**
 * MetricStyleFields component for styling a single metric
 */
export function MetricStyleFields({
  metricIndex,
  metricLabel,
  styles,
  schema,
  onChange,
}: MetricStyleFieldsProps) {
  const handleFieldChange = (key: string, value: unknown) => {
    onChange(metricIndex, { [key]: value });
  };

  const schemaEntries = Object.entries(schema);

  if (schemaEntries.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
        {metricLabel || `Metrique ${metricIndex + 1}`}
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        {schemaEntries.map(([key, fieldSchema]) => (
          <SchemaField
            key={key}
            fieldKey={key}
            schema={fieldSchema}
            value={styles[key as keyof MetricStyle]}
            onChange={handleFieldChange}
          />
        ))}
      </div>
    </div>
  );
}
