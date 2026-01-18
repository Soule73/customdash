import type { BubbleMetricConfig, Filter } from '../interfaces';
import type {
  BubbleDataPoint,
  BubbleValidationResult,
  BubbleScales,
  ProcessedBubbleMetric,
} from '../interfaces';
import { applyAllFilters } from './filterUtils';
import { validateChartMetrics, calculateXYScales, generateAxisMetricLabel } from './aggregation';

/**
 * Generates a formatted label for a bubble metric.
 *
 * @param metric - The bubble metric configuration containing x, y, and r field definitions.
 * @returns A formatted string label for the bubble dataset.
 */
export function generateBubbleMetricLabel(metric: BubbleMetricConfig): string {
  return generateAxisMetricLabel(metric, 'Bubble Dataset');
}

/**
 * Validates a bubble metric configuration.
 *
 * Checks that the required fields (x, y, and r) are specified and non-empty.
 *
 * @param metric - The bubble metric configuration to validate.
 * @returns An object containing:
 *   - `isValid`: Whether the metric configuration is valid.
 *   - `errors`: An array of error messages describing validation failures.
 */
export function validateBubbleMetric(metric: BubbleMetricConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metric.x || metric.x.trim() === '') {
    errors.push('X field must be specified');
  }

  if (!metric.y || metric.y.trim() === '') {
    errors.push('Y field must be specified');
  }

  if (!metric.r || metric.r.trim() === '') {
    errors.push('R field (radius) must be specified');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the complete configuration for the bubble chart.
 *
 * This function ensures that all provided metrics are valid for use in a bubble chart.
 * It leverages the `validateChartMetrics` utility to perform the validation.
 *
 * @param metrics - An array of bubble metric configurations to validate.
 * @returns An object containing:
 *   - `isValid`: A boolean indicating if the configuration is valid.
 *   - `errors`: An array of error messages for invalid metrics.
 *   - `warnings`: An array of warning messages for potential issues.
 */
export function validateBubbleConfiguration(metrics: BubbleMetricConfig[]): BubbleValidationResult {
  return validateChartMetrics({ metrics, chartType: 'bubble' });
}

/**
 * Converts data into the bubble format required by Chart.js.
 *
 * This function takes an array of data records and a bubble metric configuration,
 * and maps the data into an array of BubbleDataPoint objects. Each BubbleDataPoint
 * contains x, y, and r values derived from the data records based on the metric configuration.
 *
 * @param data - An array of data records where each record is a key-value pair.
 * @param metric - The bubble metric configuration specifying the x, y, and r fields.
 * @returns An array of BubbleDataPoint objects formatted for Chart.js.
 */
export function convertToBubbleData(
  data: Record<string, unknown>[],
  metric: BubbleMetricConfig,
): BubbleDataPoint[] {
  if (!data.length || !metric.x || !metric.y || !metric.r) {
    return [];
  }

  return data
    .map(row => {
      const x = Number(row[metric.x]) || 0;
      const y = Number(row[metric.y]) || 0;
      const r = Number(row[metric.r]) || 1;

      return { x, y, r };
    })
    .filter(point => !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.r) && point.r > 0);
}

/**
 * Processes all bubble metrics and returns datasets with applied filters.
 *
 * This function iterates over the provided bubble metrics, applies global and dataset-specific filters
 * to the data, and converts the filtered data into the bubble format required by Chart.js.
 *
 * @param data - The raw data records to process, where each record is a key-value pair.
 * @param metrics - An array of bubble metric configurations specifying the x, y, and r fields.
 * @param globalFilters - Optional global filters to apply to all datasets.
 * @returns An array of processed bubble metrics, each containing:
 *   - `metric`: The original bubble metric configuration.
 *   - `bubbleData`: The filtered and formatted bubble data points.
 *   - `index`: The index of the metric in the input array.
 */
export function processBubbleMetrics(
  data: Record<string, unknown>[],
  metrics: BubbleMetricConfig[],
  globalFilters?: Filter[],
): ProcessedBubbleMetric[] {
  return metrics.map((metric, index) => {
    const filteredData = applyAllFilters(data, globalFilters, metric.datasetFilters);

    return {
      metric,
      bubbleData: convertToBubbleData(filteredData, metric),
      index,
    };
  });
}

/**
 * Calculates the optimal scales for the bubble chart.
 *
 * This function aggregates all bubble data points from the provided metrics and computes the minimum and maximum
 * values for the x, y, and r dimensions. If no data is available, default scale values are returned.
 *
 * @param data - An array of raw data records where each record is a key-value pair.
 * @param metrics - An array of bubble metric configurations specifying the x, y, and r fields.
 * @returns An object containing the calculated scales:
 *   - `xMin`: Minimum value for the x-axis.
 *   - `xMax`: Maximum value for the x-axis.
 *   - `yMin`: Minimum value for the y-axis.
 *   - `yMax`: Maximum value for the y-axis.
 *   - `rMin`: Minimum value for the radius.
 *   - `rMax`: Maximum value for the radius.
 */
export function calculateBubbleScales(
  data: Record<string, unknown>[],
  metrics: BubbleMetricConfig[],
): BubbleScales {
  if (!data.length || !metrics.length) {
    return { xMin: 0, xMax: 100, yMin: 0, yMax: 100, rMin: 1, rMax: 10 };
  }

  const allBubbleData: BubbleDataPoint[] = [];

  metrics.forEach(metric => {
    allBubbleData.push(...convertToBubbleData(data, metric));
  });

  const xyScales = calculateXYScales(allBubbleData);

  let rMin = Infinity;
  let rMax = -Infinity;

  allBubbleData.forEach(point => {
    rMin = Math.min(rMin, point.r);
    rMax = Math.max(rMax, point.r);
  });

  if (!isFinite(rMin)) rMin = 1;
  if (!isFinite(rMax)) rMax = 10;

  return {
    ...xyScales,
    rMin,
    rMax,
  };
}
