import type {
  Metric,
  MetricStyle,
  ProcessedData,
  DatasetCreationContext,
  WidgetParams,
} from '../interfaces';
import { createDefaultDataset } from './chartConfigUtils';
import { getDatasetColor, generateColorsForLabels } from './chartColorUtils';
import { aggregate } from './chartUtils';

/**
 * Creates datasets for split series.
 * @param context - The dataset creation context containing chart type, labels, widget parameters, metrics, metric styles, and processed data.
 * @param customDatasetCreator - Optional function to create a custom dataset for each metric.
 * @returns An array of datasets for the split series.
 *
 * @example
 * const context: DatasetCreationContext = {
 *   chartType: 'bar',
 *   labels: ['January', 'February', 'March'],
 *   widgetParams: { /* widget parameters * / },
 *   metrics: [{ field: 'sales', agg: 'sum', label: 'Total Sales' }],
 *   metricStyles: [{ color: '#34d399' }],
 *   processedData: { /* processed data with split series * / },
 * };
 * const splitDatasets = createSplitSeriesDatasets(context);
 * // Result: Array of datasets for each split series in the processed data.
 */
export function createSplitSeriesDatasets(
  context: DatasetCreationContext,
  customDatasetCreator?: (
    metric: Metric,
    idx: number,
    values: number[],
    labels: string[],
    widgetParams: WidgetParams,
    metricStyle: MetricStyle,
  ) => Record<string, unknown>,
): Record<string, unknown>[] {
  const { chartType, labels, widgetParams, metrics, metricStyles, processedData } = context;

  return processedData.splitData.series.map((splitItem, idx) => {
    const metric = metrics[0] || { agg: 'sum' as const, field: '', label: '' };
    const values = labels.map(label => {
      const bucketData = splitItem.data.filter(
        row => row[processedData.bucketHierarchy[0]?.bucket.field] === label,
      );
      return aggregate(bucketData as Record<string, unknown>[], metric.agg, metric.field);
    });

    const style = metricStyles[idx] || {};

    if (customDatasetCreator) {
      return customDatasetCreator(metric, idx, values, labels, widgetParams, style);
    }

    return createDefaultDataset(chartType, {
      label: splitItem.key,
      data: values,
      backgroundColor: getDatasetColor(chartType, idx, style),
      borderColor: style.borderColor || getDatasetColor(chartType, idx, style),
      borderWidth: style.borderWidth ?? 1,
      ...style,
    });
  });
}

/**
 * Creates datasets for each metric.
 * @param context - The dataset creation context containing chart type, labels, widget parameters, metrics, metric styles, and a function to get values.
 * @param customDatasetCreator - Optional function to create a custom dataset for each metric.
 * @returns An array of datasets, one for each metric.
 *
 * @example
 * const context: DatasetCreationContext = {
 *   chartType: 'line',
 *   labels: ['January', 'February', 'March'],
 *   widgetParams: { /* widget parameters * / },
 *   metrics: [
 *     { field: 'sales', agg: 'sum', label: 'Total Sales' },
 *     { field: 'profit', agg: 'sum', label: 'Total Profit' },
 *   ],
 *   metricStyles: [{ color: '#34d399' }, { color: '#60a5fa' }],
 *   getValues: (metric) => { /* function to get values for the metric * / },
 * };
 * const metricDatasets = createMetricDatasets(context);
 * // Result: Array of datasets for each metric in the context.
 */
export function createMetricDatasets(
  context: DatasetCreationContext,
  customDatasetCreator?: (
    metric: Metric,
    idx: number,
    values: number[],
    labels: string[],
    widgetParams: WidgetParams,
    metricStyle: MetricStyle,
  ) => Record<string, unknown>,
): Record<string, unknown>[] {
  const { chartType, labels, widgetParams, metrics, metricStyles, getValues } = context;

  return metrics.map((metric, idx) => {
    const values = getValues(metric);
    const style = metricStyles[idx] || {};

    if (customDatasetCreator) {
      return customDatasetCreator(metric, idx, values, labels, widgetParams, style);
    }

    return createDefaultDataset(chartType, {
      label: metric.label || `${metric.agg}(${metric.field})`,
      data: values,
      backgroundColor: getDatasetColor(chartType, idx, style, style.colors),
      borderColor: style.borderColor || getDatasetColor(chartType, idx, style),
      borderWidth: style.borderWidth ?? 1,
      ...style,
    });
  });
}

/**
 * Main logic to create all datasets.
 *
 * This function determines whether to create datasets for split series or for individual metrics
 * based on the presence of split data in the processed data. It delegates the dataset creation
 * to either `createSplitSeriesDatasets` or `createMetricDatasets`.
 *
 * @param context - The dataset creation context containing chart type, labels, widget parameters,
 * metrics, metric styles, and processed data.
 * @param customDatasetCreator - Optional function to create a custom dataset for each metric.
 * @returns An array of datasets for the chart.
 *
 * @example
 * const context: DatasetCreationContext = {
 *   chartType: 'line',
 *   labels: ['January', 'February', 'March'],
 *   widgetParams: { /* widget parameters * / },
 *   metrics: [
 *     { field: 'sales', agg: 'sum', label: 'Total Sales' },
 *     { field: 'profit', agg: 'sum', label: 'Total Profit' },
 *   ],
 *   metricStyles: [{ color: '#34d399' }, { color: '#60a5fa' }],
 *   processedData: { /* processed data with split series * / },
 *   getValues: (metric) => { /* function to get values for the metric * / },
 * };
 * const datasets = createChartDatasets(context);
 * // Result: Array of datasets for the chart based on the context.
 */
export function createChartDatasets(
  context: DatasetCreationContext,
  customDatasetCreator?: (
    metric: Metric,
    idx: number,
    values: number[],
    labels: string[],
    widgetParams: WidgetParams,
    metricStyle: MetricStyle,
  ) => Record<string, unknown>,
): Record<string, unknown>[] {
  if (context.processedData.splitData.series.length > 0) {
    return createSplitSeriesDatasets(context, customDatasetCreator);
  }
  return createMetricDatasets(context, customDatasetCreator);
}

/**
 * Normalizes the structure of metric styles.
 *
 * This function ensures that the metric styles are returned as an array,
 * regardless of whether the input is already an array or an object.
 *
 * @param metricStyles - The metric styles to normalize, which can be either
 * an array of MetricStyle objects or an object with MetricStyle values.
 * @returns An array of MetricStyle objects.
 *
 * @example
 * const stylesArray: MetricStyle[] = [
 *   { color: '#34d399' },
 *   { color: '#60a5fa' },
 * ];
 * const normalizedArray = prepareMetricStyles(stylesArray);
 * // Result: Same as stylesArray
 */
export function prepareMetricStyles(
  metricStyles?: MetricStyle[] | Record<string, MetricStyle>,
): MetricStyle[] {
  if (Array.isArray(metricStyles)) {
    return metricStyles;
  }

  if (metricStyles && typeof metricStyles === 'object') {
    return Object.values(metricStyles);
  }

  return [];
}

/**
 * Creates a dataset specialized for bar charts.
 *
 * @param metric - The metric configuration.
 * @param idx - The index of the dataset.
 * @param values - The array of values for the dataset.
 * @param _labels - The array of labels (not used in this function).
 * @param widgetParams - The widget parameters for additional styling options.
 * @param style - The metric style for custom styling.
 * @returns A dataset object configured for a bar chart.
 *
 * @example
 * const metric: Metric = { field: 'sales', agg: 'sum', label: 'Total Sales' };
 * const values: number[] = [100, 200, 150];
 * const widgetParams: WidgetParams = { borderWidth: 2, barThickness: 20 };
 * const style: MetricStyle = { color: '#34d399', borderColor: '#10b981' };
 * const barDataset = createBarChartDataset(metric, 0, values, [], widgetParams, style);
 * // Result: Dataset object configured for a bar chart with the specified parameters.
 */
export function createBarChartDataset(
  metric: Metric,
  idx: number,
  values: number[],
  _labels: string[],
  widgetParams: WidgetParams,
  style: MetricStyle,
): Record<string, unknown> {
  return {
    label: metric.label || `${metric.agg}(${metric.field})`,
    data: values,
    backgroundColor: getDatasetColor('bar', idx, style, style.colors),
    borderColor: style.borderColor || getDatasetColor('bar', idx, style),
    borderWidth: style.borderWidth ?? (widgetParams.borderWidth as number) ?? 1,
    barThickness: style.barThickness || (widgetParams.barThickness as number),
    borderRadius: style.borderRadius || (widgetParams.borderRadius as number) || 0,
    borderSkipped: false,
  };
}

/** Creates a dataset specialized for line charts.
 *
 * @param metric - The metric configuration.
 * @param idx - The index of the dataset.
 * @param values - The array of values for the dataset.
 * @param _labels - The array of labels (not used in this function).
 * @param widgetParams - The widget parameters for additional styling options.
 * @param style - The metric style for custom styling.
 * @returns A dataset object configured for a line chart.
 *
 * @example
 * const metric: Metric = { field: 'revenue', agg: 'avg', label: 'Average Revenue' };
 * const values: number[] = [120, 150, 180];
 * const widgetParams: WidgetParams = { borderWidth: 2, tension: 0.3 };
 * const style: MetricStyle = { color: '#f87171', borderColor: '#ef4444' };
 * const lineDataset = createLineChartDataset(metric, 0, values, [], widgetParams, style);
 * // Result: Dataset object configured for a line chart with the specified parameters.
 */
export function createLineChartDataset(
  metric: Metric,
  idx: number,
  values: number[],
  _labels: string[],
  widgetParams: WidgetParams,
  style: MetricStyle,
): Record<string, unknown> {
  return {
    label: metric.label || `${metric.agg}(${metric.field})`,
    data: values,
    backgroundColor: getDatasetColor('line', idx, style, style.colors),
    borderColor: style.borderColor || getDatasetColor('line', idx, style),
    borderWidth: style.borderWidth ?? (widgetParams.borderWidth as number) ?? 2,
    tension: style.tension ?? (widgetParams.tension as number) ?? 0.4,
    fill: style.fill ?? false,
    pointRadius: style.pointRadius ?? 3,
    pointHoverRadius: style.pointHoverRadius ?? 5,
  };
}

/** Creates a dataset specialized for pie charts.
 *
 * @param _metric - The metric configuration (not used in this function).
 * @param _idx - The index of the dataset (not used in this function).
 * @param values - The array of values for the dataset.
 * @param labels - The array of labels for the dataset.
 * @param _widgetParams - The widget parameters (not used in this function).
 * @param style - The metric style for custom styling.
 * @returns A dataset object configured for a pie chart.
 *
 * @example
 * const metric: Metric = { field: 'category', agg: 'count', label: 'Category Count' };
 * const values: number[] = [30, 50, 20];
 * const labels: string[] = ['A', 'B', 'C'];
 * const style: MetricStyle = { colors: ['#f87171', '#60a5fa', '#34d399'] };
 * const pieDataset = createPieChartDataset(metric, 0, values, labels, {}, style);
 * // Result: Dataset object configured for a pie chart with the specified parameters.
 */
export function createPieChartDataset(
  _metric: Metric,
  _idx: number,
  values: number[],
  labels: string[],
  _widgetParams: WidgetParams,
  style: MetricStyle,
): Record<string, unknown> {
  return {
    data: values,
    backgroundColor: style.colors || generateColorsForLabels(labels),
    borderColor: style.borderColor || '#ffffff',
    borderWidth: style.borderWidth ?? 2,
    hoverOffset: 4,
  };
}

export function createGetValuesFunction(
  processedData: ProcessedData,
  data: Record<string, unknown>[],
): (metric: Metric) => number[] {
  return (metric: Metric): number[] => {
    if (processedData.bucketHierarchy.length === 0) {
      return [aggregate(data, metric.agg, metric.field)];
    }

    const firstLevel = processedData.bucketHierarchy[0];
    return firstLevel.buckets.map(bucket => aggregate(bucket.data, metric.agg, metric.field));
  };
}

/** Creates a dataset specialized for bubble charts.
 *
 * @param metric - The bubble metric configuration.
 * @param idx - The index of the dataset.
 * @param bubbleData - The array of bubble data points, each containing x, y, and r values.
 * @param _labels - The array of labels (not used in this function).
 * @param widgetParams - The widget parameters for additional styling options.
 * @param style - The metric style for custom styling.
 * @returns A dataset object configured for a bubble chart.
 *
 * @example
 * const metric: Metric = { field: 'size', label: 'Bubble Size' };
 * const bubbleData: Array<{ x: number; y: number; r: number }> = [
 *   { x: 10, y: 20, r: 5 },
 *   { x: 15, y: 25, r: 10 },
 * ];
 * const widgetParams: WidgetParams = { showPoints: true };
 * const style: MetricStyle = { color: '#fbbf24', borderColor: '#f59e0b' };
 * const bubbleDataset = createBubbleChartDataset(metric, 0, bubbleData, [], widgetParams, style);
 * // Result: Dataset object configured for a bubble chart with the specified parameters.
 */
export function createBubbleChartDataset(
  metric: { label?: string },
  idx: number,
  bubbleData: Array<{ x: number; y: number; r: number }>,
  _labels: string[],
  widgetParams: WidgetParams,
  style: MetricStyle,
): Record<string, unknown> {
  const baseColor = getDatasetColor('bubble', idx, style, style.colors);
  let backgroundColor = baseColor;

  if (style.opacity !== undefined && style.opacity !== null) {
    if (typeof baseColor === 'string' && baseColor.startsWith('#')) {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      backgroundColor = `rgba(${r}, ${g}, ${b}, ${style.opacity})`;
    }
  }

  return {
    type: 'bubble' as const,
    label: metric.label,
    data: bubbleData,
    backgroundColor,
    borderColor: style.borderColor || baseColor,
    borderWidth: style.borderWidth || 1,
    pointStyle: style.pointStyle || 'circle',
    pointRadius: widgetParams.showPoints !== false ? style.pointRadius || 5 : 0,
    pointHoverRadius: widgetParams.showPoints !== false ? style.pointHoverRadius || 7 : 0,
    hoverBackgroundColor: backgroundColor,
    hoverBorderColor: style.borderColor || baseColor,
  };
}

/** Creates a dataset specialized for scatter charts.
 *
 * @param metric - The metric configuration.
 * @param idx - The index of the dataset.
 * @param scatterData - The array of scatter data points, each containing x and y values.
 * @param _labels - The array of labels (not used in this function).
 * @param widgetParams - The widget parameters for additional styling options.
 * @param style - The metric style for custom styling.
 * @returns A dataset object configured for a scatter chart.
 *
 * @example
 * const metric: Metric = { label: 'Data Points' };
 * const scatterData: Array<{ x: number; y: number }> = [
 *   { x: 5, y: 10 },
 *   { x: 15, y: 20 },
 * ];
 * const widgetParams: WidgetParams = { showPoints: true };
 * const style: MetricStyle = { color: '#3b82f6', borderColor: '#2563eb' };
 * const scatterDataset = createScatterChartDataset(metric, 0, scatterData, [], widgetParams, style);
 * // Result: Dataset object configured for a scatter chart with the specified parameters.
 */
export function createScatterChartDataset(
  metric: { label?: string },
  idx: number,
  scatterData: Array<{ x: number; y: number }>,
  _labels: string[],
  widgetParams: WidgetParams,
  style: MetricStyle,
): Record<string, unknown> {
  const baseColor = getDatasetColor('scatter', idx, style, style.colors);
  let backgroundColor = baseColor;

  if (style.opacity !== undefined && style.opacity !== null) {
    if (typeof baseColor === 'string' && baseColor.startsWith('#')) {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      backgroundColor = `rgba(${r}, ${g}, ${b}, ${style.opacity})`;
    }
  }

  return {
    type: 'scatter' as const,
    label: metric.label,
    data: scatterData,
    backgroundColor,
    borderColor: style.borderColor || baseColor,
    borderWidth: style.borderWidth || 1,
    pointStyle: style.pointStyle || 'circle',
    pointRadius: widgetParams.showPoints !== false ? style.pointRadius || 5 : 0,
    pointHoverRadius: widgetParams.showPoints !== false ? style.pointHoverRadius || 7 : 0,
    showLine: false,
    hoverBackgroundColor: backgroundColor,
    hoverBorderColor: style.borderColor || baseColor,
  };
}

/** Creates a dataset specialized for radar charts.
 *
 * @param metric - The radar metric configuration.
 * @param idx - The index of the dataset.
 * @param values - The array of values for the radar chart.
 * @param _labels - The array of labels (not used in this function).
 * @param widgetParams - The widget parameters for additional styling options.
 * @param style - The metric style for custom styling.
 * @returns A dataset object configured for a radar chart.
 *
 * @example
 * const metric: Metric = { label: 'Performance' };
 * const values: number[] = [65, 75, 70, 80, 60];
 * const widgetParams: WidgetParams = { borderWidth: 2, pointRadius: 4 };
 * const style: MetricStyle = { color: '#8b5cf6', borderColor: '#7c3aed' };
 * const radarDataset = createRadarChartDataset(metric, 0, values, [], widgetParams, style);
 * // Result: Dataset object configured for a radar chart with the specified parameters.
 */
export function createRadarChartDataset(
  metric: { label?: string; field?: string },
  idx: number,
  values: number[],
  _labels: string[],
  widgetParams: WidgetParams,
  style: MetricStyle,
): Record<string, unknown> {
  const baseColor = getDatasetColor('radar', idx, style, style.colors);
  const defaultLabel = metric.label || metric.field || `Dataset ${idx + 1}`;

  return {
    label: defaultLabel,
    data: values,
    backgroundColor: style.backgroundColor || `${baseColor}33`,
    borderColor: style.borderColor || baseColor,
    borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 2,
    pointRadius: style.pointRadius ?? widgetParams.pointRadius ?? 4,
    pointHoverRadius: style.pointHoverRadius ?? 6,
    pointBackgroundColor: baseColor,
    pointBorderColor: baseColor,
    fill: style.fill !== false,
  };
}
