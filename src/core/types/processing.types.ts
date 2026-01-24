import type { AuthType, AuthConfig } from './datasource.types';

export interface MetricDefinition {
  field: string;
  type: 'sum' | 'avg' | 'count' | 'min' | 'max';
  alias?: string;
}

export interface BucketDefinition {
  field: string;
  format?: string;
}

export interface FilterDefinition {
  field: string;
  operator: string;
  value: unknown;
}

export interface FetchDataOptions {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  fields?: string;
}

export interface FetchDataResult {
  data: Record<string, unknown>[];
  total: number;
}

export interface AggregateConfig {
  metrics: MetricDefinition[];
  buckets?: BucketDefinition[];
  filters?: FilterDefinition[];
  from?: string;
  to?: string;
}

export interface AggregateResult {
  data: Record<string, unknown>[];
}

export interface DetectColumnsConfig {
  type: string;
  endpoint?: string;
  filePath?: string;
  httpMethod?: 'GET' | 'POST';
  authType?: AuthType;
  authConfig?: AuthConfig;
  esIndex?: string;
}

export interface DetectColumnsResult {
  columns: string[];
  types: Record<string, string>;
  preview: Record<string, unknown>[];
}

export interface ColumnStats {
  name: string;
  type: string;
  nullable: boolean;
  uniqueCount: number;
  totalCount: number;
  cardinality: number;
  samples: unknown[];
  emptyCount: number;
  minValue?: number | string;
  maxValue?: number | string;
  avgValue?: number;
}

export interface SchemaAnalysisResult {
  columns: ColumnStats[];
  rowCount: number;
  analyzedAt: string;
  dataSourceId: string;
}

export interface AnalyzeSchemaOptions {
  sampleSize?: number;
}

export interface QuickSchemaResult {
  columns: {
    name: string;
    type: string;
  }[];
}
