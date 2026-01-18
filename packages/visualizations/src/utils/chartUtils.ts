import type { AggregationType } from '../types';
import { DEFAULT_CHART_COLORS } from '../constants';
import { aggregateFromRecords } from './aggregation';
import { getLocal } from './config';

/**
 * Aggregates data based on the specified aggregation type.
 *
 * @param rows - An array of records to aggregate.
 * @param agg - The type of aggregation to perform.
 * @param field - The field in the records to aggregate.
 * @returns The aggregated value as a number.
 *
 * @example
 * const data = [
 *   { sales: 100, price: 10 },
 *   { sales: 200, price: 20 },
 *   { sales: 150, price: 15 },
 * ];
 * aggregate(data, 'sum', 'sales'); // Returns the sum of the 'sales' field (450)
 * aggregate(data, 'avg', 'price'); // Returns the average of the 'price' field (15)
 */
export function aggregate(
  rows: Record<string, unknown>[],
  agg: AggregationType,
  field: string,
): number {
  return aggregateFromRecords(rows, agg, field);
}

/**
 * Extracts unique labels from a specified field in the data.
 *
 * @param data - An array of records to extract labels from.
 * @param field - The field in the records to extract unique labels.
 * @returns An array of unique labels as strings.
 *
 * @example
 * const data = [
 *  { category: 'A', value: 10 },
 *   { category: 'B', value: 20 },
 *   { category: 'A', value: 30 },
 * ];
 * getLabels(data, 'category'); // Returns unique categories from the 'category' field
 */
export function getLabels(data: Record<string, unknown>[], field: string): string[] {
  return Array.from(new Set(data.map(row => String(row[field] || ''))));
}

/**
 * Returns default or customized colors for chart labels.
 *
 * This function generates an array of colors corresponding to the provided labels.
 * If custom colors are provided, they are used cyclically. Otherwise, default chart colors
 * are used, starting from the specified metric index.
 *
 * @param labels - An array of labels for which colors are to be generated.
 * @param customColors - An optional array of custom colors to use.
 * @param metricIndex - The starting index for default colors (default is 0).
 * @returns An array of colors corresponding to the labels.
 *
 * @example
 * getColors(['A', 'B', 'C']); // Returns default colors for A, B, C
 * getColors(['A', 'B', 'C'], ['#ff0000', '#00ff00']); // Returns ['#ff0000', '#00ff00', '#ff0000']
 * getColors(['A', 'B', 'C'], undefined, 2); // Returns default colors starting from index 2
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
 * Detects if a value is an ISO timestamp string.
 * Supports various ISO 8601 formats:
 * - Full datetime: `2024-01-15T14:30:00`
 * - Date only: `2024-01-15`
 * - Year-month: `2024-01`
 * - Week format: `2024-W03`
 *
 * @param val - The value to check
 * @returns `true` if the value is a string matching an ISO timestamp pattern, `false` otherwise
 *
 * @example
 * isIsoTimestamp('2024-01-15T14:30:00'); // true
 * isIsoTimestamp('2024-01-15'); // true
 * isIsoTimestamp('2024-01'); // true
 * isIsoTimestamp('2024-W03'); // true
 * isIsoTimestamp('not a date'); // false
 * isIsoTimestamp(123); // false
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
 * Checks if all labels in the array represent timestamps from the same calendar day.
 * Only works with full ISO datetime strings (e.g., `2024-01-15T14:30:00`).
 *
 * @param labels - An array of ISO datetime strings to check
 * @returns `true` if all labels are from the same day, `false` if the array is empty,
 *          contains non-datetime strings, or spans multiple days
 *
 * @example
 * allSameDay(['2024-01-15T10:00:00', '2024-01-15T14:30:00']); // true
 * allSameDay(['2024-01-15T10:00:00', '2024-01-16T14:30:00']); // false
 * allSameDay(['2024-01-15']); // false (not a full datetime)
 * allSameDay([]); // false
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
 * Formats a timestamp label for the X-axis.
 *
 * This function takes a raw timestamp string and formats it into a human-readable
 * string suitable for display on the X-axis of a chart. It supports various ISO 8601
 * formats and can optionally display only the time if all timestamps are from the same day.
 *
 * @param raw - The raw timestamp string to format.
 * @param onlyTimeIfSameDay - If `true`, formats the label to show only the time when all timestamps are from the same day.
 * @param locale - The locale string to use for formatting (default is null).
 * @returns The formatted timestamp label as a string.
 *
 * @example
 * formatXTicksLabel('2024-01-15T14:30:00'); // "15/01 14:30"
 * formatXTicksLabel('2024-01-15'); // "15/01"
 * formatXTicksLabel('2024-01'); // "janv."
 * formatXTicksLabel('2024-W03'); // "S03"
 */
export function formatXTicksLabel(raw: string, onlyTimeIfSameDay = false, locale?: string): string {
  if (!raw || typeof raw !== 'string') return String(raw);

  if (!/^\d{4}/.test(raw) && !raw.includes('T') && !raw.includes('Z')) {
    return raw;
  }

  const localValue = getLocal(locale);

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;

    if (onlyTimeIfSameDay) {
      return d.toLocaleTimeString(localValue, { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString(localValue, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString(localValue, { day: '2-digit', month: '2-digit' });
  }

  if (/^\d{4}-\d{2}$/.test(raw)) {
    const [year, month] = raw.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleDateString(localValue, { month: 'short' });
  }

  if (/^\d{4}-W\d{1,2}$/.test(raw)) {
    const match = raw.match(/(\d{4})-W(\d{1,2})/);
    if (match) return `S${match[2]}`;
  }

  return raw;
}

/**
 * Formats a value for display in a tooltip.
 *
 * This function takes a value and formats it into a human-readable string suitable for display in a tooltip.
 * It supports ISO 8601 date formats and converts them to a localized French date format.
 *
 * @param val - The value to format for the tooltip. Can be a string or other types.
 * @returns The formatted value as a string.
 *
 * @example
 * formatTooltipValue('2024-01-15T14:30:00'); // "January 15, 2024, 2:30 PM"
 * formatTooltipValue('2024-01-15'); // "January 15, 2024"
 * formatTooltipValue('random text'); // "random text"
 */
export function formatTooltipValue(val: unknown, locale?: string): string {
  if (!val || typeof val !== 'string') return String(val);

  const localValue = getLocal(locale);

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(localValue, {
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
      return d.toLocaleDateString(localValue, { day: '2-digit', month: 'long', year: 'numeric' });
    }
  }

  return String(val);
}
