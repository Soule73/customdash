import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { toast } from 'sonner';
import { useErrorHandler } from '../useErrorHandler';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'errors.unknown': 'An unexpected error occurred',
        'errors.badRequest': 'Invalid request',
        'errors.unauthorized': 'Authentication required',
        'errors.forbidden': 'Access denied',
        'errors.notFound': 'Resource not found',
        'errors.conflict': 'Conflict with existing data',
        'errors.serverError': 'Internal server error',
        'errors.saveFailed': 'Failed to save',
        'errors.deleteFailed': 'Failed to delete',
        'errors.loadFailed': 'Failed to load',
        'errors.createFailed': 'Failed to create',
        'errors.updateFailed': 'Failed to update',
        'errors.fetchFailed': 'Failed to fetch data',
        'common.retry': 'Retry',
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: vi.fn() },
  }),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleError', () => {
    it('should handle Error object with message', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError(new Error('Custom error message'));
      });

      expect(toast.error).toHaveBeenCalledWith('Custom error message', {
        duration: Infinity,
      });
    });

    it('should handle string error', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError('String error message');
      });

      expect(toast.error).toHaveBeenCalledWith('String error message', {
        duration: Infinity,
      });
    });

    it('should handle unknown error type with default message', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError({ some: 'object' });
      });

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred', {
        duration: Infinity,
      });
    });

    it('should use custom message when provided', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError(new Error('Original'), {
          customMessage: 'Custom override message',
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Custom override message', {
        duration: Infinity,
      });
    });

    it('should handle axios error with response message', () => {
      const { result } = renderHook(() => useErrorHandler());
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Validation failed' },
        },
      };

      act(() => {
        result.current.handleError(axiosError);
      });

      expect(toast.error).toHaveBeenCalledWith('Validation failed', {
        duration: Infinity,
      });
    });

    it('should add retry action when provided', () => {
      const { result } = renderHook(() => useErrorHandler());
      const retryFn = vi.fn();

      act(() => {
        result.current.handleError(new Error('Failed'), {
          retryAction: retryFn,
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Failed', {
        duration: Infinity,
        action: expect.objectContaining({
          label: 'Retry',
        }),
      });
    });

    it('should respect persistent option set to false', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleError(new Error('Non-persistent error'), {
          persistent: false,
        });
      });

      expect(toast.error).toHaveBeenCalledWith('Non-persistent error', {});
    });
  });

  describe('handleApiError', () => {
    it('should use context-specific message for save when error is generic', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        // Use null/undefined to trigger generic message behavior
        result.current.handleApiError(null, 'save');
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to save', {
        duration: Infinity,
      });
    });

    it('should use context-specific message for delete when error is generic', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError(undefined, 'delete');
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to delete', {
        duration: Infinity,
      });
    });

    it('should use context-specific message for load on network error', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError(new Error('Network Error'), 'load');
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to load', {
        duration: Infinity,
      });
    });

    it('should use context-specific message for create when error is generic', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError({}, 'create');
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to create', {
        duration: Infinity,
      });
    });

    it('should use context-specific message for update when error is generic', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError(null, 'update');
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to update', {
        duration: Infinity,
      });
    });

    it('should use context-specific message for fetch when error is generic', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError(null, 'fetch');
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to fetch data', {
        duration: Infinity,
      });
    });

    it('should use specific error message when available', () => {
      const { result } = renderHook(() => useErrorHandler());

      act(() => {
        result.current.handleApiError(new Error('Validation error: email is required'), 'save');
      });

      expect(toast.error).toHaveBeenCalledWith('Validation error: email is required', {
        duration: Infinity,
      });
    });
  });

  describe('hook behavior', () => {
    it('should return both handler functions', () => {
      const { result } = renderHook(() => useErrorHandler());

      expect(typeof result.current.handleError).toBe('function');
      expect(typeof result.current.handleApiError).toBe('function');
    });

    it('should call onError callback when provided', () => {
      const { result } = renderHook(() => useErrorHandler());
      const onErrorSpy = vi.fn();

      act(() => {
        result.current.handleError(new Error('Test error'), {
          onError: onErrorSpy,
        });
      });

      expect(onErrorSpy).toHaveBeenCalled();
    });
  });
});
