import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateDataSource } from '@hooks';
import { useAppTranslation } from '@hooks';
import { DataSourceForm } from './DataSourceForm';
import { INITIAL_FORM_STATE, type DataSourceFormState } from './datasource-form.constants';
import type { DataSourceType, CreateDataSourceData } from '@type/datasource.types';

/**
 * Page for creating a new data source
 */
export function DataSourceCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useAppTranslation();
  const createDataSource = useCreateDataSource();

  const initialType = searchParams.get('type') as DataSourceType;
  const validType =
    initialType && ['json', 'csv', 'elasticsearch'].includes(initialType) ? initialType : 'json';

  const initialValues: DataSourceFormState = {
    ...INITIAL_FORM_STATE,
    type: validType,
  };

  const handleSubmit = async (form: DataSourceFormState) => {
    const data: CreateDataSourceData = {
      name: form.name,
      type: form.type,
      visibility: form.visibility,
    };

    if (form.type === 'json') {
      data.endpoint = form.endpoint;
      data.httpMethod = form.httpMethod;
    } else if (form.type === 'csv') {
      data.filePath = form.filePath;
    } else if (form.type === 'elasticsearch') {
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
          data.authConfig = { username: form.basicUsername, password: form.basicPassword };
          break;
      }
    }

    if (form.timestampField.trim()) {
      data.timestampField = form.timestampField;
    }

    await createDataSource.mutateAsync(data);
    navigate('/datasources');
  };

  return (
    <DataSourceForm
      mode="create"
      title={t('datasources.create')}
      subtitle={t('datasources.subtitle')}
      initialValues={initialValues}
      isSubmitting={createDataSource.isPending}
      submitLabel={t('common.create')}
      onSubmit={handleSubmit}
    />
  );
}
