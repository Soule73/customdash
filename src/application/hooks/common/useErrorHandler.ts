import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useAppTranslation } from './useAppTranslation';

interface ApiError {
  message?: string;
  statusCode?: number;
  error?: string;
}

interface ErrorHandlerOptions {
  /** If false, error will auto-dismiss after default duration */
  persistent?: boolean;
  /** Custom error message (overrides API error message) */
  customMessage?: string;
  /** Callback to execute after showing error */
  onError?: (error: unknown) => void;
  /** Action button for retry */
  retryAction?: () => void;
}

interface UseErrorHandlerReturn {
  /**
   * Handle any error and display appropriate notification
   * @param error - The error to handle (Error, ApiError, or unknown)
   * @param options - Configuration options
   */
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;

  /**
   * Handle API mutation errors with standard messages
   * @param error - The error from API call
   * @param context - Context for the error (e.g., 'save', 'delete', 'load')
   */
  handleApiError: (
    error: unknown,
    context: 'save' | 'delete' | 'load' | 'create' | 'update' | 'fetch',
  ) => void;
}

/**
 * Centralized error handling hook
 *
 * @example
 * const { handleError, handleApiError } = useErrorHandler();
 *
 * // Simple usage
 * try {
 *   await saveData();
 * } catch (error) {
 *   handleError(error);
 * }
 *
 * // With context
 * mutation.mutate(data, {
 *   onError: (error) => handleApiError(error, 'save')
 * });
 *
 * // With retry action
 * handleError(error, {
 *   retryAction: () => refetch()
 * });
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const { showError } = useNotifications();
  const { t } = useAppTranslation();

  /**
   * Extract readable message from various error types
   */
  const extractErrorMessage = useCallback(
    (error: unknown): string => {
      if (!error) {
        return t('errors.unknown');
      }

      // Axios error with response
      if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          return axiosError.response.data.message;
        }
      }

      // Standard Error object
      if (error instanceof Error) {
        return error.message;
      }

      // API error response
      if (typeof error === 'object') {
        const apiError = error as ApiError;

        if (apiError.message) {
          return apiError.message;
        }

        if (apiError.error) {
          return apiError.error;
        }
      }

      // String error
      if (typeof error === 'string') {
        return error;
      }

      return t('errors.unknown');
    },
    [t],
  );

  /**
   * Get HTTP status-based error message
   */
  const getStatusMessage = useCallback(
    (statusCode?: number): string | null => {
      if (!statusCode) return null;

      switch (statusCode) {
        case 400:
          return t('errors.badRequest');
        case 401:
          return t('errors.unauthorized');
        case 403:
          return t('errors.forbidden');
        case 404:
          return t('errors.notFound');
        case 409:
          return t('errors.conflict');
        case 422:
          return t('errors.validationError');
        case 429:
          return t('errors.tooManyRequests');
        case 500:
          return t('errors.serverError');
        case 502:
        case 503:
        case 504:
          return t('errors.serviceUnavailable');
        default:
          return null;
      }
    },
    [t],
  );

  const handleError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      const { persistent = true, customMessage, onError, retryAction } = options || {};

      // Determine message to display
      let message: string;

      if (customMessage) {
        message = customMessage;
      } else if (typeof error === 'object' && error !== null && 'statusCode' in error) {
        const statusMessage = getStatusMessage((error as ApiError).statusCode);
        message = statusMessage || extractErrorMessage(error);
      } else {
        message = extractErrorMessage(error);
      }

      // Show error notification
      showError(message, {
        persistent,
        action: retryAction
          ? {
              label: t('common.retry'),
              onClick: retryAction,
            }
          : undefined,
      });

      // Execute callback if provided
      if (onError) {
        onError(error);
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error('[ErrorHandler]', error);
      }
    },
    [showError, extractErrorMessage, getStatusMessage, t],
  );

  const handleApiError = useCallback(
    (error: unknown, context: 'save' | 'delete' | 'load' | 'create' | 'update' | 'fetch') => {
      const contextMessages: Record<string, string> = {
        save: t('errors.saveFailed'),
        delete: t('errors.deleteFailed'),
        load: t('errors.loadFailed'),
        create: t('errors.createFailed'),
        update: t('errors.updateFailed'),
        fetch: t('errors.fetchFailed'),
      };

      // Try to get specific error message first, fallback to context message
      const specificMessage = extractErrorMessage(error);
      const isGenericMessage =
        specificMessage === t('errors.unknown') || specificMessage.includes('Network Error');

      handleError(error, {
        customMessage: isGenericMessage ? contextMessages[context] : specificMessage,
      });
    },
    [handleError, extractErrorMessage, t],
  );

  return {
    handleError,
    handleApiError,
  };
}
