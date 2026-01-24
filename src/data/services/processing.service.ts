import { httpClient } from './http.client';
import type {
  FetchDataOptions,
  FetchDataResult,
  AggregateConfig,
  DetectColumnsConfig,
  DetectColumnsResult,
  SchemaAnalysisResult,
  AnalyzeSchemaOptions,
  QuickSchemaResult,
} from '@type/processing.types';

function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export const processingService = {
  async fetchData(dataSourceId: string, options?: FetchDataOptions): Promise<FetchDataResult> {
    const queryString = options ? buildQueryString(options) : '';
    const url = `/processing/datasources/${dataSourceId}/data${queryString ? `?${queryString}` : ''}`;
    return httpClient.get<FetchDataResult>(url);
  },

  async aggregate(
    dataSourceId: string,
    config: AggregateConfig,
  ): Promise<Record<string, unknown>[]> {
    const result = await httpClient.post<{ data: Record<string, unknown>[] }>(
      `/processing/datasources/${dataSourceId}/aggregate`,
      config,
    );
    return result.data || [];
  },

  async detectColumns(config: DetectColumnsConfig): Promise<DetectColumnsResult> {
    return httpClient.post<DetectColumnsResult>('/processing/detect-columns', config);
  },

  async analyzeSchema(
    dataSourceId: string,
    options?: AnalyzeSchemaOptions,
  ): Promise<SchemaAnalysisResult> {
    const queryString = options ? buildQueryString(options) : '';
    const url = `/processing/datasources/${dataSourceId}/schema${queryString ? `?${queryString}` : ''}`;
    return httpClient.get<SchemaAnalysisResult>(url);
  },

  async quickAnalyze(dataSourceId: string): Promise<QuickSchemaResult> {
    return httpClient.get<QuickSchemaResult>(
      `/processing/datasources/${dataSourceId}/quick-schema`,
    );
  },
};
