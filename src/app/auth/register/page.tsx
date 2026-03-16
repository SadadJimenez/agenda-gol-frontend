'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.username) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // 1. Register User
      await authApi.post('/register', {
        ...formData,
        role: 'user'
      });
      
      // 2. Auto-login immediately
      const res = await authApi.post('/login', {
        email: formData.email,
        password: formData.password
      });
      
      const token = res.data.access_token;
      
      const meRes = await authApi.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAuth(meRes.data, token);
      router.push('/fields');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error en registro. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
          <h2 style={{ fontSize: '1.25rem' }}>Registro de cuenta</h2>
          <p className="text-muted text-sm mt-2">Crea tu usuario para empezar a reservar</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full justify-center mb-6" style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div className="form-group gap-2">
            <label className="form-label">Username</label>
            <input 
              name="username"
              type="text" 
              className="input" 
              placeholder="juanxyz"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group gap-2 mt-4">
            <label className="form-label">Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              className="input" 
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group gap-2 mt-4">
            <label className="form-label">Contraseña</label>
            <input 
              name="password"
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6" style={{ padding: '0.625rem' }} disabled={loading}>
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm">
          <span className="text-muted">¿Ya tienes cuenta?</span>{' '}
          <Link href="/auth/login" style={{ color: 'var(--foreground)', fontWeight: 500, borderBottom: '1px solid var(--foreground)' }}>
            Ingresa aquí
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
