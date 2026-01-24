import type { ChartOptions, TooltipItem } from 'chart.js';
import type { WidgetParams, ChartStyles, BaseDataset } from '../interfaces';
import { isIsoTimestamp, allSameDay, formatXTicksLabel } from './chartUtils';
import type { ChartOptionsType, ChartType } from '../types';

interface DataLabelsOptions {
  display: boolean;
  color?: string;
  font?: { size?: number; weight?: string };
  formatter?: (
    value: number,
    context: { chart: unknown; dataIndex: number; dataset: { data: number[] } },
  ) => string;
  anchor?: string;
  align?: string;
}

/**
 * Creates a default dataset based on the chart type.
 *
 * @param chartType - The type of chart (e.g., 'bar', 'line', 'pie', etc.).
 * @param baseDataset - The base dataset containing data and optional styles.
 * @returns A dataset object with default and type-specific properties.
 *
 * @example
 * const baseDataset = {
 *   label: 'Sales',
 *   data: [100, 200, 150],
 *   backgroundColor: ['#ff0000', '#00ff00', '#0000ff'],
 * };
 * const defaultDataset = createDefaultDataset('bar', baseDataset);
 * // Result: Dataset object configured for a bar chart with the specified data and styles.
 */
export function createDefaultDataset(
  chartType: ChartType,
  baseDataset: BaseDataset & Partial<ChartStyles>,
): Record<string, unknown> {
  const typeSpecific: Record<ChartType, Record<string, unknown>> = {
    bar: {
      barThickness: baseDataset.barThickness,
      borderRadius: baseDataset.borderRadius || 0,
      borderSkipped: false,
    },
    line: {
      fill: baseDataset.fill !== undefined ? baseDataset.fill : false,
      tension: baseDataset.tension || 0,
      pointStyle: baseDataset.pointStyle || 'circle',
      borderDash: [],
      pointRadius: baseDataset.pointRadius || 3,
      pointHoverRadius: baseDataset.pointHoverRadius || 5,
      pointBackgroundColor: baseDataset.backgroundColor,
      pointBorderColor: baseDataset.borderColor,
    },
    pie: {
      hoverOffset: 4,
      borderAlign: 'inner',
      cutout: baseDataset.cutout || '0%',
    },
    scatter: {
      pointStyle: baseDataset.pointStyle || 'circle',
      showLine: false,
      pointRadius: baseDataset.pointRadius || 5,
      pointHoverRadius: baseDataset.pointHoverRadius || 7,
    },
    bubble: {
      pointStyle: baseDataset.pointStyle || 'circle',
      pointRadius: baseDataset.pointRadius || 5,
      pointHoverRadius: baseDataset.pointHoverRadius || 7,
    },
    radar: {
      fill: baseDataset.fill !== false,
      pointStyle: baseDataset.pointStyle || 'circle',
      pointRadius: baseDataset.pointRadius || 4,
      pointHoverRadius: baseDataset.pointHoverRadius || 6,
      tension: 0.1,
    },
  };

  return {
    ...baseDataset,
    ...typeSpecific[chartType],
  };
}

/**
 * Creates the base options for a chart.
 *
 * @param chartType - The type of chart (e.g., 'bar', 'line', 'scatter', etc.).
 * @param params - Widget parameters including labels, legends, and other configurations.
 * @param labels - The labels for the chart's data points.
 * @returns A Chart.js options object with default and type-specific properties.
 *
 * @example
 * const params: WidgetParams = {
 *   title: 'Sales Over Time',
 *   legendPosition: 'top',
 *   xLabel: 'Date',
 *   yLabel: 'Sales',
 *   showGrid: true,
 *   stacked: false,
 * };
 * const labels = ['2023-01-01', '2023-01-02', '2023-01-03'];
 * const baseOptions = createBaseOptions('line', params, labels);
 * // Result: ChartOptions object configured for a line chart with the specified parameters and labels.
 */
export function createBaseOptions(
  chartType: ChartType,
  params: WidgetParams,
  labels: string[],
): ChartOptionsType {
  const datalabelsOptions: DataLabelsOptions = {
    display: params.showValues === true,
    color: params.labelColor || '#000',
    font: {
      size: params.labelFontSize || 11,
      weight: 'bold',
    },
    anchor: 'end',
    align: 'top',
  };

  const baseOptions: ChartOptionsType = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: params.legend !== false,
        position: params.legendPosition || 'top',
      },
      title: {
        display: !!params.title,
        text: params.title || '',
        align: params.titleAlign || 'center',
        color: params.labelColor || '#000000',
        font: { size: params.labelFontSize || 12 },
      },
      tooltip: {
        callbacks: {
          label: (
            context: TooltipItem<'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'radar'>,
          ) => {
            const value = context.parsed.y ?? context.parsed;
            const format = params.tooltipFormat || '{label}: {value}';
            return format
              .replace('{label}', context.dataset.label || '')
              .replace('{value}', String(value));
          },
        },
      },
      datalabels: datalabelsOptions,
    },
  };

  if (chartType === 'bar' || chartType === 'line') {
    const isTimeSeries = labels.length > 0 && isIsoTimestamp(labels[0]);
    const isSameDay = isTimeSeries && allSameDay(labels);

    baseOptions.scales = {
      x: {
        display: true,
        title: {
          display: !!params.xLabel,
          text: params.xLabel || '',
          color: params.labelColor || '#000000',
          font: { size: params.labelFontSize || 12 },
        },
        stacked: params.stacked === true,
        grid: { display: params.showGrid !== false },
        ticks: isTimeSeries
          ? {
              callback: function (_: unknown, index: number) {
                return formatXTicksLabel(labels[index], isSameDay);
              },
              maxRotation: 45,
              minRotation: 0,
            }
          : { maxRotation: 45, minRotation: 0 },
      },
      y: {
        display: true,
        title: {
          display: !!params.yLabel,
          text: params.yLabel || '',
          color: params.labelColor || '#000000',
          font: { size: params.labelFontSize || 12 },
        },
        beginAtZero: true,
        stacked: params.stacked === true,
        grid: { display: params.showGrid !== false },
      },
    };

    baseOptions.indexAxis = params.horizontal === true ? 'y' : 'x';
  }

  if (chartType === 'scatter' || chartType === 'bubble') {
    baseOptions.scales = {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: !!params.xLabel,
          text: params.xLabel || '',
          color: params.labelColor || '#000000',
          font: { size: params.labelFontSize || 12 },
        },
        grid: { display: params.showGrid !== false },
      },
      y: {
        title: {
          display: !!params.yLabel,
          text: params.yLabel || '',
          color: params.labelColor || '#000000',
          font: { size: params.labelFontSize || 12 },
        },
        grid: { display: params.showGrid !== false },
      },
    };
  }

  return baseOptions;
}

/**
 * Creates specific options for a pie chart.
 *
 * @param params - Widget parameters including labels, legends, and other configurations.
 * @returns A Chart.js options object specifically for pie charts.
 *
 * @example
 * const params: WidgetParams = {
 *   title: 'Sales Distribution',
 *   legendPosition: 'right',
 *   labelFormat: '{label}: {value} ({percent}%)',
 * };
 * const pieOptions = createPieOptions(params);
 * // Result: ChartOptions object configured for a pie chart with the specified parameters.
 */
export function createPieOptions(params: WidgetParams): ChartOptions<'pie'> {
  const datalabelsOptions: DataLabelsOptions = {
    display: params.showValues === true,
    color: params.labelColor || '#fff',
    font: {
      size: params.labelFontSize || 12,
      weight: 'bold',
    },
    formatter: (
      value: number,
      context: { chart: unknown; dataIndex: number; dataset: { data: number[] } },
    ) => {
      const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
      const percentage = ((value / total) * 100).toFixed(1);
      return `${percentage}%`;
    },
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: params.cutout || '0%',
    plugins: {
      legend: {
        display: params.legend !== false,
        position: params.legendPosition || 'right',
      },
      title: {
        display: !!params.title,
        text: params.title || '',
        align: params.titleAlign || 'center',
      },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce(
              (sum: number, val: number) => sum + val,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(1);
            const format = params.labelFormat || '{label}: {value} ({percent}%)';
            return format
              .replace('{label}', label)
              .replace('{value}', String(value))
              .replace('{percent}', percentage);
          },
        },
      },
      datalabels: datalabelsOptions,
    },
  };
}
