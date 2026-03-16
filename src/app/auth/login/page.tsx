'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Required fields are missing.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const res = await authApi.post('/login', {
        email,
        password
      });
      
      const token = res.data.access_token;
      
      const meRes = await authApi.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAuth(meRes.data, token);
      router.push('/fields');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center" style={{ minHeight: 'calc(100vh - 120px)', alignItems: 'center' }}>
      <motion.div 
        className="w-full" 
        style={{ maxWidth: '380px' }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-6 flex items-center justify-center border" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--surface)' }}>
            <Hexagon size={20} color="var(--foreground)" />
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>Iniciar sesión</h2>
          <p className="text-muted text-sm mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full justify-center mb-6" style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div className="form-group gap-2">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="input" 
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group gap-2 mt-4">
            <label className="form-label flex justify-between">
              Contraseña
              <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>¿Olvidada?</span>
            </label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6" style={{ padding: '0.625rem' }} disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm">
          <span className="text-muted">¿No tienes cuenta?</span>{' '}
          <Link href="/auth/register" style={{ color: 'var(--foreground)', fontWeight: 500, borderBottom: '1px solid var(--foreground)' }}>
            Crear cuenta
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
