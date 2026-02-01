import { useMemo, type CSSProperties } from 'react';
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import { Button, Input } from '@customdash/ui';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppTranslation } from '@hooks';

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
  const { t } = useAppTranslation();
  const title = useDashboardFormStore(s => s.config.title);
  const setTitle = useDashboardFormStore(s => s.setTitle);
  const editMode = useDashboardFormStore(s => s.editMode);
  const setEditMode = useDashboardFormStore(s => s.setEditMode);
  const stylePanelOpen = useDashboardFormStore(s => s.stylePanelOpen);
  const setStylePanelOpen = useDashboardFormStore(s => s.setStylePanelOpen);
  const styles = useDashboardFormStore(s => s.config.styles);

  const isEditing = editMode || isCreateMode;

  const titleStyle = useMemo((): CSSProperties | undefined => {
    if (!styles?.titleFontSize && !styles?.titleColor) return undefined;
    return {
      fontSize: styles.titleFontSize,
      color: styles.titleColor,
    };
  }, [styles]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t('dashboards.header.titlePlaceholder')}
            className=" bg-transparent! border-x-0! border-t-0! rounded-none! font-semibold"
            style={titleStyle}
          />
        ) : (
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white" style={titleStyle}>
            {title || t('dashboards.header.untitled')}
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
              {t('dashboards.header.addWidget')}
            </Button>
            <Button
              variant={stylePanelOpen ? 'secondary' : 'outline'}
              size="sm"
              leftIcon={<SwatchIcon className="h-4 w-4" />}
              onClick={() => setStylePanelOpen(!stylePanelOpen)}
            >
              {t('dashboards.header.customize')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckIcon className="h-4 w-4" />}
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? t('dashboards.header.saving') : t('dashboards.header.save')}
            </Button>
            {!isCreateMode && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<XMarkIcon className="h-4 w-4" />}
                onClick={onCancel}
              >
                {t('dashboards.header.cancel')}
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
                {t('dashboards.header.export')}
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ShareIcon className="h-4 w-4" />}
                onClick={onShare}
              >
                {t('dashboards.header.share')}
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<PencilIcon className="h-4 w-4" />}
                onClick={() => setEditMode(true)}
              >
                {t('dashboards.header.edit')}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
