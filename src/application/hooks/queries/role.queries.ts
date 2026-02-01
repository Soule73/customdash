import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@services/index';
import { roleKeys } from './keys';
import type { CreateRoleData, UpdateRoleData } from '@type/role.types';

// Re-export for backwards compatibility
export { roleKeys };

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => roleService.getAll(),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleService.getById(id),
    enabled: !!id,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: [...roleKeys.all, 'permissions'] as const,
    queryFn: () => roleService.getAllPermissions(),
    staleTime: 1000 * 60 * 30,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) => roleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) =>
      roleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}
