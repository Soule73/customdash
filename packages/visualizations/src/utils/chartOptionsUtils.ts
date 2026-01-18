import type { ChartOptions } from 'chart.js';
import type { WidgetParams } from '../interfaces';
import type { ChartType } from '../types';

/**
 * Create custom options for a bar chart
 * @param params - Widget parameters
 * @returns Custom options for a bar chart
 *
 * @example
 * const params: WidgetParams = {
 *   stacked: true,
 *   horizontal: false,
 *   showGrid: true,
 *  // other params...
 * };
 * createBarChartCustomOptions(params);
 * //Result:
 * {
 *  scales: {
 *     x: { stacked: true },
 *    y: { stacked: true }
 *  },
 *  indexAxis: 'x'
 * }
 */
export function createBarChartCustomOptions(params: WidgetParams): Partial<ChartOptions<'bar'>> {
  return {
    scales: {
      x: {
        stacked: params.stacked === true,
      },
      y: {
        stacked: params.stacked === true,
      },
    },
    indexAxis: params.horizontal ? 'y' : 'x',
  };
}

/**
 * Create custom options for a line chart
 * @param params - Widget parameters
 * @returns Custom options for a line chart
 *
 * @example
 * const params: WidgetParams = {
 *   stacked: false,
 *   showPoints: true,
 *   pointRadius: 4,
 *  // other params...
 * };
 * createLineChartCustomOptions(params);
 * // Result:
 * {
 *  scales: {
 *     x: { stacked: false },
 *    y: { stacked: false }
 *  },
 *  elements: {
 *    point: { radius: 4 }
 *  }
 * }
 */
export function createLineChartCustomOptions(params: WidgetParams): Partial<ChartOptions<'line'>> {
  return {
    scales: {
      x: {
        stacked: params.stacked === true,
      },
      y: {
        stacked: params.stacked === true,
      },
    },
    elements: {
      point: {
        radius: params.showPoints === false ? 0 : params.pointRadius || 3,
      },
    },
  };
}

/**
 * Create custom options for a scatter chart
 * @returns Custom options for a scatter chart
 *
 * @example
 * createScatterChartCustomOptions();
 * //Result:
 * {
 *  scales: {
 *     x: { type: 'linear', position: 'bottom' },
 *    y: {}
 *  }
 * }
 */
export function createScatterChartCustomOptions(): Partial<ChartOptions<'scatter'>> {
  return {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
      y: {},
    },
  };
}

/**
 * Create custom options for a bubble chart
 * @returns Custom options for a bubble chart
 *
 * @example
 * createBubbleChartCustomOptions();
 * //Result:
 * {
 *  scales: {
 *     x: { type: 'linear', position: 'bottom' },
 *    y: {}
 *  }
 * }
 */
export function createBubbleChartCustomOptions(): Partial<ChartOptions<'bubble'>> {
  return {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
      y: {},
    },
  };
}

/**
 * Create custom options for a radar chart
 * @param params - Widget parameters
 * @returns Custom options for a radar chart
 *
 * @example
 * const params: WidgetParams = {
 *   showGrid: true,
 *   showTicks: true,
 *   pointRadius: 3,
 *   borderWidth: 1,
 *  // other params...
 * };
 * createRadarChartCustomOptions(params);
 * //Result:
 * {
 *  scales: {
 *     r: {
 *       beginAtZero: true,
 *       grid: { display: true },
 *       ticks: { display: true }
 *     }
 *  },
 */
export function createRadarChartCustomOptions(
  params: WidgetParams,
): Partial<ChartOptions<'radar'>> {
  return {
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          display: params.showGrid !== false,
        },
        ticks: {
          display: params.showTicks !== false,
        },
      },
    },
    elements: {
      point: {
        radius: params.pointRadius || 3,
      },
      line: {
        borderWidth: params.borderWidth || 2,
      },
    },
  };
}

/**
 * Factory function to get the appropriate options based on chart type
 * @param chartType - The chart type
 * @param params - Widget parameters
 * @returns Custom options for the specified chart type
 *
 * @example
 * const params: WidgetParams = {
 *   stacked: true,
 *   horizontal: false,
 *   showGrid: true,
 *   pointRadius: 4,
 *   borderWidth: 2,
 *   // other params...
 * };
 * getCustomChartOptions('bar', params);
 * //Result:
 * {
 *  scales: {
 *     x: { stacked: true },
 *    y: { stacked: true }
 *  },
 *  indexAxis: 'x'
 * }
 *
 * const params: WidgetParams = {
 *   stacked: false,
 *   showPoints: true,
 *   pointRadius: 4,
 *   // other params...
 * };
 * getCustomChartOptions('line', params);
 * //Result:
 * {
 *  scales: {
 *     x: { stacked: false },
 *    y: { stacked: false }
 *  },
 *  elements: {
 *    point: { radius: 4 }
 *  }
 * }
 */
export function getCustomChartOptions(
  chartType: ChartType,
  params: WidgetParams,
): Record<string, unknown> {
  switch (chartType) {
    case 'bar':
      return createBarChartCustomOptions(params) as Record<string, unknown>;
    case 'line':
      return createLineChartCustomOptions(params) as Record<string, unknown>;
    case 'scatter':
      return createScatterChartCustomOptions() as Record<string, unknown>;
    case 'bubble':
      return createBubbleChartCustomOptions() as Record<string, unknown>;
    case 'radar':
      return createRadarChartCustomOptions(params) as Record<string, unknown>;
    default:
      return {};
  }
}

/**
 * Deep merge two chart options objects
 * @param baseOptions - Base options
 * @param customOptions - Custom options to merge
 * @returns Merged options
 *
 * @example
 * const baseOptions = { plugins: { legend: { display: true } } };
 * const customOptions = { plugins: { legend: { position: 'bottom' } } };
 * const merged = mergeOptions(baseOptions, customOptions);
 * // Result: { plugins: { legend: { display: true, position: 'bottom' } } }
 */
export function mergeOptions<T extends Record<string, unknown>>(
  baseOptions: T,
  customOptions: Partial<T>,
): T {
  const result = { ...baseOptions };

  for (const key in customOptions) {
    if (Object.prototype.hasOwnProperty.call(customOptions, key)) {
      const customValue = customOptions[key as keyof T];
      const baseValue = result[key as keyof T];

      if (
        customValue !== null &&
        typeof customValue === 'object' &&
        !Array.isArray(customValue) &&
        baseValue !== null &&
        typeof baseValue === 'object' &&
        !Array.isArray(baseValue)
      ) {
        result[key as keyof T] = mergeOptions(
          baseValue as Record<string, unknown>,
          customValue as Record<string, unknown>,
        ) as T[keyof T];
      } else if (customValue !== undefined) {
        result[key as keyof T] = customValue as T[keyof T];
      }
    }
  }

  return result;
}
