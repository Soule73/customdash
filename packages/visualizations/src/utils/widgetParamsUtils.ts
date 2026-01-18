import { DEFAULT_WIDGET_PARAMS } from '../constants';
import type { WidgetParams } from '../interfaces';

/**
 * Merges the default widget parameters with user-provided parameters.
 *
 * @param userParams - Partial widget parameters provided by the user.
 * @returns The merged widget parameters, combining defaults and user overrides.
 *
 * @example
 * mergeWidgetParams({ title: 'My Chart', legend: false });
 * // Returns:
 * // {
 * //   title: 'My Chart',
 * //   legendPosition: 'top',
 * //   xLabel: '',
 * //   yLabel: '',
 * //   labelFormat: '{label}: {value} ({percent}%)',
 * //   tooltipFormat: '{label}: {value}',
 * //   titleAlign: 'center',
 * //   labelFontSize: 12,
 * //   labelColor: '#000000',
 * //   legend: false,
 * //   showGrid: true,
 * //   showValues: false,
 * //   stacked: false,
 * //   horizontal: false,
 * //   showPoints: true,
 * //   tension: 0,
 * //   borderWidth: 1,
 * //   borderRadius: 0,
 * //   pointRadius: 3,
 * //   showTicks: true,
 * // }
 */
export function mergeWidgetParams(userParams?: Partial<WidgetParams>): WidgetParams {
  return {
    ...DEFAULT_WIDGET_PARAMS,
    ...userParams,
  };
}

/**
 * Validates and normalizes widget parameters.
 *
 * This function ensures that the provided widget parameters are valid and fall within acceptable ranges.
 * It merges the user-provided parameters with the default parameters, and applies additional validation rules.
 *
 * @param params - Partial widget parameters provided by the user.
 * @returns The validated and normalized widget parameters.
 *
 * @example
 * validateWidgetParams({ title: 'My Chart', labelFontSize: 100 });
 * // Returns:
 * // {
 * //   title: 'My Chart',
 * //   legendPosition: 'top',
 * //   xLabel: '',
 * //   yLabel: '',
 * //   labelFormat: '{label}: {value} ({percent}%)',
 * //   tooltipFormat: '{label}: {value}',
 * //   titleAlign: 'center',
 * //   labelFontSize: 72, // Clamped to max 72
 * //   labelColor: '#000000',
 * //   legend: true,
 * //   showGrid: true,
 * //   showValues: false,
 * //   stacked: false,
 * //   horizontal: false,
 * //   showPoints: true,
 * //   tension: 0,
 * //   borderWidth: 1,
 * //   borderRadius: 0,
 * //   pointRadius: 3,
 * //   showTicks: true,
 * // }
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
