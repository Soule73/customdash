import { useState, useCallback } from 'react';
import { useNotifications, useErrorHandler, useAppTranslation } from '../common';
import { useShareDashboard } from '../queries';

interface UseDashboardShareReturn {
  shareId: string | null;
  isSharing: boolean;
  shareLink: string | null;
  enableShare: () => Promise<void>;
  disableShare: () => Promise<void>;
  copyShareLink: () => void;
}

export function useDashboardShare(dashboardId: string): UseDashboardShareReturn {
  const [shareId, setShareId] = useState<string | null>(null);
  const shareMutation = useShareDashboard();
  const { showSuccess } = useNotifications();
  const { handleApiError } = useErrorHandler();
  const { t } = useAppTranslation();

  const shareLink = shareId ? `${window.location.origin}/dashboards/share/${shareId}` : null;

  const enableShare = useCallback(async () => {
    if (!dashboardId) return;

    try {
      const result = await shareMutation.mutateAsync({
        id: dashboardId,
        shareEnabled: true,
      });
      setShareId(result.sharedWith?.[0] || null);
      showSuccess(t('dashboards.share.enabled'));
    } catch (error) {
      handleApiError(error, 'update');
    }
  }, [dashboardId, shareMutation, showSuccess, handleApiError, t]);

  const disableShare = useCallback(async () => {
    if (!dashboardId) return;

    try {
      await shareMutation.mutateAsync({
        id: dashboardId,
        shareEnabled: false,
      });
      setShareId(null);
      showSuccess(t('dashboards.share.disabled'));
    } catch (error) {
      handleApiError(error, 'update');
    }
  }, [dashboardId, shareMutation, showSuccess, handleApiError, t]);

  const copyShareLink = useCallback(() => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      showSuccess(t('dashboards.share.linkCopied'));
    }
  }, [shareLink, showSuccess, t]);

  return {
    shareId,
    isSharing: shareMutation.isPending,
    shareLink,
    enableShare,
    disableShare,
    copyShareLink,
  };
}
