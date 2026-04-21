export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'fr';

export interface AppSettings {
  theme: Theme;
  language: Language;
}

export type AppState = AppSettings;

export interface AppActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  reset: () => void;
}

export interface AppStore extends AppState, AppActions {}
