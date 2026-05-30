import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User, LoginLog, AdminStats } from '@/types';
import { QUERY_KEYS } from '@/constants/queryKeys';


export function useAdminStats() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_STATS,
    queryFn: async () => {
      const { data } = await api.get<AdminStats>('/admin/stats');
      return data;
    },
  });
}


export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS,
    queryFn: async () => {
      const { data } = await api.get<{ users: User[] }>('/admin/users');
      return data.users;
    },
  });
}


export function useLoginLogs() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_LOGIN_LOGS,
    queryFn: async () => {
      const { data } = await api.get<{ logs: LoginLog[] }>('/admin/login-logs');
      return data.logs;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const { data } = await api.put(`/admin/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BASE });
    },
  });
}

export function useUpdateUserSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, subscription }: { id: number; subscription: string }) => {
      const { data } = await api.put(`/admin/users/${id}/subscription`, { subscription });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BASE });
    },
  });
}


export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { data } = await api.put(`/admin/users/${id}/status`, { is_active });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BASE });
    },
  });
}
