import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@customdash/ui';
import type { SelectOption } from '@customdash/visualizations';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { dashboardFormService } from '@core/dashboards';
import { dataSourceService } from '@services/data-source.service';
import { FilterField } from '@components/widgets/fields/FilterField';
import type { DashboardFilter } from '@type/dashboard-form.types';

interface GlobalFilterPanelProps {
  datasourceIds: string[];
  onClose: () => void;
}

/**
 * Slide-over panel for managing dashboard-level global filters.
 * Discovers available columns from all distinct datasources used in the dashboard.
 */
export function GlobalFilterPanel({ datasourceIds, onClose }: GlobalFilterPanelProps) {
  const { t } = useTranslation();
  const globalFilters = useDashboardFormStore(s => s.config.globalFilters);
  const addFilter = useDashboardFormStore(s => s.addFilter);
  const updateFilter = useDashboardFormStore(s => s.updateFilter);
  const removeFilter = useDashboardFormStore(s => s.removeFilter);

  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    if (datasourceIds.length === 0) return;

    const uniqueIds = [...new Set(datasourceIds)];
    let cancelled = false;

    Promise.allSettled(uniqueIds.map(id => dataSourceService.getData(id))).then(results => {
      if (cancelled) return;
      const allColumns = results
        .filter(
          (r): r is PromiseFulfilledResult<Record<string, unknown>[]> => r.status === 'fulfilled',
        )
        .flatMap(r => (r.value.length > 0 ? Object.keys(r.value[0]) : []));
      setColumns([...new Set(allColumns)]);
    });

    return () => {
      cancelled = true;
    };
  }, [datasourceIds]);

  const columnOptions: SelectOption[] = useMemo(
    () => columns.map(col => ({ value: col, label: col })),
    [columns],
  );

  const handleAdd = useCallback(() => {
    addFilter(dashboardFormService.createFilter());
  }, [addFilter]);

  const handleUpdate = useCallback(
    (index: number, updates: Partial<DashboardFilter>) => {
      const filter = globalFilters[index];
      if (filter) {
        updateFilter(filter.id, updates);
      }
    },
    [globalFilters, updateFilter],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const filter = globalFilters[index];
      if (filter) {
        removeFilter(filter.id);
      }
    },
    [globalFilters, removeFilter],
  );

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md shadow-xl flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {t('dashboards.filters.title')}
          </h2>
          {globalFilters.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {globalFilters.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={t('common.close')}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {globalFilters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FunnelIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t('dashboards.filters.empty')}
            </p>
          </div>
        ) : (
          globalFilters.map((filter, index) => (
            <FilterField
              key={filter.id}
              filter={filter}
              index={index}
              columns={columnOptions}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={handleAdd}
          className="w-full"
        >
          {t('dashboards.filters.add')}
        </Button>
      </div>
    </div>
  );
}
