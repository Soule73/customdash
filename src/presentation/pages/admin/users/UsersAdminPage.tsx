import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, Table, Skeleton, Badge } from '@customdash/ui';
import { useUsers } from '@hooks';
import { useAuthStore } from '@stores/authStore';
import { PageHeader } from '@components/common';
import { formatDate } from '@customdash/utils';
import type { User } from '@type/user.types';
import { UserFormModal, DeleteUserModal } from './components';

export function UsersAdminPage() {
  const { t } = useTranslation();
  const { hasPermission } = useAuthStore.getState();
  const { data: users, isLoading } = useUsers();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  const canCreate = hasPermission('user:canCreate');
  const canUpdate = hasPermission('user:canUpdate');
  const canDelete = hasPermission('user:canDelete');
  const canView = hasPermission('user:canView');

  const filteredUsers = useMemo(() => {
    if (!users || !search) return users ?? [];
    const q = search.toLowerCase();
    return users.filter(
      u =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.role?.name ?? '').toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setFormModalOpen(true);
  };

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <ShieldExclamationIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400 text-center">Accès non autorisé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.users.title')}
        subtitle={t('admin.users.subtitle')}
        actions={
          canCreate ? (
            <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={handleAdd}>
              {t('admin.users.addUser')}
            </Button>
          ) : undefined
        }
      />

      <Card>
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('admin.users.searchPlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton width="100%" height={48} variant="rectangular" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={56} variant="rectangular" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {t('admin.users.noUsers')}
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('admin.users.columns.username')}</Table.Head>
                <Table.Head>{t('admin.users.columns.email')}</Table.Head>
                <Table.Head>{t('admin.users.columns.role')}</Table.Head>
                <Table.Head>{t('admin.users.columns.status')}</Table.Head>
                <Table.Head>{t('admin.users.columns.createdAt')}</Table.Head>
                <Table.Head>{t('admin.users.columns.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredUsers.map(user => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {user.role ? (
                      <Badge variant="default">{user.role.name}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={user.isActive ? 'success' : 'error'}>
                      {user.isActive
                        ? t('admin.users.status.active')
                        : t('admin.users.status.inactive')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-500">
                      {user.createdAt ? formatDate(user.createdAt) : '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title={t('admin.users.editUser')}
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title={t('admin.users.deleteUser')}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>

      <UserFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
