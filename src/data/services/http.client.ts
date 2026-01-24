import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { CORE_API_URL, STORAGE_KEYS } from '@/core/constants';

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

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
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
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
  async get<T>(url: string): Promise<T> {
    const response = await getClient().get<T>(url);
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
