import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Spinner, Alert } from '@customdash/ui';
import { WidgetFormLayout } from '@components/widgets/layout';
import { useWidgetForm } from '@hooks/widgets/useWidgetForm';
import { useWidgetFormTitle, useWidgetFormIsLoading } from '@stores';
import { useWidget } from '@hooks';

/**
 * WidgetEditPage component for editing an existing widget
 */
export function WidgetEditPage() {
  const { t } = useTranslation();
  const { id: widgetId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('dashboardId') || undefined;

  const name = useWidgetFormTitle();
  const isLoading = useWidgetFormIsLoading();

  const { sources, isSaving, isEditMode, actions } = useWidgetForm({ widgetId, dashboardId });
  const { data: widget } = useWidget(widgetId ?? '');

  const isAIDraft = widget?.isGeneratedByAI && widget?.isDraft;

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
    <div className="flex flex-col h-full">
      {isAIDraft && (
        <div className="px-6 pt-4">
          <Alert variant="info" className="flex items-start gap-3">
            <SparklesIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{t('ai.draftBanner.title')}</p>
              {widget.reasoning && <p className="mt-1 text-sm opacity-90">{widget.reasoning}</p>}
              <p className="mt-1 text-sm opacity-75">{t('ai.draftBanner.hint')}</p>
            </div>
          </Alert>
        </div>
      )}
      <WidgetFormLayout
        title={t('widgets.form.modifyWidget')}
        subtitle={name || t('widgets.loading')}
        sources={sources}
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSourceChange={actions.setSourceId}
        onSave={actions.save}
        onCancel={handleBack}
      />
    </div>
  );
}
