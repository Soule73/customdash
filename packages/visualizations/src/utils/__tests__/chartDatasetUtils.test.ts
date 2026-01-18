import { describe, it, expect } from 'vitest';
import {
  createSplitSeriesDatasets,
  createMetricDatasets,
  createChartDatasets,
  prepareMetricStyles,
  createBarChartDataset,
  createLineChartDataset,
  createPieChartDataset,
  createGetValuesFunction,
  createBubbleChartDataset,
  createScatterChartDataset,
  createRadarChartDataset,
} from '../chartDatasetUtils';
import type {
  Metric,
  MetricStyle,
  ProcessedData,
  DatasetCreationContext,
  WidgetParams,
  SplitData,
  BucketLevel,
  BucketItem,
  SplitItem,
  MultiBucketConfig,
} from '../../interfaces';

function createEmptySplitData(): SplitData {
  return { series: [], rows: [], charts: [] };
}

function createBucketItem(key: string, data: Record<string, unknown>[]): BucketItem {
  return { key, data, docCount: data.length };
}

function createBucketLevel(
  field: string,
  buckets: BucketItem[],
  data: Record<string, unknown>[] = [],
): BucketLevel {
  const bucket: MultiBucketConfig = { field, type: 'terms' };
  return { bucket, level: 0, buckets, data };
}

function createSplitItem(key: string, data: Record<string, unknown>[]): SplitItem {
  const bucket: MultiBucketConfig = { field: 'split', type: 'split_series' };
  return { key, data, bucket };
}

describe('chartDatasetUtils', () => {
  const mockMetric: Metric = { agg: 'sum', field: 'sales', label: 'Total Sales' };
  const mockLabels = ['A', 'B', 'C'];

  describe('prepareMetricStyles', () => {
    it('should return empty array for undefined input', () => {
      expect(prepareMetricStyles(undefined)).toEqual([]);
    });

    it('should return array as-is when input is array', () => {
      const styles: MetricStyle[] = [{ backgroundColor: 'red' }];
      expect(prepareMetricStyles(styles)).toEqual(styles);
    });

    it('should convert object values to array', () => {
      const styles = { metric1: { backgroundColor: 'red' }, metric2: { backgroundColor: 'blue' } };
      const result = prepareMetricStyles(styles);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ backgroundColor: 'red' });
      expect(result).toContainEqual({ backgroundColor: 'blue' });
    });

    it('should return empty array for empty object', () => {
      expect(prepareMetricStyles({})).toEqual([]);
    });
  });

  describe('createBarChartDataset', () => {
    it('should create bar dataset with default values', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createBarChartDataset(mockMetric, 0, values, mockLabels, widgetParams, style);

      expect(dataset.label).toBe('Total Sales');
      expect(dataset.data).toEqual([10, 20, 30]);
      expect(dataset.borderWidth).toBe(1);
      expect(dataset.borderRadius).toBe(0);
      expect(dataset.borderSkipped).toBe(false);
    });

    it('should apply custom style', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {
        backgroundColor: '#ff0000',
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 5,
      };

      const dataset = createBarChartDataset(mockMetric, 0, values, mockLabels, widgetParams, style);

      expect(dataset.borderColor).toBe('#000000');
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.borderRadius).toBe(5);
    });

    it('should use widget params for barThickness', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = { barThickness: 50, borderWidth: 3 };
      const style: MetricStyle = {};

      const dataset = createBarChartDataset(mockMetric, 0, values, mockLabels, widgetParams, style);

      expect(dataset.barThickness).toBe(50);
      expect(dataset.borderWidth).toBe(3);
    });

    it('should use metric field as label fallback', () => {
      const metric: Metric = { agg: 'sum', field: 'revenue' };
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createBarChartDataset(metric, 0, values, mockLabels, widgetParams, style);

      expect(dataset.label).toBe('sum(revenue)');
    });
  });

  describe('createLineChartDataset', () => {
    it('should create line dataset with default values', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createLineChartDataset(
        mockMetric,
        0,
        values,
        mockLabels,
        widgetParams,
        style,
      );

      expect(dataset.label).toBe('Total Sales');
      expect(dataset.data).toEqual([10, 20, 30]);
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.tension).toBe(0.4);
      expect(dataset.fill).toBe(false);
      expect(dataset.pointRadius).toBe(3);
    });

    it('should apply custom style', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {
        tension: 0.2,
        fill: true,
        pointRadius: 5,
      };

      const dataset = createLineChartDataset(
        mockMetric,
        0,
        values,
        mockLabels,
        widgetParams,
        style,
      );

      expect(dataset.tension).toBe(0.2);
      expect(dataset.fill).toBe(true);
      expect(dataset.pointRadius).toBe(5);
    });

    it('should use widget params for tension', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = { tension: 0.8, borderWidth: 4 };
      const style: MetricStyle = {};

      const dataset = createLineChartDataset(
        mockMetric,
        0,
        values,
        mockLabels,
        widgetParams,
        style,
      );

      expect(dataset.tension).toBe(0.8);
      expect(dataset.borderWidth).toBe(4);
    });
  });

  describe('createPieChartDataset', () => {
    it('should create pie dataset with default values', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createPieChartDataset(mockMetric, 0, values, mockLabels, widgetParams, style);

      expect(dataset.data).toEqual([10, 20, 30]);
      expect(dataset.borderColor).toBe('#ffffff');
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.hoverOffset).toBe(4);
      expect(Array.isArray(dataset.backgroundColor)).toBe(true);
    });

    it('should use custom colors from style', () => {
      const values = [10, 20, 30];
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        borderColor: '#333333',
      };

      const dataset = createPieChartDataset(mockMetric, 0, values, mockLabels, widgetParams, style);

      expect(dataset.backgroundColor).toEqual(['#ff0000', '#00ff00', '#0000ff']);
      expect(dataset.borderColor).toBe('#333333');
    });
  });

  describe('createBubbleChartDataset', () => {
    const bubbleData = [
      { x: 10, y: 20, r: 5 },
      { x: 15, y: 25, r: 8 },
    ];

    it('should create bubble dataset with default values', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createBubbleChartDataset(
        { label: 'Bubbles' },
        0,
        bubbleData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.type).toBe('bubble');
      expect(dataset.label).toBe('Bubbles');
      expect(dataset.data).toEqual(bubbleData);
      expect(dataset.pointStyle).toBe('circle');
      expect(dataset.pointRadius).toBe(5);
      expect(dataset.borderWidth).toBe(1);
    });

    it('should apply opacity to backgroundColor with hex color', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {
        color: '#ff0000',
        opacity: 0.5,
      };

      const dataset = createBubbleChartDataset(
        { label: 'Bubbles' },
        0,
        bubbleData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.backgroundColor).toMatch(/rgba\(255, 0, 0, 0\.5\)/);
    });

    it('should keep HSL color when opacity is set but no hex color', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = { opacity: 0.5 };

      const dataset = createBubbleChartDataset(
        { label: 'Bubbles' },
        0,
        bubbleData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.backgroundColor).toMatch(/hsl\(\d+,\s*\d+%,\s*\d+%\)/);
    });

    it('should hide points when showPoints is false', () => {
      const widgetParams: WidgetParams = { showPoints: false };
      const style: MetricStyle = {};

      const dataset = createBubbleChartDataset(
        { label: 'Bubbles' },
        0,
        bubbleData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.pointRadius).toBe(0);
      expect(dataset.pointHoverRadius).toBe(0);
    });

    it('should use custom pointStyle', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = { pointStyle: 'triangle' };

      const dataset = createBubbleChartDataset(
        { label: 'Bubbles' },
        0,
        bubbleData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.pointStyle).toBe('triangle');
    });
  });

  describe('createScatterChartDataset', () => {
    const scatterData = [
      { x: 10, y: 20 },
      { x: 15, y: 25 },
    ];

    it('should create scatter dataset with default values', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createScatterChartDataset(
        { label: 'Points' },
        0,
        scatterData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.type).toBe('scatter');
      expect(dataset.label).toBe('Points');
      expect(dataset.data).toEqual(scatterData);
      expect(dataset.showLine).toBe(false);
      expect(dataset.pointRadius).toBe(5);
    });

    it('should apply opacity to backgroundColor with hex color', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {
        color: '#00ff00',
        opacity: 0.7,
      };

      const dataset = createScatterChartDataset(
        { label: 'Points' },
        0,
        scatterData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.backgroundColor).toMatch(/rgba\(0, 255, 0, 0\.7\)/);
    });

    it('should keep HSL color when opacity is set but no hex color', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = { opacity: 0.7 };

      const dataset = createScatterChartDataset(
        { label: 'Points' },
        0,
        scatterData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.backgroundColor).toMatch(/hsl\(\d+,\s*\d+%,\s*\d+%\)/);
    });

    it('should hide points when showPoints is false', () => {
      const widgetParams: WidgetParams = { showPoints: false };
      const style: MetricStyle = {};

      const dataset = createScatterChartDataset(
        { label: 'Points' },
        0,
        scatterData,
        [],
        widgetParams,
        style,
      );

      expect(dataset.pointRadius).toBe(0);
      expect(dataset.pointHoverRadius).toBe(0);
    });
  });

  describe('createRadarChartDataset', () => {
    const values = [10, 20, 30, 40, 50];

    it('should create radar dataset with default values', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createRadarChartDataset(
        { label: 'Metrics' },
        0,
        values,
        [],
        widgetParams,
        style,
      );

      expect(dataset.label).toBe('Metrics');
      expect(dataset.data).toEqual(values);
      expect(dataset.fill).toBe(true);
      expect(dataset.pointRadius).toBe(4);
      expect(dataset.borderWidth).toBe(2);
    });

    it('should use field as fallback label', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createRadarChartDataset(
        { field: 'performance' },
        0,
        values,
        [],
        widgetParams,
        style,
      );

      expect(dataset.label).toBe('performance');
    });

    it('should use default label when no label or field', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {};

      const dataset = createRadarChartDataset({}, 1, values, [], widgetParams, style);

      expect(dataset.label).toBe('Dataset 2');
    });

    it('should apply custom style', () => {
      const widgetParams: WidgetParams = {};
      const style: MetricStyle = {
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: '#ff0000',
        borderWidth: 3,
        pointRadius: 6,
        fill: false,
      };

      const dataset = createRadarChartDataset(
        { label: 'Custom' },
        0,
        values,
        [],
        widgetParams,
        style,
      );

      expect(dataset.backgroundColor).toBe('rgba(255, 0, 0, 0.3)');
      expect(dataset.borderColor).toBe('#ff0000');
      expect(dataset.borderWidth).toBe(3);
      expect(dataset.pointRadius).toBe(6);
      expect(dataset.fill).toBe(false);
    });

    it('should use widgetParams for borderWidth and pointRadius', () => {
      const widgetParams: WidgetParams = { borderWidth: 4, pointRadius: 8 };
      const style: MetricStyle = {};

      const dataset = createRadarChartDataset(
        { label: 'Metrics' },
        0,
        values,
        [],
        widgetParams,
        style,
      );

      expect(dataset.borderWidth).toBe(4);
      expect(dataset.pointRadius).toBe(8);
    });
  });

  describe('createGetValuesFunction', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'A', value: 20 },
      { category: 'B', value: 30 },
    ];

    it('should return aggregated value when no buckets', () => {
      const processedData: ProcessedData = {
        groupedData: data,
        labels: [],
        bucketHierarchy: [],
        splitData: createEmptySplitData(),
      };
      const getValues = createGetValuesFunction(processedData, data);
      const metric: Metric = { agg: 'sum', field: 'value' };

      const result = getValues(metric);

      expect(result).toEqual([60]);
    });

    it('should return values for each bucket', () => {
      const processedData: ProcessedData = {
        groupedData: data,
        labels: ['A', 'B'],
        bucketHierarchy: [
          createBucketLevel('category', [
            createBucketItem('A', [
              { category: 'A', value: 10 },
              { category: 'A', value: 20 },
            ]),
            createBucketItem('B', [{ category: 'B', value: 30 }]),
          ]),
        ],
        splitData: createEmptySplitData(),
      };
      const getValues = createGetValuesFunction(processedData, data);
      const metric: Metric = { agg: 'sum', field: 'value' };

      const result = getValues(metric);

      expect(result).toEqual([30, 30]);
    });
  });

  describe('createMetricDatasets', () => {
    it('should create datasets for each metric', () => {
      const processedData: ProcessedData = {
        groupedData: [
          { category: 'A', value: 10 },
          { category: 'B', value: 20 },
        ],
        labels: ['A', 'B'],
        bucketHierarchy: [
          createBucketLevel('category', [
            createBucketItem('A', [{ category: 'A', value: 10 }]),
            createBucketItem('B', [{ category: 'B', value: 20 }]),
          ]),
        ],
        splitData: createEmptySplitData(),
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: ['A', 'B'],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [],
        processedData,
        getValues: () => [10, 20],
      };

      const datasets = createMetricDatasets(context);

      expect(datasets).toHaveLength(1);
      expect(datasets[0].label).toBe('Total Sales');
    });

    it('should use custom dataset creator', () => {
      const processedData: ProcessedData = {
        groupedData: [],
        labels: ['A', 'B'],
        bucketHierarchy: [],
        splitData: createEmptySplitData(),
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: ['A', 'B'],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [],
        processedData,
        getValues: () => [10, 20],
      };

      const customCreator = () => ({ custom: true, label: 'Custom' });
      const datasets = createMetricDatasets(context, customCreator);

      expect(datasets).toHaveLength(1);
      expect(datasets[0].custom).toBe(true);
    });
  });

  describe('createSplitSeriesDatasets', () => {
    it('should create datasets for each split series', () => {
      const processedData: ProcessedData = {
        groupedData: [
          { category: 'A', value: 10 },
          { category: 'A', value: 20 },
        ],
        labels: ['A'],
        bucketHierarchy: [createBucketLevel('category', [])],
        splitData: {
          series: [
            createSplitItem('Series 1', [{ category: 'A', value: 10 }]),
            createSplitItem('Series 2', [{ category: 'A', value: 20 }]),
          ],
          rows: [],
          charts: [],
        },
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: ['A'],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [],
        processedData,
        getValues: () => [10],
      };

      const datasets = createSplitSeriesDatasets(context);

      expect(datasets).toHaveLength(2);
      expect(datasets[0].label).toBe('Series 1');
      expect(datasets[1].label).toBe('Series 2');
    });
  });

  describe('createChartDatasets', () => {
    it('should use split series datasets when series exist', () => {
      const processedData: ProcessedData = {
        groupedData: [],
        labels: [],
        bucketHierarchy: [createBucketLevel('category', [])],
        splitData: {
          series: [createSplitItem('Series 1', [])],
          rows: [],
          charts: [],
        },
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: [],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [],
        processedData,
        getValues: () => [],
      };

      const datasets = createChartDatasets(context);

      expect(datasets).toHaveLength(1);
      expect(datasets[0].label).toBe('Series 1');
    });

    it('should use metric datasets when no split series', () => {
      const processedData: ProcessedData = {
        groupedData: [],
        labels: [],
        bucketHierarchy: [],
        splitData: createEmptySplitData(),
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: [],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [],
        processedData,
        getValues: () => [100],
      };

      const datasets = createChartDatasets(context);

      expect(datasets).toHaveLength(1);
      expect(datasets[0].label).toBe('Total Sales');
    });
  });

  describe('createSplitSeriesDatasets edge cases', () => {
    it('should handle missing bucket hierarchy', () => {
      const processedData: ProcessedData = {
        groupedData: [],
        labels: ['A', 'B'],
        bucketHierarchy: [],
        splitData: {
          series: [createSplitItem('Series 1', [{ value: 10 }])],
          rows: [],
          charts: [],
        },
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: ['A', 'B'],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [],
        processedData,
        getValues: () => [10],
      };

      const datasets = createSplitSeriesDatasets(context);
      expect(datasets).toHaveLength(1);
    });

    it('should use customDatasetCreator when provided', () => {
      const processedData: ProcessedData = {
        groupedData: [],
        labels: ['A', 'B'],
        bucketHierarchy: [createBucketLevel('category', [])],
        splitData: {
          series: [createSplitItem('Series 1', [{ category: 'A', sales: 10 }])],
          rows: [],
          charts: [],
        },
      };

      const context: DatasetCreationContext = {
        chartType: 'bar',
        labels: ['A', 'B'],
        widgetParams: {},
        metrics: [mockMetric],
        metricStyles: [{ backgroundColor: 'red' }],
        processedData,
        getValues: () => [10, 20],
      };

      const customCreator = (
        metric: Metric,
        idx: number,
        values: number[],
        labels: string[],
        params: WidgetParams,
        style: MetricStyle,
      ) => ({
        customLabel: `Custom ${metric.label}`,
        customData: values,
        customIndex: idx,
        customLabels: labels,
        customParams: params,
        customStyle: style,
      });

      const datasets = createSplitSeriesDatasets(context, customCreator);
      expect(datasets).toHaveLength(1);
      expect(datasets[0]).toHaveProperty('customLabel', 'Custom Total Sales');
      expect(datasets[0]).toHaveProperty('customIndex', 0);
    });
  });
});
