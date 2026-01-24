import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWidgetForm } from '@hooks/widgets/useWidgetForm';
import type { WidgetType } from '@customdash/visualizations';
import { WidgetFormLayout } from '@/presentation/components/widgets/layout';

/**
 * WidgetCreatePage component for creating a new widget
 */
export function WidgetCreatePage() {
  const { t } = useTranslation();
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
      title={t('widgets.form.configure')}
      subtitle={t('widgets.form.configureSubtitle')}
      sources={sources}
      isSaving={isSaving}
      isEditMode={isEditMode}
      onSourceChange={actions.setSourceId}
      onSave={actions.save}
      onCancel={handleBack}
    />
  );
}
