import { useMemo, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  PlusCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, Spinner } from '@customdash/ui';
import { useWidgets, useDataSources, useAppTranslation } from '@hooks';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { widgetRegistry } from '@core/widgets';
import type { Widget } from '@type/widget.types';

interface WidgetSidePanelProps {
  open: boolean;
  onClose: () => void;
  dashboardId?: string;
}

const CATEGORY_ORDER = ['metric', 'chart', 'data'];

export function WidgetSidePanel({ open, onClose, dashboardId }: WidgetSidePanelProps) {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { data: allWidgets, isLoading } = useWidgets();
  const { data: allDataSources } = useDataSources();
  const [search, setSearch] = useState('');

  const dataSourceMap = useMemo(() => {
    if (!allDataSources) return {} as Record<string, string>;
    return Object.fromEntries(allDataSources.map(ds => [ds.id, ds.name]));
  }, [allDataSources]);

  const layout = useDashboardFormStore(s => s.config.layout);
  const addWidget = useDashboardFormStore(s => s.addWidget);
  const editMode = useDashboardFormStore(s => s.editMode);
  const isCreateMode = useDashboardFormStore(s => s.isCreateMode);

  const isEditing = editMode || isCreateMode;

  const existingWidgetIds = useMemo(() => new Set(layout.map(item => item.widgetId)), [layout]);

  const groupedWidgets = useMemo(() => {
    if (!allWidgets) return {} as Record<string, Widget[]>;

    const q = search.toLowerCase().trim();
    const groups: Record<string, Widget[]> = {};
    for (const widget of allWidgets) {
      if (q && !widget.title.toLowerCase().includes(q) && !widget.type.toLowerCase().includes(q))
        continue;
      const definition = widgetRegistry.get(
        widget.type as Parameters<typeof widgetRegistry.get>[0],
      );
      const category = definition?.getDefinition().category ?? 'chart';
      if (!groups[category]) groups[category] = [];
      groups[category].push(widget);
    }
    return groups;
  }, [allWidgets, search]);

  const handleAdd = useCallback(
    (widget: Widget) => {
      if (existingWidgetIds.has(widget.id)) return;
      addWidget(widget.id, widget);
    },
    [addWidget, existingWidgetIds],
  );

  const handleCreateNew = () => {
    const params = new URLSearchParams();
    if (dashboardId) params.set('dashboardId', dashboardId);
    navigate(`/widgets/new${params.toString() ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      metric: t('widgets.categories.metric'),
      chart: t('widgets.categories.chart'),
      data: t('widgets.categories.data'),
    };
    return map[category] ?? category;
  };

  const orderedCategories = CATEGORY_ORDER.filter(c => groupedWidgets[c]?.length);

  return (
    <div className="flex h-full w-80 flex-shrink-0 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          {t('dashboards.widgetPanel.title')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Search bar */}
      <div className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('dashboards.widgetSelectModal.searchPlaceholder')}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Create new button */}
      {isEditing && (
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={handleCreateNew}
          >
            {t('dashboards.widgetPanel.createNew')}
          </Button>
        </div>
      )}

      {/* Widget list */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : !allWidgets?.length ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <MagnifyingGlassIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dashboards.widgetPanel.noWidgets')}
            </p>
            {isEditing && (
              <Button size="sm" onClick={handleCreateNew}>
                {t('dashboards.widgetPanel.createNew')}
              </Button>
            )}
          </div>
        ) : orderedCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dashboards.widgetSelectModal.noResults')}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orderedCategories.map(category => {
              const widgets = groupedWidgets[category] ?? [];
              return (
                <div key={category}>
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {getCategoryLabel(category)}
                  </p>
                  <div className="space-y-1.5">
                    {widgets.map(widget => {
                      const already = existingWidgetIds.has(widget.id);
                      const definition = widgetRegistry.get(
                        widget.type as Parameters<typeof widgetRegistry.get>[0],
                      );
                      const Icon = definition?.getDefinition().icon;

                      return (
                        <div
                          key={widget.id}
                          className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                            already
                              ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50 dark:border-gray-800 dark:bg-gray-900'
                              : 'cursor-pointer border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20'
                          }`}
                          onClick={() => !already && handleAdd(widget)}
                          role="button"
                          aria-disabled={already}
                          tabIndex={already ? -1 : 0}
                          onKeyDown={e => e.key === 'Enter' && !already && handleAdd(widget)}
                        >
                          {Icon && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                              <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {widget.title}
                            </p>
                            {dataSourceMap[widget.dataSourceId] && (
                              <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                                {dataSourceMap[widget.dataSourceId]}
                              </p>
                            )}
                            {(widget.isGeneratedByAI || widget.isDraft) && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {widget.isGeneratedByAI && (
                                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                    IA
                                  </span>
                                )}
                                {widget.isDraft && (
                                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    Brouillon
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {already ? (
                            <Badge variant="default" className="shrink-0 text-xs">
                              {t('dashboards.widgetPanel.added')}
                            </Badge>
                          ) : (
                            <PlusCircleIcon className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-indigo-500 dark:text-gray-600 dark:group-hover:text-indigo-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
