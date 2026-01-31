import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthLayout, AppLayout } from '@/presentation/layouts';
import { RequireAuth, GuestOnly } from '@components/common';
import { useAppStore } from '@stores/appStore';
import {
  LoginPage,
  DashboardsPage,
  DashboardPage,
  WidgetsPage,
  WidgetCreatePage,
  WidgetEditPage,
  DataSourcesPage,
  DataSourceCreatePage,
  DataSourceEditPage,
  AIPage,
  SettingsPage,
  NotFoundPage,
} from '@pages/index';

function useInitializeApp() {
  const theme = useAppStore(s => s.theme);
  const language = useAppStore(s => s.language);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && systemDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
}

function App() {
  useInitializeApp();
  const theme = useAppStore(s => s.theme);

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={theme === 'system' ? 'system' : theme}
        toastOptions={{
          duration: 4000,
          className: 'font-sans',
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboards" replace />} />

        <Route
          element={
            <GuestOnly>
              <AuthLayout />
            </GuestOnly>
          }
        >
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/dashboards/new" element={<DashboardPage />} />
          <Route path="/dashboards/:id" element={<DashboardPage />} />
          <Route path="/widgets" element={<WidgetsPage />} />
          <Route path="/widgets/new" element={<WidgetCreatePage />} />
          <Route path="/widgets/:id/edit" element={<WidgetEditPage />} />
          <Route path="/datasources" element={<DataSourcesPage />} />
          <Route path="/datasources/new" element={<DataSourceCreatePage />} />
          <Route path="/datasources/:id/edit" element={<DataSourceEditPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
