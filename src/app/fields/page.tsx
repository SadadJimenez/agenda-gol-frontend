'use client';

import { useEffect, useState } from 'react';
import { fieldsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Field {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price_per_hour: number;
  image_url: string;
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fieldsApi.get('/');
        // Extract array from paginated response
        const data = Array.isArray(res.data) ? res.data : res.data?.fields || [];
        setFields(data);
      } catch (err) {
        setError('Error al cargar las canchas. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div style={{ padding: '2rem', fontSize: '1.2rem' }}>Cargando canchas...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Canchas Disponibles</h2>
      </div>

      {error ? (
        <div className="badge badge-danger w-full text-center" style={{ padding: '1rem', fontSize: '1rem' }}>
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {fields.map((field, idx) => (
            <motion.div 
              key={field.id}
              className="glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ y: -5, boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)' }}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div 
                style={{ 
                  height: '200px', 
                  backgroundImage: `url(${field.image_url || 'https://images.unsplash.com/photo-1575361204481-482270bb3f21'})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  backgroundColor: 'var(--border)'
                }} 
              />
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{field.name}</h3>
                
                <div className="flex items-center text-muted mb-2 gap-2">
                  <MapPin size={16} /> <span style={{ fontSize: '0.9rem' }}>{field.location}</span>
                </div>
                
                <div className="flex items-center justify-between mt-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} color="var(--primary)" /> 
                    <span style={{ fontWeight: 600 }}>{field.capacity} jg.</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <DollarSign size={16} color="var(--secondary)" /> 
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>S/ {field.price_per_hour}/hr</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link href={`/fields/${field.id}`} className="btn btn-primary w-full gap-2">
                    <Calendar size={18} /> Ver Horarios
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          {fields.length === 0 && (
             <div className="text-muted w-full text-center" style={{ gridColumn: 'span 3', padding: '3rem' }}>
               No hay canchas registradas en este momento.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
