import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { Button, Input } from '@customdash/ui';
import { useDashboardFormStore } from '@stores/dashboardFormStore';

interface DashboardHeaderProps {
  isCreateMode: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onAddWidget: () => void;
  onExportPDF?: () => void;
  onShare?: () => void;
  canEdit?: boolean;
}

export function DashboardHeader({
  isCreateMode,
  isSaving,
  onSave,
  onCancel,
  onAddWidget,
  onExportPDF,
  onShare,
  canEdit = true,
}: DashboardHeaderProps) {
  const title = useDashboardFormStore(s => s.config.title);
  const setTitle = useDashboardFormStore(s => s.setTitle);
  const editMode = useDashboardFormStore(s => s.editMode);
  const setEditMode = useDashboardFormStore(s => s.setEditMode);

  const isEditing = editMode || isCreateMode;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre du tableau de bord"
            className="text-xl font-semibold"
          />
        ) : (
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title || 'Sans titre'}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={onAddWidget}
            >
              Ajouter widget
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckIcon className="h-4 w-4" />}
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            {!isCreateMode && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<XMarkIcon className="h-4 w-4" />}
                onClick={onCancel}
              >
                Annuler
              </Button>
            )}
          </>
        ) : (
          <>
            {onExportPDF && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                onClick={onExportPDF}
              >
                Exporter
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ShareIcon className="h-4 w-4" />}
                onClick={onShare}
              >
                Partager
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<PencilIcon className="h-4 w-4" />}
                onClick={() => setEditMode(true)}
              >
                Modifier
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
