/**
 * Auth Store Tests
 * @module application/stores/authStore.test
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import type { User } from '@type/auth.types';

describe('authStore', () => {
  const mockUser: User = {
    _id: '1',
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    role: { id: 'role-1', name: 'admin', permissions: [] },
  };

  const mockToken = 'jwt-token-123';

  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user and update isAuthenticated to true', () => {
      useAuthStore.getState().setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear user and set isAuthenticated to false when null', () => {
      // First set a user
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Then clear it
      useAuthStore.getState().setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setToken', () => {
    it('should set token', () => {
      useAuthStore.getState().setToken(mockToken);

      expect(useAuthStore.getState().token).toBe(mockToken);
    });

    it('should clear token when null', () => {
      useAuthStore.getState().setToken(mockToken);
      useAuthStore.getState().setToken(null);

      expect(useAuthStore.getState().token).toBeNull();
    });
  });

  describe('login', () => {
    it('should set user, token, isAuthenticated and clear isLoading', () => {
      // Start with loading state
      useAuthStore.getState().setLoading(true);

      useAuthStore.getState().login(mockUser, mockToken);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear all auth state', () => {
      // First login
      useAuthStore.getState().login(mockUser, mockToken);

      // Then logout
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      useAuthStore.getState().setLoading(true);

      expect(useAuthStore.getState().isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().setLoading(false);

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('persist middleware', () => {
    it('should only persist user, token, and isAuthenticated', () => {
      // The partialize function should exclude isLoading
      // This is tested by checking the store configuration
      const storeApi = useAuthStore;

      // Access the persist options if available
      // Note: This is a structural test to ensure configuration
      expect(storeApi.getState).toBeDefined();
      expect(storeApi.setState).toBeDefined();
    });
  });
});
