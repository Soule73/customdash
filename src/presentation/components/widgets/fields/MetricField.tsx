import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button, Checkbox, Input, Select, SearchSelect } from '@customdash/ui';
import { AGGREGATION_OPTIONS } from '@core/widgets';
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
  const { t } = useTranslation();

  const handleAggChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { agg: e.target.value as AggregationType });
  };

  const handleFieldChange = (value: string) => {
    onUpdate(index, { field: value, label: metric.label || value });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, { label: e.target.value });
  };

  const handleXChange = (value: string) => {
    onUpdate(index, { x: value });
  };

  const handleYChange = (value: string) => {
    onUpdate(index, { y: value });
  };

  const handleRChange = (value: string) => {
    onUpdate(index, { r: value });
  };

  return (
    <div className="group flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 pl-10 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-1 space-y-3">
        {!showXY && !showFields && (
          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t('widgets.metrics.aggregation')}
              value={metric.agg}
              onChange={handleAggChange}
              options={AGGREGATION_OPTIONS}
            />
            <SearchSelect
              label={t('widgets.metrics.field')}
              value={metric.field}
              onChange={handleFieldChange}
              options={columns}
              placeholder={t('widgets.actions.select')}
            />
          </div>
        )}

        {showXY && (
          <div className="grid grid-cols-2 gap-3">
            <SearchSelect
              label={t('widgets.metrics.xField')}
              value={metric.x || ''}
              onChange={handleXChange}
              options={columns}
              placeholder={t('widgets.actions.select')}
            />
            <SearchSelect
              label={t('widgets.metrics.yField')}
              value={metric.y || ''}
              onChange={handleYChange}
              options={columns}
              placeholder={t('widgets.actions.select')}
            />
          </div>
        )}

        {showR && (
          <SearchSelect
            label={t('widgets.metrics.rField')}
            value={metric.r || ''}
            onChange={handleRChange}
            options={columns}
            placeholder={t('widgets.actions.select')}
          />
        )}

        {showFields && (
          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('widgets.metrics.axesToInclude')}
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
          label={t('widgets.metrics.datasetLabel')}
          value={metric.label}
          onChange={handleLabelChange}
          placeholder={
            showXY || showFields
              ? t('widgets.metrics.datasetPlaceholder')
              : t('widgets.metrics.metricLabel')
          }
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        disabled={!canDelete}
        className="mt-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
        aria-label={t('widgets.metrics.deleteMetric')}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
