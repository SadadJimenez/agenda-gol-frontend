'use client';

import { useEffect, useState } from 'react';
import { reservationsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, XCircle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Reservation {
  id: string;
  field_id: string;
  field_name?: string; // We might need to fetch field names or backend provides
  start_time: string;
  duration_hours: number;
  status: string; // 'active', 'cancelled', 'completed'
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await reservationsApi.get('/my');
      const data = Array.isArray(res.data) ? res.data : res.data?.reservations || [];
      setReservations(data);
    } catch (err: any) {
      setMessage({ text: 'Error al cargar tus reservas', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
    
    setCancellingId(id);
    try {
      await reservationsApi.post(`/${id}/cancel`, {
        reason: "Cancelado por el usuario"
      });
      setMessage({ text: 'Reserva cancelada con éxito', type: 'success' });
      fetchReservations();
    } catch (err: any) {
      setMessage({ text: err.response?.data?.detail || 'Error al cancelar la reserva', type: 'danger' });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Cargando tus reservas...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-4">
        <h2>Mis Reservas</h2>
        <div className="badge badge-info gap-2 flex items-center">
          <Calendar size={16} /> {reservations.length} Reservas
        </div>
      </div>

      {message.text && (
        <div className={`badge badge-${message.type} w-full text-center`} style={{ padding: '1rem', marginBottom: '1.5rem', display: 'block' }}>
          {message.text}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="glass-panel text-center text-muted w-full" style={{ padding: '4rem 2rem' }}>
          <Calendar size={48} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
          No tienes reservas actualmente.
        </div>
      ) : (
        <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
          {reservations.map((res, i) => {
             const statusColor = res.status === 'activa' || res.status === 'active' || res.status === 'CONFIRMED' 
                ? 'success' 
                : res.status.includes('cancel') ? 'danger' : 'warning';
             
             return (
              <motion.div 
                key={res.id}
                className="glass-panel flex justify-between"
                style={{ padding: '1.5rem', alignItems: 'center', opacity: statusColor === 'danger' ? 0.7 : 1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-4">
                  <div className="flex-center" style={{ 
                    width: '60px', height: '60px', borderRadius: 'var(--radius)', 
                    background: `var(--${statusColor})`, color: 'white', 
                    opacity: 0.2, position: 'relative' 
                  }}>
                    {statusColor === 'success' && <CheckCircle style={{ position: 'absolute' }} />}
                    {statusColor === 'danger' && <XCircle style={{ position: 'absolute' }} />}
                    {statusColor === 'warning' && <Clock style={{ position: 'absolute' }} />}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>
                      Cancha #{res.field_id} {res.field_name && `- ${res.field_name}`}
                    </h3>
                    <div className="text-muted flex items-center gap-2">
                      <Clock size={16} /> 
                      {res.start_time ? format(new Date(res.start_time), 'dd/MM/yyyy HH:mm') : 'Fecha no disponible'}
                      <span style={{ margin: '0 0.5rem' }}>•</span> 
                      {res.duration_hours} hora(s)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`badge badge-${statusColor}`} style={{ textTransform: 'uppercase' }}>
                    {res.status}
                  </span>
                  
                  {(statusColor === 'success' || res.status === 'active') && (
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      onClick={() => handleCancel(res.id)}
                      disabled={cancellingId === res.id}
                    >
                      {cancellingId === res.id ? 'Cancelando...' : 'Cancelar Reserva'}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  );
}
