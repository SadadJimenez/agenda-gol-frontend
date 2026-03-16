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
        setAvailableSlots(Array.isArray(res.data) ? res.data : res.data?.available_slots || []);
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
      // Formatear a la fecha ISO que espera el backend
      // start_time: "YYYY-MM-DDTHH:MM:SS"
      const startTimeISO = `${date}T${selectedTime.length === 5 ? selectedTime + ':00' : selectedTime}`;
      
      await reservationsApi.post('/', {
        field_id: parseInt(id as string),
        start_time: startTimeISO,
        duration_hours: duration,
        notes: "Reserva desde Frontend"
      });
      
      setMessage({ text: '¡Reserva completada con éxito!', type: 'success' });
      setTimeout(() => router.push('/reservations'), 2000);
    } catch (err: any) {
      setMessage({ text: err.response?.data?.detail || 'Error al realizar la reserva', type: 'danger' });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Cargando detalles...</div>;
  if (!field) return <div className="flex-center badge badge-danger container text-center">No se encontró la cancha.</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
        <motion.div 
          className="glass-panel" 
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ background: 'var(--border)', height: '250px', borderRadius: 'var(--radius)', marginBottom: '1.5rem', backgroundImage: 'url(https://images.unsplash.com/photo-1575361204481-482270bb3f21)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <h1>{field.name}</h1>
          <p className="text-muted mt-2 mb-4" style={{ lineHeight: '1.6' }}>{field.description}</p>
          
          <div className="grid grid-cols-2" style={{ gap: '1rem', marginTop: '2rem' }}>
            <div className="flex items-center gap-2">
              <MapPin color="var(--primary)" /> <span>{field.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users color="var(--primary)" /> <span>Capacidad: {field.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign color="var(--secondary)" /> <span style={{ fontWeight: 'bold' }}>S/ {field.price_per_hour}/hr</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock color="var(--accent)" /> <span>{field.opening_time} - {field.closing_time}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-panel" 
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>Reserva tu Horario</h2>
          
          {message.text && (
            <div className={`badge badge-${message.type} w-full text-center`} style={{ padding: '1rem', marginBottom: '1.5rem', display: 'block' }}>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <CalendarIcon size={16} /> Selecciona una Fecha
            </label>
            <input 
              type="date" 
              className="input" 
              value={date} 
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Horarios Disponibles</label>
            <div className="flex" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              {availableSlots.length === 0 ? (
                <span className="text-muted text-center w-full" style={{ padding: '1rem' }}>No hay horarios disponibles</span>
              ) : (
                availableSlots.map((slot, i) => {
                  const slotStr = typeof slot === 'string' ? slot : slot.start_time || slot.time;
                  // Si el backend devuelve algo como "10:00:00", lo cortamos para mostrar
                  const visualSlot = slotStr.slice(0, 5);
                  
                  return (
                    <button 
                      key={i}
                      className={`btn ${selectedTime === slotStr ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.5rem 1rem' }}
                      onClick={() => setSelectedTime(slotStr)}
                    >
                      {visualSlot}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Duración</label>
            <div className="flex gap-4">
              <button 
                className={`btn w-full ${duration === 1 ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setDuration(1)}
              >
                1 Hora
              </button>
              <button 
                className={`btn w-full ${duration === 2 ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setDuration(2)}
              >
                2 Horas
              </button>
            </div>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-4 text-muted">
              <span>Total a pagar:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>
                S/ {field.price_per_hour * duration}
              </span>
            </div>
            <button 
              className="btn btn-primary w-full gap-2" 
              style={{ padding: '1rem 1.5rem', fontSize: '1.1rem' }}
              onClick={handleBook}
              disabled={bookingLoading}
            >
              <CalendarIcon /> {bookingLoading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
