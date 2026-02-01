import { httpClient } from './http.client';
import type { Theme, Language } from '@type/app.types';
import type { FormatConfig } from '@type/format-config.types';

/**
 * User preferences as stored in the backend
 */
export interface UserPreferences {
  theme?: Theme;
  language?: Language;
  formatConfig?: Partial<FormatConfig>;
}

/**
 * Preferences service for syncing user preferences with the backend
 *
 * This service handles fetching and updating user preferences stored in MongoDB.
 * Preferences include theme, language, and formatting configuration.
 */
export const preferencesService = {
  /**
   * Get current user's preferences from the backend
   * @returns User preferences or null if not authenticated
   */
  async getPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>('/users/me/preferences');
  },

  /**
   * Update current user's preferences
   * @param preferences - Partial preferences to update (only changed fields)
   * @returns Updated preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return httpClient.patch<UserPreferences>('/users/me/preferences', preferences);
  },

  /**
   * Update theme preference
   * @param theme - Theme value ('light' | 'dark' | 'system')
   */
  async updateTheme(theme: Theme): Promise<UserPreferences> {
    return this.updatePreferences({ theme });
  },

  /**
   * Update language preference
   * @param language - Language value ('fr' | 'en')
   */
  async updateLanguage(language: Language): Promise<UserPreferences> {
    return this.updatePreferences({ language });
  },

  /**
   * Update format configuration
   * @param formatConfig - Partial format config to update
   */
  async updateFormatConfig(formatConfig: Partial<FormatConfig>): Promise<UserPreferences> {
    return this.updatePreferences({ formatConfig });
  },
};
