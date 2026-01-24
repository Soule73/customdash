import type { MetricStyle } from '../interfaces';

/**
 * Prepares metric styles ensuring they are in array format.
 * This function ensures that the metric styles are returned as an array,
 * regardless of whether the input is already an array or an object.
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
