import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataSourceService } from '@services/index';
import type { CreateDataSourceData, UpdateDataSourceData } from '@type/datasource.types';

export const dataSourceKeys = {
  all: ['datasources'] as const,
  lists: () => [...dataSourceKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...dataSourceKeys.lists(), filters] as const,
  details: () => [...dataSourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...dataSourceKeys.details(), id] as const,
};

export function useDataSources() {
  return useQuery({
    queryKey: dataSourceKeys.list(),
    queryFn: () => dataSourceService.getAll(),
  });
}

export function useDataSource(id: string) {
  return useQuery({
    queryKey: dataSourceKeys.detail(id),
    queryFn: () => dataSourceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDataSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDataSourceData) => dataSourceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataSourceKeys.lists() });
    },
  });
}

export function useUpdateDataSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDataSourceData }) =>
      dataSourceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dataSourceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: dataSourceKeys.lists() });
    },
  });
}

export function useUploadCsv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, name }: { file: File; name?: string }) =>
      dataSourceService.uploadCsv(file, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataSourceKeys.lists() });
    },
  });
}

export function useDeleteDataSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataSourceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataSourceKeys.lists() });
    },
  });
}
