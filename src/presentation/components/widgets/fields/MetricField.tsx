import { TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Button, Checkbox, Input, Select } from '@customdash/ui';
import { AGGREGATION_OPTIONS } from '@core/config';
import type { AggregationType, SelectOption } from '@customdash/visualizations';
import type { MetricConfig } from '@type/widget-form.types';

interface MetricFieldProps {
  metric: MetricConfig;
  index: number;
  columns: SelectOption[];
  canDelete: boolean;
  onUpdate: (index: number, updates: Partial<MetricConfig>) => void;
  onRemove: (index: number) => void;
  showXY?: boolean;
  showR?: boolean;
  showFields?: boolean;
}

/**
 * MetricField component for configuring a single metric
 */
export function MetricField({
  metric,
  index,
  columns,
  canDelete,
  onUpdate,
  onRemove,
  showXY = false,
  showR = false,
  showFields = false,
}: MetricFieldProps) {
  const handleAggChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { agg: e.target.value as AggregationType });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field = e.target.value;
    onUpdate(index, { field, label: metric.label || field });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, { label: e.target.value });
  };

  const handleXChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { x: e.target.value });
  };

  const handleYChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { y: e.target.value });
  };

  const handleRChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { r: e.target.value });
  };

  return (
    <div className="group flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex cursor-grab items-center pt-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <Bars3Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-3">
        {!showXY && !showFields && (
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Agregation"
              value={metric.agg}
              onChange={handleAggChange}
              options={AGGREGATION_OPTIONS}
            />
            <Select
              label="Champ"
              value={metric.field}
              onChange={handleFieldChange}
              options={columns}
              placeholder="Selectionner..."
            />
          </div>
        )}

        {showXY && (
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Champ X"
              value={metric.x || ''}
              onChange={handleXChange}
              options={columns}
              placeholder="Selectionner..."
            />
            <Select
              label="Champ Y"
              value={metric.y || ''}
              onChange={handleYChange}
              options={columns}
              placeholder="Selectionner..."
            />
          </div>
        )}

        {showR && (
          <Select
            label="Champ R (rayon)"
            value={metric.r || ''}
            onChange={handleRChange}
            options={columns}
            placeholder="Selectionner..."
          />
        )}

        {showFields && (
          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Axes a inclure
            </span>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {columns.map(col => {
                const isChecked =
                  Array.isArray(metric.fields) && metric.fields.includes(col.value as string);
                return (
                  <Checkbox
                    key={col.value}
                    label={col.label}
                    checked={isChecked}
                    onChange={e => {
                      const currentFields = Array.isArray(metric.fields) ? [...metric.fields] : [];
                      const newFields = e.target.checked
                        ? [...currentFields, col.value as string]
                        : currentFields.filter(f => f !== col.value);
                      onUpdate(index, { fields: newFields });
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <Input
          label="Label du dataset"
          value={metric.label}
          onChange={handleLabelChange}
          placeholder={
            showXY || showFields ? 'Ex: Serie 1, Donnees 2024...' : 'Label de la metrique'
          }
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        disabled={!canDelete}
        className="mt-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
        aria-label="Supprimer la metrique"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
