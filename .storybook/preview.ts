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

        const storyRoot = document.getElementById('storybook-root');
        if (storyRoot) {
          storyRoot.style.backgroundColor = isDark ? '#111827' : '#ffffff';
          storyRoot.style.minHeight = '100vh';
          storyRoot.style.transition = 'background-color 0.2s ease';
        }
        document.body.style.backgroundColor = isDark ? '#111827' : '#ffffff';
        document.body.style.transition = 'background-color 0.2s ease';
        document.body.style.color = isDark ? '#f9fafb' : '#111827';

        const docsContainer = document.querySelector('.sbdocs-wrapper');
        if (docsContainer) {
          (docsContainer as HTMLElement).style.backgroundColor = isDark ? '#111827' : '#ffffff';
          (docsContainer as HTMLElement).style.color = isDark ? '#f9fafb' : '#111827';
        }

        const docsContent = document.querySelector('.sbdocs-content');
        if (docsContent) {
          (docsContent as HTMLElement).style.backgroundColor = isDark ? '#111827' : '#ffffff';
          (docsContent as HTMLElement).style.color = isDark ? '#f9fafb' : '#111827';
        }

        document
          .querySelectorAll('.sbdocs, .sbdocs-wrapper, .sbdocs-content, .docs-story')
          .forEach(el => {
            (el as HTMLElement).style.backgroundColor = isDark ? '#111827' : '#ffffff';
            (el as HTMLElement).style.color = isDark ? '#f9fafb' : '#111827';
          });

        document
          .querySelectorAll('.docblock-code-toggle, .docblock-argstable, table, th, td, pre, code')
          .forEach(el => {
            (el as HTMLElement).style.backgroundColor = isDark ? '#1f2937' : '#f9fafb';
            (el as HTMLElement).style.color = isDark ? '#f9fafb' : '#111827';
            (el as HTMLElement).style.borderColor = isDark ? '#374151' : '#e5e7eb';
          });

        try {
          const managerIframe = window.parent.document;
          if (managerIframe) {
            managerIframe.documentElement.style.setProperty(
              '--storybook-background',
              isDark ? '#111827' : '#f9fafb',
            );
          }
        } catch {
          /* */
        }
      }, [isDark, theme]);

      return createElement(
        'div',
        {
          className: `min-h-32 w-full p-4 transition-colors`,
          style: { backgroundColor: isDark ? '#111827' : '#ffffff' },
        },
        createElement(Story),
      );
    },
  ],
};

export default preview;
