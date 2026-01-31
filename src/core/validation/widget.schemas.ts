/**
 * Widget validation schemas
 * @module core/validation/widget
 */
import { z } from 'zod';
import { nameSchema, descriptionSchema, visibilitySchema } from './common.schemas';

// =============================================================================
// WIDGET TYPE ENUM
// =============================================================================

export const widgetTypeSchema = z.enum([
  'kpi',
  'card',
  'kpiGroup',
  'bar',
  'line',
  'pie',
  'table',
  'radar',
  'bubble',
  'scatter',
]);

export type WidgetTypeEnum = z.infer<typeof widgetTypeSchema>;

// =============================================================================
// AGGREGATION ENUM
// =============================================================================

export const aggregationTypeSchema = z.enum(['sum', 'avg', 'count', 'min', 'max', 'first', 'last']);

export type AggregationTypeEnum = z.infer<typeof aggregationTypeSchema>;

// =============================================================================
// WIDGET FORM BASE SCHEMA
// =============================================================================

/**
 * Base widget form validation schema
 */
export const widgetFormBaseSchema = z.object({
  title: nameSchema,
  description: descriptionSchema,
  type: widgetTypeSchema,
  dataSourceId: z.string().min(1, 'validation.datasourceRequired'),
  visibility: visibilitySchema,
});

export type WidgetFormBaseData = z.infer<typeof widgetFormBaseSchema>;

// =============================================================================
// METRIC SCHEMA
// =============================================================================

/**
 * Metric configuration schema
 */
export const metricConfigSchema = z.object({
  id: z.string(),
  field: z.string().min(1, 'validation.fieldRequired'),
  aggregation: aggregationTypeSchema,
  label: z.string().optional(),
});

export type MetricConfigData = z.infer<typeof metricConfigSchema>;

// =============================================================================
// BUCKET SCHEMA
// =============================================================================

/**
 * Bucket configuration schema
 */
export const bucketConfigSchema = z.object({
  id: z.string(),
  field: z.string().min(1, 'validation.fieldRequired'),
  type: z.enum(['terms', 'date_histogram', 'histogram']).default('terms'),
  order: z.enum(['asc', 'desc']).default('desc'),
  size: z.number().min(1).max(1000).default(10),
});

export type BucketConfigData = z.infer<typeof bucketConfigSchema>;

// =============================================================================
// FILTER SCHEMA
// =============================================================================

export const filterOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_than_or_equals',
  'less_than_or_equals',
  'between',
  'in',
  'not_in',
  'is_null',
  'is_not_null',
]);

export type FilterOperatorEnum = z.infer<typeof filterOperatorSchema>;

/**
 * Filter configuration schema
 */
export const filterConfigSchema = z.object({
  id: z.string(),
  field: z.string().min(1, 'validation.fieldRequired'),
  operator: filterOperatorSchema,
  value: z.unknown(),
});

export type FilterConfigData = z.infer<typeof filterConfigSchema>;

// =============================================================================
// WIDGET STYLE SCHEMA
// =============================================================================

/**
 * Metric style configuration schema
 */
export const metricStyleSchema = z.object({
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().min(0).optional(),
  tension: z.number().min(0).max(1).optional(),
  fill: z.boolean().optional(),
  pointRadius: z.number().min(0).optional(),
  pointStyle: z.string().optional(),
});

export type MetricStyleData = z.infer<typeof metricStyleSchema>;

// =============================================================================
// CREATE/UPDATE WIDGET SCHEMAS
// =============================================================================

/**
 * Create widget form validation schema
 */
export const createWidgetSchema = z.object({
  title: nameSchema,
  description: descriptionSchema,
  type: widgetTypeSchema,
  dataSourceId: z.string().min(1, 'validation.datasourceRequired'),
  visibility: visibilitySchema,
  config: z.record(z.string(), z.unknown()).optional(),
});

export type CreateWidgetFormData = z.infer<typeof createWidgetSchema>;

/**
 * Update widget form validation schema
 */
export const updateWidgetSchema = createWidgetSchema.partial();

export type UpdateWidgetFormData = z.infer<typeof updateWidgetSchema>;
