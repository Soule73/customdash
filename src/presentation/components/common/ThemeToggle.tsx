import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@customdash/ui';
import { useAppTranslation } from '@hooks';
import { useAppStore } from '@stores/appStore';

export function ThemeToggle() {
  const { t } = useAppTranslation();
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
