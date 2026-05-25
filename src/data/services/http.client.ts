import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { CORE_API_URL } from '@/core/constants';
import { useAuthStore } from '@stores/authStore';

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _skipAuthRedirect?: boolean;
}

function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
    withCredentials: true,
  });

  client.interceptors.request.use(
    config => config,
    error => Promise.reject(error),
  );

  client.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        const config = error.config as CustomAxiosConfig | undefined;
        if (!config?._skipAuthRedirect) {
          const { isAuthenticated, logout } = useAuthStore.getState();
          if (isAuthenticated) {
            logout();
          }
        }
      }
      const message = error.response?.data?.message || error.message || 'Request failed';
      return Promise.reject(new Error(message));
    },
  );

  return client;
}

const coreClient = createHttpClient(CORE_API_URL);

function getClient(): AxiosInstance {
  return coreClient;
}

class HttpClient {
  async get<T>(url: string, config?: { skipAuthRedirect?: boolean }): Promise<T> {
    const response = await getClient().get<T>(url, {
      _skipAuthRedirect: config?.skipAuthRedirect,
    } as CustomAxiosConfig);
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await getClient().post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await getClient().put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await getClient().patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await getClient().delete<T>(url);
    return response.data;
  }

  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    const response = await getClient().post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const httpClient = new HttpClient();
