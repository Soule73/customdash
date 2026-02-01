import { useCallback } from 'react';
import { toast, type ExternalToast } from 'sonner';

interface ToastOptions {
  /** If true, toast stays until user dismisses it */
  persistent?: boolean;
  /** Custom duration in milliseconds */
  duration?: number;
  /** Action button configuration */
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UseNotificationsReturn {
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  dismiss: (toastId?: string | number) => void;
}

/**
 * Custom hook for displaying toast notifications using Sonner
 *
 * @example
 * // Simple notification
 * showSuccess('Saved successfully');
 *
 * @example
 * // Persistent error (user must dismiss)
 * showError('Connection failed', { persistent: true });
 *
 * @example
 * // With action button
 * showError('Failed to save', {
 *   persistent: true,
 *   action: { label: 'Retry', onClick: handleRetry }
 * });
 */
export function useNotifications(): UseNotificationsReturn {
  const buildToastOptions = useCallback((options?: ToastOptions): ExternalToast => {
    const toastOptions: ExternalToast = {};

    if (options?.persistent) {
      toastOptions.duration = Infinity;
    } else if (options?.duration) {
      toastOptions.duration = options.duration;
    }

    if (options?.action) {
      toastOptions.action = {
        label: options.action.label,
        onClick: options.action.onClick,
      };
    }

    return toastOptions;
  }, []);

  const showSuccess = useCallback(
    (message: string, options?: ToastOptions) => {
      toast.success(message, buildToastOptions(options));
    },
    [buildToastOptions],
  );

  const showError = useCallback(
    (message: string, options?: ToastOptions) => {
      // Errors are persistent by default
      const errorOptions: ToastOptions = {
        persistent: true,
        ...options,
      };
      toast.error(message, buildToastOptions(errorOptions));
    },
    [buildToastOptions],
  );

  const showWarning = useCallback(
    (message: string, options?: ToastOptions) => {
      toast.warning(message, buildToastOptions(options));
    },
    [buildToastOptions],
  );

  const showInfo = useCallback(
    (message: string, options?: ToastOptions) => {
      toast.info(message, buildToastOptions(options));
    },
    [buildToastOptions],
  );

  const dismiss = useCallback((toastId?: string | number) => {
    toast.dismiss(toastId);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
  };
}
