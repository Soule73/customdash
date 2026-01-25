import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Squares2X2Icon,
  ChartBarIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { Button, Avatar, Tooltip } from '@customdash/ui';
import { cn } from '@customdash/utils';
import { Logo, ThemeToggle, LanguageSelector } from '@components/common';
import { useAuthStore } from '@stores/authStore';
import { useLogout } from '@hooks/index';
import { useAppTranslation, type TranslationKey } from '@hooks/useAppTranslation';

interface NavItem {
  nameKey: TranslationKey;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { nameKey: 'navigation.dashboards', href: '/dashboards', icon: Squares2X2Icon },
  { nameKey: 'navigation.widgets', href: '/widgets', icon: ChartBarIcon },
  { nameKey: 'navigation.datasources', href: '/datasources', icon: CircleStackIcon },
  { nameKey: 'navigation.aiAssistant', href: '/ai', icon: ChatBubbleLeftRightIcon },
];

const bottomNav: NavItem[] = [
  { nameKey: 'navigation.settings', href: '/settings', icon: Cog6ToothIcon },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
          'lg:static lg:translate-x-0 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        <div
          className={cn(
            'flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-800',
            collapsed ? 'justify-center px-2' : 'justify-between px-4',
          )}
        >
          {collapsed ? <Logo size="sm" showText={false} /> : <Logo size="sm" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto p-3">
          <div className="flex-1 space-y-1">
            {navigation.map(item => (
              <Tooltip
                key={item.nameKey}
                content={t(item.nameKey)}
                position="right"
                disabled={!collapsed}
                className={collapsed ? '' : 'w-full'}
              >
                <NavLink
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-600 dark:bg-primary-500" />
                      )}
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0 transition-transform duration-200',
                          !isActive && 'group-hover:scale-110',
                        )}
                      />
                      {!collapsed && <span>{t(item.nameKey)}</span>}
                    </>
                  )}
                </NavLink>
              </Tooltip>
            ))}
          </div>

          <div className="mt-auto space-y-3 border-t border-gray-200 pt-3 dark:border-gray-800">
            {bottomNav.map(item => (
              <Tooltip
                key={item.nameKey}
                content={t(item.nameKey)}
                position="right"
                disabled={!collapsed}
                className={collapsed ? '' : 'w-full'}
              >
                <NavLink
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-600 dark:bg-primary-500" />
                      )}
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0 transition-transform duration-200',
                          !isActive && 'group-hover:scale-110',
                        )}
                      />
                      {!collapsed && <span>{t(item.nameKey)}</span>}
                    </>
                  )}
                </NavLink>
              </Tooltip>
            ))}

            <div
              className={cn(
                'flex items-center gap-2',
                collapsed ? 'flex-col' : 'justify-between px-1',
              )}
            >
              <Tooltip content={t('layout.theme')} position="right" disabled={!collapsed}>
                <ThemeToggle />
              </Tooltip>
              {!collapsed && <LanguageSelector className="w-28" />}
              {collapsed && (
                <Tooltip content={t('layout.language')} position="right">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
              )}
            </div>

            <Tooltip
              content={collapsed ? t('layout.expand') : t('layout.collapse')}
              position="right"
              disabled={!collapsed}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  'hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                  collapsed && 'justify-center px-2',
                )}
              >
                {collapsed ? (
                  <ChevronRightIcon className="h-5 w-5 shrink-0" />
                ) : (
                  <>
                    <ChevronLeftIcon className="h-5 w-5 shrink-0" />
                    <span>{t('layout.collapse')}</span>
                  </>
                )}
              </Button>
            </Tooltip>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Tooltip content={user?.username || t('layout.user')} position="right">
                <Avatar size="sm" name={user?.username || t('layout.user')} />
              </Tooltip>
              <Tooltip content={t('auth.logout')} position="right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <Avatar size="sm" name={user?.username || t('layout.user')} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username || t('layout.user')}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || ''}
                </p>
              </div>
              <Tooltip content={t('auth.logout')} position="top">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="shrink-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-5 w-5" />
          </Button>

          <Logo size="sm" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
