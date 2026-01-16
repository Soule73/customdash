import type {
  Metric,
  MetricStyle,
  ProcessedData,
  DatasetCreationContext,
  WidgetParams,
} from '../types';
import { createDefaultDataset } from './chartConfigUtils';
import { getDatasetColor, generateColorsForLabels } from './chartColorUtils';
import { aggregate } from './chartUtils';

/**
 * Cree des datasets pour les series divisees (split series)
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
 * Cree des datasets normaux (un par metrique)
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
 * Logique principale pour creer tous les datasets
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
 * Prepare les styles de metriques (normalise la structure)
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
 * Cree un dataset specialise pour bar chart
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

/**
 * Cree un dataset specialise pour line chart
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

/**
 * Cree un dataset specialise pour pie chart
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

/**
 * Cree une fonction pour obtenir les valeurs d'une metrique
 */
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

/**
 * Cree un dataset specialise pour bubble chart
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

/**
 * Cree un dataset specialise pour scatter chart
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

/**
 * Cree un dataset specialise pour radar chart
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
