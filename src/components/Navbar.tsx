'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, LayoutDashboard, Calendar, Search, LogIn, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <nav className="navbar skeleton-nav" />;

  return (
    <nav className="navbar" style={{
      position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0',
      background: 'var(--surface)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)'
    }}>
      <div className="container flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="logo flex-center" style={{ gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            AGENDA
          </div>
          GOL
        </Link>
        
        <div className="nav-links flex-center" style={{ gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <Link href="/fields" style={{ color: pathname === '/fields' ? 'var(--primary)' : 'inherit' }} className="flex-center gap-2">
            <Search size={18} /> Explora Canchas
          </Link>
          
          {isAuthenticated && (
            <Link href="/reservations" style={{ color: pathname === '/reservations' ? 'var(--primary)' : 'inherit' }} className="flex-center gap-2">
              <Calendar size={18} /> Mis Reservas
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link href="/dashboard" style={{ color: pathname === '/dashboard' ? 'var(--primary)' : 'inherit' }} className="flex-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          )}
        </div>

        <div className="auth-links flex-center" style={{ gap: '1rem' }}>
          {!isAuthenticated ? (
            <>
              <Link href="/auth/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={16} /> Entrar
              </Link>
              <Link href="/auth/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={16} /> Regístrate
              </Link>
            </>
          ) : (
            <div className="user-menu flex-center" style={{ gap: '1rem' }}>
              <span className="user-name" style={{ fontWeight: 600 }}>Hola, {user?.first_name}</span>
              <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem' }}>
                <LogOut size={16} /> Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
