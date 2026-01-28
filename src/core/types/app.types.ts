export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'fr';

export interface LayoutStyles {
  backgroundColor?: string;
  backgroundGradient?: string;
  padding?: string;
}

export interface AppSettings {
  theme: Theme;
  language: Language;
  layoutStyles: LayoutStyles;
}

export interface AppState extends AppSettings {
  isLayoutStylesOverridden: boolean;
}

export interface AppActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setLayoutStyles: (styles: Partial<LayoutStyles>) => void;
  resetLayoutStyles: () => void;
  reset: () => void;
}

export interface AppStore extends AppState, AppActions {}
