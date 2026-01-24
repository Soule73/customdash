import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout, AppLayout } from '@/presentation/layouts';
import { RequireAuth, GuestOnly } from '@components/common';
import {
  LoginPage,
  DashboardsPage,
  WidgetsPage,
  DataSourcesPage,
  DataSourceCreatePage,
  DataSourceEditPage,
  AIPage,
  SettingsPage,
  NotFoundPage,
} from '@pages/index';

function App() {
  return (
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
        <Route path="/widgets" element={<WidgetsPage />} />
        <Route path="/datasources" element={<DataSourcesPage />} />
        <Route path="/datasources/new" element={<DataSourceCreatePage />} />
        <Route path="/datasources/:id/edit" element={<DataSourceEditPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
