import type { Preview, ReactRenderer } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { createElement, useEffect } from 'react';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    (Story, context) => {
      const theme = context.globals?.theme || 'light';
      const isDark = theme === 'dark';

      useEffect(() => {
        localStorage.setItem('storybook-theme', theme);

        const root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }

        const storyRoot = document.getElementById('storybook-root');
        if (storyRoot) {
          storyRoot.style.backgroundColor = isDark ? '#0f172a' : '#ffffff';
          storyRoot.style.minHeight = '100vh';
        }

        document.body.style.backgroundColor = isDark ? '#0f172a' : '#ffffff';
        document.body.style.color = isDark ? '#f8fafc' : '#0f172a';

        document.querySelectorAll('.sbdocs-wrapper, .sbdocs-content, .docs-story').forEach(el => {
          (el as HTMLElement).style.backgroundColor = isDark ? '#0f172a' : '#ffffff';
          (el as HTMLElement).style.color = isDark ? '#f8fafc' : '#0f172a';
        });

        document.querySelectorAll('.docblock-argstable').forEach(el => {
          (el as HTMLElement).style.backgroundColor = isDark ? '#1e293b' : '#f8fafc';
        });

        document.querySelectorAll('pre, code').forEach(el => {
          if (!el.closest('.docs-story')) {
            (el as HTMLElement).style.backgroundColor = isDark ? '#1e293b' : '#f1f5f9';
          }
        });
      }, [isDark, theme]);

      return createElement(
        'div',
        {
          className: `min-h-32 w-full p-4 ${isDark ? 'dark' : ''}`,
          style: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
        },
        createElement(Story),
      );
    },
  ],
};

export default preview;
