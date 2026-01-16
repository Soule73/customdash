import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const lightTheme = create({
  base: 'light',
  brandTitle: 'CustomDash UI',
  brandUrl: '/',

  colorPrimary: '#3b82f6',
  colorSecondary: '#6366f1',

  appBg: '#f9fafb',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  textColor: '#111827',
  textInverseColor: '#ffffff',
  textMutedColor: '#6b7280',

  barTextColor: '#374151',
  barSelectedColor: '#3b82f6',
  barHoverColor: '#6366f1',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#111827',
  inputBorderRadius: 6,

  buttonBg: '#f3f4f6',
  buttonBorder: '#e5e7eb',
  booleanBg: '#e5e7eb',
  booleanSelectedBg: '#3b82f6',
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'CustomDash UI',
  brandUrl: '/',

  colorPrimary: '#60a5fa',
  colorSecondary: '#818cf8',

  appBg: '#111827',
  appContentBg: '#1f2937',
  appPreviewBg: '#111827',
  appBorderColor: '#374151',
  appBorderRadius: 8,

  textColor: '#f9fafb',
  textInverseColor: '#111827',
  textMutedColor: '#9ca3af',

  barTextColor: '#d1d5db',
  barSelectedColor: '#60a5fa',
  barHoverColor: '#818cf8',
  barBg: '#1f2937',

  inputBg: '#374151',
  inputBorder: '#4b5563',
  inputTextColor: '#f9fafb',
  inputBorderRadius: 6,

  buttonBg: '#374151',
  buttonBorder: '#4b5563',
  booleanBg: '#4b5563',
  booleanSelectedBg: '#60a5fa',
});

const getPreferredTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('storybook-theme');
    if (stored === 'dark') return darkTheme;
    if (stored === 'light') return lightTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
  }
  return lightTheme;
};

addons.setConfig({
  theme: getPreferredTheme(),
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
