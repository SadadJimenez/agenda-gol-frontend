'use client';

import { useEffect, useState } from 'react';
import { reservationsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, XCircle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Reservation {
  id: string;
  field_id: string;
  field_name?: string;
  start_time: string;
  duration_hours: number;
  status: string;
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
      setMessage({ text: 'Error de red - No se pudo conectar.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Esta acción no se puede deshacer. ¿Seguro?')) return;
    
    setCancellingId(id);
    try {
      await reservationsApi.post(`/${id}/cancel`, {
        reason: "Cancelado por el usuario"
      });
      setMessage({ text: 'Reserva eliminada con éxito', type: 'success' });
      fetchReservations();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const errorMsg = Array.isArray(detail) ? detail[0]?.msg : (typeof detail === 'string' ? detail : 'Error en microservicio local');
      setMessage({ text: errorMsg, type: 'danger' });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="flex justify-center mt-8 text-sm text-muted">Obteniendo tus reservas...</div>;

  return (
    <div className="container mt-8" style={{ maxWidth: '800px' }}>
      <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Mis Reservas</h2>
        <div className="badge badge-secondary gap-2 text-xs">
          {reservations.length} Registradas
        </div>
      </div>

      {message.text && (
        <div className={`badge badge-${message.type} w-full justify-center text-sm`} style={{ padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
          {message.text}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="card text-center text-muted w-full flex flex-col items-center justify-center" style={{ padding: '4.5rem 2rem' }}>
          <Calendar size={32} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
          <p className="text-sm">Aún no tienes horarios agendados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map((res, i) => {
             const statusColor = res.status === 'activa' || res.status === 'active' || res.status === 'CONFIRMED' 
                ? 'success' 
                : res.status.includes('cancel') ? 'danger' : 'warning';
             
             return (
              <motion.div 
                key={res.id}
                className="card flex justify-between items-center"
                style={{ padding: '1.25rem', opacity: statusColor === 'danger' ? 0.6 : 1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <div className="flex gap-4 items-center">
                  <div className="flex items-center justify-center" style={{ 
                    width: '40px', height: '40px', borderRadius: '6px', 
                    background: `var(--${statusColor})`, color: 'white', 
                    opacity: 0.8, fill: 'currentColor'
                  }}>
                    {statusColor === 'success' && <CheckCircle size={18} />}
                    {statusColor === 'danger' && <XCircle size={18} />}
                    {statusColor === 'warning' && <Clock size={18} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      Cancha #{res.field_id} {res.field_name && `• ${res.field_name}`}
                    </h3>
                    <div className="text-muted text-xs flex items-center gap-2">
                      <Clock size={12} /> 
                      {res.start_time ? format(new Date(res.start_time), 'dd/MM/yyyy HH:mm') : '--/--/----'}
                      <span style={{ margin: '0 0.25rem' }}>|</span> 
                      {res.duration_hours} hr(s)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`badge badge-${statusColor}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    {res.status}
                  </span>
                  
                  {(statusColor === 'success' || res.status === 'active') && (
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--border)' }}
                      onClick={() => handleCancel(res.id)}
                      disabled={cancellingId === res.id}
                    >
                      {cancellingId === res.id ? '...' : 'Anular'}
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
