import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { Button, Input } from '@customdash/ui';
import type { SelectOption } from '@customdash/visualizations';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppTranslation } from '@hooks';
import { TimeRangePicker } from '@components/dashboards/TimeRangePicker';

interface DashboardHeaderProps {
  isCreateMode: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onAddWidget: () => void;
  widgetPanelOpen?: boolean;
  onToggleFilterPanel?: () => void;
  filterCount?: number;
  columnOptions?: SelectOption[];
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
  widgetPanelOpen = false,
  onToggleFilterPanel,
  filterCount = 0,
  columnOptions = [],
  onExportPDF,
  onShare,
  canEdit = true,
}: DashboardHeaderProps) {
  const { t } = useAppTranslation();
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
            placeholder={t('dashboards.header.titlePlaceholder')}
            className=" bg-transparent! border-x-0! border-t-0! rounded-none! font-semibold"
          />
        ) : (
          <h1 className="dashboard-title text-2xl font-semibold text-gray-900 dark:text-white">
            {title || t('dashboards.header.untitled')}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <TimeRangePicker columnOptions={columnOptions} />

        {onToggleFilterPanel && (
          <button
            type="button"
            onClick={onToggleFilterPanel}
            className="relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            title={t('dashboards.filters.title')}
          >
            <FunnelIcon className="h-4 w-4" />
            {filterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {filterCount}
              </span>
            )}
          </button>
        )}

        {isEditing ? (
          <>
            <Button
              variant={widgetPanelOpen ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={onAddWidget}
            >
              {t('dashboards.header.addWidget')}
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
