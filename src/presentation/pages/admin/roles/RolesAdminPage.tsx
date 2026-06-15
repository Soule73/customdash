import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, Table, Skeleton, Badge } from '@customdash/ui';
import { useRoles } from '@hooks';
import { useAuthStore } from '@stores/authStore';
import { PageHeader } from '@components/common';
import { formatDate } from '@customdash/utils';
import type { Role } from '@type/role.types';
import { RoleFormModal, DeleteRoleModal } from './components';

export function RolesAdminPage() {
  const { t } = useTranslation();
  const { hasPermission } = useAuthStore.getState();
  const { data: roles, isLoading } = useRoles();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [search, setSearch] = useState('');

  const canCreate = hasPermission('role:canCreate');
  const canUpdate = hasPermission('role:canUpdate');
  const canDelete = hasPermission('role:canDelete');
  const canView = hasPermission('role:canView');

  const filteredRoles = useMemo(() => {
    if (!roles || !search) return roles ?? [];
    const q = search.toLowerCase();
    return roles.filter(
      r => r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q),
    );
  }, [roles, search]);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRole(null);
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
        title={t('admin.roles.title')}
        subtitle={t('admin.roles.subtitle')}
        actions={
          canCreate ? (
            <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={handleAdd}>
              {t('admin.roles.addRole')}
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
            placeholder={t('admin.roles.searchPlaceholder')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton width="100%" height={48} variant="rectangular" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={56} variant="rectangular" />
            ))}
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {t('admin.roles.noRoles')}
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('admin.roles.columns.name')}</Table.Head>
                <Table.Head>{t('admin.roles.columns.description')}</Table.Head>
                <Table.Head>{t('admin.roles.columns.permissions')}</Table.Head>
                <Table.Head>{t('admin.roles.columns.createdAt')}</Table.Head>
                <Table.Head>{t('admin.roles.columns.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredRoles.map(role => (
                <Table.Row key={role.id}>
                  <Table.Cell>
                    <span className="font-medium text-gray-900 dark:text-white">{role.name}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {role.description || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.length === 0 ? (
                        <span className="text-gray-400 text-sm">-</span>
                      ) : role.permissions.length <= 3 ? (
                        role.permissions.map(p => (
                          <Badge key={p.id} variant="default" className="font-mono text-xs">
                            {p.name}
                          </Badge>
                        ))
                      ) : (
                        <>
                          {role.permissions.slice(0, 2).map(p => (
                            <Badge key={p.id} variant="default" className="font-mono text-xs">
                              {p.name}
                            </Badge>
                          ))}
                          <Badge variant="default" className="text-xs">
                            +{role.permissions.length - 2}
                          </Badge>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-500">
                      {role.createdAt ? formatDate(role.createdAt) : '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() => handleEdit(role)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title={t('admin.roles.editRole')}
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(role)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title={t('admin.roles.deleteRole')}
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

      <RoleFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        role={selectedRole}
      />

      <DeleteRoleModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        role={selectedRole}
      />
    </div>
  );
}
