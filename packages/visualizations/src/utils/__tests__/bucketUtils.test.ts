import { describe, it, expect } from 'vitest';
import {
  createDefaultBucket,
  validateBucket,
  generateBucketLabel,
  createDefaultRange,
  isSplitBucket,
  getSplitType,
} from '../bucketUtils';
import { BUCKET_TYPE_OPTIONS, DATE_INTERVAL_OPTIONS, SORT_ORDER_OPTIONS } from '../../constants';

describe('bucketUtils', () => {
  describe('BUCKET_TYPE_OPTIONS', () => {
    it('should have all bucket types defined', () => {
      expect(BUCKET_TYPE_OPTIONS.length).toBeGreaterThan(0);
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'terms')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'histogram')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'date_histogram')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'range')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'split_series')).toBeDefined();
    });
  });

  describe('DATE_INTERVAL_OPTIONS', () => {
    it('should have all date intervals defined', () => {
      expect(DATE_INTERVAL_OPTIONS.length).toBeGreaterThan(0);
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'day')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'week')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'month')).toBeDefined();
    });
  });

  describe('SORT_ORDER_OPTIONS', () => {
    it('should have asc and desc options', () => {
      expect(SORT_ORDER_OPTIONS).toHaveLength(2);
      expect(SORT_ORDER_OPTIONS.find(o => o.value === 'asc')).toBeDefined();
      expect(SORT_ORDER_OPTIONS.find(o => o.value === 'desc')).toBeDefined();
    });
  });

  describe('createDefaultBucket', () => {
    it('should create terms bucket by default', () => {
      const bucket = createDefaultBucket('terms', 'category');
      expect(bucket.type).toBe('terms');
      expect(bucket.field).toBe('category');
      expect(bucket.order).toBe('desc');
      expect(bucket.size).toBe(10);
    });

    it('should create histogram bucket with interval', () => {
      const bucket = createDefaultBucket('histogram', 'price');
      expect(bucket.type).toBe('histogram');
      expect(bucket.interval).toBe(1);
    });

    it('should create date_histogram bucket with dateInterval', () => {
      const bucket = createDefaultBucket('date_histogram', 'timestamp');
      expect(bucket.type).toBe('date_histogram');
      expect(bucket.dateInterval).toBe('day');
    });

    it('should create range bucket with default ranges', () => {
      const bucket = createDefaultBucket('range', 'price');
      expect(bucket.type).toBe('range');
      expect(bucket.ranges).toHaveLength(1);
      expect(bucket.ranges?.[0]).toEqual({ from: 0, to: 100, label: 'Range 1' });
    });

    it('should create split_series bucket', () => {
      const bucket = createDefaultBucket('split_series', 'category');
      expect(bucket.type).toBe('split_series');
      expect(bucket.splitType).toBe('series');
      expect(bucket.size).toBe(5);
    });

    it('should create split_rows bucket', () => {
      const bucket = createDefaultBucket('split_rows', 'category');
      expect(bucket.splitType).toBe('rows');
    });

    it('should create split_chart bucket', () => {
      const bucket = createDefaultBucket('split_chart', 'category');
      expect(bucket.splitType).toBe('chart');
      expect(bucket.size).toBe(4);
    });
  });

  describe('validateBucket', () => {
    it('should return valid for complete terms bucket', () => {
      const bucket = createDefaultBucket('terms', 'category');
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when field is empty', () => {
      const bucket = createDefaultBucket('terms', '');
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The field is required');
    });

    it('should validate histogram interval', () => {
      const bucket = createDefaultBucket('histogram', 'price');
      bucket.interval = 0;
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('interval'))).toBe(true);
    });

    it('should validate date_histogram dateInterval', () => {
      const bucket = createDefaultBucket('date_histogram', 'timestamp');
      bucket.dateInterval = undefined;
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
    });

    it('should validate range bucket has ranges', () => {
      const bucket = createDefaultBucket('range', 'price');
      bucket.ranges = [];
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('range'))).toBe(true);
    });

    it('should validate size is positive', () => {
      const bucket = createDefaultBucket('terms', 'category');
      bucket.size = -1;
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
    });
  });

  describe('generateBucketLabel', () => {
    it('should return custom label when provided', () => {
      const bucket = createDefaultBucket('terms', 'category');
      bucket.label = 'Custom Label';
      expect(generateBucketLabel(bucket)).toBe('Custom Label');
    });

    it('should generate label from type and field', () => {
      const bucket = createDefaultBucket('terms', 'category');
      bucket.label = '';
      const label = generateBucketLabel(bucket);
      expect(label).toContain('Terms');
      expect(label).toContain('category');
    });
  });

  describe('createDefaultRange', () => {
    it('should create range with default values', () => {
      const range = createDefaultRange();
      expect(range).toEqual({ from: 0, to: 100, label: '' });
    });
  });

  describe('isSplitBucket', () => {
    it('should return true for split_series', () => {
      const bucket = createDefaultBucket('split_series', 'category');
      expect(isSplitBucket(bucket)).toBe(true);
    });

    it('should return true for split_rows', () => {
      const bucket = createDefaultBucket('split_rows', 'category');
      expect(isSplitBucket(bucket)).toBe(true);
    });

    it('should return true for split_chart', () => {
      const bucket = createDefaultBucket('split_chart', 'category');
      expect(isSplitBucket(bucket)).toBe(true);
    });

    it('should return false for terms bucket', () => {
      const bucket = createDefaultBucket('terms', 'category');
      expect(isSplitBucket(bucket)).toBe(false);
    });

    it('should return false for histogram bucket', () => {
      const bucket = createDefaultBucket('histogram', 'price');
      expect(isSplitBucket(bucket)).toBe(false);
    });
  });

  describe('getSplitType', () => {
    it('should return series for split_series bucket', () => {
      const bucket = createDefaultBucket('split_series', 'category');
      expect(getSplitType(bucket)).toBe('series');
    });

    it('should return rows for split_rows bucket', () => {
      const bucket = createDefaultBucket('split_rows', 'category');
      expect(getSplitType(bucket)).toBe('rows');
    });

    it('should return chart for split_chart bucket', () => {
      const bucket = createDefaultBucket('split_chart', 'category');
      expect(getSplitType(bucket)).toBe('chart');
    });

    it('should return null for non-split bucket', () => {
      const bucket = createDefaultBucket('terms', 'category');
      expect(getSplitType(bucket)).toBeNull();
    });
  });

  describe('validateBucket edge cases', () => {
    it('should validate histogram with negative interval', () => {
      const bucket = createDefaultBucket('histogram', 'price');
      bucket.interval = -10;
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
    });

    it('should validate bucket size is positive', () => {
      const bucket = createDefaultBucket('terms', 'category');
      bucket.size = -5;
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('size'))).toBe(true);
    });

    it('should validate range bucket with empty ranges', () => {
      const bucket = createDefaultBucket('range', 'price');
      bucket.ranges = [];
      const result = validateBucket(bucket);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('range'))).toBe(true);
    });
  });
});
