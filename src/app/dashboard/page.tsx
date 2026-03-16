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

  if (loading) return <div className="text-sm mt-8 text-center text-muted">Construyendo Dashboard...</div>;

  return (
    <div className="container mt-8" style={{ maxWidth: '1000px' }}>
      <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Metrics Panel</h2>
        <div className="badge badge-secondary gap-2 flex items-center text-xs">
          <Settings2 size={12} /> Root Access
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Usuarios', value: globalStats?.total_users || 0, icon: <Users size={16} /> },
          { label: 'Canchas Activas', value: globalStats?.total_fields || 0, icon: <Activity size={16} /> },
          { label: 'Total Reservas', value: globalStats?.total_reservations || 0, icon: <BarChart size={16} /> },
          { label: 'Ingresos Totales', value: `S/ ${globalStats?.total_revenue || 0}`, icon: <DollarSign size={16} /> }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            className="card flex flex-col justify-between"
            style={{ padding: '1.25rem' }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-4 text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--foreground)' }}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Métricas por Cancha</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {fieldStats.length === 0 ? (
          <div className="card text-muted text-center w-full flex items-center justify-center text-sm" style={{ gridColumn: 'span 3', padding: '3rem' }}>
            No hay data histórica registrada aún.
          </div>
        ) : (
          fieldStats.map((fs, i) => (
            <motion.div 
              key={fs.field_id || i}
              className="card"
              style={{ padding: '1.25rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.2 }}
            >
              <h4 className="font-semibold text-sm mb-4 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                {fs.field_name || `ID #${fs.field_id}`}
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Tickets</span>
                  <span className="font-medium">{fs.total_reservations || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Desgaste</span>
                  <span className="font-medium">{fs.total_hours || 0} hrs</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2" style={{ borderTop: '1px dashed var(--border)' }}>
                  <span className="text-muted">Gross</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>S/ {fs.total_revenue || 0}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
