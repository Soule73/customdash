import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button, Card, Input, Select } from '@customdash/ui';
import { getDateColumns } from '@customdash/utils';
import { useAppTranslation } from '@hooks/useAppTranslation';
import { DataPreviewTable } from './DataPreviewTable';
import { processingService } from '@services/index';
import type { DataSourceType, AuthType, HttpMethod } from '@type/datasource.types';
import {
  getTypeOptions,
  HTTP_METHOD_OPTIONS,
  getAuthTypeOptions,
  getVisibilityOptions,
  getTypeLabel,
  INITIAL_VALIDATION_STATE,
  type DataSourceFormState,
  type ValidationState,
} from './datasource-form.constants';

interface DataSourceFormProps {
  mode: 'create' | 'edit';
  title: string;
  subtitle: string;
  initialValues: DataSourceFormState;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (form: DataSourceFormState) => Promise<void>;
  typeReadOnly?: boolean;
}

/**
 * Shared form component for creating and editing data sources
 */
export function DataSourceForm({
  mode,
  title,
  subtitle,
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  typeReadOnly = false,
}: DataSourceFormProps) {
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const [form, setForm] = useState<DataSourceFormState>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof DataSourceFormState, string>>>({});
  const [validation, setValidation] = useState<ValidationState>(INITIAL_VALIDATION_STATE);

  const timestampFieldOptions = useMemo(() => {
    const dateColumns = getDateColumns(validation.columns, validation.types);
    return [
      { value: '', label: t('common.none') },
      ...dateColumns.map(column => ({ value: column, label: column })),
    ];
  }, [validation.columns, validation.types, t]);

  const updateField = <K extends keyof DataSourceFormState>(
    field: K,
    value: DataSourceFormState[K],
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setValidation(prev => ({
      ...prev,
      isValid: null,
      error: null,
      columns: [],
      types: {},
      preview: [],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DataSourceFormState, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = t('datasources.validation.nameRequired');
    }

    if (form.type === 'json' && !form.endpoint.trim()) {
      newErrors.endpoint = t('datasources.validation.endpointRequired');
    }

    if (form.type === 'csv' && !form.filePath.trim()) {
      newErrors.filePath = t('datasources.validation.filePathRequired');
    }

    if (form.type === 'elasticsearch') {
      if (!form.endpoint.trim()) {
        newErrors.endpoint = t('datasources.validation.endpointRequired');
      }
      if (!form.esIndex.trim()) {
        newErrors.esIndex = t('datasources.validation.indexRequired');
      }
    }

    if (form.authType === 'bearer' && !form.authToken.trim()) {
      newErrors.authToken = t('datasources.validation.tokenRequired');
    }

    if (form.authType === 'apiKey' && !form.apiKey.trim()) {
      newErrors.apiKey = t('datasources.validation.apiKeyRequired');
    }

    if (form.authType === 'basic') {
      if (!form.basicUsername.trim()) {
        newErrors.basicUsername = t('datasources.validation.usernameRequired');
      }
      if (mode === 'create' && !form.basicPassword.trim()) {
        newErrors.basicPassword = t('datasources.validation.passwordRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildAuthConfig = () => {
    switch (form.authType) {
      case 'bearer':
        return { token: form.authToken };
      case 'apiKey':
        return { apiKey: form.apiKey, headerName: form.apiKeyHeader };
      case 'basic':
        return {
          username: form.basicUsername,
          ...(form.basicPassword && { password: form.basicPassword }),
        };
      default:
        return undefined;
    }
  };

  const testConnection = async () => {
    if (!validateForm()) return;

    setValidation({
      isValidating: true,
      isValid: null,
      columns: [],
      types: {},
      preview: [],
      error: null,
    });

    try {
      const result = await processingService.detectColumns({
        type: form.type,
        endpoint: form.type !== 'csv' ? form.endpoint : undefined,
        filePath: form.type === 'csv' ? form.filePath : undefined,
        httpMethod: form.type === 'json' ? form.httpMethod : undefined,
        authType: form.authType !== 'none' ? form.authType : undefined,
        authConfig: buildAuthConfig(),
        esIndex: form.type === 'elasticsearch' ? form.esIndex : undefined,
      });

      setValidation({
        isValidating: false,
        isValid: true,
        columns: result.columns,
        types: result.types,
        preview: result.preview,
        error: null,
      });
    } catch (err) {
      setValidation({
        isValidating: false,
        isValid: false,
        columns: [],
        types: {},
        preview: [],
        error: err instanceof Error ? err.message : t('datasources.connectionFailed'),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(form);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Button type="button" size="sm" variant="ghost" onClick={() => navigate('/datasources')}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" size="sm" variant="ghost" onClick={() => navigate('/datasources')}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={testConnection}
            isLoading={validation.isValidating}
            disabled={validation.isValidating}
          >
            {t('datasources.testConnection')}
          </Button>
          <Button
            type="submit"
            size="sm"
            form="datasource-form"
            isLoading={isSubmitting}
            disabled={mode === 'create' && validation.isValid !== true}
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      <form id="datasource-form" onSubmit={handleSubmit} className="flex-1 min-h-0 flex gap-6 pt-4">
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {t('datasources.form.generalInfo')}
            </h2>
            <div className="space-y-3">
              <Input
                label={t('datasources.name')}
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder={t('datasources.form.namePlaceholder')}
                error={errors.name}
              />
              {typeReadOnly ? (
                <Input
                  label={t('datasources.type')}
                  value={getTypeLabel(form.type)}
                  disabled
                  helperText={t('datasources.form.notModifiable')}
                />
              ) : (
                <Select
                  label={t('datasources.type')}
                  value={form.type}
                  onChange={e => updateField('type', e.target.value as DataSourceType)}
                  options={getTypeOptions()}
                />
              )}
              <Select
                label={t('datasources.visibility')}
                value={form.visibility}
                onChange={e => updateField('visibility', e.target.value as 'private' | 'public')}
                options={getVisibilityOptions()}
              />
            </div>
          </div>

          {form.type === 'json' && (
            <div className="shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('datasources.form.apiConfig')}
              </h2>
              <div className="space-y-3">
                <Input
                  label={t('datasources.form.urlEndpoint')}
                  value={form.endpoint}
                  onChange={e => updateField('endpoint', e.target.value)}
                  placeholder={t('datasources.form.endpointPlaceholder')}
                  error={errors.endpoint}
                />
                <Select
                  label={t('datasources.form.httpMethod')}
                  value={form.httpMethod}
                  onChange={e => updateField('httpMethod', e.target.value as HttpMethod)}
                  options={HTTP_METHOD_OPTIONS}
                />
              </div>
            </div>
          )}

          {form.type === 'csv' && (
            <div className="shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('datasources.form.csvConfig')}
              </h2>
              <Input
                label={t('datasources.form.filePath')}
                value={form.filePath}
                onChange={e => updateField('filePath', e.target.value)}
                placeholder={t('datasources.form.filePathPlaceholder')}
                error={errors.filePath}
              />
            </div>
          )}

          {form.type === 'elasticsearch' && (
            <div className="shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('datasources.form.esConfig')}
              </h2>
              <div className="space-y-3">
                <Input
                  label={t('datasources.form.clusterUrl')}
                  value={form.endpoint}
                  onChange={e => updateField('endpoint', e.target.value)}
                  placeholder={t('datasources.form.clusterUrlPlaceholder')}
                  error={errors.endpoint}
                />
                <Input
                  label={t('datasources.form.index')}
                  value={form.esIndex}
                  onChange={e => updateField('esIndex', e.target.value)}
                  placeholder={t('datasources.form.indexPlaceholder')}
                  error={errors.esIndex}
                />
              </div>
            </div>
          )}

          {(form.type === 'json' || form.type === 'elasticsearch') && (
            <div className="shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('datasources.form.authentication')}
              </h2>
              <div className="space-y-3">
                <Select
                  label={t('datasources.form.authType')}
                  value={form.authType}
                  onChange={e => updateField('authType', e.target.value as AuthType)}
                  options={getAuthTypeOptions()}
                />

                {form.authType === 'bearer' && (
                  <Input
                    label={t('datasources.form.token')}
                    type="password"
                    value={form.authToken}
                    onChange={e => updateField('authToken', e.target.value)}
                    error={errors.authToken}
                  />
                )}

                {form.authType === 'apiKey' && (
                  <>
                    <Input
                      label={t('datasources.form.apiKey')}
                      type="password"
                      value={form.apiKey}
                      onChange={e => updateField('apiKey', e.target.value)}
                      error={errors.apiKey}
                    />
                    <Input
                      label={t('datasources.form.header')}
                      value={form.apiKeyHeader}
                      onChange={e => updateField('apiKeyHeader', e.target.value)}
                      placeholder={t('datasources.form.headerPlaceholder')}
                    />
                  </>
                )}

                {form.authType === 'basic' && (
                  <>
                    <Input
                      label={t('datasources.form.username')}
                      value={form.basicUsername}
                      onChange={e => updateField('basicUsername', e.target.value)}
                      error={errors.basicUsername}
                    />
                    <Input
                      label={t('auth.password')}
                      type="password"
                      value={form.basicPassword}
                      onChange={e => updateField('basicPassword', e.target.value)}
                      placeholder={
                        mode === 'edit' ? t('datasources.form.leaveEmptyToKeep') : undefined
                      }
                      error={errors.basicPassword}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="shrink-0">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {t('datasources.form.advancedOptions')}
            </h2>
            <Select
              label={t('datasources.form.timestampField')}
              value={form.timestampField}
              onChange={e => updateField('timestampField', e.target.value)}
              helperText={t('datasources.form.timestampHelp')}
              disabled={validation.columns.length === 0}
              options={timestampFieldOptions}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden">
          {validation.isValid === true && (
            <div className="shrink-0 flex items-center gap-2 px-3 py-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="h-4 w-4" />
              <span>
                {t('datasources.connectionSuccess')} - {validation.columns.length}{' '}
                {t('datasources.columns')}, {validation.preview.length} {t('datasources.rows')}
              </span>
            </div>
          )}

          {validation.isValid === false && (
            <div className="shrink-0 flex items-start gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <ExclamationCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{validation.error}</span>
            </div>
          )}

          {validation.isValid === true && (
            <Card className="flex-1 min-h-0 overflow-auto">
              <DataPreviewTable
                columns={validation.columns}
                types={validation.types}
                preview={validation.preview}
              />
            </Card>
          )}

          {validation.isValid !== true && (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('datasources.preview.title')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {t('datasources.preview.description')}
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
