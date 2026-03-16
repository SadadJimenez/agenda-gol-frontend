'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { BarChart, Users, DollarSign, Activity, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [fieldStats, setFieldStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const [statsRes, fieldsRes] = await Promise.all([
          adminApi.get('/stats'),
          adminApi.get('/fields/stats')
        ]);
        setGlobalStats(statsRes.data);
        setFieldStats(Array.isArray(fieldsRes.data) ? fieldsRes.data : []);
      } catch (err) {
        console.error('Error fetching admin dashboard content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Cargando Panel Administrativo...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-4">
        <h2>Dashboard Administrativo</h2>
        <div className="badge badge-info gap-2 flex items-center">
          <Settings2 size={16} /> Admin Mode
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Usuarios Registrados', value: globalStats?.total_users || 0, icon: <Users size={24} color="var(--primary)" /> },
          { label: 'Canchas Activas', value: globalStats?.total_fields || 0, icon: <Activity size={24} color="var(--secondary)" /> },
          { label: 'Total Reservas', value: globalStats?.total_reservations || 0, icon: <BarChart size={24} color="var(--accent)" /> },
          { label: 'Ingresos Estimados', value: `S/ ${globalStats?.total_revenue || 0}`, icon: <DollarSign size={24} color="var(--danger)" /> }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            className="glass-panel text-center"
            style={{ padding: '2rem 1.5rem' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <div className="flex-center" style={{ marginBottom: '1rem', background: 'var(--border)', width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 1.5rem' }}>
              {stat.icon}
            </div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{stat.value}</h3>
            <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <h3>Estadísticas por Cancha</h3>
      
      <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
        {fieldStats.length === 0 ? (
          <div className="text-muted text-center w-full" style={{ gridColumn: 'span 3', padding: '2rem' }}>
            No hay estadísticas de canchas disponibles
          </div>
        ) : (
          fieldStats.map((fs, i) => (
            <motion.div 
              key={fs.field_id || i}
              className="glass-panel"
              style={{ padding: '1.5rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                {fs.field_name || `Cancha #${fs.field_id}`}
              </h4>
              <div className="flex justify-between items-center mt-4">
                <span className="text-muted">Reservas</span>
                <span style={{ fontWeight: 'bold' }}>{fs.total_reservations || 0}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted">Horas Jugadas</span>
                <span style={{ fontWeight: 'bold' }}>{fs.total_hours || 0} h</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted">Ingresos</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>S/ {fs.total_revenue || 0}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
