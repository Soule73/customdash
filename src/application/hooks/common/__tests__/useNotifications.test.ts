import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { toast } from 'sonner';
import { useNotifications } from '../useNotifications';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showSuccess', () => {
    it('should call toast.success with message and empty options', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess('Operation completed');
      });

      expect(toast.success).toHaveBeenCalledWith('Operation completed', {});
      expect(toast.success).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess('');
      });

      expect(toast.success).toHaveBeenCalledWith('', {});
    });

    it('should pass custom options to toast', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess('Custom message', { duration: 5000 });
      });

      expect(toast.success).toHaveBeenCalledWith('Custom message', { duration: 5000 });
    });
  });

  describe('showError', () => {
    it('should call toast.error with message and persistent duration', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showError('Something went wrong');
      });

      expect(toast.error).toHaveBeenCalledWith('Something went wrong', { duration: Infinity });
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('should handle technical error messages with persistent duration', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showError('Network error: Connection refused');
      });

      expect(toast.error).toHaveBeenCalledWith('Network error: Connection refused', {
        duration: Infinity,
      });
    });

    it('should allow overriding persistent behavior', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showError('Short error', { persistent: false, duration: 3000 });
      });

      expect(toast.error).toHaveBeenCalledWith('Short error', { duration: 3000 });
    });
  });

  describe('showWarning', () => {
    it('should call toast.warning with message and empty options', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showWarning('Please review your input');
      });

      expect(toast.warning).toHaveBeenCalledWith('Please review your input', {});
      expect(toast.warning).toHaveBeenCalledTimes(1);
    });
  });

  describe('showInfo', () => {
    it('should call toast.info with message and empty options', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showInfo('New update available');
      });

      expect(toast.info).toHaveBeenCalledWith('New update available', {});
      expect(toast.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('dismiss', () => {
    it('should call toast.dismiss', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.dismiss();
      });

      expect(toast.dismiss).toHaveBeenCalledWith(undefined);
    });

    it('should call toast.dismiss with specific id', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.dismiss('toast-123');
      });

      expect(toast.dismiss).toHaveBeenCalledWith('toast-123');
    });
  });

  describe('hook stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useNotifications());

      const { showSuccess, showError, showWarning, showInfo, dismiss } = result.current;

      rerender();

      expect(result.current.showSuccess).toBe(showSuccess);
      expect(result.current.showError).toBe(showError);
      expect(result.current.showWarning).toBe(showWarning);
      expect(result.current.showInfo).toBe(showInfo);
      expect(result.current.dismiss).toBe(dismiss);
    });
  });

  describe('multiple notifications', () => {
    it('should handle multiple notifications in sequence', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess('Success 1');
        result.current.showError('Error 1');
        result.current.showWarning('Warning 1');
        result.current.showInfo('Info 1');
      });

      expect(toast.success).toHaveBeenCalledWith('Success 1', {});
      expect(toast.error).toHaveBeenCalledWith('Error 1', { duration: Infinity });
      expect(toast.warning).toHaveBeenCalledWith('Warning 1', {});
      expect(toast.info).toHaveBeenCalledWith('Info 1', {});
    });
  });

  describe('action buttons', () => {
    it('should pass action to toast options', () => {
      const { result } = renderHook(() => useNotifications());
      const mockAction = { label: 'Retry', onClick: vi.fn() };

      act(() => {
        result.current.showError('Failed operation', { action: mockAction });
      });

      expect(toast.error).toHaveBeenCalledWith('Failed operation', {
        duration: Infinity,
        action: mockAction,
      });
    });
  });
});
