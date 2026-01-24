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
} from '@heroicons/react/24/outline';
import { Button, Avatar, Tooltip } from '@customdash/ui';
import { cn } from '@customdash/utils';
import { Logo, ThemeToggle } from '@components/common';
import { useAuthStore } from '@stores/authStore';
import { useLogout } from '@hooks/index';
import { useAppTranslation } from '@hooks/useAppTranslation';

interface NavItem {
  nameKey: string;
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
          'lg:static lg:translate-x-0 transition-all duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          {!collapsed && <Logo size="sm" />}
          {collapsed && (
            <div className="w-full flex justify-center">
              <Logo size="sm" showText={false} />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <div className="flex-1 space-y-1">
            {navigation.map(item => (
              <Tooltip
                key={item.nameKey}
                content={t(item.nameKey)}
                position="right"
                disabled={!collapsed}
              >
                <NavLink
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && t(item.nameKey)}
                </NavLink>
              </Tooltip>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 dark:border-gray-800">
            {bottomNav.map(item => (
              <Tooltip
                key={item.nameKey}
                content={t(item.nameKey)}
                position="right"
                disabled={!collapsed}
              >
                <NavLink
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && t(item.nameKey)}
                </NavLink>
              </Tooltip>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'hidden lg:flex w-full mt-2 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white',
                collapsed && 'justify-center px-2',
              )}
            >
              {collapsed ? (
                <ChevronRightIcon className="h-5 w-5 shrink-0" />
              ) : (
                <>
                  <ChevronLeftIcon className="h-5 w-5 shrink-0" />
                  {t('layout.collapse')}
                </>
              )}
            </Button>
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>

          <div className="flex-1 lg:ml-0" />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="flex items-center gap-2 border-l border-gray-200 pl-3 dark:border-gray-700">
              <Avatar size="sm" name={user?.username || t('layout.user')} />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username || t('layout.user')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
              </div>
              <Tooltip content={t('auth.logout')} position="bottom">
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
