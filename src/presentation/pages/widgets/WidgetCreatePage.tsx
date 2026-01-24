import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWidgetForm } from '@hooks/widgets/useWidgetForm';
import type { WidgetType } from '@customdash/visualizations';
import { WidgetFormLayout } from '@/presentation/components/widgets/layout';

/**
 * WidgetCreatePage component for creating a new widget
 */
export function WidgetCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dashboardId = searchParams.get('dashboardId') || undefined;
  const initialSourceId = searchParams.get('sourceId') || undefined;
  const initialType = (searchParams.get('type') as WidgetType) || undefined;

  const { sources, isSaving, isEditMode, actions } = useWidgetForm({
    dashboardId,
    initialSourceId,
    initialType,
  });

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <WidgetFormLayout
      title="Configurer le widget"
      subtitle="Configurez les donnees, le style et les parametres du widget"
      // actions={
      //   <Button variant="ghost" leftIcon={<ArrowLeftIcon className="h-4 w-4" />} onClick={handleBack}>
      //     Retour
      //   </Button>
      // }
      sources={sources}
      isSaving={isSaving}
      isEditMode={isEditMode}
      onSourceChange={actions.setSourceId}
      onSave={actions.save}
      onCancel={handleBack}
    />
  );
}
