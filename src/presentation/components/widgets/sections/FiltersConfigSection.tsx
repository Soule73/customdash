import { useTranslation } from 'react-i18next';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button, Card } from '@customdash/ui';
import { FilterField } from '../fields/FilterField';
import { getWidgetDataConfig } from '@core/widgets';
import {
  useWidgetFormType,
  useWidgetFormColumns,
  useWidgetFormFilters,
  useWidgetFormActions,
} from '@stores/widgetFormStore';
import type { SelectOption } from '@customdash/visualizations';

/**
 * FiltersConfigSection component for configuring global filters
 */
export function FiltersConfigSection() {
  const { t } = useTranslation();
  const type = useWidgetFormType();
  const columns = useWidgetFormColumns();
  const globalFilters = useWidgetFormFilters();
  const { addGlobalFilter, updateGlobalFilter, removeGlobalFilter } = useWidgetFormActions();

  const dataConfig = getWidgetDataConfig(type);
  const columnOptions: SelectOption[] = columns.map(col => ({ value: col, label: col }));

  const showFilters = dataConfig?.useGlobalFilters;

  if (!showFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
          {t('widgets.sections.filtersNotAvailable')}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('widgets.sections.filtersNotAvailableDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('widgets.sections.filters')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={addGlobalFilter}
          >
            {t('widgets.actions.addFilter')}
          </Button>
        </div>
        {globalFilters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FunnelIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t('widgets.sections.noFilters')}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={addGlobalFilter}
            >
              {t('widgets.actions.addFirstFilter')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {globalFilters.map((filter, index) => (
              <FilterField
                key={index}
                filter={filter}
                index={index}
                columns={columnOptions}
                onUpdate={updateGlobalFilter}
                onRemove={removeGlobalFilter}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
