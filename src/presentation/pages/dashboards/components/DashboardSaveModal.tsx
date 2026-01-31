import { Modal, Button, Input } from '@customdash/ui';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppTranslation } from '@hooks/useAppTranslation';

interface DashboardSaveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export function DashboardSaveModal({
  open,
  onClose,
  onConfirm,
  isSaving,
}: DashboardSaveModalProps) {
  const { t } = useAppTranslation();
  const title = useDashboardFormStore(s => s.config.title);
  const setTitle = useDashboardFormStore(s => s.setTitle);
  const description = useDashboardFormStore(s => s.config.description);
  const setDescription = useDashboardFormStore(s => s.setDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="md">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{t('dashboards.saveModal.title')}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-4">
          <Input
            label={`${t('dashboards.saveModal.titleLabel')} *`}
            id="dashboard-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t('dashboards.saveModal.titlePlaceholder')}
            required
          />
          <Input
            label={t('dashboards.saveModal.descriptionLabel')}
            id="dashboard-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t('dashboards.saveModal.descriptionPlaceholder')}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('dashboards.saveModal.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim() || isSaving}>
            {isSaving ? t('dashboards.saveModal.saving') : t('dashboards.saveModal.save')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
