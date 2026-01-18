import type {
  MultiBucketConfig,
  BucketLevel,
  BucketItem,
  ProcessedData,
  SplitData,
  SplitItem,
  ChartConfig,
} from '../interfaces';
import type { MultiBucketCompatibleConfig } from '../interfaces';
import { getLocal } from './config';

/**
 * Ensures that the configuration has a valid buckets array.
 *
 * @param config - The multi-bucket compatible configuration.
 * @returns The buckets array from the configuration, or an empty array if not present.
 *
 * @example
 * const config: MultiBucketCompatibleConfig = {
 *   metrics: [{ field: 'sales', agg: 'sum' }],
 * };
 * const buckets = ensureMultiBuckets(config);
 * // Result: []
 */
function ensureMultiBuckets(config: MultiBucketCompatibleConfig): MultiBucketConfig[] {
  return config.buckets || [];
}

/**
 * The MultiBucketDataProcessor class is responsible for processing data using multiple bucket configurations.
 * It supports various bucket types such as terms, histogram, date_histogram, and range.
 * The processed data includes grouped data, labels, bucket hierarchy, and split data.
 */
export class MultiBucketDataProcessor {
  private data: Record<string, unknown>[];
  private buckets: MultiBucketConfig[];

  constructor(data: Record<string, unknown>[], config: MultiBucketCompatibleConfig) {
    this.data = data;
    this.buckets = ensureMultiBuckets(config);
  }

  processData(): ProcessedData {
    if (this.buckets.length === 0) {
      return {
        groupedData: this.data,
        labels: ['Total'],
        bucketHierarchy: [],
        splitData: { series: [], rows: [], charts: [] },
      };
    }

    let processedData = this.data;
    const hierarchy: BucketLevel[] = [];
    const splitData: SplitData = { series: [], rows: [], charts: [] };

    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];
      const level = this.processBucketLevel(processedData, bucket, i);
      hierarchy.push(level);

      if (bucket.type?.startsWith('split_')) {
        this.handleSplitBucket(bucket, level, splitData);
      }

      processedData = level.data;
    }

    const labels = this.generateLabels(hierarchy);

    return { groupedData: processedData, labels, bucketHierarchy: hierarchy, splitData };
  }

  /**
   * Processes a specific bucket level based on the bucket type.
   *
   * @param data - The data to be processed at the current bucket level.
   * @param bucket - The configuration for the current bucket.
   * @param level - The level of the bucket in the hierarchy.
   * @returns The processed bucket level, including grouped data and metadata.
   *
   * @example
   * const data = [
   *  { category: 'A', value: 10 },
   *  { category: 'B', value: 20 },
   *  { category: 'A', value: 30 },
   * ];
   * const bucket: MultiBucketConfig = { type: 'terms', field: 'category', size: 10 };
   * const level = processBucketLevel(data, bucket, 0);
   * // { bucket: { ... }, level: 0, buckets: [ ... ], data: [ ... ] }
   */
  private processBucketLevel(
    data: Record<string, unknown>[],
    bucket: MultiBucketConfig,
    level: number,
  ): BucketLevel {
    switch (bucket.type) {
      case 'terms':
        return this.processTermsBucket(data, bucket, level);
      case 'histogram':
        return this.processHistogramBucket(data, bucket, level);
      case 'date_histogram':
        return this.processDateHistogramBucket(data, bucket, level);
      case 'range':
        return this.processRangeBucket(data, bucket, level);
      case 'split_series':
      case 'split_rows':
      case 'split_chart':
        return this.processTermsBucket(data, bucket, level);
      default:
        return this.processTermsBucket(data, bucket, level);
    }
  }

  /**
   * Processes a terms bucket by grouping data based on the specified field.
   *
   * @param data - The data to be grouped.
   * @param bucket - The configuration for the terms bucket.
   * @param level - The level of the bucket in the hierarchy.
   * @returns The processed bucket level, including grouped data and metadata.
   */
  private processTermsBucket(
    data: Record<string, unknown>[],
    bucket: MultiBucketConfig,
    level: number,
  ): BucketLevel {
    const grouped = new Map<string, Record<string, unknown>[]>();

    data.forEach(row => {
      const value = String(row[bucket.field] || '');
      if (!grouped.has(value)) {
        grouped.set(value, []);
      }
      const group = grouped.get(value);
      if (group) {
        group.push(row);
      }
    });

    const sortedEntries = Array.from(grouped.entries())
      .filter(([, rows]) => rows.length >= (bucket.minDocCount || 1))
      .sort((a, b) => {
        const order = bucket.order === 'asc' ? 1 : -1;
        return order * (a[1].length - b[1].length);
      })
      .slice(0, bucket.size || 10);

    const bucketData: BucketItem[] = sortedEntries.map(([key, rows]) => ({
      key,
      docCount: rows.length,
      data: rows,
    }));

    return { bucket, level, buckets: bucketData, data };
  }

  /**
   * Processes a histogram bucket by grouping data into numerical ranges.
   *
   * @param data - The data to be grouped.
   * @param bucket - The configuration for the histogram bucket.
   * @param level - The level of the bucket in the hierarchy.
   * @returns The processed bucket level, including grouped data and metadata.
   */
  private processHistogramBucket(
    data: Record<string, unknown>[],
    bucket: MultiBucketConfig,
    level: number,
  ): BucketLevel {
    const interval = bucket.interval || 1;
    const grouped = new Map<number, Record<string, unknown>[]>();

    data.forEach(row => {
      const value = Number(row[bucket.field] || 0);
      const bucketKey = Math.floor(value / interval) * interval;

      if (!grouped.has(bucketKey)) {
        grouped.set(bucketKey, []);
      }
      const group = grouped.get(bucketKey);
      if (group) {
        group.push(row);
      }
    });

    const sortedEntries = Array.from(grouped.entries())
      .filter(([, rows]) => rows.length >= (bucket.minDocCount || 1))
      .sort((a, b) => a[0] - b[0])
      .slice(0, bucket.size || 50);

    const bucketData: BucketItem[] = sortedEntries.map(([key, rows]) => ({
      key: `${key}-${key + interval}`,
      docCount: rows.length,
      data: rows,
    }));

    return { bucket, level, buckets: bucketData, data };
  }

  /**
   * Processes a date histogram bucket by grouping data into date intervals.
   *
   * @param data - The data to be grouped.
   * @param bucket - The configuration for the date histogram bucket.
   * @param level - The level of the bucket in the hierarchy.
   * @returns The processed bucket level, including grouped data and metadata.
   */
  private processDateHistogramBucket(
    data: Record<string, unknown>[],
    bucket: MultiBucketConfig,
    level: number,
  ): BucketLevel {
    const grouped = new Map<string, Record<string, unknown>[]>();

    data.forEach(row => {
      const rawDateValue = row[bucket.field];
      if (!rawDateValue) return;

      const dateValue = new Date(rawDateValue as string | number | Date);
      if (isNaN(dateValue.getTime())) return;

      let bucketKey: string;

      switch (bucket.dateInterval) {
        case 'year':
          bucketKey = dateValue.getFullYear().toString();
          break;
        case 'month':
          bucketKey = `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'week': {
          const weekStart = new Date(dateValue);
          const dayOfWeek = weekStart.getDay();
          const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          weekStart.setDate(diff);
          bucketKey = `${weekStart.getFullYear()}-W${this.getWeekNumber(weekStart)}`;
          break;
        }
        case 'hour':
          bucketKey = `${dateValue.toISOString().split('T')[0]}T${String(dateValue.getUTCHours()).padStart(2, '0')}:00:00Z`;
          break;
        case 'minute':
          bucketKey = `${dateValue.toISOString().split('T')[0]}T${String(dateValue.getUTCHours()).padStart(2, '0')}:${String(dateValue.getUTCMinutes()).padStart(2, '0')}:00Z`;
          break;
        case 'day':
        default:
          bucketKey = dateValue.toISOString().split('T')[0];
          break;
      }

      if (!grouped.has(bucketKey)) {
        grouped.set(bucketKey, []);
      }
      const group = grouped.get(bucketKey);
      if (group) {
        group.push(row);
      }
    });

    const sortedEntries = Array.from(grouped.entries())
      .filter(([, rows]) => rows.length >= (bucket.minDocCount || 1))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(0, bucket.size || 100);

    const bucketData: BucketItem[] = sortedEntries.map(([key, rows]) => ({
      key,
      keyAsString: this.formatDateLabel(key, bucket.dateInterval),
      docCount: rows.length,
      data: rows,
    }));

    return { bucket, level, buckets: bucketData, data };
  }

  /**
   * Processes a range bucket by grouping data into specified ranges.
   *
   * @param data - The data to be grouped.
   * @param bucket - The configuration for the range bucket.
   * @param level - The level of the bucket in the hierarchy.
   * @returns The processed bucket level, including grouped data and metadata.
   */
  private processRangeBucket(
    data: Record<string, unknown>[],
    bucket: MultiBucketConfig,
    level: number,
  ): BucketLevel {
    const ranges = bucket.ranges || [];
    const bucketData: BucketItem[] = ranges
      .map(range => {
        const filteredData = data.filter(row => {
          const value = Number(row[bucket.field] || 0);
          return (
            (range.from === undefined || value >= range.from) &&
            (range.to === undefined || value < range.to)
          );
        });

        return {
          key: range.label || `${range.from}-${range.to}`,
          docCount: filteredData.length,
          data: filteredData,
        };
      })
      .filter(item => item.docCount >= (bucket.minDocCount || 1));

    return { bucket, level, buckets: bucketData, data };
  }

  /**
   * Processes a split bucket by distributing its items into the appropriate split data structure.
   *
   * @param bucket - The configuration for the split bucket.
   * @param level - The current bucket level being processed.
   * @param splitData - The overall split data structure to populate.
   *
   * @example
   * const bucket: MultiBucketConfig = { type: 'split_series', field: 'category' };
   * const level = processBucketLevel(data, bucket, 0);
   * handleSplitBucket(bucket, level, splitData);
   * // splitData will be populated with series based on the bucket items
   */
  private handleSplitBucket(
    bucket: MultiBucketConfig,
    level: BucketLevel,
    splitData: SplitData,
  ): void {
    const splitType =
      bucket.splitType || (bucket.type?.replace('split_', '') as 'series' | 'rows' | 'chart');

    level.buckets.forEach(bucketItem => {
      const splitItem: SplitItem = { key: bucketItem.key, data: bucketItem.data, bucket };

      switch (splitType) {
        case 'series':
          splitData.series.push(splitItem);
          break;
        case 'rows':
          splitData.rows.push(splitItem);
          break;
        case 'chart':
          splitData.charts.push(splitItem);
          break;
      }
    });
  }

  /**
   * Generates labels for the processed data based on the bucket hierarchy.
   * @param hierarchy - The hierarchy of bucket levels.
   * @returns An array of labels as strings.
   *
   * @example
   * const hierarchy: BucketLevel[] = [ ... ];
   * const labels = generateLabels(hierarchy);
   * // Returns an array of labels based on the first bucket level
   */
  private generateLabels(hierarchy: BucketLevel[]): string[] {
    if (hierarchy.length === 0) return ['Total'];

    const firstLevel = hierarchy[0];
    return firstLevel.buckets.map(bucket => bucket.keyAsString || bucket.key);
  }

  /**
   * Calculates the ISO week number for a given date.
   *
   * @param date - The date for which to calculate the week number.
   * @returns The ISO week number.
   *
   * @example
   * const date = new Date('2023-03-15');
   * const weekNumber = getWeekNumber(date);
   * // Returns the ISO week number for March 15, 2023
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  /**
   * Formats a date label based on the specified interval.
   *
   * @param key - The raw date key as a string.
   * @param interval - The date interval type.
   * @param locale - The locale string to use for formatting (e.g., 'fr-FR').
   * @returns The formatted date label.
   *
   * @example
   * formatDateLabel('2023-03', 'month', 'fr-FR'); // "mars 2023"
   * formatDateLabel('2023-W11', 'week'); // "Week 11, 2023"
   */
  private formatDateLabel(key: string, interval?: string, locale?: string): string {
    if (!interval) return key;

    const localValue = getLocal(locale);

    try {
      switch (interval) {
        case 'year':
          return key;
        case 'month': {
          const [year, month] = key.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return date.toLocaleDateString(localValue, { year: 'numeric', month: 'long' });
        }
        case 'week': {
          const weekMatch = key.match(/(\d+)-W(\d+)/);
          if (weekMatch) return `Week ${weekMatch[2]}, ${weekMatch[1]}`;
          return key;
        }
        case 'day': {
          const dayDate = new Date(key);
          if (!isNaN(dayDate.getTime())) {
            return dayDate.toLocaleDateString(localValue, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
          }
          return key;
        }
        case 'hour': {
          const hourDate = new Date(key);
          if (!isNaN(hourDate.getTime())) {
            return (
              hourDate.toLocaleDateString(localValue, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) + `, ${hourDate.getHours()}:00`
            );
          }
          return key;
        }
        case 'minute': {
          const minuteDate = new Date(key);
          if (!isNaN(minuteDate.getTime())) {
            return (
              minuteDate.toLocaleDateString(localValue, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) + `, ${minuteDate.getHours()}:${String(minuteDate.getMinutes()).padStart(2, '0')}`
            );
          }
          return key;
        }
        default:
          return key;
      }
    } catch {
      return key;
    }
  }
}

/**
 * Processes data using multiple bucket configurations.
 *
 * @param data - The data to be processed.
 * @param config - The multi-bucket compatible configuration.
 * @returns The processed data including grouped data, labels, bucket hierarchy, and split data.
 */
export function processMultiBucketData(
  data: Record<string, unknown>[],
  config: MultiBucketCompatibleConfig,
): ProcessedData {
  const processor = new MultiBucketDataProcessor(data, config);
  return processor.processData();
}

/**
 * Hook to use the multi-bucket data processor.
 * @param data - The data to be processed.
 * @param config - The multi-bucket compatible configuration.
 * @returns The processed data including grouped data, labels, bucket hierarchy, and split data.
 */
export function useMultiBucketProcessor(
  data: Record<string, unknown>[],
  config: ChartConfig,
): ProcessedData {
  const processor = new MultiBucketDataProcessor(data, config);
  return processor.processData();
}
