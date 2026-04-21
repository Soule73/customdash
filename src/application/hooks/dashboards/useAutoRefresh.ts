import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDashboardFormStore } from '@stores/dashboardFormStore';

const INTERVAL_MS: Record<string, number> = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
};

/**
 * Periodically invalidates the widget-data query cache when auto-refresh is enabled.
 * Uses the interval configuration from the dashboard form store.
 */
export function useAutoRefresh(): void {
  const queryClient = useQueryClient();
  const autoRefresh = useDashboardFormStore(s => s.config.autoRefresh);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!autoRefresh.enabled || !autoRefresh.intervalValue) return;

    const unitMs = INTERVAL_MS[autoRefresh.intervalUnit ?? 'minute'] ?? INTERVAL_MS.minute;
    const delayMs = autoRefresh.intervalValue * unitMs;

    intervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['widget-data'] });
    }, delayMs);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh.enabled, autoRefresh.intervalValue, autoRefresh.intervalUnit, queryClient]);
}
