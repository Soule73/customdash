import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@customdash/ui';
import type { SelectOption } from '@customdash/visualizations';
import { useDashboardForm, useAutoRefresh } from '@hooks/dashboards';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { buildActiveFilters } from '@utils/dashboardFilter.utils';
import { exportElementToPdf } from '@utils/export.utils';
import { GlobalFilterPanel } from '@components/dashboards/GlobalFilterPanel';
import {
  DashboardGrid,
  DashboardHeader,
  WidgetSelectModal,
  DashboardSaveModal,
} from './components';

export function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardGridRef = useRef<HTMLDivElement>(null);

  const { isLoading, isSaving, isCreateMode, save, cancel } = useDashboardForm({ dashboardId: id });
  useAutoRefresh();

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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 dashboard-container">
      <DashboardHeader
        isCreateMode={isCreateMode}
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={cancel}
        onAddWidget={() => setWidgetModalOpen(true)}
        onToggleFilterPanel={() => setFilterPanelOpen(o => !o)}
        filterCount={globalFilters.length}
        columnOptions={columnOptions}
        onExportPDF={handleExportPDF}
      />

      <div ref={dashboardGridRef}>
        <DashboardGrid
          onAddWidget={() => setWidgetModalOpen(true)}
          dashboardGlobalFilters={dashboardGlobalFilters}
        />
      </div>

      {filterPanelOpen && (
        <GlobalFilterPanel
          datasourceIds={datasourceIds}
          onClose={() => setFilterPanelOpen(false)}
        />
      )}

      <WidgetSelectModal open={widgetModalOpen} onClose={() => setWidgetModalOpen(false)} />

      <DashboardSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />
    </div>
  );
}
