export type DataSourceType = 'json' | 'csv' | 'elasticsearch';
export type AuthType = 'none' | 'bearer' | 'apiKey' | 'basic';
export type HttpMethod = 'GET' | 'POST';

export interface AuthConfig {
  token?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  headerName?: string;
  queryParam?: string;
  addTo?: 'header' | 'query';
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  endpoint?: string;
  filePath?: string;
  httpMethod?: HttpMethod;
  authType: AuthType;
  authConfig?: AuthConfig;
  timestampField?: string;
  esIndex?: string;
  esQuery?: Record<string, unknown>;
  ownerId: string;
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataSourceData {
  name: string;
  type: DataSourceType;
  endpoint?: string;
  filePath?: string;
  httpMethod?: HttpMethod;
  authType?: AuthType;
  authConfig?: AuthConfig;
  timestampField?: string;
  esIndex?: string;
  esQuery?: Record<string, unknown>;
  visibility?: 'private' | 'public';
}

export interface UpdateDataSourceData {
  name?: string;
  endpoint?: string;
  filePath?: string;
  httpMethod?: HttpMethod;
  authType?: AuthType;
  authConfig?: AuthConfig;
  timestampField?: string;
  esIndex?: string;
  esQuery?: Record<string, unknown>;
  visibility?: 'private' | 'public';
}
