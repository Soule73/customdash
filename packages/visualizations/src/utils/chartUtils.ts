import type { AggregationType } from '../types';
import { DEFAULT_CHART_COLORS } from '../types/constants';

/**
 * Agregation de donnees selon le type d'agregation
 */
export function aggregate(
  rows: Record<string, unknown>[],
  agg: AggregationType,
  field: string,
): number {
  if (agg === 'none') {
    if (rows.length === 1) {
      const value = rows[0][field];
      return typeof value === 'number' ? value : 0;
    }
    const found = rows.find(r => r[field] !== undefined && r[field] !== null);
    return found ? Number(found[field]) || 0 : 0;
  }

  const nums = rows.map(r => Number(r[field])).filter(v => !isNaN(v));

  switch (agg) {
    case 'sum':
      return nums.reduce((a, b) => a + b, 0);
    case 'avg':
      return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    case 'min':
      return nums.length ? Math.min(...nums) : 0;
    case 'max':
      return nums.length ? Math.max(...nums) : 0;
    case 'count':
      return rows.length;
    default:
      return 0;
  }
}

/**
 * Extrait les labels uniques d'un champ
 */
export function getLabels(data: Record<string, unknown>[], field: string): string[] {
  return Array.from(new Set(data.map(row => String(row[field] || ''))));
}

/**
 * Retourne les couleurs par defaut ou personnalisees
 */
export function getColors(
  labels: string[],
  customColors?: string[],
  metricIndex: number = 0,
): string[] {
  if (Array.isArray(customColors) && customColors.length > 0) {
    return labels.map((_, i) => customColors[i % customColors.length]);
  }
  return labels.map(
    (_, i) => DEFAULT_CHART_COLORS[(i + metricIndex) % DEFAULT_CHART_COLORS.length],
  );
}

/**
 * Detecte si un label est un timestamp ISO
 */
export function isIsoTimestamp(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val) ||
    /^\d{4}-\d{2}-\d{2}$/.test(val) ||
    /^\d{4}-\d{2}$/.test(val) ||
    /^\d{4}-W\d{1,2}$/.test(val)
  );
}

/**
 * Verifie si tous les labels sont du meme jour
 */
export function allSameDay(labels: string[]): boolean {
  if (!labels || labels.length === 0) return false;

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(labels[0])) {
    return false;
  }

  const first = new Date(labels[0]);
  return labels.every(l => {
    const d = new Date(l);
    return (
      d.getFullYear() === first.getFullYear() &&
      d.getMonth() === first.getMonth() &&
      d.getDate() === first.getDate()
    );
  });
}

/**
 * Formate un label timestamp pour l'axe X
 */
export function formatXTicksLabel(raw: string, onlyTimeIfSameDay = false): string {
  if (!raw || typeof raw !== 'string') return String(raw);

  if (!/^\d{4}/.test(raw) && !raw.includes('T') && !raw.includes('Z')) {
    return raw;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;

    if (onlyTimeIfSameDay) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  if (/^\d{4}-\d{2}$/.test(raw)) {
    const [year, month] = raw.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleDateString('fr-FR', { month: 'short' });
  }

  if (/^\d{4}-W\d{1,2}$/.test(raw)) {
    const match = raw.match(/(\d{4})-W(\d{1,2})/);
    if (match) return `S${match[2]}`;
  }

  return raw;
}

/**
 * Formate une valeur pour affichage dans un tooltip
 */
export function formatTooltipValue(val: unknown): string {
  if (!val || typeof val !== 'string') return String(val);

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  }

  return String(val);
}
