/**
 * App Store Tests
 * @module application/stores/appStore.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from './appStore';

// Mock i18n
vi.mock('@core/i18n', () => ({
  default: {
    changeLanguage: vi.fn(),
  },
}));

describe('appStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState({
      theme: 'system',
      language: 'fr',
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useAppStore.getState();
      expect(state.theme).toBe('system');
      expect(state.language).toBe('fr');
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      useAppStore.getState().setTheme('dark');
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('should set theme to light', () => {
      useAppStore.getState().setTheme('light');
      expect(useAppStore.getState().theme).toBe('light');
    });

    it('should set theme to system', () => {
      useAppStore.getState().setTheme('dark');
      useAppStore.getState().setTheme('system');
      expect(useAppStore.getState().theme).toBe('system');
    });
  });

  describe('setLanguage', () => {
    it('should set language to en', () => {
      useAppStore.getState().setLanguage('en');
      expect(useAppStore.getState().language).toBe('en');
    });

    it('should set language to fr', () => {
      useAppStore.getState().setLanguage('en');
      useAppStore.getState().setLanguage('fr');
      expect(useAppStore.getState().language).toBe('fr');
    });
  });

  describe('reset', () => {
    it('should keep theme and language', () => {
      useAppStore.getState().setTheme('dark');
      useAppStore.getState().setLanguage('en');

      useAppStore.getState().reset();

      const state = useAppStore.getState();
      expect(state.theme).toBe('dark');
      expect(state.language).toBe('en');
    });
  });

  describe('persist middleware', () => {
    it('should have persist structure', () => {
      const store = useAppStore;
      expect(store.persist).toBeDefined();
      expect(store.persist.getOptions().name).toBe('customdash_theme');
    });
  });
});
