'use client';
import { create } from 'zustand';
import api from '@/lib/api';
import type { User, AuthResponse } from '@/types';
import { useShallow } from 'zustand/react/shallow';
interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        role: role || 'viewer',
      });
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isLoading: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<{ user: User }>('/auth/me');
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
}));

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isLoading: state.isLoading,
      login: state.login,
      register: state.register,
      logout: state.logout,
      checkAuth: state.checkAuth,
      isAdmin: state.user?.role === 'admin',
      isEngineer: state.user?.role === 'engineer',
      isViewer: state.user?.role === 'viewer',
    }))
  );
}