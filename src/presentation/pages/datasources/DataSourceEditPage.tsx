import { useNavigate, useParams } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button, Card, Skeleton } from '@customdash/ui';
import { useDataSource, useUpdateDataSource } from '@hooks/index';
import { useAppTranslation } from '@hooks/useAppTranslation';
import { DataSourceForm } from './DataSourceForm';
import { type DataSourceFormState } from './datasource-form.constants';
import type { UpdateDataSourceData, DataSource } from '@type/datasource.types';

function EditFormSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton width={40} height={40} variant="rounded" />
        <div>
          <Skeleton width={200} height={24} variant="text" />
          <Skeleton width={150} height={16} variant="text" className="mt-1" />
        </div>
      </div>
      <div className="flex-1 flex gap-6 pt-4">
        <div className="w-80 shrink-0 space-y-4">
          <Card>
            <Skeleton width={150} height={20} variant="text" className="mb-3" />
            <div className="space-y-3">
              <Skeleton width="100%" height={40} variant="rounded" />
              <Skeleton width="100%" height={40} variant="rounded" />
              <Skeleton width="100%" height={40} variant="rounded" />
            </div>
          </Card>
          <Card>
            <Skeleton width={150} height={20} variant="text" className="mb-3" />
            <div className="space-y-3">
              <Skeleton width="100%" height={40} variant="rounded" />
              <Skeleton width="100%" height={40} variant="rounded" />
            </div>
          </Card>
        </div>
        <div className="flex-1">
          <Card className="h-full">
            <Skeleton width={150} height={20} variant="text" className="mb-3" />
            <Skeleton width="100%" height={200} variant="rounded" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function createFormState(dataSource: DataSource): DataSourceFormState {
  return {
    name: dataSource.name,
    type: dataSource.type,
    endpoint: dataSource.endpoint || '',
    filePath: dataSource.filePath || '',
    httpMethod: dataSource.httpMethod || 'GET',
    authType: dataSource.authType,
    authToken: dataSource.authConfig?.token || '',
    apiKey: dataSource.authConfig?.apiKey || '',
    apiKeyHeader: dataSource.authConfig?.headerName || 'X-API-Key',
    basicUsername: dataSource.authConfig?.username || '',
    basicPassword: '',
    esIndex: dataSource.esIndex || '',
    timestampField: dataSource.timestampField || '',
    visibility: dataSource.visibility,
  };
}

interface EditFormWrapperProps {
  dataSource: DataSource;
  dataSourceId: string;
}

function EditFormWrapper({ dataSource, dataSourceId }: EditFormWrapperProps) {
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const updateDataSource = useUpdateDataSource();

  const handleSubmit = async (form: DataSourceFormState) => {
    const data: UpdateDataSourceData = {
      name: form.name,
      visibility: form.visibility,
    };

    if (dataSource.type === 'json') {
      data.endpoint = form.endpoint;
      data.httpMethod = form.httpMethod;
    } else if (dataSource.type === 'csv') {
      data.filePath = form.filePath;
    } else if (dataSource.type === 'elasticsearch') {
      data.endpoint = form.endpoint;
      data.esIndex = form.esIndex;
    }

    if (form.authType !== 'none') {
      data.authType = form.authType;
      switch (form.authType) {
        case 'bearer':
          data.authConfig = { token: form.authToken };
          break;
        case 'apiKey':
          data.authConfig = { apiKey: form.apiKey, headerName: form.apiKeyHeader };
          break;
        case 'basic':
          data.authConfig = {
            username: form.basicUsername,
            ...(form.basicPassword && { password: form.basicPassword }),
          };
          break;
      }
    } else {
      data.authType = 'none';
    }

    if (form.timestampField.trim()) {
      data.timestampField = form.timestampField;
    }

    await updateDataSource.mutateAsync({ id: dataSourceId, data });
    navigate('/datasources');
  };

  return (
    <DataSourceForm
      mode="edit"
      title={t('datasources.edit')}
      subtitle={dataSource.name}
      initialValues={createFormState(dataSource)}
      isSubmitting={updateDataSource.isPending}
      submitLabel={t('common.save')}
      onSubmit={handleSubmit}
      typeReadOnly
    />
  );
}

/**
 * Page for editing an existing data source
 */
export function DataSourceEditPage() {
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: dataSource, isLoading, error } = useDataSource(id || '');

  if (isLoading) {
    return <EditFormSkeleton />;
  }

  if (error || !dataSource || !id) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md w-full py-12 text-center">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('errors.notFound')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('errors.generic')}</p>
          <Button className="mt-6" onClick={() => navigate('/datasources')}>
            {t('common.back')}
          </Button>
        </Card>
      </div>
    );
  }

  return <EditFormWrapper dataSource={dataSource} dataSourceId={id} />;
}
