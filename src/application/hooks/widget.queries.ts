import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { widgetService } from '@services/index';
import type { CreateWidgetData, UpdateWidgetData } from '@type/widget.types';

export const widgetKeys = {
  all: ['widgets'] as const,
  lists: () => [...widgetKeys.all, 'list'] as const,
  list: (filters?: { dataSourceId?: string }) => [...widgetKeys.lists(), filters] as const,
  details: () => [...widgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...widgetKeys.details(), id] as const,
};

export function useWidgets(dataSourceId?: string) {
  return useQuery({
    queryKey: widgetKeys.list({ dataSourceId }),
    queryFn: () => widgetService.getAll(dataSourceId),
  });
}

export function useWidget(id: string) {
  return useQuery({
    queryKey: widgetKeys.detail(id),
    queryFn: () => widgetService.getById(id),
    enabled: !!id,
  });
}

export function useCreateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWidgetData) => widgetService.create(data),
    onSuccess: widget => {
      queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
      queryClient.setQueryData(widgetKeys.detail(widget.id), widget);
    },
  });
}

export function useUpdateWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWidgetData }) =>
      widgetService.update(id, data),
    onSuccess: (widget, variables) => {
      queryClient.setQueryData(widgetKeys.detail(variables.id), widget);
      queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
    },
  });
}

export function useDeleteWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => widgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: widgetKeys.lists() });
    },
  });
}
