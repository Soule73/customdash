import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Input, Select, Switch } from '@customdash/ui';
import { useCreateUser, useUpdateUser, useRoles } from '@hooks';
import { useNotifications } from '@hooks';
import type { User, CreateUserData, UpdateUserData } from '@type/user.types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();

  const isEditMode = !!user;

  const getInitialState = useCallback(
    () => ({
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
      roleId: user?.role?.id ?? '',
      isActive: user?.isActive ?? true,
    }),
    [user],
  );

  const [formState, setFormState] = useState(getInitialState);

  const username = formState.username;
  const email = formState.email;
  const password = formState.password;
  const roleId = formState.roleId;
  const isActive = formState.isActive;

  const setUsername = (v: string) => setFormState(s => ({ ...s, username: v }));
  const setEmail = (v: string) => setFormState(s => ({ ...s, email: v }));
  const setPassword = (v: string) => setFormState(s => ({ ...s, password: v }));
  const setRoleId = (v: string) => setFormState(s => ({ ...s, roleId: v }));
  const setIsActive = (v: boolean) => setFormState(s => ({ ...s, isActive: v }));

  useEffect(() => {
    if (isOpen) {
      setFormState(getInitialState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isSaving = createUser.isPending || updateUser.isPending;

  const roleOptions = (roles ?? []).map(r => ({ value: r.id, label: r.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && user) {
        const data: UpdateUserData = {
          username,
          email,
          roleId: roleId || undefined,
          isActive,
        };
        if (password) {
          data.password = password;
        }
        await updateUser.mutateAsync({ id: user.id, data });
        showSuccess(t('admin.users.notifications.updated'));
      } else {
        const data: CreateUserData = {
          username,
          email,
          password,
          roleId,
        };
        await createUser.mutateAsync(data);
        showSuccess(t('admin.users.notifications.created'));
      }
      onClose();
    } catch {
      showError(t('common.error'));
    }
  };

  const title = isEditMode ? t('admin.users.editUser') : t('admin.users.addUser');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header closeLabel={t('common.close')}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-4">
          <Input
            label={t('admin.users.form.username')}
            placeholder={t('admin.users.form.usernamePlaceholder')}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <Input
            label={t('admin.users.form.email')}
            type="email"
            placeholder={t('admin.users.form.emailPlaceholder')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label={t('admin.users.form.password')}
            type="password"
            placeholder={
              isEditMode
                ? t('admin.users.form.passwordHint')
                : t('admin.users.form.passwordPlaceholder')
            }
            value={password}
            onChange={e => setPassword(e.target.value)}
            required={!isEditMode}
            helperText={isEditMode ? t('admin.users.form.passwordHint') : undefined}
          />
          <Select
            label={t('admin.users.form.role')}
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
            options={roleOptions}
            placeholder={
              isLoadingRoles ? t('common.loading') : t('admin.users.form.rolePlaceholder')
            }
            disabled={isLoadingRoles}
          />
          {isEditMode && (
            <Switch
              label={t('admin.users.form.isActive')}
              checked={isActive}
              onChange={setIsActive}
            />
          )}
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
