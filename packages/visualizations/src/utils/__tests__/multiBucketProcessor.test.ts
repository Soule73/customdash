import { describe, it, expect } from 'vitest';
import {
  MultiBucketDataProcessor,
  processMultiBucketData,
  useMultiBucketProcessor,
} from '../multiBucketProcessor';
import type { MultiBucketConfig } from '../../interfaces';

describe('multiBucketProcessor', () => {
  const sampleData = [
    { category: 'A', region: 'North', value: 100, date: '2024-01-15' },
    { category: 'A', region: 'South', value: 150, date: '2024-01-16' },
    { category: 'B', region: 'North', value: 200, date: '2024-02-15' },
    { category: 'B', region: 'South', value: 250, date: '2024-02-16' },
    { category: 'A', region: 'North', value: 120, date: '2024-01-17' },
  ];

  describe('MultiBucketDataProcessor', () => {
    describe('processData with no buckets', () => {
      it('should return all data with Total label when no buckets configured', () => {
        const processor = new MultiBucketDataProcessor(sampleData, {});
        const result = processor.processData();

        expect(result.labels).toEqual(['Total']);
        expect(result.groupedData).toEqual(sampleData);
        expect(result.bucketHierarchy).toHaveLength(0);
        expect(result.splitData.series).toHaveLength(0);
      });

      it('should handle empty data array', () => {
        const processor = new MultiBucketDataProcessor([], { buckets: [] });
        const result = processor.processData();

        expect(result.labels).toEqual(['Total']);
        expect(result.groupedData).toEqual([]);
      });
    });

    describe('processData with terms bucket', () => {
      it('should group data by field values', () => {
        const buckets: MultiBucketConfig[] = [{ field: 'category', type: 'terms', size: 10 }];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.labels).toContain('A');
        expect(result.labels).toContain('B');
        expect(result.bucketHierarchy).toHaveLength(1);
      });

      it('should respect size limit', () => {
        const data = Array.from({ length: 20 }, (_, i) => ({ cat: `Category ${i}`, val: i }));
        const buckets: MultiBucketConfig[] = [{ field: 'cat', type: 'terms', size: 5 }];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels.length).toBeLessThanOrEqual(5);
      });

      it('should respect minDocCount filter', () => {
        const data = [
          { cat: 'A', val: 1 },
          { cat: 'A', val: 2 },
          { cat: 'B', val: 3 },
        ];
        const buckets: MultiBucketConfig[] = [{ field: 'cat', type: 'terms', minDocCount: 2 }];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels).toContain('A');
        expect(result.labels).not.toContain('B');
      });

      it('should sort by order parameter', () => {
        const buckets: MultiBucketConfig[] = [{ field: 'category', type: 'terms', order: 'asc' }];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBeGreaterThan(0);
      });

      it('should handle missing field values', () => {
        const data = [{ category: 'A', value: 10 }, { value: 20 }, { category: 'B', value: 30 }];
        const buckets: MultiBucketConfig[] = [{ field: 'category', type: 'terms' }];

        const processor = new MultiBucketDataProcessor(data as Record<string, unknown>[], {
          buckets,
        });
        const result = processor.processData();

        expect(result.labels).toBeDefined();
      });
    });

    describe('processData with histogram bucket', () => {
      it('should group data by numeric intervals', () => {
        const data = [
          { value: 5 },
          { value: 15 },
          { value: 25 },
          { value: 35 },
          { value: 12 },
          { value: 22 },
        ];
        const buckets: MultiBucketConfig[] = [{ field: 'value', type: 'histogram', interval: 10 }];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels.some(l => l.includes('0-10'))).toBe(true);
        expect(result.labels.some(l => l.includes('10-20'))).toBe(true);
      });

      it('should handle default interval of 1', () => {
        const data = [{ value: 1 }, { value: 2 }, { value: 3 }];
        const buckets: MultiBucketConfig[] = [{ field: 'value', type: 'histogram' }];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels).toHaveLength(3);
      });

      it('should handle missing numeric values as 0', () => {
        const data = [{ value: 10 }, {}, { value: 20 }];
        const buckets: MultiBucketConfig[] = [{ field: 'value', type: 'histogram', interval: 10 }];

        const processor = new MultiBucketDataProcessor(data as Record<string, unknown>[], {
          buckets,
        });
        const result = processor.processData();

        expect(result.labels.some(l => l.includes('0-10'))).toBe(true);
      });
    });

    describe('processData with date_histogram bucket', () => {
      it('should group data by day', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'day' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy).toHaveLength(1);
        expect(result.bucketHierarchy[0].buckets.length).toBeGreaterThan(0);
      });

      it('should group data by month', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'month' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBe(2);
      });

      it('should group data by year', () => {
        const data = [
          { date: '2023-01-15', val: 1 },
          { date: '2024-01-15', val: 2 },
          { date: '2024-06-15', val: 3 },
        ];
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'year' },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBe(2);
      });

      it('should group data by week', () => {
        const data = [
          { date: '2024-01-15', val: 1 },
          { date: '2024-01-16', val: 2 },
          { date: '2024-01-22', val: 3 },
        ];
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'week' },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBeGreaterThanOrEqual(1);
      });

      it('should handle invalid date values', () => {
        const data = [
          { date: '2024-01-15', val: 1 },
          { date: 'invalid-date', val: 2 },
          { date: null, val: 3 },
        ];
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'day' },
        ];

        const processor = new MultiBucketDataProcessor(data as Record<string, unknown>[], {
          buckets,
        });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBe(1);
      });

      it('should group data by hour', () => {
        const data = [
          { date: '2024-01-15T10:30:00Z', val: 1 },
          { date: '2024-01-15T10:45:00Z', val: 2 },
          { date: '2024-01-15T11:30:00Z', val: 3 },
        ];
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'hour' },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBe(2);
      });

      it('should group data by minute', () => {
        const data = [
          { date: '2024-01-15T10:30:00Z', val: 1 },
          { date: '2024-01-15T10:30:45Z', val: 2 },
          { date: '2024-01-15T10:31:00Z', val: 3 },
        ];
        const buckets: MultiBucketConfig[] = [
          { field: 'date', type: 'date_histogram', dateInterval: 'minute' },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy[0].buckets.length).toBe(2);
      });
    });

    describe('processData with range bucket', () => {
      it('should group data by defined ranges', () => {
        const data = [{ value: 50 }, { value: 150 }, { value: 250 }, { value: 75 }, { value: 180 }];
        const buckets: MultiBucketConfig[] = [
          {
            field: 'value',
            type: 'range',
            ranges: [
              { from: 0, to: 100, label: 'Low' },
              { from: 100, to: 200, label: 'Medium' },
              { from: 200, to: 300, label: 'High' },
            ],
          },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels).toContain('Low');
        expect(result.labels).toContain('Medium');
        expect(result.labels).toContain('High');
      });

      it('should handle open-ended ranges', () => {
        const data = [{ value: 50 }, { value: 150 }, { value: 250 }];
        const buckets: MultiBucketConfig[] = [
          {
            field: 'value',
            type: 'range',
            ranges: [
              { to: 100, label: 'Under 100' },
              { from: 100, label: 'Over 100' },
            ],
          },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels).toContain('Under 100');
        expect(result.labels).toContain('Over 100');
      });

      it('should filter by minDocCount', () => {
        const data = [{ value: 50 }, { value: 55 }, { value: 150 }];
        const buckets: MultiBucketConfig[] = [
          {
            field: 'value',
            type: 'range',
            minDocCount: 2,
            ranges: [
              { from: 0, to: 100, label: 'Low' },
              { from: 100, to: 200, label: 'Medium' },
            ],
          },
        ];

        const processor = new MultiBucketDataProcessor(data, { buckets });
        const result = processor.processData();

        expect(result.labels).toContain('Low');
        expect(result.labels).not.toContain('Medium');
      });
    });

    describe('processData with split buckets', () => {
      it('should populate split_series data', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'region', type: 'split_series', splitType: 'series' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.splitData.series.length).toBeGreaterThan(0);
        expect(result.splitData.series.some(s => s.key === 'North')).toBe(true);
        expect(result.splitData.series.some(s => s.key === 'South')).toBe(true);
      });

      it('should populate split_rows data', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'region', type: 'split_rows', splitType: 'rows' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.splitData.rows.length).toBeGreaterThan(0);
      });

      it('should populate split_chart data', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'region', type: 'split_chart', splitType: 'chart' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.splitData.charts.length).toBeGreaterThan(0);
      });

      it('should infer splitType from bucket type when not specified', () => {
        const buckets: MultiBucketConfig[] = [{ field: 'region', type: 'split_series' }];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.splitData.series.length).toBeGreaterThan(0);
      });
    });

    describe('processData with multiple bucket levels', () => {
      it('should process multiple bucket levels in sequence', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'category', type: 'terms' },
          { field: 'region', type: 'terms' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.bucketHierarchy).toHaveLength(2);
      });

      it('should use first level for labels', () => {
        const buckets: MultiBucketConfig[] = [
          { field: 'category', type: 'terms' },
          { field: 'region', type: 'split_series' },
        ];

        const processor = new MultiBucketDataProcessor(sampleData, { buckets });
        const result = processor.processData();

        expect(result.labels).toContain('A');
        expect(result.labels).toContain('B');
      });
    });
  });

  describe('processMultiBucketData', () => {
    it('should be a convenience function for MultiBucketDataProcessor', () => {
      const buckets: MultiBucketConfig[] = [{ field: 'category', type: 'terms' }];

      const result = processMultiBucketData(sampleData, { buckets });

      expect(result.labels).toContain('A');
      expect(result.labels).toContain('B');
      expect(result.bucketHierarchy).toHaveLength(1);
    });

    it('should handle empty config', () => {
      const result = processMultiBucketData(sampleData, {});

      expect(result.labels).toEqual(['Total']);
    });
  });

  describe('useMultiBucketProcessor', () => {
    it('should work with ChartConfig type', () => {
      const config = {
        buckets: [{ field: 'category', type: 'terms' as const }],
        metrics: [{ field: 'value', agg: 'sum' as const }],
      };

      const result = useMultiBucketProcessor(sampleData, config);

      expect(result.labels).toContain('A');
      expect(result.bucketHierarchy).toHaveLength(1);
    });
  });

  describe('MultiBucketDataProcessor edge cases', () => {
    it('should handle split_rows type', () => {
      const buckets: MultiBucketConfig[] = [
        { field: 'region', type: 'split_rows', splitType: 'rows' },
      ];

      const processor = new MultiBucketDataProcessor(sampleData, { buckets });
      const result = processor.processData();

      expect(result.splitData.rows.length).toBeGreaterThan(0);
    });

    it('should handle split_chart type', () => {
      const buckets: MultiBucketConfig[] = [
        { field: 'category', type: 'split_chart', splitType: 'chart' },
      ];

      const processor = new MultiBucketDataProcessor(sampleData, { buckets });
      const result = processor.processData();

      expect(result.splitData.charts.length).toBeGreaterThan(0);
    });

    it('should handle unknown bucket type as terms', () => {
      const buckets: MultiBucketConfig[] = [{ field: 'category', type: 'unknown' as 'terms' }];

      const processor = new MultiBucketDataProcessor(sampleData, { buckets });
      const result = processor.processData();

      expect(result.labels).toContain('A');
    });

    it('should sort terms bucket in ascending order', () => {
      const buckets: MultiBucketConfig[] = [{ field: 'category', type: 'terms', order: 'asc' }];

      const processor = new MultiBucketDataProcessor(sampleData, { buckets });
      const result = processor.processData();

      expect(result.labels.length).toBeGreaterThan(0);
    });

    it('should format week date labels correctly', () => {
      const dataWithDates = [
        { date: '2024-01-15', value: 10 },
        { date: '2024-01-22', value: 20 },
      ];
      const buckets: MultiBucketConfig[] = [
        { field: 'date', type: 'date_histogram', dateInterval: 'week' },
      ];

      const processor = new MultiBucketDataProcessor(dataWithDates, { buckets });
      const result = processor.processData();

      expect(result.labels.length).toBeGreaterThan(0);
    });

    it('should format year date labels correctly', () => {
      const dataWithDates = [
        { date: '2024-01-15', value: 10 },
        { date: '2023-06-22', value: 20 },
      ];
      const buckets: MultiBucketConfig[] = [
        { field: 'date', type: 'date_histogram', dateInterval: 'year' },
      ];

      const processor = new MultiBucketDataProcessor(dataWithDates, { buckets });
      const result = processor.processData();

      expect(result.labels).toContain('2024');
    });

    it('should format hour date labels correctly', () => {
      const dataWithDates = [
        { date: '2024-01-15T10:00:00Z', value: 10 },
        { date: '2024-01-15T11:00:00Z', value: 20 },
      ];
      const buckets: MultiBucketConfig[] = [
        { field: 'date', type: 'date_histogram', dateInterval: 'hour' },
      ];

      const processor = new MultiBucketDataProcessor(dataWithDates, { buckets });
      const result = processor.processData();

      expect(result.labels.length).toBeGreaterThan(0);
    });

    it('should format minute date labels correctly', () => {
      const dataWithDates = [
        { date: '2024-01-15T10:30:00Z', value: 10 },
        { date: '2024-01-15T10:45:00Z', value: 20 },
      ];
      const buckets: MultiBucketConfig[] = [
        { field: 'date', type: 'date_histogram', dateInterval: 'minute' },
      ];

      const processor = new MultiBucketDataProcessor(dataWithDates, { buckets });
      const result = processor.processData();

      expect(result.labels.length).toBeGreaterThan(0);
    });

    it('should skip invalid date values', () => {
      const dataWithDates = [
        { date: 'invalid', value: 10 },
        { date: '2024-01-15', value: 20 },
      ];
      const buckets: MultiBucketConfig[] = [
        { field: 'date', type: 'date_histogram', dateInterval: 'day' },
      ];

      const processor = new MultiBucketDataProcessor(dataWithDates, { buckets });
      const result = processor.processData();

      expect(result.labels.length).toBe(1);
    });

    it('should skip rows with missing date field', () => {
      const dataWithDates = [{ value: 10 }, { date: '2024-01-15', value: 20 }];
      const buckets: MultiBucketConfig[] = [
        { field: 'date', type: 'date_histogram', dateInterval: 'day' },
      ];

      const processor = new MultiBucketDataProcessor(dataWithDates, { buckets });
      const result = processor.processData();

      expect(result.labels.length).toBe(1);
    });

    it('should handle range with only from defined', () => {
      const data = [{ value: 50 }, { value: 150 }];
      const buckets: MultiBucketConfig[] = [
        {
          field: 'value',
          type: 'range',
          ranges: [{ from: 100, label: 'Over 100' }],
        },
      ];

      const processor = new MultiBucketDataProcessor(data, { buckets });
      const result = processor.processData();

      expect(result.labels).toContain('Over 100');
    });

    it('should handle range with only to defined', () => {
      const data = [{ value: 50 }, { value: 150 }];
      const buckets: MultiBucketConfig[] = [
        {
          field: 'value',
          type: 'range',
          ranges: [{ to: 100, label: 'Under 100' }],
        },
      ];

      const processor = new MultiBucketDataProcessor(data, { buckets });
      const result = processor.processData();

      expect(result.labels).toContain('Under 100');
    });
  });
});
