import { useSharedDashboard } from '../queries';

interface UseDashboardShareViewReturn {
  dashboard: NonNullable<ReturnType<typeof useSharedDashboard>['data']> | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Loads a public dashboard share.
 */
export function useDashboardShareView(shareId?: string): UseDashboardShareViewReturn {
  const { data: dashboard, isLoading, error } = useSharedDashboard(shareId ?? '');

  return {
    dashboard,
    isLoading: !!shareId && isLoading,
    error: error as Error | null,
  };
}
