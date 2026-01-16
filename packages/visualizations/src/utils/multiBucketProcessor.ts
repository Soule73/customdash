import type {
  MultiBucketConfig,
  BucketLevel,
  BucketItem,
  ProcessedData,
  SplitData,
  SplitItem,
  ChartConfig,
} from '../types';

export interface MultiBucketCompatibleConfig {
  buckets?: MultiBucketConfig[];
  metrics?: Array<{ field: string; agg: string }>;
}

function ensureMultiBuckets(config: MultiBucketCompatibleConfig): MultiBucketConfig[] {
  return config.buckets || [];
}

/**
 * Processeur de donnees pour les buckets multiples
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
      grouped.get(value)!.push(row);
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
      grouped.get(bucketKey)!.push(row);
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
      grouped.get(bucketKey)!.push(row);
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

  private generateLabels(hierarchy: BucketLevel[]): string[] {
    if (hierarchy.length === 0) return ['Total'];

    const firstLevel = hierarchy[0];
    return firstLevel.buckets.map(bucket => bucket.keyAsString || bucket.key);
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private formatDateLabel(key: string, interval?: string): string {
    if (!interval) return key;

    try {
      switch (interval) {
        case 'year':
          return key;
        case 'month': {
          const [year, month] = key.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        }
        case 'week': {
          const weekMatch = key.match(/(\d+)-W(\d+)/);
          if (weekMatch) return `Semaine ${weekMatch[2]}, ${weekMatch[1]}`;
          return key;
        }
        case 'day': {
          const dayDate = new Date(key);
          if (!isNaN(dayDate.getTime())) {
            return dayDate.toLocaleDateString('fr-FR', {
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
              hourDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) + `, ${hourDate.getHours()}h`
            );
          }
          return key;
        }
        case 'minute': {
          const minuteDate = new Date(key);
          if (!isNaN(minuteDate.getTime())) {
            return (
              minuteDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) + `, ${minuteDate.getHours()}h${String(minuteDate.getMinutes()).padStart(2, '0')}`
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
 * Fonction utilitaire pour traiter les donnees avec des buckets multiples
 */
export function processMultiBucketData(
  data: Record<string, unknown>[],
  config: MultiBucketCompatibleConfig,
): ProcessedData {
  const processor = new MultiBucketDataProcessor(data, config);
  return processor.processData();
}

/**
 * Hook pour utiliser le processeur de buckets multiples
 */
export function useMultiBucketProcessor(
  data: Record<string, unknown>[],
  config: ChartConfig,
): ProcessedData {
  const processor = new MultiBucketDataProcessor(data, config);
  return processor.processData();
}
