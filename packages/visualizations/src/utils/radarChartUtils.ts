import type { RadarMetricConfig, Filter } from '../types';
import { applyAllFilters } from './filterUtils';

export interface RadarValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface RadarConfigValidationResult extends RadarValidationResult {
  warnings: string[];
}

export interface ProcessedRadarMetric {
  metric: RadarMetricConfig;
  values: number[];
  index: number;
}

/**
 * Generates a formatted label for a radar metric
 */
export function generateRadarMetricLabel(metric: RadarMetricConfig): string {
  if (metric.label && metric.label.trim()) {
    return metric.label;
  }

  const fieldsStr = metric.fields && metric.fields.length > 0 ? metric.fields.join(', ') : 'champs';

  return `${metric.agg}(${fieldsStr})`;
}

/**
 * Extracts radar labels (axes) from metrics using the union of all fields from all datasets
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
 */
export function calculateRadarFieldValue(
  data: Record<string, unknown>[],
  field: string,
  aggregation: string,
): number {
  if (!data.length) return 0;

  switch (aggregation) {
    case 'sum':
      return data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);

    case 'avg': {
      const total = data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
      return total / data.length;
    }

    case 'count':
      return data.filter(row => row[field] !== null && row[field] !== undefined).length;

    case 'min':
      return Math.min(...data.map(row => Number(row[field]) || 0));

    case 'max':
      return Math.max(...data.map(row => Number(row[field]) || 0));

    default:
      return data.length;
  }
}

/**
 * Calculates all values for the axes of a radar metric, ensuring values correspond to all radar labels
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
 */
export function validateRadarMetric(metric: RadarMetricConfig): RadarValidationResult {
  const errors: string[] = [];

  if (!metric.fields || metric.fields.length === 0) {
    errors.push('Au moins un champ doit etre selectionne pour les axes');
  }

  if (!metric.agg) {
    errors.push('Une agregation doit etre specifiee');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the complete radar chart configuration
 */
export function validateRadarConfiguration(
  metrics: RadarMetricConfig[],
): RadarConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!metrics.length) {
    errors.push('Au moins un dataset doit etre configure');
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
    warnings.push('Les datasets ont des champs differents, cela peut creer un radar desequilibre');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
