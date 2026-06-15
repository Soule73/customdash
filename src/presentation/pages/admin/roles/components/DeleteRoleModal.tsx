import { useTranslation } from 'react-i18next';
import { Modal, Button } from '@customdash/ui';
import { useDeleteRole } from '@hooks';
import { useNotifications } from '@hooks';
import type { Role } from '@type/role.types';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

export function DeleteRoleModal({ isOpen, onClose, role }: DeleteRoleModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const deleteRole = useDeleteRole();

  const handleConfirm = async () => {
    if (!role) return;
    try {
      await deleteRole.mutateAsync(role.id);
      showSuccess(t('admin.roles.notifications.deleted'));
      onClose();
    } catch {
      showError(t('common.error'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{t('admin.roles.deleteConfirm.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('admin.roles.deleteConfirm.message', { name: role?.name ?? '' })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={deleteRole.isPending}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          isLoading={deleteRole.isPending}
          disabled={deleteRole.isPending}
        >
          {t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
