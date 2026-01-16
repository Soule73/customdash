import type { Filter, FilterOperator, ValidationResult } from '../types';

const VALID_OPERATORS: FilterOperator[] = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
  'starts_with',
  'ends_with',
];

/**
 * Applique un filtre a un ensemble de donnees
 */
export function applyFilter(
  data: Record<string, unknown>[],
  filter: Filter,
): Record<string, unknown>[] {
  if (!filter.field || filter.value === undefined || filter.value === null || filter.value === '') {
    return data;
  }

  const operator = filter.operator || 'equals';

  return data.filter(row => {
    const fieldValue = row[filter.field];

    if (fieldValue === undefined || fieldValue === null) {
      return false;
    }

    switch (operator) {
      case 'equals':
        return String(fieldValue) === String(filter.value);

      case 'not_equals':
        return String(fieldValue) !== String(filter.value);

      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());

      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());

      case 'greater_than':
        return Number(fieldValue) > Number(filter.value);

      case 'less_than':
        return Number(fieldValue) < Number(filter.value);

      case 'greater_equal':
        return Number(fieldValue) >= Number(filter.value);

      case 'less_equal':
        return Number(fieldValue) <= Number(filter.value);

      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(filter.value).toLowerCase());

      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(filter.value).toLowerCase());

      default:
        return String(fieldValue) === String(filter.value);
    }
  });
}

/**
 * Applique une liste de filtres globaux
 */
export function applyGlobalFilters(
  data: Record<string, unknown>[],
  filters: Filter[],
): Record<string, unknown>[] {
  if (!filters || filters.length === 0) {
    return data;
  }

  return filters.reduce((filteredData, filter) => {
    return applyFilter(filteredData, filter);
  }, data);
}

/**
 * Applique tous les filtres (globaux + dataset) a un ensemble de donnees
 */
export function applyAllFilters(
  data: Record<string, unknown>[],
  globalFilters?: Filter[],
  datasetFilters?: Filter[],
): Record<string, unknown>[] {
  let filteredData = data;

  if (globalFilters && globalFilters.length > 0) {
    filteredData = applyGlobalFilters(filteredData, globalFilters);
  }

  if (datasetFilters && datasetFilters.length > 0) {
    filteredData = applyGlobalFilters(filteredData, datasetFilters);
  }

  return filteredData;
}

/**
 * Valide un filtre
 */
export function validateFilter(filter: Filter): ValidationResult {
  const errors: string[] = [];

  if (!filter.field || filter.field.trim() === '') {
    errors.push('Le champ du filtre doit etre specifie');
  }

  if (filter.value === undefined || filter.value === null || filter.value === '') {
    errors.push('La valeur du filtre doit etre specifiee');
  }

  if (filter.operator && !VALID_OPERATORS.includes(filter.operator)) {
    errors.push(`Operateur invalide: ${filter.operator}`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Cree un filtre par defaut
 */
export function createDefaultFilter(field: string = ''): Filter {
  return {
    field,
    operator: 'equals',
    value: '',
  };
}
