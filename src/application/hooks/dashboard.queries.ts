import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@services/index';
import type { CreateDashboardData, UpdateDashboardData, LayoutItem } from '@type/dashboard.types';

export const dashboardKeys = {
  all: ['dashboards'] as const,
  lists: () => [...dashboardKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...dashboardKeys.lists(), filters] as const,
  details: () => [...dashboardKeys.all, 'detail'] as const,
  detail: (id: string) => [...dashboardKeys.details(), id] as const,
};

export function useDashboards() {
  return useQuery({
    queryKey: dashboardKeys.list(),
    queryFn: () => dashboardService.getAll(),
  });
}

export function useDashboard(id: string) {
  return useQuery({
    queryKey: dashboardKeys.detail(id),
    queryFn: () => dashboardService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDashboardData) => dashboardService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDashboardData }) =>
      dashboardService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
    },
  });
}

export function useUpdateDashboardLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, layout }: { id: string; layout: LayoutItem[] }) =>
      dashboardService.updateLayout(id, layout),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.detail(variables.id) });
    },
  });
}

export function useShareDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, shareEnabled }: { id: string; shareEnabled: boolean }) =>
      dashboardService.share(id, shareEnabled),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.detail(variables.id) });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
    },
  });
}
