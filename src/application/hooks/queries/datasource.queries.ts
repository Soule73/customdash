import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataSourceService } from '@services/index';
import { dataSourceKeys } from './keys';
import type { CreateDataSourceData, UpdateDataSourceData } from '@type/datasource.types';

// Re-export for backwards compatibility
export { dataSourceKeys };

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
