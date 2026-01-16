import type { BubbleMetricConfig, Filter } from '../types';
import { applyAllFilters } from './filterUtils';

export interface BubbleDataPoint {
  x: number;
  y: number;
  r: number;
}

export interface BubbleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BubbleScales {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  rMin: number;
  rMax: number;
}

export interface ProcessedBubbleMetric {
  metric: BubbleMetricConfig;
  bubbleData: BubbleDataPoint[];
  index: number;
}

/**
 * Genere un label formate pour une metrique bubble
 */
export function generateBubbleMetricLabel(metric: BubbleMetricConfig): string {
  if (metric.label && metric.label.trim()) {
    return metric.label;
  }

  const parts: string[] = [];
  if (metric.x) parts.push(`X: ${metric.x}`);
  if (metric.y) parts.push(`Y: ${metric.y}`);
  if (metric.r) parts.push(`R: ${metric.r}`);

  return parts.length > 0 ? parts.join(', ') : 'Bubble Dataset';
}

/**
 * Valide la configuration d'une metrique bubble
 */
export function validateBubbleMetric(metric: BubbleMetricConfig): {
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

  if (!metric.r || metric.r.trim() === '') {
    errors.push('Le champ R (rayon) doit etre specifie');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide la configuration complete du bubble chart
 */
export function validateBubbleConfiguration(metrics: BubbleMetricConfig[]): BubbleValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!metrics.length) {
    errors.push('Au moins un dataset doit etre configure');
    return { isValid: false, errors, warnings };
  }

  metrics.forEach((metric, index) => {
    const validation = validateBubbleMetric(metric);
    if (!validation.isValid) {
      errors.push(`Dataset ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Convertit les donnees pour le format bubble de Chart.js
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
 * Traite toutes les metriques bubble et retourne les datasets avec filtres appliques
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
 * Calcule les echelles optimales pour le bubble chart
 */
export function calculateBubbleScales(
  data: Record<string, unknown>[],
  metrics: BubbleMetricConfig[],
): BubbleScales {
  if (!data.length || !metrics.length) {
    return { xMin: 0, xMax: 100, yMin: 0, yMax: 100, rMin: 1, rMax: 10 };
  }

  let xMin = Infinity,
    xMax = -Infinity;
  let yMin = Infinity,
    yMax = -Infinity;
  let rMin = Infinity,
    rMax = -Infinity;

  metrics.forEach(metric => {
    const bubbleData = convertToBubbleData(data, metric);

    bubbleData.forEach(point => {
      xMin = Math.min(xMin, point.x);
      xMax = Math.max(xMax, point.x);
      yMin = Math.min(yMin, point.y);
      yMax = Math.max(yMax, point.y);
      rMin = Math.min(rMin, point.r);
      rMax = Math.max(rMax, point.r);
    });
  });

  if (!isFinite(xMin)) xMin = 0;
  if (!isFinite(xMax)) xMax = 100;
  if (!isFinite(yMin)) yMin = 0;
  if (!isFinite(yMax)) yMax = 100;
  if (!isFinite(rMin)) rMin = 1;
  if (!isFinite(rMax)) rMax = 10;

  const xMargin = (xMax - xMin) * 0.1;
  const yMargin = (yMax - yMin) * 0.1;

  return {
    xMin: xMin - xMargin,
    xMax: xMax + xMargin,
    yMin: yMin - yMargin,
    yMax: yMax + yMargin,
    rMin,
    rMax,
  };
}
