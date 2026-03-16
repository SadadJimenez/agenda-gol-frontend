'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
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
        role: 'user' // Default to user 
      });
      
      // 2. Auto-login immediately
      const res = await authApi.post('/login', {
        email: formData.email,
        password: formData.password
      });
      
      const token = res.data.access_token;
      
      // Get User Data
      const meRes = await authApi.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAuth(meRes.data, token);
      router.push('/fields');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al completar el registro. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh', padding: '2rem 0' }}>
      <motion.div 
        className="glass-panel w-full" 
        style={{ maxWidth: '450px', padding: '2rem' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-4">
          <div className="flex-center" style={{ marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
              <UserPlus color="white" size={32} />
            </div>
          </div>
          <h2>Registrarse</h2>
          <p className="text-muted">Crea una cuenta para reservar canchas</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full text-center" style={{ padding: '0.75rem', marginBottom: '1rem', display: 'block' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre de Usuario</label>
            <input 
              name="username"
              type="text" 
              className="input" 
              placeholder="juanperez"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
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
          
          <div className="form-group">
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

          <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-muted">¿Ya tienes cuenta? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Ingresa aquí</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
