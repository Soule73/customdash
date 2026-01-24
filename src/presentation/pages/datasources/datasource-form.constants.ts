import i18n from '@core/i18n';
import type { DataSourceType, AuthType, HttpMethod } from '@type/datasource.types';

const t = (key: string) => i18n.t(key);

export interface DataSourceFormState {
  name: string;
  type: DataSourceType;
  endpoint: string;
  filePath: string;
  httpMethod: HttpMethod;
  authType: AuthType;
  authToken: string;
  apiKey: string;
  apiKeyHeader: string;
  basicUsername: string;
  basicPassword: string;
  esIndex: string;
  timestampField: string;
  visibility: 'private' | 'public';
}

export const INITIAL_FORM_STATE: DataSourceFormState = {
  name: '',
  type: 'json',
  endpoint: '',
  filePath: '',
  httpMethod: 'GET',
  authType: 'none',
  authToken: '',
  apiKey: '',
  apiKeyHeader: 'X-API-Key',
  basicUsername: '',
  basicPassword: '',
  esIndex: '',
  timestampField: '',
  visibility: 'private',
};

export const getTypeOptions = () => [
  { value: 'json', label: t('datasources.types.json') },
  { value: 'csv', label: t('datasources.types.csv') },
  { value: 'elasticsearch', label: t('datasources.types.elasticsearch') },
];

export const HTTP_METHOD_OPTIONS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
];

export const getAuthTypeOptions = () => [
  { value: 'none', label: t('datasources.auth.none') },
  { value: 'bearer', label: t('datasources.auth.bearer') },
  { value: 'apiKey', label: t('datasources.auth.apiKey') },
  { value: 'basic', label: t('datasources.auth.basic') },
];

export const getVisibilityOptions = () => [
  { value: 'private', label: t('common.private') },
  { value: 'public', label: t('common.public') },
];

export const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    json: t('datasources.types.json'),
    csv: t('datasources.types.csv'),
    elasticsearch: t('datasources.types.elasticsearch'),
  };
  return labels[type] || type;
};

export interface ValidationState {
  isValidating: boolean;
  isValid: boolean | null;
  columns: string[];
  types: Record<string, string>;
  preview: Record<string, unknown>[];
  error: string | null;
}

export const INITIAL_VALIDATION_STATE: ValidationState = {
  isValidating: false,
  isValid: null,
  columns: [],
  types: {},
  preview: [],
  error: null,
};
