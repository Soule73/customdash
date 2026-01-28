import type { DashboardStyles, LayoutItemStyles } from '@type/dashboard.types';

export type ThemeNameKey =
  | 'dashboards.themes.default'
  | 'dashboards.themes.dark'
  | 'dashboards.themes.ocean'
  | 'dashboards.themes.sunset'
  | 'dashboards.themes.forest'
  | 'dashboards.themes.purpleHaze'
  | 'dashboards.themes.minimal'
  | 'dashboards.themes.corporate'
  | 'dashboards.themes.neon'
  | 'dashboards.themes.roseGold';

export interface DashboardTheme {
  id: string;
  nameKey: ThemeNameKey;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
  dashboardStyles: DashboardStyles;
  widgetStyles: LayoutItemStyles;
}

export const DASHBOARD_THEMES: DashboardTheme[] = [
  {
    id: 'default',
    nameKey: 'dashboards.themes.default',
    preview: {
      primary: '#f3f4f6',
      secondary: '#ffffff',
      accent: '#3b82f6',
    },
    dashboardStyles: {
      backgroundColor: '#f3f4f6',
      padding: '24px',
      gap: '16px',
      titleFontSize: '24px',
      titleColor: '#111827',
    },
    widgetStyles: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: '#e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '16px',
      textColor: '#111827',
      labelColor: '#6b7280',
      gridColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  {
    id: 'dark',
    nameKey: 'dashboards.themes.dark',
    preview: {
      primary: '#111827',
      secondary: '#1f2937',
      accent: '#6366f1',
    },
    dashboardStyles: {
      backgroundColor: '#111827',
      padding: '24px',
      gap: '16px',
      titleFontSize: '24px',
      titleColor: '#f9fafb',
    },
    widgetStyles: {
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      borderWidth: '1px',
      borderColor: '#374151',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      padding: '16px',
      textColor: '#f9fafb',
      labelColor: '#9ca3af',
      gridColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  {
    id: 'ocean',
    nameKey: 'dashboards.themes.ocean',
    preview: {
      primary: '#0f172a',
      secondary: '#1e3a5f',
      accent: '#0ea5e9',
    },
    dashboardStyles: {
      backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      padding: '24px',
      gap: '20px',
      titleFontSize: '28px',
      titleColor: '#e0f2fe',
    },
    widgetStyles: {
      backgroundColor: 'rgba(30, 58, 95, 0.8)',
      borderRadius: '16px',
      borderWidth: '1px',
      borderColor: '#0ea5e9',
      boxShadow: '0 8px 32px rgba(14, 165, 233, 0.15)',
      padding: '20px',
      textColor: '#e0f2fe',
      labelColor: '#7dd3fc',
      gridColor: 'rgba(14, 165, 233, 0.2)',
    },
  },
  {
    id: 'sunset',
    nameKey: 'dashboards.themes.sunset',
    preview: {
      primary: '#fef3c7',
      secondary: '#ffffff',
      accent: '#f97316',
    },
    dashboardStyles: {
      backgroundGradient: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)',
      padding: '24px',
      gap: '16px',
      titleFontSize: '26px',
      titleColor: '#9a3412',
    },
    widgetStyles: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      borderWidth: '2px',
      borderColor: '#fdba74',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
      padding: '16px',
      textColor: '#7c2d12',
      labelColor: '#c2410c',
      gridColor: 'rgba(249, 115, 22, 0.15)',
    },
  },
  {
    id: 'forest',
    nameKey: 'dashboards.themes.forest',
    preview: {
      primary: '#14532d',
      secondary: '#166534',
      accent: '#22c55e',
    },
    dashboardStyles: {
      backgroundGradient: 'linear-gradient(180deg, #14532d 0%, #166534 100%)',
      padding: '24px',
      gap: '18px',
      titleFontSize: '26px',
      titleColor: '#dcfce7',
    },
    widgetStyles: {
      backgroundColor: 'rgba(22, 101, 52, 0.7)',
      borderRadius: '10px',
      borderWidth: '1px',
      borderColor: '#22c55e',
      boxShadow: '0 6px 24px rgba(34, 197, 94, 0.2)',
      padding: '18px',
      textColor: '#dcfce7',
      labelColor: '#86efac',
      gridColor: 'rgba(34, 197, 94, 0.2)',
    },
  },
  {
    id: 'purple-haze',
    nameKey: 'dashboards.themes.purpleHaze',
    preview: {
      primary: '#581c87',
      secondary: '#7c3aed',
      accent: '#c084fc',
    },
    dashboardStyles: {
      backgroundGradient: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)',
      padding: '28px',
      gap: '20px',
      titleFontSize: '28px',
      titleColor: '#f3e8ff',
    },
    widgetStyles: {
      backgroundColor: 'rgba(124, 58, 237, 0.6)',
      backgroundGradient:
        'linear-gradient(145deg, rgba(124, 58, 237, 0.8), rgba(168, 85, 247, 0.6))',
      borderRadius: '16px',
      borderWidth: '1px',
      borderColor: '#c084fc',
      boxShadow: '0 8px 32px rgba(168, 85, 247, 0.25)',
      padding: '20px',
      textColor: '#f3e8ff',
      labelColor: '#d8b4fe',
      gridColor: 'rgba(192, 132, 252, 0.2)',
    },
  },
  {
    id: 'minimal',
    nameKey: 'dashboards.themes.minimal',
    preview: {
      primary: '#ffffff',
      secondary: '#fafafa',
      accent: '#000000',
    },
    dashboardStyles: {
      backgroundColor: '#ffffff',
      padding: '32px',
      gap: '24px',
      titleFontSize: '22px',
      titleColor: '#18181b',
    },
    widgetStyles: {
      backgroundColor: '#fafafa',
      borderRadius: '4px',
      borderWidth: '1px',
      borderColor: '#e4e4e7',
      padding: '24px',
      textColor: '#18181b',
      labelColor: '#71717a',
      gridColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  {
    id: 'corporate',
    nameKey: 'dashboards.themes.corporate',
    preview: {
      primary: '#f8fafc',
      secondary: '#ffffff',
      accent: '#0369a1',
    },
    dashboardStyles: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      gap: '16px',
      titleFontSize: '24px',
      titleColor: '#0c4a6e',
    },
    widgetStyles: {
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      borderWidth: '1px',
      borderColor: '#cbd5e1',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      padding: '16px',
      textColor: '#0f172a',
      labelColor: '#64748b',
      gridColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  {
    id: 'neon',
    nameKey: 'dashboards.themes.neon',
    preview: {
      primary: '#09090b',
      secondary: '#18181b',
      accent: '#00ff88',
    },
    dashboardStyles: {
      backgroundColor: '#09090b',
      padding: '24px',
      gap: '20px',
      titleFontSize: '28px',
      titleColor: '#00ff88',
    },
    widgetStyles: {
      backgroundColor: '#18181b',
      borderRadius: '8px',
      borderWidth: '2px',
      borderColor: '#00ff88',
      boxShadow: '0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.05)',
      padding: '16px',
      textColor: '#00ff88',
      labelColor: '#4ade80',
      gridColor: 'rgba(0, 255, 136, 0.15)',
    },
  },
  {
    id: 'rose-gold',
    nameKey: 'dashboards.themes.roseGold',
    preview: {
      primary: '#fdf2f8',
      secondary: '#ffffff',
      accent: '#ec4899',
    },
    dashboardStyles: {
      backgroundGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      padding: '24px',
      gap: '18px',
      titleFontSize: '26px',
      titleColor: '#9d174d',
    },
    widgetStyles: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '14px',
      borderWidth: '2px',
      borderColor: '#f9a8d4',
      boxShadow: '0 6px 20px rgba(236, 72, 153, 0.15)',
      padding: '18px',
      textColor: '#831843',
      labelColor: '#be185d',
      gridColor: 'rgba(236, 72, 153, 0.15)',
    },
  },
];

/**
 * Gets a theme by its ID
 */
export function getThemeById(themeId: string): DashboardTheme | undefined {
  return DASHBOARD_THEMES.find(theme => theme.id === themeId);
}
