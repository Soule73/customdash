import type { AuthType, AuthConfig } from './datasource.types';

export interface DetectColumnsConfig {
  type: string;
  endpoint?: string;
  filePath?: string;
  storageType?: 'local' | 'r2';
  httpMethod?: 'GET' | 'POST';
  authType?: AuthType;
  authConfig?: AuthConfig;
  esIndex?: string;
}

export interface DetectColumnsResult {
  columns: string[];
  types: Record<string, string>;
  preview: Record<string, unknown>[];
}
