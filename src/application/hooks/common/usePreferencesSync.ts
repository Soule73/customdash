import { useCallback, useRef } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useAppStore } from '@stores/appStore';
import { useUserConfigStore } from '@stores/userConfigStore';
import { preferencesService, type UserPreferences } from '@services/preferences.service';
import type { Theme, Language } from '@type/app.types';
import type { FormatConfig } from '@type/format-config.types';

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
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // App store selectors
  const theme = useAppStore(state => state.theme);
  const language = useAppStore(state => state.language);
  const setTheme = useAppStore(state => state.setTheme);
  const setLanguage = useAppStore(state => state.setLanguage);

  // User config store selectors
  const userConfigStore = useUserConfigStore();

  /**
   * Load preferences from the backend and apply them to local stores
   */
  const loadPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    if (!isAuthenticated) {
      return null;
    }

    try {
      const prefs = await preferencesService.getPreferences();

      // Apply theme if different from current
      if (prefs.theme && prefs.theme !== theme) {
        setTheme(prefs.theme as Theme);
      }

      // Apply language if different from current
      if (prefs.language && prefs.language !== language) {
        setLanguage(prefs.language as Language);
      }

      // Apply format config if present
      if (prefs.formatConfig) {
        const formatConfig = prefs.formatConfig as Partial<FormatConfig>;
        userConfigStore.updateConfig(formatConfig);
      }

      return prefs;
    } catch (error) {
      // Silently fail - user can still use local preferences
      console.warn('Failed to load preferences from server:', error);
      return null;
    }
  }, [isAuthenticated, theme, language, setTheme, setLanguage, userConfigStore]);

  /**
   * Save current preferences to the backend
   */
  const savePreferences = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const formatConfig: Partial<FormatConfig> = {
        locale: userConfigStore.locale,
        currency: userConfigStore.currency,
        decimals: userConfigStore.decimals,
        dateFormat: userConfigStore.dateFormat,
        nullValue: userConfigStore.nullValue,
        includeTime: userConfigStore.includeTime,
      };

      await preferencesService.updatePreferences({
        theme,
        language,
        formatConfig,
      });
    } catch (error) {
      // Silently fail - preferences are still saved locally
      console.warn('Failed to save preferences to server:', error);
    }
  }, [isAuthenticated, theme, language, userConfigStore]);

  /**
   * Save preferences with debouncing to prevent too many API calls
   */
  const savePreferencesDebounced = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      savePreferences();
    }, DEBOUNCE_DELAY);
  }, [savePreferences]);

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
    savePreferences,
    savePreferencesDebounced,
    saveTheme,
    saveLanguage,
    saveFormatConfigDebounced,
    isAuthenticated,
  };
}
