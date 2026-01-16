import type { WidgetParams } from '../types';

/**
 * Parametres par defaut communs pour tous les widgets de visualisation
 */
export const DEFAULT_WIDGET_PARAMS: WidgetParams = {
  title: '',
  legendPosition: 'top',
  xLabel: '',
  yLabel: '',
  labelFormat: '{label}: {value} ({percent}%)',
  tooltipFormat: '{label}: {value}',
  titleAlign: 'center',
  labelFontSize: 12,
  labelColor: '#000000',
  legend: true,
  showGrid: true,
  showValues: false,
  stacked: false,
  horizontal: false,
  showPoints: true,
  tension: 0,
  borderWidth: 1,
  borderRadius: 0,
  pointRadius: 3,
  showTicks: true,
};

/**
 * Fusionne les parametres par defaut avec les parametres utilisateur
 */
export function mergeWidgetParams(userParams?: Partial<WidgetParams>): WidgetParams {
  return {
    ...DEFAULT_WIDGET_PARAMS,
    ...userParams,
  };
}

/**
 * Valide et normalise les parametres de widget
 */
export function validateWidgetParams(params: Partial<WidgetParams>): WidgetParams {
  const merged = mergeWidgetParams(params);
  const validLegendPositions = ['top', 'left', 'right', 'bottom'] as const;
  const validTitleAligns = ['start', 'center', 'end'] as const;

  return {
    ...merged,
    legendPosition: validLegendPositions.includes(
      merged.legendPosition as (typeof validLegendPositions)[number],
    )
      ? merged.legendPosition
      : 'top',
    titleAlign: validTitleAligns.includes(merged.titleAlign as (typeof validTitleAligns)[number])
      ? merged.titleAlign
      : 'center',
    labelFontSize: Math.max(8, Math.min(72, merged.labelFontSize || 12)),
    tension: Math.max(0, Math.min(1, merged.tension || 0)),
    borderWidth: Math.max(0, merged.borderWidth || 1),
  };
}
