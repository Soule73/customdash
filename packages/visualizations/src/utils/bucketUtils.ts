import type {
  MultiBucketConfig,
  BucketType,
  DateInterval,
  RangeConfig,
  ValidationResult,
} from '../types';

export interface BucketTypeOption {
  value: BucketType;
  label: string;
  description: string;
}

export const BUCKET_TYPE_OPTIONS: BucketTypeOption[] = [
  { value: 'terms', label: 'Termes', description: 'Grouper par valeurs de champ (categories)' },
  { value: 'histogram', label: 'Histogramme', description: 'Grouper par intervalles numeriques' },
  {
    value: 'date_histogram',
    label: 'Histogramme de dates',
    description: 'Grouper par intervalles de temps',
  },
  { value: 'range', label: 'Plages', description: 'Grouper par plages personnalisees' },
  { value: 'split_series', label: 'Diviser en series', description: 'Creer une serie par valeur' },
  { value: 'split_rows', label: 'Diviser en lignes', description: 'Creer une ligne par valeur' },
  {
    value: 'split_chart',
    label: 'Diviser en graphiques',
    description: 'Creer un graphique separe par valeur',
  },
];

export interface DateIntervalOption {
  value: DateInterval;
  label: string;
}

export const DATE_INTERVAL_OPTIONS: DateIntervalOption[] = [
  { value: 'minute', label: 'Minute' },
  { value: 'hour', label: 'Heure' },
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Annee' },
];

export interface SortOrderOption {
  value: 'asc' | 'desc';
  label: string;
}

export const SORT_ORDER_OPTIONS: SortOrderOption[] = [
  { value: 'asc', label: 'Croissant' },
  { value: 'desc', label: 'Decroissant' },
];

/**
 * Cree un bucket par defaut selon le type
 */
export function createDefaultBucket(type: BucketType, field: string = ''): MultiBucketConfig {
  const base: MultiBucketConfig = {
    field,
    label: '',
    type,
    order: 'desc',
    size: 10,
    minDocCount: 1,
  };

  switch (type) {
    case 'histogram':
      return { ...base, interval: 1 };

    case 'date_histogram':
      return { ...base, dateInterval: 'day' };

    case 'range':
      return {
        ...base,
        ranges: [{ from: 0, to: 100, label: 'Plage 1' }],
      };

    case 'split_series':
      return { ...base, splitType: 'series', size: 5 };

    case 'split_rows':
      return { ...base, splitType: 'rows', size: 5 };

    case 'split_chart':
      return { ...base, splitType: 'chart', size: 4 };

    case 'terms':
    default:
      return base;
  }
}

/**
 * Valide si un bucket est valide
 */
export function validateBucket(bucket: MultiBucketConfig): ValidationResult {
  const errors: string[] = [];

  if (!bucket.field) {
    errors.push('Le champ est requis');
  }

  if (bucket.type === 'histogram' && (!bucket.interval || bucket.interval <= 0)) {
    errors.push("L'intervalle doit etre superieur a 0");
  }

  if (bucket.type === 'date_histogram' && !bucket.dateInterval) {
    errors.push("L'intervalle de date est requis");
  }

  if (bucket.type === 'range' && (!bucket.ranges || bucket.ranges.length === 0)) {
    errors.push('Au moins une plage est requise');
  }

  if (bucket.size && bucket.size <= 0) {
    errors.push('La taille doit etre superieure a 0');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Genere un label automatique pour un bucket
 */
export function generateBucketLabel(bucket: MultiBucketConfig): string {
  const typeLabel = BUCKET_TYPE_OPTIONS.find(t => t.value === bucket.type)?.label || bucket.type;
  return bucket.label || `${typeLabel} - ${bucket.field}`;
}

/**
 * Cree une plage par defaut
 */
export function createDefaultRange(): RangeConfig {
  return { from: 0, to: 100, label: '' };
}

/**
 * Verifie si un bucket est de type split
 */
export function isSplitBucket(bucket: MultiBucketConfig): boolean {
  return bucket.type.startsWith('split_');
}

/**
 * Obtient le type de split d'un bucket
 */
export function getSplitType(bucket: MultiBucketConfig): 'series' | 'rows' | 'chart' | null {
  if (!isSplitBucket(bucket)) return null;
  return bucket.splitType || null;
}
