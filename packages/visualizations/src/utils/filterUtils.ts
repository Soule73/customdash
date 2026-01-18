import { VALID_OPERATORS } from '../constants';
import type { Filter, ValidationResult } from '../interfaces';

/**
 * Applies a filter to a dataset.
 *
 * @param data - The dataset to filter, represented as an array of records.
 * @param filter - The filter to apply, containing field, operator, and value.
 * @returns A new array containing only the records that match the filter criteria.
 *
 * @example
 * const data = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 35 },
 * ];
 * const filter = { field: 'age', operator: 'greater_than', value: 28 };
 * const filteredData = applyFilter(data, filter);
 * // Result: [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]
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
 * Applies global filters to a dataset.
 * @param data - The dataset to filter.
 * @param filters - The global filters to apply.
 * @returns The filtered dataset.
 *
 * @example
 * const data = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 35 },
 * ];
 * const filters = [
 *   { field: 'age', operator: 'greater_than', value: 28 },
 *   { field: 'name', operator: 'contains', value: 'a' },
 * ];
 * const filteredData = applyGlobalFilters(data, filters);
 * // Result: [{ name: 'Alice', age: 30 }]
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
 * Applies all filters (global + dataset) to a dataset.
 *
 * @param data - The dataset to filter.
 * @param globalFilters - The global filters to apply.
 * @param datasetFilters - The dataset-specific filters to apply.
 * @returns The filtered dataset.
 *
 * @example
 * const data = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 35 },
 * ];
 * const globalFilters = [
 *   { field: 'age', operator: 'greater_than', value: 28 },
 * ];
 * const datasetFilters = [
 *   { field: 'name', operator: 'contains', value: 'a' },
 * ];
 * const filteredData = applyAllFilters(data, globalFilters, datasetFilters);
 * // Result: [{ name: 'Alice', age: 30 }]
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
 * Validates a filter.
 * @param filter - The filter to validate.
 * @returns An object containing a boolean indicating validity and a list of error messages.
 *
 * @example
 * const filter = { field: 'age', operator: 'greater_than', value: 28 };
 * const validationResult = validateFilter(filter);
 * // Result: { isValid: true, errors: [] }
 */
export function validateFilter(filter: Filter): ValidationResult {
  const errors: string[] = [];

  if (!filter.field || filter.field.trim() === '') {
    errors.push('The filter field must be specified');
  }

  if (filter.value === undefined || filter.value === null || filter.value === '') {
    errors.push('The filter value must be specified');
  }

  if (filter.operator && !VALID_OPERATORS.includes(filter.operator)) {
    errors.push(`Invalid operator: ${filter.operator}`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Creates a default filter.
 * @param field - The field for the filter.
 * @returns A default filter object.
 *
 * @example
 * const defaultFilter = createDefaultFilter('age');
 * // Result: { field: 'age', operator: 'equals', value: '' }
 */
export function createDefaultFilter(field: string = ''): Filter {
  return {
    field,
    operator: 'equals',
    value: '',
  };
}
