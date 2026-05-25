import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@type/auth.types';
import { STORAGE_KEYS } from '@/core/constants';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: user => set({ user, isAuthenticated: !!user }),

      login: user =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: isLoading => set({ isLoading }),
    }),
    {
      name: STORAGE_KEYS.TOKEN,
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
