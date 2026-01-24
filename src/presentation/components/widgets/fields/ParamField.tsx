import type { SelectOption, WidgetParams } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import { Input, Select, Switch } from '@customdash/ui';

interface ParamFieldProps {
  fieldKey: string;
  schema: FieldSchema;
  value: unknown;
  onChange: (key: keyof WidgetParams, value: unknown) => void;
}

/**
 * ParamField component for rendering widget parameter fields
 */
export function ParamField({ fieldKey, schema, value, onChange }: ParamFieldProps) {
  const handleChange = (newValue: unknown) => {
    onChange(fieldKey as keyof WidgetParams, newValue);
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {schema.label}
          </label>
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

    default:
      return null;
  }
}

interface ParamGroupProps {
  title: string;
  children: React.ReactNode;
}

/**
 * ParamGroup component for grouping related parameters
 */
export function ParamGroup({ title, children }: ParamGroupProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
