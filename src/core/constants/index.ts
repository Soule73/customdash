export const CORE_API_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3002/api/v1';
export const PROCESSING_API_URL =
  import.meta.env.VITE_PROCESSING_API_URL || 'http://localhost:3003';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CustomDash';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.1';

export const STORAGE_KEYS = {
  TOKEN: 'customdash_token',
  USER: 'customdash_user',
  THEME: 'customdash_theme',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARDS: '/dashboards',
  DASHBOARD_DETAIL: '/dashboards/:id',
  WIDGETS: '/widgets',
  DATASOURCES: '/datasources',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
