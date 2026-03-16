'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fieldsApi, reservationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { MapPin, Users, DollarSign, Clock, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Field {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price_per_hour: number;
  description: string;
  opening_time: string;
  closing_time: string;
}

export default function FieldDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchField = async () => {
      try {
        const res = await fieldsApi.get(`/${id}`);
        setField(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchField();
  }, [id]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !field) return;
      try {
        const res = await fieldsApi.get(`/${id}/availability?date=${date}`);
        setAvailableSlots(res.data.available_hours || res.data.available_slots || []);
        setSelectedTime(''); // reset on date change
      } catch (err) {
        console.error(err);
      }
    };
    fetchAvailability();
  }, [date, id, field]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!selectedTime) {
      setMessage({ text: 'Por favor, selecciona un horario.', type: 'danger' });
      return;
    }

    setBookingLoading(true);
    try {
      const startTimeISO = `${date}T${selectedTime.length === 5 ? selectedTime + ':00' : selectedTime}`;
      
      await reservationsApi.post('/', {
        field_id: parseInt(id as string),
        start_time: startTimeISO,
        duration_hours: duration,
        notes: "Reserva B2C"
      });
      
      setMessage({ text: 'Reservado.', type: 'success' });
      setTimeout(() => router.push('/reservations'), 2000);
    } catch (err: any) {
      setMessage({ text: err.response?.data?.detail || 'Error al completar', type: 'danger' });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-8 text-sm text-muted">Cargando...</div>;
  if (!field) return <div className="badge badge-danger container text-center mt-8">Cancha no encontrada.</div>;

  return (
    <div className="mt-8 container" style={{ maxWidth: '900px' }}>
      <div className="grid grid-cols-2 gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ background: 'var(--surface)', height: '220px', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', backgroundImage: 'url(https://images.unsplash.com/photo-1575361204481-482270bb3f21)', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }} />
          
          <div className="flex items-center justify-between mb-2">
            <h1 style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{field.name}</h1>
            <span className="badge badge-secondary" style={{ padding: '4px 8px', borderRadius: '4px' }}>S/ {field.price_per_hour}/hr</span>
          </div>

          <p className="text-muted text-sm mt-2 mb-6" style={{ lineHeight: '1.6' }}>{field.description || "Agenda y asegura tu campo sintético de forma rápida y sencilla."}</p>
          
          <div className="flex flex-col gap-3 font-medium text-sm border-t pt-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-muted" /> <span>{field.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} className="text-muted" /> <span>Hasta {field.capacity} jugadores</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-muted" /> <span>Horario: {field.opening_time} — {field.closing_time}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card" 
          style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.125rem' }}>Fecha y Hora</h2>
            <CalendarIcon size={16} className="text-muted" />
          </div>
          
          {message.text && (
            <div className={`badge badge-${message.type} w-full text-center mt-2 mb-4`} style={{ padding: '0.625rem', borderRadius: '4px', display: 'block' }}>
              {message.text}
            </div>
          )}

          <div className="form-group gap-2 mb-4">
            <label className="form-label text-xs uppercase" style={{ letterSpacing: '0.05em' }}>Fecha de reserva</label>
            <input 
              type="date" 
              className="input" 
              value={date} 
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <div className="form-group gap-2 mb-4">
            <label className="form-label text-xs uppercase" style={{ letterSpacing: '0.05em' }}>Horarios Disponibles</label>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.length === 0 ? (
                <span className="text-muted text-sm col-span-4" style={{ gridColumn: 'span 4' }}>Escoge otra fecha con disponibilidad.</span>
              ) : (
                availableSlots.map((slot, i) => {
                  const slotStr = typeof slot === 'string' ? slot : slot.start_time || slot.time;
                  const visualSlot = slotStr.slice(0, 5);
                  
                  return (
                    <button 
                      key={i}
                      className={`btn ${selectedTime === slotStr ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.5rem', borderRadius: '4px' }}
                      onClick={() => setSelectedTime(slotStr)}
                    >
                      {visualSlot}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="form-group gap-2 mb-6">
            <label className="form-label text-xs uppercase" style={{ letterSpacing: '0.05em' }}>Módulo de Uso</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className={`btn w-full ${duration === 1 ? 'btn-secondary' : 'btn-outline'}`}
                style={{ borderRadius: '4px' }}
                onClick={() => setDuration(1)}
              >
                1 Hr
              </button>
              <button 
                className={`btn w-full ${duration === 2 ? 'btn-secondary' : 'btn-outline'}`}
                style={{ borderRadius: '4px' }}
                onClick={() => setDuration(2)}
              >
                2 Hrs
              </button>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>Total final</span>
              <span style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>
                S/ {field.price_per_hour * duration}
              </span>
            </div>
            
            <button 
              className="btn btn-primary w-full" 
              style={{ padding: '0.75rem' }}
              onClick={handleBook}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Agendando...' : 'Confirmar'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
