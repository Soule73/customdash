import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import type { ReactNode } from 'react';

interface GuestOnlyProps {
  children: ReactNode;
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboards';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
