import { useCallback } from 'react';
import { Badge, Button, Input, Modal, Switch } from '@customdash/ui';
import { useAppTranslation } from '@hooks';

interface DashboardShareModalProps {
  isOpen: boolean;
  dashboardTitle: string;
  isShared: boolean;
  shareLink: string | null;
  isSaving: boolean;
  onClose: () => void;
  onToggleShare: (enabled: boolean) => Promise<void>;
  onCopyLink: () => void;
  onOpenLink: () => void;
}

/**
 * Modal used to manage public dashboard sharing from the editor view.
 */
export function DashboardShareModal({
  isOpen,
  dashboardTitle,
  isShared,
  shareLink,
  isSaving,
  onClose,
  onToggleShare,
  onCopyLink,
  onOpenLink,
}: DashboardShareModalProps) {
  const { t } = useAppTranslation();

  const handleToggle = useCallback(
    (enabled: boolean) => {
      void onToggleShare(enabled);
    },
    [onToggleShare],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{t('dashboards.shareModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{dashboardTitle}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {isShared
                  ? t('dashboards.shareModal.enabledDescription')
                  : t('dashboards.shareModal.disabledDescription')}
              </p>
            </div>
            <Badge variant={isShared ? 'success' : 'default'}>
              {isShared ? t('dashboards.shareModal.enabled') : t('dashboards.shareModal.disabled')}
            </Badge>
          </div>
        </div>

        <Switch
          label={t('dashboards.shareModal.toggleLabel')}
          checked={isShared}
          onChange={handleToggle}
          disabled={isSaving}
        />

        {shareLink ? (
          <Input
            label={t('dashboards.shareModal.linkLabel')}
            value={shareLink}
            readOnly
            onChange={() => undefined}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {t('dashboards.shareModal.noLink')}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onCopyLink} disabled={!shareLink || isSaving}>
            {t('dashboards.shareModal.copyLink')}
          </Button>
          <Button variant="ghost" onClick={onOpenLink} disabled={!shareLink || isSaving}>
            {t('dashboards.shareModal.openLink')}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose} disabled={isSaving}>
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
