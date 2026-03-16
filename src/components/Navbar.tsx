'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, LayoutDashboard, Calendar, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <nav className="navbar-app" style={{ height: '65px' }} />;

  return (
    <nav className="navbar-app">
      <div className="container flex items-center justify-between" style={{ height: '65px' }}>
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div style={{ background: 'var(--foreground)', color: 'var(--background)', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
              AG
            </div>
            AgendaGol
          </Link>
          
          <div className="flex gap-6 text-sm text-muted font-medium">
            <Link href="/fields" style={{ color: pathname === '/fields' ? 'var(--foreground)' : 'inherit' }} className="flex items-center gap-2">
              <Search size={14} /> Canchas
            </Link>
            
            {isAuthenticated && (
              <Link href="/reservations" style={{ color: pathname === '/reservations' ? 'var(--foreground)' : 'inherit' }} className="flex items-center gap-2">
                <Calendar size={14} /> Reservas
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/dashboard" style={{ color: pathname === '/dashboard' ? 'var(--foreground)' : 'inherit' }} className="flex items-center gap-2">
                <LayoutDashboard size={14} /> Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-muted" style={{ padding: '0.5rem 0.75rem' }}>
                Entrar
              </Link>
              <Link href="/auth/register" className="btn btn-primary">
                Regístrate
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border" style={{ padding: '4px 12px', borderLeft: '1px solid var(--border)', marginLeft: '8px' }}>
                <span className="text-sm font-medium">{user?.first_name || user?.username}</span>
              </div>
              <button onClick={logout} className="text-muted text-sm flex items-center gap-2" title="Cerrar sesión">
                <LogOut size={16} /> Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
