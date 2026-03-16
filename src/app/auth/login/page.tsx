'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
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
      setError('Por favor, ingresa correo y contraseña.');
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
      
      // Obtener los datos del usuario actual
      const meRes = await authApi.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAuth(meRes.data, token);
      router.push('/fields');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <motion.div 
        className="glass-panel w-full" 
        style={{ maxWidth: '400px', padding: '2rem' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-4">
          <div className="flex-center" style={{ marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
              <LogIn color="white" size={32} />
            </div>
          </div>
          <h2>Iniciar Sesión</h2>
          <p className="text-muted">Ingresa a tu cuenta de AgendaGol</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full text-center" style={{ padding: '0.75rem', marginBottom: '1rem', display: 'block' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem' }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-muted">¿No tienes cuenta? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Regístrate</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
