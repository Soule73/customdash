import { useMutation, useQuery } from '@tanstack/react-query';
import { processingService } from '@services/index';
import type {
  FetchDataOptions,
  AggregateConfig,
  DetectColumnsConfig,
  AnalyzeSchemaOptions,
} from '@type/processing.types';

export const processingKeys = {
  all: ['processing'] as const,
  data: (dataSourceId: string, options?: FetchDataOptions) =>
    [...processingKeys.all, 'data', dataSourceId, options] as const,
  schema: (dataSourceId: string) => [...processingKeys.all, 'schema', dataSourceId] as const,
  quickSchema: (dataSourceId: string) =>
    [...processingKeys.all, 'quickSchema', dataSourceId] as const,
};

export function useFetchData(dataSourceId: string, options?: FetchDataOptions) {
  return useQuery({
    queryKey: processingKeys.data(dataSourceId, options),
    queryFn: () => processingService.fetchData(dataSourceId, options),
    enabled: !!dataSourceId,
  });
}

export function useAggregate() {
  return useMutation({
    mutationFn: ({ dataSourceId, config }: { dataSourceId: string; config: AggregateConfig }) =>
      processingService.aggregate(dataSourceId, config),
  });
}

export function useDetectColumns() {
  return useMutation({
    mutationFn: (config: DetectColumnsConfig) => processingService.detectColumns(config),
  });
}

export function useAnalyzeSchema(dataSourceId: string, options?: AnalyzeSchemaOptions) {
  return useQuery({
    queryKey: processingKeys.schema(dataSourceId),
    queryFn: () => processingService.analyzeSchema(dataSourceId, options),
    enabled: !!dataSourceId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useQuickAnalyze(dataSourceId: string) {
  return useQuery({
    queryKey: processingKeys.quickSchema(dataSourceId),
    queryFn: () => processingService.quickAnalyze(dataSourceId),
    enabled: !!dataSourceId,
    staleTime: 1000 * 60 * 10,
  });
}
