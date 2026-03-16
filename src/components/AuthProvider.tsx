'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      router.push('/auth/login');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [logout, router]);

  return <>{children}</>;
}
