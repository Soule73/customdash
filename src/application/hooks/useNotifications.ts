import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseNotificationsReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

/**
 * Custom hook for displaying toast notifications using Sonner
 */
export function useNotifications(): UseNotificationsReturn {
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
