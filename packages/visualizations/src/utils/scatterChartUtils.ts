import type { ScatterMetricConfig, Filter } from '../types';
import { applyAllFilters } from './filterUtils';

export interface ScatterDataPoint {
  x: number;
  y: number;
}

export interface ScatterValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ScatterScales {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface ProcessedScatterMetric {
  metric: ScatterMetricConfig;
  scatterData: ScatterDataPoint[];
  index: number;
}

/**
 * Genere un label formate pour une metrique scatter
 */
export function generateScatterMetricLabel(metric: ScatterMetricConfig): string {
  if (metric.label && metric.label.trim()) {
    return metric.label;
  }

  const parts: string[] = [];
  if (metric.x) parts.push(`X: ${metric.x}`);
  if (metric.y) parts.push(`Y: ${metric.y}`);

  return parts.length > 0 ? parts.join(', ') : 'Scatter Dataset';
}

/**
 * Valide la configuration d'une metrique scatter
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
 * Valide la configuration complete du scatter chart
 */
export function validateScatterConfiguration(
  metrics: ScatterMetricConfig[],
): ScatterValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!metrics.length) {
    errors.push('Au moins un dataset doit etre configure');
    return { isValid: false, errors, warnings };
  }

  metrics.forEach((metric, index) => {
    const validation = validateScatterMetric(metric);
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
 * Convertit les donnees pour le format scatter de Chart.js
 */
export function convertToScatterData(
  data: Record<string, unknown>[],
  metric: ScatterMetricConfig,
): ScatterDataPoint[] {
  if (!data.length || !metric.x || !metric.y) {
    return [];
  }

  return data
    .map(row => {
      const x = Number(row[metric.x]) || 0;
      const y = Number(row[metric.y]) || 0;

      return { x, y };
    })
    .filter(point => !isNaN(point.x) && !isNaN(point.y));
}

/**
 * Traite toutes les metriques scatter et retourne les datasets avec filtres appliques
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
 * Calcule les echelles optimales pour le scatter chart
 */
export function calculateScatterScales(
  data: Record<string, unknown>[],
  metrics: ScatterMetricConfig[],
): ScatterScales {
  if (!data.length || !metrics.length) {
    return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
  }

  let xMin = Infinity,
    xMax = -Infinity;
  let yMin = Infinity,
    yMax = -Infinity;

  metrics.forEach(metric => {
    const scatterData = convertToScatterData(data, metric);

    scatterData.forEach(point => {
      xMin = Math.min(xMin, point.x);
      xMax = Math.max(xMax, point.x);
      yMin = Math.min(yMin, point.y);
      yMax = Math.max(yMax, point.y);
    });
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
