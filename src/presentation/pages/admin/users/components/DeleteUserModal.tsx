import { useTranslation } from 'react-i18next';
import { Modal, Button } from '@customdash/ui';
import { useDeleteUser } from '@hooks';
import { useNotifications } from '@hooks';
import type { User } from '@type/user.types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const deleteUser = useDeleteUser();

  const handleConfirm = async () => {
    if (!user) return;
    try {
      await deleteUser.mutateAsync(user.id);
      showSuccess(t('admin.users.notifications.deleted'));
      onClose();
    } catch {
      showError(t('common.error'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{t('admin.users.deleteConfirm.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('admin.users.deleteConfirm.message', { username: user?.username ?? '' })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={deleteUser.isPending}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          isLoading={deleteUser.isPending}
          disabled={deleteUser.isPending}
        >
          {t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
