import type { AggregationType } from '../types';
import type { ChartValidationConfig, ChartValidationResult, ScaleResult } from '../interfaces';

/**
 * Aggregates an array of numeric values according to the specified aggregation type
 * @param values - An array of numeric values to aggregate
 * @param aggregationType - The type of aggregation to perform
 * @returns The aggregated numeric result
 *
 * @example
 * aggregateNumericValues([1, 2, 3, 4], 'sum'); // Returns 10
 * aggregateNumericValues([1, 2, 3, 4], 'avg'); // Returns 2.5
 * aggregateNumericValues([1, 2, 3, 4], 'min'); // Returns 1
 * aggregateNumericValues([1, 2, 3, 4], 'max'); // Returns 4
 * aggregateNumericValues([1, 2, 3, 4], 'count'); // Returns 4
 * aggregateNumericValues([1, 2, 3, 4], 'none'); // Returns 1
 */
export function aggregateNumericValues(values: number[], aggregationType: AggregationType): number {
  if (values.length === 0) return 0;

  const validValues = values.filter(v => !isNaN(v) && isFinite(v));
  if (validValues.length === 0) return 0;

  switch (aggregationType) {
    case 'sum':
      return validValues.reduce((acc, val) => acc + val, 0);

    case 'avg':
      return validValues.reduce((acc, val) => acc + val, 0) / validValues.length;

    case 'min':
      return Math.min(...validValues);

    case 'max':
      return Math.max(...validValues);

    case 'count':
      return values.length;

    case 'none':
      return validValues[0] || 0;

    default:
      return validValues[0] || 0;
  }
}

/**
 * Extracts numeric values from an array of records for a specific field
 */
export function extractNumericValues(rows: Record<string, unknown>[], field: string): number[] {
  return rows.map(row => Number(row[field])).filter(v => !isNaN(v));
}

/**
 * Aggregates data from an array of records
 */
export function aggregateFromRecords(
  rows: Record<string, unknown>[],
  aggregationType: AggregationType,
  field: string,
): number {
  if (aggregationType === 'none') {
    if (rows.length === 1) {
      const value = rows[0][field];
      return typeof value === 'number' ? value : 0;
    }
    const found = rows.find(r => r[field] !== undefined && r[field] !== null);
    return found ? Number(found[field]) || 0 : 0;
  }

  if (aggregationType === 'count') {
    return rows.length;
  }

  const values = extractNumericValues(rows, field);
  return aggregateNumericValues(values, aggregationType);
}

/**
 * Generic validation for chart metric configurations
 */
export function validateChartMetrics(config: ChartValidationConfig): ChartValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { metrics, chartType } = config;

  if (!metrics.length) {
    errors.push('At least one dataset must be configured');
    return { isValid: false, errors, warnings };
  }

  metrics.forEach((metric, index) => {
    const metricErrors: string[] = [];

    switch (chartType) {
      case 'bubble':
        if (!metric.x?.trim()) metricErrors.push('X field must be specified');
        if (!metric.y?.trim()) metricErrors.push('Y field must be specified');
        if (!metric.r?.trim()) metricErrors.push('R field (radius) must be specified');
        break;

      case 'scatter':
        if (!metric.x?.trim()) metricErrors.push('X field must be specified');
        if (!metric.y?.trim()) metricErrors.push('Y field must be specified');
        break;
    }

    if (metricErrors.length > 0) {
      errors.push(`Dataset ${index + 1}: ${metricErrors.join(', ')}`);
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Calculates optimal scales from XY data points
 */
export function calculateXYScales(points: Array<{ x: number; y: number }>): ScaleResult {
  if (points.length === 0) {
    return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
  }

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  points.forEach(point => {
    xMin = Math.min(xMin, point.x);
    xMax = Math.max(xMax, point.x);
    yMin = Math.min(yMin, point.y);
    yMax = Math.max(yMax, point.y);
  });

  if (!isFinite(xMin)) xMin = 0;
  if (!isFinite(xMax)) xMax = 100;
  if (!isFinite(yMin)) yMin = 0;
  if (!isFinite(yMax)) yMax = 100;

  const xMargin = (xMax - xMin) * 0.1;
  const yMargin = (yMax - yMin) * 0.1;

  return {
    xMin: xMin - xMargin,
    xMax: xMax + xMargin,
    yMin: yMin - yMargin,
    yMax: yMax + yMargin,
  };
}

/**
 * Converts records to XY data points
 */
export function convertToXYPoints(
  data: Record<string, unknown>[],
  xField: string,
  yField: string,
): Array<{ x: number; y: number }> {
  if (!data.length || !xField || !yField) {
    return [];
  }

  return data
    .map(row => ({
      x: Number(row[xField]) || 0,
      y: Number(row[yField]) || 0,
    }))
    .filter(point => !isNaN(point.x) && !isNaN(point.y));
}

/**
 * Generates a formatted label for a metric with x/y/r fields
 */
export function generateAxisMetricLabel(
  metric: { label?: string; x?: string; y?: string; r?: string },
  defaultLabel: string = 'Dataset',
): string {
  if (metric.label?.trim()) {
    return metric.label;
  }

  const parts: string[] = [];
  if (metric.x) parts.push(`X: ${metric.x}`);
  if (metric.y) parts.push(`Y: ${metric.y}`);
  if (metric.r) parts.push(`R: ${metric.r}`);

  return parts.length > 0 ? parts.join(', ') : defaultLabel;
}
