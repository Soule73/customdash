import { TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Input, Select } from '@customdash/ui';
import { BUCKET_TYPE_OPTIONS } from '@core/config';
import type { BucketType, SelectOption } from '@customdash/visualizations';
import type { BucketConfig } from '@type/widget-form.types';

interface BucketFieldProps {
  bucket: BucketConfig;
  index: number;
  columns: SelectOption[];
  allowedTypes?: SelectOption<BucketType>[];
  canDelete: boolean;
  onUpdate: (index: number, updates: Partial<BucketConfig>) => void;
  onRemove: (index: number) => void;
}

/**
 * BucketField component for configuring a single bucket/grouping
 */
export function BucketField({
  bucket,
  index,
  columns,
  allowedTypes = BUCKET_TYPE_OPTIONS,
  canDelete,
  onUpdate,
  onRemove,
}: BucketFieldProps) {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { type: e.target.value as BucketType });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { field: e.target.value });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, { label: e.target.value });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    onUpdate(index, { size: isNaN(size) ? undefined : size });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = parseInt(e.target.value, 10);
    onUpdate(index, { interval: isNaN(interval) ? undefined : interval });
  };

  const showSizeField = bucket.type === 'terms';
  const showIntervalField = bucket.type === 'histogram' || bucket.type === 'date_histogram';

  return (
    <div className="group flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex cursor-grab items-center pt-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <Bars3Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            value={bucket.type}
            onChange={handleTypeChange}
            options={allowedTypes}
          />
          <Select
            label="Champ"
            value={bucket.field}
            onChange={handleFieldChange}
            options={columns}
            placeholder="Selectionner..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Label"
            value={bucket.label || ''}
            onChange={handleLabelChange}
            placeholder="Label du groupement"
          />
          {showSizeField && (
            <Input
              type="number"
              label="Nombre max"
              value={bucket.size?.toString() || '10'}
              onChange={handleSizeChange}
              min={1}
            />
          )}
          {showIntervalField && (
            <Input
              type="number"
              label="Intervalle"
              value={bucket.interval?.toString() || ''}
              onChange={handleIntervalChange}
              min={1}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canDelete}
        className="mt-2 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900/20"
        aria-label="Supprimer le groupement"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
