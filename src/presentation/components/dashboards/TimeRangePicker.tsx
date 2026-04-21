import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SelectOption } from '@customdash/visualizations';
import { useDashboardFormStore } from '@stores/dashboardFormStore';

interface TimeRangePickerProps {
  columnOptions?: SelectOption[];
}

/**
 * Inline popover for configuring the dashboard's global time range filter.
 * Reads and writes `config.timeRange` in the dashboard form store.
 */
export function TimeRangePicker({ columnOptions = [] }: TimeRangePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRange = useDashboardFormStore(s => s.config.timeRange);
  const setTimeRange = useDashboardFormStore(s => s.setTimeRange);

  const isActive = Boolean(timeRange.dateField && (timeRange.from || timeRange.to));

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setTimeRange({ dateField: undefined, from: null, to: null });
    },
    [setTimeRange],
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
        title={t('dashboards.timeRange.title')}
      >
        <CalendarDaysIcon className="h-4 w-4" />
        {isActive && (
          <span className="text-xs">
            {timeRange.from ? timeRange.from.slice(0, 10) : ''} -{' '}
            {timeRange.to ? timeRange.to.slice(0, 10) : ''}
          </span>
        )}
        {isActive && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={e => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
            className="ml-1 rounded p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 cursor-pointer"
            aria-label={t('dashboards.timeRange.clear')}
          >
            <XMarkIcon className="h-3 w-3" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            {t('dashboards.timeRange.title')}
          </h3>

          <div className="space-y-3">
            {columnOptions.length > 0 && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t('dashboards.timeRange.dateField')}
                </label>
                <select
                  value={timeRange.dateField ?? ''}
                  onChange={e => setTimeRange({ dateField: e.target.value || undefined })}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">{t('dashboards.timeRange.selectField')}</option>
                  {columnOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {columnOptions.length === 0 && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t('dashboards.timeRange.dateField')}
                </label>
                <input
                  type="text"
                  value={timeRange.dateField ?? ''}
                  onChange={e => setTimeRange({ dateField: e.target.value || undefined })}
                  placeholder={t('dashboards.timeRange.dateFieldPlaceholder')}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {t('dashboards.timeRange.from')}
              </label>
              <input
                type="datetime-local"
                value={timeRange.from ?? ''}
                onChange={e => setTimeRange({ from: e.target.value || null })}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {t('dashboards.timeRange.to')}
              </label>
              <input
                type="datetime-local"
                value={timeRange.to ?? ''}
                onChange={e => setTimeRange({ to: e.target.value || null })}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleClear}
                className="rounded px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {t('dashboards.timeRange.clear')}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                {t('common.apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
