/**
 * Auth Service Tests
 * @module data/services/auth.service.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service';
import { httpClient } from './http.client';

// Mock httpClient
vi.mock('./http.client', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call /auth/login with credentials and return auth response', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', username: 'testuser' },
        token: 'jwt-token-123',
      };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

      const credentials = { email: 'test@test.com', password: 'password123' };
      const result = await authService.login(credentials);

      expect(httpClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual({
        user: mockResponse.user,
        accessToken: mockResponse.token,
      });
    });

    it('should throw error on invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(httpClient.post).mockRejectedValue(error);

      const credentials = { email: 'bad@test.com', password: 'wrong' };

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      vi.mocked(httpClient.post).mockRejectedValue(networkError);

      await expect(authService.login({ email: 'test@test.com', password: 'pass' })).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('register', () => {
    it('should call /auth/register with user data and return auth response', async () => {
      const mockResponse = {
        user: { id: '2', email: 'new@test.com', username: 'newuser' },
        token: 'jwt-token-456',
      };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

      const registerData = {
        email: 'new@test.com',
        password: 'password123',
        username: 'newuser',
      };
      const result = await authService.register(registerData);

      expect(httpClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual({
        user: mockResponse.user,
        accessToken: mockResponse.token,
      });
    });

    it('should throw error when email already exists', async () => {
      const error = new Error('Email already exists');
      vi.mocked(httpClient.post).mockRejectedValue(error);

      await expect(
        authService.register({
          email: 'existing@test.com',
          password: 'pass',
          username: 'user',
        }),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('getMe', () => {
    it('should fetch current user profile', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        username: 'testuser',
      };
      vi.mocked(httpClient.get).mockResolvedValue(mockUser);

      const result = await authService.getMe();

      expect(httpClient.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when not authenticated', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(httpClient.get).mockRejectedValue(error);

      await expect(authService.getMe()).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('should complete without error', async () => {
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });
});
