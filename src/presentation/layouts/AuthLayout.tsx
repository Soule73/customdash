import { Outlet } from 'react-router-dom';
import { Logo, ThemeToggle } from '@components/common';
import { useAppTranslation } from '@hooks';

export function AuthLayout() {
  const { t } = useAppTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
        <Logo size="sm" />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <Outlet />
      </main>

      <footer className="flex h-12 items-center justify-center border-t border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        <span>{t('layout.footer')}</span>
      </footer>
    </div>
  );
}
