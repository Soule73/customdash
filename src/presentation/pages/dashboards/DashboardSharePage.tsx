import { useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Button, Badge } from '@customdash/ui';
import { ArrowTopRightOnSquareIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useAppTranslation, useNotifications } from '@hooks';
import { useDashboardShareView } from '@hooks/dashboards';
import { toVisualizationFilters } from '@utils/dashboardFilter.utils';
import { DashboardGrid, DashboardHeader } from './components';

/**
 * Public, read-only view for a shared dashboard.
 */
export function DashboardSharePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const { t } = useAppTranslation();
  const { showSuccess } = useNotifications();
  const { dashboard, isLoading, error } = useDashboardShareView(shareId);
  const dashboardGridRef = useRef<HTMLDivElement>(null);

  const dashboardFilters = useMemo(
    () => toVisualizationFilters(dashboard?.globalFilters ?? []),
    [dashboard?.globalFilters],
  );

  const shareLink = useMemo(() => window.location.href, []);

  const copyLink = useCallback(() => {
    void navigator.clipboard.writeText(shareLink);
    showSuccess(t('dashboards.sharePage.linkCopied'));
  }, [shareLink, showSuccess, t]);

  const openInNewTab = useCallback(() => {
    window.open(shareLink, '_blank', 'noopener,noreferrer');
  }, [shareLink]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex h-full flex-col dashboard-container">
        <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="danger">{t('dashboards.sharePage.unavailableBadge')}</Badge>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('dashboards.sharePage.unavailableTitle')}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyLink}>
                <ClipboardDocumentIcon className="h-4 w-4" />
                {t('dashboards.sharePage.copyLink')}
              </Button>
              <Button variant="primary" onClick={openInNewTab}>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                {t('dashboards.sharePage.openLink')}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <p className="max-w-xl text-center text-sm text-gray-600 dark:text-gray-300">
            {t('dashboards.sharePage.unavailableDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col dashboard-container">
      <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-800 bg-white dark:bg-gray-950">
        <DashboardHeader
          isCreateMode={false}
          isSaving={false}
          onSave={() => undefined}
          onCancel={() => undefined}
          onAddWidget={() => undefined}
          onToggleFilterPanel={() => undefined}
          filterCount={dashboard.globalFilters.length}
          columnOptions={[]}
          canEdit={false}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div ref={dashboardGridRef} className="flex flex-1 flex-col overflow-auto p-2">
          <DashboardGrid
            dashboardGlobalFilters={dashboardFilters}
            readOnly
            layout={dashboard.layout}
            widgets={new Map((dashboard.widgets ?? []).map(widget => [widget.id, widget]))}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 px-3 py-2 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">{t('dashboards.sharePage.publicBadge')}</Badge>
            <Badge variant="default">{t('dashboards.sharePage.readOnlyBadge')}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={copyLink}>
              <ClipboardDocumentIcon className="h-4 w-4" />
              {t('dashboards.sharePage.copyLink')}
            </Button>
            <Button variant="primary" onClick={openInNewTab}>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              {t('dashboards.sharePage.openLink')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
