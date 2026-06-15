import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Input, Checkbox } from '@customdash/ui';
import { useCreateRole, useUpdateRole, usePermissions } from '@hooks';
import { useNotifications } from '@hooks';
import type { Role, CreateRoleData, UpdateRoleData } from '@type/role.types';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

const PERMISSION_GROUPS: Record<string, string> = {
  dashboard: 'admin.roles.permissionGroups.dashboard',
  widget: 'admin.roles.permissionGroups.widget',
  datasource: 'admin.roles.permissionGroups.datasource',
  user: 'admin.roles.permissionGroups.user',
  role: 'admin.roles.permissionGroups.role',
};

export function RoleFormModal({ isOpen, onClose, role }: RoleFormModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const { data: allPermissions, isLoading: isLoadingPermissions } = usePermissions();

  const isEditMode = !!role;

  const getInitialState = useCallback(
    () => ({
      name: role?.name ?? '',
      description: role?.description ?? '',
      selectedPermissions: new Set((role?.permissions ?? []).map(p => p.id)),
    }),
    [role],
  );

  const [formState, setFormState] = useState(getInitialState);

  const name = formState.name;
  const description = formState.description;
  const selectedPermissions = formState.selectedPermissions;

  const setName = (v: string) => setFormState(s => ({ ...s, name: v }));
  const setDescription = (v: string) => setFormState(s => ({ ...s, description: v }));

  useEffect(() => {
    if (isOpen) {
      setFormState(getInitialState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const isSaving = createRole.isPending || updateRole.isPending;

  const groupedPermissions = useMemo(() => {
    if (!allPermissions) return {};
    return allPermissions.reduce(
      (acc, perm) => {
        const resource = perm.name.split(':')[0] ?? 'other';
        if (!acc[resource]) acc[resource] = [];
        acc[resource].push(perm);
        return acc;
      },
      {} as Record<string, typeof allPermissions>,
    );
  }, [allPermissions]);

  const togglePermission = (permId: string) => {
    setFormState(prev => {
      const next = new Set(prev.selectedPermissions);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return { ...prev, selectedPermissions: next };
    });
  };

  const toggleGroup = (perms: typeof allPermissions) => {
    if (!perms) return;
    const allSelected = perms.every(p => selectedPermissions.has(p.id));
    setFormState(prev => {
      const next = new Set(prev.selectedPermissions);
      perms.forEach(p => {
        if (allSelected) {
          next.delete(p.id);
        } else {
          next.add(p.id);
        }
      });
      return { ...prev, selectedPermissions: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const permissions = Array.from(selectedPermissions);

    try {
      if (isEditMode && role) {
        const data: UpdateRoleData = { name, description, permissions };
        await updateRole.mutateAsync({ id: role.id, data });
        showSuccess(t('admin.roles.notifications.updated'));
      } else {
        const data: CreateRoleData = { name, description, permissions };
        await createRole.mutateAsync(data);
        showSuccess(t('admin.roles.notifications.created'));
      }
      onClose();
    } catch {
      showError(t('common.error'));
    }
  };

  const title = isEditMode ? t('admin.roles.editRole') : t('admin.roles.addRole');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-5">
          <Input
            label={t('admin.roles.form.name')}
            placeholder={t('admin.roles.form.namePlaceholder')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            minLength={2}
          />
          <Input
            label={t('admin.roles.form.description')}
            placeholder={t('admin.roles.form.descriptionPlaceholder')}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.roles.form.permissions')}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t('admin.roles.form.permissionsHint')}
            </p>

            {isLoadingPermissions ? (
              <div className="text-sm text-gray-500">{t('common.loading')}</div>
            ) : !allPermissions?.length ? (
              <div className="text-sm text-gray-500">{t('admin.roles.form.noPermissions')}</div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {Object.entries(groupedPermissions).map(([resource, perms]) => {
                  const groupLabelKey = PERMISSION_GROUPS[resource];
                  const groupLabel = groupLabelKey ? t(groupLabelKey) : resource;
                  const allGroupSelected = perms.every(p => selectedPermissions.has(p.id));

                  return (
                    <div
                      key={resource}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                    >
                      <Checkbox
                        checked={allGroupSelected}
                        onChange={() => toggleGroup(perms)}
                        label={groupLabel}
                        className="mb-2 [&_label]:font-semibold [&_label]:text-sm [&_label]:text-gray-800 dark:[&_label]:text-gray-200"
                      />
                      <div className="grid grid-cols-2 gap-1.5 pl-6">
                        {perms.map(perm => {
                          const action = perm.name.split(':')[1] ?? perm.name;
                          return (
                            <Checkbox
                              key={perm.id}
                              checked={selectedPermissions.has(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              label={action}
                              className="[&_label]:font-mono [&_label]:text-xs"
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSaving} disabled={isSaving}>
            {isEditMode ? t('common.save') : t('common.create')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
