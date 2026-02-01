import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@services/index';
import { dashboardKeys } from './keys';
import type { CreateDashboardData, UpdateDashboardData, LayoutItem } from '@type/dashboard.types';

// Re-export for backwards compatibility
export { dashboardKeys };

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
