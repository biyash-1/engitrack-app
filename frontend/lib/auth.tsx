'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
export { useAuth } from '@/hooks/useAuth';
