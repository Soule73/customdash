import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@type/auth.types';
import { STORAGE_KEYS } from '@/core/constants';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: user => set({ user, isAuthenticated: !!user }),

      setToken: token => set({ token }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: isLoading => set({ isLoading }),
    }),
    {
      name: STORAGE_KEYS.TOKEN,
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
