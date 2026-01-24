import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@customdash/ui';
import { getLocalStorage, setLocalStorage } from '@customdash/utils';
import { useAppTranslation } from '@hooks/useAppTranslation';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const { t } = useAppTranslation();
  const [theme, setTheme] = useState<Theme>(() => {
    return getLocalStorage<Theme>('theme', 'system');
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && systemDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setLocalStorage('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Tooltip content={isDark ? t('layout.lightMode') : t('layout.darkMode')} position="bottom">
      <Button variant="ghost" size="sm" onClick={toggleTheme}>
        {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </Button>
    </Tooltip>
  );
}
