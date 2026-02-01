import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { widgetService } from '@services/index';
import { widgetKeys } from './keys';
import type { CreateWidgetData, UpdateWidgetData } from '@type/widget.types';

// Re-export for backwards compatibility
export { widgetKeys };

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
