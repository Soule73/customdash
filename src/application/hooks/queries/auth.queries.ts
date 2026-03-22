import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, preferencesService } from '@services/index';
import { useAuthStore } from '@stores/authStore';
import { useAppStore } from '@stores/appStore';
import { useUserConfigStore } from '@stores/userConfigStore';
import type { LoginCredentials, RegisterData } from '@type/auth.types';
import type { Theme, Language } from '@type/app.types';
import type { FormatConfig } from '@type/format-config.types';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * Load user preferences from the backend and apply them to local stores
 */
async function loadAndApplyPreferences(): Promise<void> {
  try {
    const prefs = await preferencesService.getPreferences();
    const appStore = useAppStore.getState();
    const userConfigStore = useUserConfigStore.getState();

    // Apply theme if present
    if (prefs.theme) {
      appStore.setTheme(prefs.theme as Theme);
    }

    // Apply language if present
    if (prefs.language) {
      appStore.setLanguage(prefs.language as Language);
    }

    // Apply format config if present
    if (prefs.formatConfig) {
      userConfigStore.updateConfig(prefs.formatConfig as Partial<FormatConfig>);
    }
  } catch {
    // Silently fail - user can still use local preferences
    console.warn('Failed to load preferences from server');
  }
}

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
    onSuccess: async data => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(authKeys.me(), data.user);

      // Load preferences from server after successful login
      await loadAndApplyPreferences();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: async data => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(authKeys.me(), data.user);

      // Load preferences from server after successful registration
      await loadAndApplyPreferences();
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
