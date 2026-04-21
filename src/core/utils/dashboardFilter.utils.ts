import type { Filter } from '@customdash/visualizations';
import type { DashboardFilter, TimeRangeConfig } from '@type/dashboard-form.types';

/**
 * Converts a DashboardFilter (store model with id) to a Filter (visualizations model).
 *
 * @param filter - The dashboard filter to convert.
 * @returns A Filter compatible with the visualizations package.
 */
export function toDashboardFilterModel(filter: DashboardFilter): Filter {
  return {
    field: filter.field,
    operator: filter.operator,
    value: filter.value,
  };
}

/**
 * Converts an array of DashboardFilters to visualizations Filters,
 * skipping filters that are incomplete (no field or no value).
 *
 * @param filters - The dashboard filters to convert.
 * @returns An array of Filter objects ready for use in applyGlobalFilters.
 */
export function toVisualizationFilters(filters: DashboardFilter[]): Filter[] {
  return filters
    .filter(f => {
      if (!f.field.trim()) return false;

      if (Array.isArray(f.value)) {
        if (f.value.length === 0) return false;
        if (f.operator === 'between') {
          return f.value.length >= 2 && f.value[0] !== '' && f.value[1] !== '';
        }
        return true;
      }

      return f.value !== '' && f.value !== undefined;
    })
    .map(toDashboardFilterModel);
}

/**
 * Converts a TimeRangeConfig to a Filter (between operator) if both a date field
 * and at least one bound (from/to) are configured.
 *
 * @param timeRange - The dashboard time range configuration.
 * @returns A Filter for the time range, or null if not applicable.
 */
export function timeRangeToFilter(timeRange: TimeRangeConfig): Filter | null {
  const { dateField, from, to } = timeRange;
  if (!dateField || (!from && !to)) return null;

  if (from && to) {
    return { field: dateField, operator: 'between', value: [from, to] };
  }
  if (from) {
    return { field: dateField, operator: 'greater_than_or_equal', value: from };
  }
  return { field: dateField, operator: 'less_than_or_equal', value: to as string };
}

/**
 * Builds the complete list of active visualization filters by combining
 * explicit dashboard filters and the time range filter.
 *
 * @param filters - The explicit dashboard filters.
 * @param timeRange - The dashboard time range configuration.
 * @returns Combined array of Filter objects.
 */
export function buildActiveFilters(
  filters: DashboardFilter[],
  timeRange: TimeRangeConfig,
): Filter[] {
  const result = toVisualizationFilters(filters);
  const timeFilter = timeRangeToFilter(timeRange);
  if (timeFilter) result.push(timeFilter);
  return result;
}
