import { useState, useCallback } from 'react';
import { useNotifications, useErrorHandler, useAppTranslation } from '../common';
import { useShareDashboard } from '../queries';

interface UseDashboardShareReturn {
  shareId: string | null;
  isSharing: boolean;
  isShared: boolean;
  shareLink: string | null;
  enableShare: () => Promise<void>;
  disableShare: () => Promise<void>;
  copyShareLink: () => void;
}

export function useDashboardShare(
  dashboardId: string,
  initialShareId?: string | null,
): UseDashboardShareReturn {
  const [shareId, setShareId] = useState<string | null>(null);
  const shareMutation = useShareDashboard();
  const { showSuccess } = useNotifications();
  const { handleApiError } = useErrorHandler();
  const { t } = useAppTranslation();

  const currentShareId = shareId ?? initialShareId ?? null;
  const shareLink = currentShareId
    ? `${window.location.origin}/dashboards/share/${currentShareId}`
    : null;

  const enableShare = useCallback(async () => {
    if (!dashboardId) return;

    try {
      const result = await shareMutation.mutateAsync({
        id: dashboardId,
        shareEnabled: true,
      });
      setShareId(result.shareId ?? null);
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
    shareId: currentShareId,
    isSharing: shareMutation.isPending,
    isShared: Boolean(currentShareId),
    shareLink,
    enableShare,
    disableShare,
    copyShareLink,
  };
}
