import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Spinner, Badge } from '@customdash/ui';
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
      <WidgetFormLayout
        title={
          <span className="flex items-center gap-2">
            {t('widgets.form.modifyWidget')}
            {isAIDraft && (
              <>
                <Badge variant="warning">{t('widgets.draft')}</Badge>
                <SparklesIcon
                  className="h-4 w-4 text-purple-500"
                  title={t('widgets.generatedByAI')}
                />
              </>
            )}
          </span>
        }
        subtitle={name || t('widgets.loading')}
        sources={sources}
        isSaving={isSaving}
        isEditMode={isEditMode}
        isAIDraft={Boolean(isAIDraft)}
        isDraft={Boolean(widget?.isDraft)}
        onSourceChange={actions.setSourceId}
        onSave={actions.save}
        onCancel={handleBack}
      />
    </div>
  );
}
