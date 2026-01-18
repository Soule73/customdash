import type { RadarMetricConfig, Filter } from '../interfaces';
import type {
  RadarValidationResult,
  RadarConfigValidationResult,
  ProcessedRadarMetric,
} from '../interfaces';
import { applyAllFilters } from './filterUtils';
import { aggregateFromRecords } from './aggregation';

/**
 * Generates a formatted label for a radar metric
 * @param metric - The radar metric configuration
 * @returns A formatted string label for the radar dataset
 *
 * @example
 * const metric: RadarMetricConfig = {
 *   agg: 'sum',
 *   fields: ['sales', 'profit'],
 * };
 * const label = generateRadarMetricLabel(metric);
 * // Result: 'sum(sales, profit)'
 */
export function generateRadarMetricLabel(metric: RadarMetricConfig): string {
  if (metric.label && metric.label.trim()) {
    return metric.label;
  }

  const fieldsStr = metric.fields && metric.fields.length > 0 ? metric.fields.join(', ') : 'fields';

  return `${metric.agg}(${fieldsStr})`;
}

/**
 * Extracts radar labels (axes) from metrics using the union of all fields from all datasets
 * @param metrics - An array of radar metric configurations
 * @returns An array of unique radar labels as strings
 *
 * @example
 * const metrics: RadarMetricConfig[] = [
 *   { agg: 'sum', fields: ['sales', 'profit'] },
 *   { agg: 'avg', fields: ['sales', 'expenses'] },
 * ];
 * const labels = getRadarLabels(metrics);
 * // Result: ['sales', 'profit', 'expenses']
 */
export function getRadarLabels(metrics: RadarMetricConfig[]): string[] {
  if (!metrics.length) {
    return [];
  }

  const allFields = new Set<string>();

  metrics.forEach(metric => {
    (metric.fields || []).forEach(field => {
      const stringField = typeof field === 'string' ? field : String(field);
      allFields.add(stringField);
    });
  });

  return Array.from(allFields);
}

/**
 * Calculates the aggregated value for a specific field
 * @param data - The dataset to aggregate
 * @param field - The field to aggregate
 * @param aggregation - The aggregation type (e.g., 'sum', 'avg')
 * @returns The aggregated value as a number
 *
 * @example
 * const data = [
 *   { sales: 100, profit: 20 },
 *   { sales: 200, profit: 50 },
 * ];
 * const totalSales = calculateRadarFieldValue(data, 'sales', 'sum');
 * // Result: 300
 */
export function calculateRadarFieldValue(
  data: Record<string, unknown>[],
  field: string,
  aggregation: string,
): number {
  if (!data.length) return 0;
  return aggregateFromRecords(data, aggregation as import('../types').AggregationType, field);
}

/**
 * Calculates all values for the axes of a radar metric, ensuring values correspond to all radar labels
 * @param data - The dataset to aggregate
 * @param metric - The radar metric configuration
 * @param allLabels - An array of all radar labels (axes)
 * @returns An array of aggregated values corresponding to each radar label
 *
 * @example
 * const data = [
 *   { sales: 100, profit: 20, expenses: 50 },
 *   { sales: 200, profit: 50, expenses: 80 },
 * ];
 * const metric: RadarMetricConfig = {
 *   agg: 'sum',
 *   fields: ['sales', 'profit'],
 * };
 * const allLabels = ['sales', 'profit', 'expenses'];
 * const values = calculateRadarMetricValues(data, metric, allLabels);
 * // Result: [300, 70, 0]
 */
export function calculateRadarMetricValues(
  data: Record<string, unknown>[],
  metric: RadarMetricConfig,
  allLabels: string[],
): number[] {
  return allLabels.map(label => {
    const hasField = (metric.fields || []).includes(label);

    if (!hasField) {
      return 0;
    }

    return calculateRadarFieldValue(data, label, metric.agg);
  });
}

/**
 * Processes all radar metrics and returns datasets with applied filters
 * @param data - The raw data records to process
 * @param metrics - An array of radar metric configurations
 * @param globalFilters - Optional global filters to apply to all datasets
 * @returns An array of processed radar metrics, each containing:
 *   - `metric`: The original radar metric configuration
 *   - `values`: The aggregated values for each axis
 *   - `index`: The index of the metric in the input array
 *
 * @example
 * const data = [
 *   { sales: 100, profit: 20, expenses: 50 },
 *   { sales: 200, profit: 50, expenses: 80 },
 * ];
 * const metrics: RadarMetricConfig[] = [
 *   { agg: 'sum', fields: ['sales', 'profit'] },
 *   { agg: 'avg', fields: ['expenses'] },
 * ];
 * const processedMetrics = processRadarMetrics(data, metrics);
 * // Result: [
 * //   { metric: { ... }, values: [300, 70], index: 0 },
 * //   { metric: { ... }, values: [65], index: 1 },
 * // ]
 */
export function processRadarMetrics(
  data: Record<string, unknown>[],
  metrics: RadarMetricConfig[],
  globalFilters?: Filter[],
): ProcessedRadarMetric[] {
  const allLabels = getRadarLabels(metrics);

  return metrics.map((metric, index) => {
    const filteredData = applyAllFilters(data, globalFilters, metric.datasetFilters);

    return {
      metric,
      values: calculateRadarMetricValues(filteredData, metric, allLabels),
      index,
    };
  });
}

/**
 * Validates a single radar metric configuration
 * @param metric - The radar metric configuration to validate
 * @returns An object indicating whether the metric is valid and any associated error messages
 *
 * @example
 * const metric: RadarMetricConfig = {
 *   agg: 'sum',
 *   fields: [],
 * };
 * const validation = validateRadarMetric(metric);
 * // Result: { isValid: false, errors: ['Au moins un champ doit etre selectionne pour les axes'] }
 */
export function validateRadarMetric(metric: RadarMetricConfig): RadarValidationResult {
  const errors: string[] = [];

  if (!metric.fields || metric.fields.length === 0) {
    errors.push('At least one field must be selected for axes');
  }

  if (!metric.agg) {
    errors.push('An aggregation must be specified');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the complete radar chart configuration
 * @param metrics - An array of radar metric configurations to validate
 * @returns An object containing:
 *   - `isValid`: A boolean indicating if the configuration is valid
 *   - `errors`: An array of error messages for invalid metrics
 *   - `warnings`: An array of warning messages for potential issues
 *
 * @example
 * const metrics: RadarMetricConfig[] = [
 *   { agg: 'sum', fields: ['sales'] },
 *   { agg: 'avg', fields: [] },
 * ];
 * const validation = validateRadarConfiguration(metrics);
 * // Result: {
 * //   isValid: false,
 * //   errors: ['Dataset 2: Au moins un champ doit etre selectionne pour les axes'],
 * //   warnings: [],
 * // }
 */
export function validateRadarConfiguration(
  metrics: RadarMetricConfig[],
): RadarConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!metrics.length) {
    errors.push('At least one dataset must be configured');
    return { isValid: false, errors, warnings };
  }

  metrics.forEach((metric, index) => {
    const validation = validateRadarMetric(metric);
    if (!validation.isValid) {
      errors.push(`Dataset ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });

  const firstFields = metrics[0].fields || [];
  const hasInconsistentFields = metrics.some(metric => {
    const fields = metric.fields || [];
    return (
      fields.length !== firstFields.length || !fields.every(field => firstFields.includes(field))
    );
  });

  if (hasInconsistentFields) {
    warnings.push('Datasets have different fields, this may create an unbalanced radar');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
