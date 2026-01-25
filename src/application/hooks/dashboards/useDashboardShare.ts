import { useState, useCallback } from 'react';
import { useShareDashboard } from '@hooks/dashboard.queries';
import { useNotifications } from '../useNotifications';

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
  const { showSuccess, showError } = useNotifications();

  const shareLink = shareId ? `${window.location.origin}/dashboards/share/${shareId}` : null;

  const enableShare = useCallback(async () => {
    if (!dashboardId) return;

    try {
      const result = await shareMutation.mutateAsync({
        id: dashboardId,
        shareEnabled: true,
      });
      setShareId(result.sharedWith?.[0] || null);
      showSuccess('Partage active');
    } catch {
      showError("Erreur lors de l'activation du partage");
    }
  }, [dashboardId, shareMutation, showSuccess, showError]);

  const disableShare = useCallback(async () => {
    if (!dashboardId) return;

    try {
      await shareMutation.mutateAsync({
        id: dashboardId,
        shareEnabled: false,
      });
      setShareId(null);
      showSuccess('Partage desactive');
    } catch {
      showError('Erreur lors de la desactivation du partage');
    }
  }, [dashboardId, shareMutation, showSuccess, showError]);

  const copyShareLink = useCallback(() => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      showSuccess('Lien copie dans le presse-papiers');
    }
  }, [shareLink, showSuccess]);

  return {
    shareId,
    isSharing: shareMutation.isPending,
    shareLink,
    enableShare,
    disableShare,
    copyShareLink,
  };
}
