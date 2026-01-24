import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner } from '@customdash/ui';
import { WidgetFormLayout } from '@components/widgets/layout';
import { useWidgetForm } from '@hooks/widgets/useWidgetForm';
import { useWidgetFormTitle, useWidgetFormIsLoading } from '@stores/widgetFormStore';

/**
 * WidgetEditPage component for editing an existing widget
 */
export function WidgetEditPage() {
  const { id: widgetId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('dashboardId') || undefined;

  const name = useWidgetFormTitle();
  const isLoading = useWidgetFormIsLoading();

  const { sources, isSaving, isEditMode, actions } = useWidgetForm({ widgetId, dashboardId });

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading && !name) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <WidgetFormLayout
      title="Modifier le widget"
      subtitle={name || 'Chargement...'}
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
