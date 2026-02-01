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
      layoutStyles: { padding: '24px' },
      isLayoutStylesOverridden: false,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useAppStore.getState();
      expect(state.theme).toBe('system');
      expect(state.language).toBe('fr');
      expect(state.layoutStyles).toEqual({ padding: '24px' });
      expect(state.isLayoutStylesOverridden).toBe(false);
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

  describe('setLayoutStyles', () => {
    it('should update layout styles', () => {
      useAppStore.getState().setLayoutStyles({
        backgroundColor: '#ff0000',
        padding: '16px',
      });

      const state = useAppStore.getState();
      expect(state.layoutStyles.backgroundColor).toBe('#ff0000');
      expect(state.layoutStyles.padding).toBe('16px');
      expect(state.isLayoutStylesOverridden).toBe(true);
    });

    it('should merge with existing styles', () => {
      useAppStore.getState().setLayoutStyles({ backgroundColor: '#ff0000' });
      useAppStore.getState().setLayoutStyles({ backgroundGradient: 'linear-gradient(...)' });

      const state = useAppStore.getState();
      expect(state.layoutStyles.backgroundColor).toBe('#ff0000');
      expect(state.layoutStyles.backgroundGradient).toBe('linear-gradient(...)');
    });
  });

  describe('resetLayoutStyles', () => {
    it('should reset layout styles to default', () => {
      useAppStore.getState().setLayoutStyles({
        backgroundColor: '#ff0000',
        padding: '16px',
      });

      useAppStore.getState().resetLayoutStyles();

      const state = useAppStore.getState();
      expect(state.layoutStyles).toEqual({ padding: '24px' });
      expect(state.isLayoutStylesOverridden).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset layout but keep theme and language', () => {
      useAppStore.getState().setTheme('dark');
      useAppStore.getState().setLanguage('en');
      useAppStore.getState().setLayoutStyles({ backgroundColor: '#ff0000' });

      useAppStore.getState().reset();

      const state = useAppStore.getState();
      expect(state.theme).toBe('dark');
      expect(state.language).toBe('en');
      expect(state.layoutStyles).toEqual({ padding: '24px' });
      expect(state.isLayoutStylesOverridden).toBe(false);
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
