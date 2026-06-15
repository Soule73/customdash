import { useCallback, useRef } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useAppStore } from '@stores/appStore';
import { useUserConfigStore } from '@stores/userConfigStore';
import { preferencesService, type UserPreferences } from '@services/preferences.service';
import type { Theme, Language } from '@type/app.types';
import type { FormatConfig } from '@type/format-config.types';
import type { AuthState } from '@/core/types';

/**
 * Debounce delay for saving preferences (ms)
 * Prevents too many API calls when user is rapidly changing settings
 */
const DEBOUNCE_DELAY = 1000;

/**
 * Hook for synchronizing user preferences with the backend
 *
 * This hook provides functions to:
 * - Load preferences from the backend on login
 * - Save preferences to the backend with debouncing
 * - Update local stores with backend preferences
 *
 * @example
 * ```tsx
 * const { loadPreferences, savePreferences, isSyncing } = usePreferencesSync();
 *
 * // Load preferences after login
 * await loadPreferences();
 *
 * // Save current preferences to backend
 * await savePreferences();
 * ```
 */
export function usePreferencesSync() {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // App store setters only (avoid reading values in dependencies to prevent loops)
  const setTheme = useAppStore(state => state.setTheme);
  const setLanguage = useAppStore(state => state.setLanguage);

  // User config store - get updateConfig function only
  const updateFormatConfigInStore = useUserConfigStore(state => state.updateConfig);

  /**
   * Load preferences from the backend and apply them to local stores
   * Note: We don't read current values to avoid dependency loops
   */
  const loadPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    if (!isAuthenticated) {
      return null;
    }

    try {
      const prefs = await preferencesService.getPreferences();

      // Apply theme if present
      if (prefs.theme) {
        setTheme(prefs.theme as Theme);
      }

      // Apply language if present
      if (prefs.language) {
        setLanguage(prefs.language as Language);
      }

      // Apply format config if present
      if (prefs.formatConfig) {
        const formatConfig = prefs.formatConfig as Partial<FormatConfig>;
        updateFormatConfigInStore(formatConfig);
      }

      return prefs;
    } catch (error) {
      // Silently fail - user can still use local preferences
      console.warn('Failed to load preferences from server:', error);
      return null;
    }
  }, [isAuthenticated, setTheme, setLanguage, updateFormatConfigInStore]);

  /**
   * Save theme preference immediately
   */
  const saveTheme = useCallback(
    async (newTheme: Theme) => {
      if (!isAuthenticated) return;

      try {
        await preferencesService.updateTheme(newTheme);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    },
    [isAuthenticated],
  );

  /**
   * Save language preference immediately
   */
  const saveLanguage = useCallback(
    async (newLanguage: Language) => {
      if (!isAuthenticated) return;

      try {
        await preferencesService.updateLanguage(newLanguage);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    },
    [isAuthenticated],
  );

  /**
   * Save format config with debouncing
   */
  const saveFormatConfigDebounced = useCallback(
    (formatConfig: Partial<FormatConfig>) => {
      if (!isAuthenticated) return;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          await preferencesService.updateFormatConfig(formatConfig);
        } catch (error) {
          console.warn('Failed to save format config:', error);
        }
      }, DEBOUNCE_DELAY);
    },
    [isAuthenticated],
  );

  return {
    loadPreferences,
    saveTheme,
    saveLanguage,
    saveFormatConfigDebounced,
    isAuthenticated,
  };
}
