import type { MultiBucketConfig, RangeConfig, ValidationResult } from '../interfaces';
import { BUCKET_TYPE_OPTIONS } from '../constants';
import type { BucketType, SplitType } from '../types';

/**
 * Creates a default bucket configuration based on the specified type.
 *
 * @param type - The type of bucket to create.
 * @param field - The field associated with the bucket (default is an empty string).
 * @returns A MultiBucketConfig object with default settings for the specified bucket type.
 *
 * @example
 * const defaultTermsBucket = createDefaultBucket('terms', 'category');
 * // Result: {
 * //   field: 'category',
 * //   label: '',
 * //   type: 'terms',
 * //   order: 'desc',
 * //   size: 10,
 * //   minDocCount: 1,
 * // }
 * const defaultHistogramBucket = createDefaultBucket('histogram', 'price');
 * // Result: {
 * //   field: 'price',
 * //   label: '',
 * //   type: 'histogram',
 * //   order: 'desc',
 * //   size: 10,
 * //   minDocCount: 1,
 * //   interval: 1,
 * // }
 * const defaultDateHistogramBucket = createDefaultBucket('date_histogram', 'date');
 * // Result: {
 * //   field: 'date',
 * //   label: '',
 * //   type: 'date_histogram',
 * //   order: 'desc',
 * //   size: 10,
 * //   minDocCount: 1,
 * //   dateInterval: 'day',
 * // }
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
        ranges: [{ from: 0, to: 100, label: 'Range 1' }],
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
 * Validates if a bucket configuration is valid.
 *
 * @param bucket - The bucket configuration to validate.
 * @returns An object containing a boolean indicating validity and a list of error messages.
 *
 * @example
 * const bucket: MultiBucketConfig = {
 *   field: 'price',
 *   type: 'histogram',
 *   interval: 0,
 * };
 * const validation = validateBucket(bucket);
 * // Result: {
 * //   isValid: false,
 * //   errors: ['The interval must be greater than 0'],
 * // }
 */
export function validateBucket(bucket: MultiBucketConfig): ValidationResult {
  const errors: string[] = [];

  if (!bucket.field) {
    errors.push('The field is required');
  }

  if (bucket.type === 'histogram' && (!bucket.interval || bucket.interval <= 0)) {
    errors.push('The interval must be greater than 0');
  }

  if (bucket.type === 'date_histogram' && !bucket.dateInterval) {
    errors.push('The date interval is required');
  }

  if (bucket.type === 'range' && (!bucket.ranges || bucket.ranges.length === 0)) {
    errors.push('At least one range is required');
  }

  if (bucket.size && bucket.size <= 0) {
    errors.push('The size must be greater than 0');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Generates an automatic label for a bucket configuration.
 *
 * @param bucket - The bucket configuration for which to generate the label.
 * @returns The generated label string. If the bucket has a label, it returns that label.
 * Otherwise, it combines the bucket type label and field name.
 *
 * @example
 * const bucket: MultiBucketConfig = {
 *   field: 'category',
 *   type: 'terms',
 * };
 * const label = generateBucketLabel(bucket);
 * // Result: 'Terms - category'
 */
export function generateBucketLabel(bucket: MultiBucketConfig): string {
  const typeLabel = BUCKET_TYPE_OPTIONS.find(t => t.value === bucket.type)?.label || bucket.type;
  return bucket.label || `${typeLabel} - ${bucket.field}`;
}

/**
 * Creates a default range configuration.
 *
 * @returns {RangeConfig} The default range configuration with `from` set to 0, `to` set to 100, and an empty `label`.
 *
 * @example
 * const defaultRange = createDefaultRange();
 * // Result: { from: 0, to: 100, label: '' }
 */
export function createDefaultRange(): RangeConfig {
  return { from: 0, to: 100, label: '' };
}

/**
 * Checks if a bucket is of type split.
 *
 * @param bucket - The bucket configuration to check.
 * @returns True if the bucket type starts with 'split_', otherwise false.
 *
 * @example
 * const bucket: MultiBucketConfig = {
 *   field: 'region',
 *   type: 'split_series',
 * };
 * const isSplit = isSplitBucket(bucket);
 * // Result: true
 */
export function isSplitBucket(bucket: MultiBucketConfig): boolean {
  return bucket.type.startsWith('split_');
}

/**
 * Retrieves the split type of a bucket configuration.
 *
 * @param bucket - The bucket configuration to check.
 * @returns The split type `SplitType` if the bucket is a split bucket, otherwise null.
 *
 * @example
 * const bucket: MultiBucketConfig = {
 *   field: 'region',
 *   type: 'split_series',
 *   splitType: 'series',
 * };
 * const splitType = getSplitType(bucket);
 * // Result: 'series'
 */
export function getSplitType(bucket: MultiBucketConfig): SplitType | null {
  if (!isSplitBucket(bucket)) return null;
  return bucket.splitType || null;
}
