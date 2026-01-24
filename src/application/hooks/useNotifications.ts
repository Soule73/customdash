import { useCallback } from 'react';

interface UseNotificationsReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

/**
 * Custom hook for displaying notifications
 * TODO: Install sonner package and use toast notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const showSuccess = useCallback((message: string) => {
    console.log('[SUCCESS]', message);
  }, []);

  const showError = useCallback((message: string) => {
    console.error('[ERROR]', message);
  }, []);

  const showWarning = useCallback((message: string) => {
    console.warn('[WARNING]', message);
  }, []);

  const showInfo = useCallback((message: string) => {
    console.info('[INFO]', message);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
