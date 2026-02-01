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
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showSuccess', () => {
    it('should call toast.success with message', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess('Operation completed');
      });

      expect(toast.success).toHaveBeenCalledWith('Operation completed');
      expect(toast.success).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess('');
      });

      expect(toast.success).toHaveBeenCalledWith('');
    });
  });

  describe('showError', () => {
    it('should call toast.error with message', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showError('Something went wrong');
      });

      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('should handle technical error messages', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showError('Network error: Connection refused');
      });

      expect(toast.error).toHaveBeenCalledWith('Network error: Connection refused');
    });
  });

  describe('showWarning', () => {
    it('should call toast.warning with message', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showWarning('Please review your input');
      });

      expect(toast.warning).toHaveBeenCalledWith('Please review your input');
      expect(toast.warning).toHaveBeenCalledTimes(1);
    });
  });

  describe('showInfo', () => {
    it('should call toast.info with message', () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showInfo('New update available');
      });

      expect(toast.info).toHaveBeenCalledWith('New update available');
      expect(toast.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('hook stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useNotifications());

      const { showSuccess, showError, showWarning, showInfo } = result.current;

      rerender();

      expect(result.current.showSuccess).toBe(showSuccess);
      expect(result.current.showError).toBe(showError);
      expect(result.current.showWarning).toBe(showWarning);
      expect(result.current.showInfo).toBe(showInfo);
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

      expect(toast.success).toHaveBeenCalledWith('Success 1');
      expect(toast.error).toHaveBeenCalledWith('Error 1');
      expect(toast.warning).toHaveBeenCalledWith('Warning 1');
      expect(toast.info).toHaveBeenCalledWith('Info 1');
    });
  });
});
