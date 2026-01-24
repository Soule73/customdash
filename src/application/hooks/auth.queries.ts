import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@services/index';
import { useAuthStore } from '@stores/authStore';
import type { LoginCredentials, RegisterData } from '@type/auth.types';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: data => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: data => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      logout();
      queryClient.clear();
    },
  });
}
