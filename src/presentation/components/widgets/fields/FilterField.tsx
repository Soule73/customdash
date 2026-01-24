import { TrashIcon } from '@heroicons/react/24/outline';
import { Select, Input } from '@customdash/ui';
import type { FilterOperator, SelectOption } from '@customdash/visualizations';
import type { GlobalFilter } from '@type/widget-form.types';

const OPERATOR_OPTIONS: SelectOption<FilterOperator>[] = [
  { value: 'equals', label: 'Egal a' },
  { value: 'not_equals', label: 'Different de' },
  { value: 'contains', label: 'Contient' },
  { value: 'not_contains', label: 'Ne contient pas' },
  { value: 'greater_than', label: 'Superieur a' },
  { value: 'less_than', label: 'Inferieur a' },
  { value: 'greater_equal', label: 'Superieur ou egal' },
  { value: 'less_equal', label: 'Inferieur ou egal' },
  { value: 'starts_with', label: 'Commence par' },
  { value: 'ends_with', label: 'Termine par' },
];

interface FilterFieldProps {
  filter: GlobalFilter;
  index: number;
  columns: SelectOption[];
  onUpdate: (index: number, updates: Partial<GlobalFilter>) => void;
  onRemove: (index: number) => void;
}

/**
 * FilterField component for configuring a single global filter
 */
export function FilterField({ filter, index, columns, onUpdate, onRemove }: FilterFieldProps) {
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { field: e.target.value });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { operator: e.target.value as FilterOperator });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, { value: e.target.value });
  };

  return (
    <div className="flex items-end gap-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-1 grid grid-cols-3 gap-3">
        <Select
          label="Champ"
          value={filter.field}
          onChange={handleFieldChange}
          options={columns}
          placeholder="Selectionner..."
        />
        <Select
          label="Operateur"
          value={filter.operator}
          onChange={handleOperatorChange}
          options={OPERATOR_OPTIONS}
        />
        <Input
          label="Valeur"
          value={String(filter.value)}
          onChange={handleValueChange}
          placeholder="Valeur..."
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mb-1 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
        aria-label="Supprimer le filtre"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
