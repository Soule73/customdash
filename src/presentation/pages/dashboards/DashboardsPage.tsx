import { PlusIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { Button, Card, Spinner } from '@customdash/ui';
import { useAppTranslation, useDashboards } from '@hooks/index';

export function DashboardsPage() {
  const { t } = useAppTranslation();
  const { data: dashboards, isLoading } = useDashboards();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('dashboards.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('dashboards.subtitle')}
          </p>
        </div>
        <Button variant="primary" leftIcon={<PlusIcon className="h-4 w-4" />}>
          {t('dashboards.newDashboard')}
        </Button>
      </div>

      {dashboards && dashboards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dashboards.map(dashboard => (
            <Card
              key={dashboard.id}
              padding="none"
              className="group cursor-pointer overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                <div className="flex h-full items-center justify-center">
                  <Squares2X2Icon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {dashboard.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {dashboard.description || t('dashboards.noDescription')}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <Squares2X2Icon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('dashboards.noDashboards')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('dashboards.createFirst')}
          </p>
          <Button variant="primary" className="mt-6" leftIcon={<PlusIcon className="h-4 w-4" />}>
            {t('dashboards.create')}
          </Button>
        </Card>
      )}
    </div>
  );
}
