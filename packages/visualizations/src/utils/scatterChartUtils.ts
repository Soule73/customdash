import type { ScatterMetricConfig, Filter } from '../interfaces';
import type {
  ScatterDataPoint,
  ScatterValidationResult,
  ScatterScales,
  ProcessedScatterMetric,
} from '../interfaces';
import { applyAllFilters } from './filterUtils';
import {
  validateChartMetrics,
  calculateXYScales,
  convertToXYPoints,
  generateAxisMetricLabel,
} from './aggregation';

/**
 * Genere a formatted label for a scatter metric
 * @param metric - The scatter metric configuration
 * @returns A formatted string label for the scatter dataset
 *
 * @example
 * const metric: ScatterMetricConfig = {
 *   x: 'age',
 *   y: 'salary',
 * };
 * const label = generateScatterMetricLabel(metric);
 * // Result: 'Scatter Dataset (x: age, y: salary)'
 */
export function generateScatterMetricLabel(metric: ScatterMetricConfig): string {
  return generateAxisMetricLabel(metric, 'Scatter Dataset');
}

/**
 * Validate the configuration of a scatter metric
 * @param metric - The scatter metric configuration to validate
 * @returns An object indicating whether the metric is valid and any associated error messages
 *
 * @example
 * const metric: ScatterMetricConfig = {
 *  x: '',
 *  y: 'salary',
 * };
 * const validation = validateScatterMetric(metric);
 * // Result: { isValid: false, errors: ['Le champ X doit etre specifie'] }
 */
export function validateScatterMetric(metric: ScatterMetricConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metric.x || metric.x.trim() === '') {
    errors.push('Le champ X doit etre specifie');
  }

  if (!metric.y || metric.y.trim() === '') {
    errors.push('Le champ Y doit etre specifie');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate the complete scatter chart configuration
 * @param metrics - An array of scatter metric configurations to validate
 * @returns An object containing:
 *   - `isValid`: A boolean indicating if the configuration is valid
 *   - `errors`: An array of error messages for invalid metrics
 *   - `warnings`: An array of warning messages for potential issues
 *
 * @example
 * const metrics: ScatterMetricConfig[] = [
 *   { x: 'age', y: 'salary' },
 *   { x: '', y: 'expenses' },
 * ];
 * const validation = validateScatterConfiguration(metrics);
 * // Result: {
 * //   isValid: false,
 * //   errors: ['Dataset 2: Le champ X doit etre specifie'],
 * //   warnings: [],
 * // }
 */
export function validateScatterConfiguration(
  metrics: ScatterMetricConfig[],
): ScatterValidationResult {
  return validateChartMetrics({ metrics, chartType: 'scatter' });
}

/**
 * Convertit les donnees pour le format scatter de Chart.js
 */
export function convertToScatterData(
  data: Record<string, unknown>[],
  metric: ScatterMetricConfig,
): ScatterDataPoint[] {
  if (!metric.x || !metric.y) return [];
  return convertToXYPoints(data, metric.x, metric.y);
}

/**
 * Process all scatter metrics and return datasets with applied filters
 * @param data - The data to be processed
 * @param metrics - An array of scatter metric configurations
 * @param globalFilters - Optional global filters to apply to the data
 * @returns An array of processed scatter metrics with their corresponding data points
 *
 * @example
 * const data = [
 *   { age: 25, salary: 50000 },
 *   { age: 30, salary: 60000 },
 * ];
 * const metrics: ScatterMetricConfig[] = [
 *   { x: 'age', y: 'salary' },
 * ];
 * const processedMetrics = processScatterMetrics(data, metrics);
 * // Result: [
 * //   {
 * //     metric: { x: 'age', y: 'salary' },
 * //     scatterData: [
 * //       { x: 25, y: 50000 },
 * //       { x: 30, y: 60000 },
 * //     ],
 * //     index: 0,
 * //   },
 * // ]
 */
export function processScatterMetrics(
  data: Record<string, unknown>[],
  metrics: ScatterMetricConfig[],
  globalFilters?: Filter[],
): ProcessedScatterMetric[] {
  return metrics.map((metric, index) => {
    const filteredData = applyAllFilters(data, globalFilters, metric.datasetFilters);

    return {
      metric,
      scatterData: convertToScatterData(filteredData, metric),
      index,
    };
  });
}

/**
 * Calculate the scales for scatter chart axes based on the data points
 * @param data - The data to be processed
 * @param metrics - An array of scatter metric configurations
 * @returns An object containing the min and max values for both X and Y axes
 *
 * @example
 * const data = [
 *   { age: 25, salary: 50000 },
 *   { age: 30, salary: 60000 },
 * ];
 * const metrics: ScatterMetricConfig[] = [
 *   { x: 'age', y: 'salary' },
 * ];
 * const scales = calculateScatterScales(data, metrics);
 * // Result: { xMin: 25, xMax: 30, yMin: 50000, yMax: 60000 }
 */
export function calculateScatterScales(
  data: Record<string, unknown>[],
  metrics: ScatterMetricConfig[],
): ScatterScales {
  if (!data.length || !metrics.length) {
    return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
  }

  const allPoints: ScatterDataPoint[] = [];

  metrics.forEach(metric => {
    allPoints.push(...convertToScatterData(data, metric));
  });

  return calculateXYScales(allPoints);
}
