import type { ChartOptions } from 'chart.js';
import type { ChartType, WidgetParams } from '../types';

/**
 * Cree les options personnalisees pour bar chart
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
 * Cree les options personnalisees pour line chart
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
 * Cree les options personnalisees pour scatter chart
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
 * Cree les options personnalisees pour bubble chart
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
 * Cree les options personnalisees pour radar chart
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
 * Factory function pour obtenir les bonnes options selon le type de chart
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
 * Fusionne deux objets d'options de chart en profondeur
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
