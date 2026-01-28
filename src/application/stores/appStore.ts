import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@core/i18n';
import { STORAGE_KEYS } from '@/core/constants';
import type { AppStore, Theme, Language, LayoutStyles } from '@type/app.types';

const DEFAULT_LAYOUT_STYLES: LayoutStyles = {
  padding: '24px',
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (theme === 'dark' || (theme === 'system' && systemDark)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const applyLanguage = (language: Language) => {
  i18n.changeLanguage(language);
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      language: 'fr',
      layoutStyles: DEFAULT_LAYOUT_STYLES,
      isLayoutStylesOverridden: false,

      setTheme: (theme: Theme) => {
        applyTheme(theme);
        set({ theme });
      },

      setLanguage: (language: Language) => {
        applyLanguage(language);
        set({ language });
      },

      setLayoutStyles: (styles: Partial<LayoutStyles>) => {
        set(state => ({
          layoutStyles: { ...state.layoutStyles, ...styles },
          isLayoutStylesOverridden: true,
        }));
      },

      resetLayoutStyles: () => {
        set({
          layoutStyles: DEFAULT_LAYOUT_STYLES,
          isLayoutStylesOverridden: false,
        });
      },

      reset: () => {
        const { theme, language } = get();
        set({
          theme,
          language,
          layoutStyles: DEFAULT_LAYOUT_STYLES,
          isLayoutStylesOverridden: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: state => ({
        theme: state.theme,
        language: state.language,
      }),
    },
  ),
);
