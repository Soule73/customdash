import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@customdash/ui';
import { useDashboardForm } from '@hooks/dashboards';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import {
  DashboardGrid,
  DashboardHeader,
  WidgetSelectModal,
  DashboardSaveModal,
  StyleEditorPanel,
} from './components';

export function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const { isLoading, isSaving, isCreateMode, save, cancel } = useDashboardForm({ dashboardId: id });

  const resetForm = useDashboardFormStore(s => s.resetForm);

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
    <div className="space-y-6">
      <DashboardHeader
        isCreateMode={isCreateMode}
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={cancel}
        onAddWidget={() => setWidgetModalOpen(true)}
      />

      <DashboardGrid onAddWidget={() => setWidgetModalOpen(true)} />

      <WidgetSelectModal open={widgetModalOpen} onClose={() => setWidgetModalOpen(false)} />

      <DashboardSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />

      <StyleEditorPanel />
    </div>
  );
}
