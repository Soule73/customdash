import { useMemo } from 'react';
import { Skeleton } from '@customdash/ui';
import type { WidgetType, ThemeColors } from '@customdash/visualizations';
import { useWidgetData } from '@hooks/widgets';
import type { Widget } from '@type/widget.types';
import { widgetRegistry } from '@/core/widgets';

interface WidgetDisplayProps {
  widget: Widget;
  className?: string;
  themeColors?: ThemeColors;
}

/**
 * Displays a widget with its data loaded from the data source.
 * Handles loading states, errors, and renders the appropriate widget component.
 */
export function WidgetDisplay({ widget, className, themeColors }: WidgetDisplayProps) {
  const { data, config, isLoading, hasData, error } = useWidgetData({ widget });

  const mergedConfig = useMemo(() => {
    if (!themeColors) return config;
    return {
      ...config,
      themeColors: {
        ...themeColors,
        ...config?.themeColors,
      },
    };
  }, [config, themeColors]);

  const WidgetComponent = widgetRegistry.getAllComponents()[widget.type as WidgetType];

  if (!WidgetComponent) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
        Type non supporte: {widget.type}
      </div>
    );
  }

  if (isLoading && !hasData) {
    return (
      <div className="h-full w-full p-4">
        <Skeleton variant="rounded" className="h-full w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 dark:text-red-400 text-sm">
        Erreur de chargement
      </div>
    );
  }

  return (
    <div className={className || 'h-full w-full'}>
      <WidgetComponent data={data} config={mergedConfig} />
    </div>
  );
}
