import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Select, SearchSelect, Input } from '@customdash/ui';
import type { FilterOperator, SelectOption } from '@customdash/visualizations';
import type { GlobalFilter } from '@type/widget-form.types';

const OPERATOR_KEYS: FilterOperator[] = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
  'starts_with',
  'ends_with',
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
  const { t } = useTranslation();

  const operatorOptions: SelectOption<FilterOperator>[] = useMemo(() => {
    return OPERATOR_KEYS.map(key => ({
      value: key,
      label: t(`widgets.operators.${key}`),
    }));
  }, [t]);

  const handleFieldChange = (value: string) => {
    onUpdate(index, { field: value });
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
        <SearchSelect
          label={t('widgets.filters.field')}
          value={filter.field}
          onChange={handleFieldChange}
          options={columns}
          placeholder={t('widgets.actions.select')}
          searchPlaceholder={t('table.search')}
          noResultsLabel={t('common.noResultsFound')}
        />
        <Select
          label={t('widgets.filters.operator')}
          value={filter.operator}
          onChange={handleOperatorChange}
          options={operatorOptions}
        />
        <Input
          label={t('widgets.filters.value')}
          value={String(filter.value)}
          onChange={handleValueChange}
          placeholder={t('widgets.filters.valuePlaceholder')}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mb-1 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
        aria-label={t('widgets.filters.deleteFilter')}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
