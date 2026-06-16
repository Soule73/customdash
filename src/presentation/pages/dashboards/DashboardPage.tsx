import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@customdash/ui';
import type { SelectOption } from '@customdash/visualizations';
import { useDashboardForm, useAutoRefresh, useDashboardShare } from '@hooks/dashboards';
import { useDashboard } from '@hooks';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { buildActiveFilters } from '@utils/dashboardFilter.utils';
import { exportElementToPdf } from '@utils/export.utils';
import { GlobalFilterPanel } from '@components/dashboards/GlobalFilterPanel';
import {
  DashboardGrid,
  DashboardHeader,
  WidgetSidePanel,
  DashboardSaveModal,
  DashboardShareModal,
} from './components';

export function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [widgetPanelOpen, setWidgetPanelOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardGridRef = useRef<HTMLDivElement>(null);

  const { isLoading, isSaving, isCreateMode, save, cancel } = useDashboardForm({ dashboardId: id });
  const { data: dashboard } = useDashboard(id || '');
  useAutoRefresh();
  const { shareLink, isSharing, isShared, enableShare, disableShare, copyShareLink } =
    useDashboardShare(id || '', dashboard?.shareId ?? null);

  const resetForm = useDashboardFormStore(s => s.resetForm);
  const globalFilters = useDashboardFormStore(s => s.config.globalFilters);
  const timeRange = useDashboardFormStore(s => s.config.timeRange);
  const widgets = useDashboardFormStore(s => s.widgets);

  const dashboardGlobalFilters = useMemo(
    () => buildActiveFilters(globalFilters, timeRange),
    [globalFilters, timeRange],
  );

  const datasourceIds = useMemo(
    () => [...new Set([...widgets.values()].map(w => w.dataSourceId).filter(Boolean))],
    [widgets],
  );

  const columnOptions = useMemo<SelectOption[]>(() => [], []);

  const handleExportPDF = useCallback(async () => {
    if (!dashboardGridRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const title =
        document.querySelector<HTMLElement>('.dashboard-title')?.textContent ?? 'dashboard';
      await exportElementToPdf(dashboardGridRef.current, title);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const handleSave = () => {
    if (isCreateMode) {
      setSaveModalOpen(true);
    } else {
      save();
    }
  };

  const handleConfirmSave = async () => {
    await save();
    setSaveModalOpen(false);
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleToggleShare = async (enabled: boolean) => {
    if (enabled === isShared) {
      return;
    }

    if (enabled) {
      await enableShare();
      return;
    }

    await disableShare();
  };

  const handleOpenShareLink = () => {
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col dashboard-container">
      <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-800 bg-white dark:bg-gray-950">
        <DashboardHeader
          isCreateMode={isCreateMode}
          isSaving={isSaving}
          onSave={handleSave}
          onCancel={cancel}
          onAddWidget={() => setWidgetPanelOpen(o => !o)}
          widgetPanelOpen={widgetPanelOpen}
          onToggleFilterPanel={() => setFilterPanelOpen(o => !o)}
          filterCount={globalFilters.length}
          columnOptions={columnOptions}
          onExportPDF={handleExportPDF}
          onShare={!isCreateMode ? handleShare : undefined}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-auto">
          {filterPanelOpen && (
            <GlobalFilterPanel
              datasourceIds={datasourceIds}
              onClose={() => setFilterPanelOpen(false)}
            />
          )}
          <div ref={dashboardGridRef} className="flex-1 p-2">
            <DashboardGrid
              onAddWidget={() => setWidgetPanelOpen(o => !o)}
              dashboardGlobalFilters={dashboardGlobalFilters}
            />
          </div>
        </div>

        <WidgetSidePanel
          open={widgetPanelOpen}
          onClose={() => setWidgetPanelOpen(false)}
          dashboardId={id}
        />
      </div>

      <DashboardSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />

      <DashboardShareModal
        isOpen={shareModalOpen}
        dashboardTitle={dashboard?.title || ''}
        isShared={isShared}
        shareLink={shareLink}
        isSaving={isSharing}
        onClose={() => setShareModalOpen(false)}
        onToggleShare={handleToggleShare}
        onCopyLink={copyShareLink}
        onOpenLink={handleOpenShareLink}
      />
    </div>
  );
}
