import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { CORE_API_URL, PROCESSING_API_URL, STORAGE_KEYS } from '@/core/constants';
import type { ApiError, ApiResponse } from '@type/api.types';

type ApiType = 'core' | 'processing';

function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  client.interceptors.request.use(
    config => {
      const stored = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
      return config;
    },
    error => Promise.reject(error),
  );

  client.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );

  return client;
}

const coreClient = createHttpClient(CORE_API_URL);
const processingClient = createHttpClient(PROCESSING_API_URL);

function getClient(api: ApiType): AxiosInstance {
  return api === 'processing' ? processingClient : coreClient;
}

/**
 * HTTP Client for making API requests to core-api and processing-api
 */
class HttpClient {
  async get<T>(url: string, api: ApiType = 'core'): Promise<ApiResponse<T>> {
    const response = await getClient(api).get<ApiResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, api: ApiType = 'core'): Promise<ApiResponse<T>> {
    const response = await getClient(api).post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, api: ApiType = 'core'): Promise<ApiResponse<T>> {
    const response = await getClient(api).patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string, api: ApiType = 'core'): Promise<ApiResponse<T>> {
    const response = await getClient(api).delete<ApiResponse<T>>(url);
    return response.data;
  }

  async postFormData<T>(
    url: string,
    formData: FormData,
    api: ApiType = 'core',
  ): Promise<ApiResponse<T>> {
    const response = await getClient(api).post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const httpClient = new HttpClient();
export type { ApiType };
