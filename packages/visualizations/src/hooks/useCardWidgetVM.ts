import { useMemo } from 'react';
import type { CardConfig, CardDataContext } from '../interfaces';
import { CardWidgetService } from '../core/services/CardWidgetService';

export interface CardWidgetVM {
  formattedValue: string;
  title: string;
  description: string;
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
  showIcon: boolean;
  iconName: string;
}

export interface CardWidgetInput {
  data: Record<string, unknown>[];
  config: CardConfig;
}

/**
 * ViewModel hook for CardWidget handling data processing, formatting and styling
 * Uses CardWidgetService for business logic delegation
 */
export function useCardWidgetVM({ data, config }: CardWidgetInput): CardWidgetVM {
  const context = useMemo<CardDataContext>(
    () => CardWidgetService.createDataContext({ data, config }),
    [data, config],
  );

  const value = useMemo(() => CardWidgetService.calculateValue(context), [context]);

  const formattedValue = useMemo(
    () => CardWidgetService.formatValue(value, context),
    [value, context],
  );

  return {
    formattedValue,
    title: context.title,
    description: context.widgetParams.description,
    iconColor: context.widgetParams.iconColor,
    valueColor: context.widgetParams.valueColor,
    descriptionColor: context.widgetParams.descriptionColor,
    showIcon: context.widgetParams.showIcon,
    iconName: context.widgetParams.icon,
  };
}
