import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@customdash/ui';
import type { WidgetType, Filter, EChartClickParams } from '@customdash/visualizations';
import { applyAllFilters } from '@customdash/visualizations';
import { useWidgetData, useDrillDown, useWidgetDetail } from '@hooks/widgets';
import type { Widget } from '@type/widget.types';
import { widgetRegistry } from '@/core/widgets';
import { DrillDownModal } from './DrillDownModal';
import { WidgetDetailModal } from './WidgetDetailModal';

interface WidgetDisplayProps {
  widget: Widget;
  className?: string;
  dashboardGlobalFilters?: Filter[];
  editMode?: boolean;
  hideDetailButton?: boolean;
}

/**
 * Displays a widget with its data loaded from the data source.
 * Centralizes: loading state, error state, chart click drill-down (DrillDownModal)
 * and the full-data detail view (WidgetDetailModal with DataGrid).
 * The "view data" button is always visible for every widget type.
 */
export function WidgetDisplay({
  widget,
  className,
  dashboardGlobalFilters,
  editMode,
  hideDetailButton = false,
}: WidgetDisplayProps) {
  const { t } = useTranslation();
  const widgetFilters = useMemo<Filter[]>(
    () =>
      (widget.config.globalFilters ?? []).map(f => ({
        field: f.field,
        operator: f.operator as Filter['operator'],
        value: f.value as Filter['value'],
      })),
    [widget.config.globalFilters],
  );

  const hasEmbeddedData = Array.isArray(widget.data);
  const { data, config, isLoading, error } = useWidgetData({
    widget,
    dashboardGlobalFilters,
    enabled: !hasEmbeddedData,
  });
  const { drillDown, handleDataPointClick, closeDrillDown } = useDrillDown();
  const { isDetailOpen, openDetail, closeDetail } = useWidgetDetail();

  const WidgetComponent = widgetRegistry.getAllComponents()[widget.type as WidgetType];

  const onDataPointClick = useCallback(
    (params: EChartClickParams) => {
      handleDataPointClick(params, widget.title);
    },
    [handleDataPointClick, widget.title],
  );

  const displayData = useMemo(() => {
    const rawData = hasEmbeddedData ? (widget.data ?? []) : data;
    return applyAllFilters(rawData, dashboardGlobalFilters, widgetFilters);
  }, [data, dashboardGlobalFilters, hasEmbeddedData, widget.data, widgetFilters]);

  const hasDisplayData = displayData.length > 0;
  const isWidgetLoading = hasEmbeddedData ? false : isLoading;

  if (!WidgetComponent) {
    return (
      <div className="flex h-full items-center justify-center widget-text-secondary text-gray-500 dark:text-gray-400">
        {t('widgets.unsupportedType')}: {widget.type}
      </div>
    );
  }

  if (isWidgetLoading && !hasDisplayData) {
    return (
      <div className="h-full w-full p-4">
        <Skeleton variant="rounded" className="h-full w-full" />
      </div>
    );
  }

  if (error && !hasEmbeddedData) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 text-sm">
        {t('widgets.loadError')}
      </div>
    );
  }

  return (
    <>
      <div className={`relative group ${className || 'h-full w-full'}`}>
        <WidgetComponent data={displayData} config={config} onDataPointClick={onDataPointClick} />

        {!editMode && !hideDetailButton && (
          <button
            type="button"
            onClick={openDetail}
            title={t('dashboards.detail.buttonTitle')}
            className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-1.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18M10 4v16M14 4v16"
              />
            </svg>
            {t('dashboards.detail.buttonLabel')}
          </button>
        )}
      </div>

      <DrillDownModal
        isOpen={drillDown.isOpen}
        onClose={closeDrillDown}
        widgetTitle={drillDown.widgetTitle}
        clickedPoint={drillDown.clickedPoint}
      />

      <WidgetDetailModal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        widgetTitle={widget.title}
        data={displayData}
      />
    </>
  );
}
