'use client';

import { useEffect, useState } from 'react';
import { fieldsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar } from 'lucide-react';
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
        const data = Array.isArray(res.data) ? res.data : res.data?.fields || [];
        setFields(data);
      } catch (err) {
        setError('Error al cargar la información. Reintenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <span className="text-muted text-sm">Cargando canchas...</span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Canchas Disponibles</h2>
        <span className="badge badge-secondary">{fields.length} listadas</span>
      </div>

      {error ? (
        <div className="badge badge-danger w-full justify-center" style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {fields.map((field, idx) => (
            <motion.div 
              key={field.id}
              className="card flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div 
                style={{ 
                  height: '180px', 
                  backgroundImage: `url(${field.image_url || 'https://images.unsplash.com/photo-1575361204481-482270bb3f21'})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  backgroundColor: 'var(--border)'
                }} 
              />
              <div className="flex flex-col" style={{ padding: '1.25rem', flex: 1 }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold" style={{ fontSize: '1rem', lineHeight: '1.2' }}>{field.name}</h3>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>S/ {field.price_per_hour}<span className="text-muted font-medium" style={{ fontSize: '0.75rem' }}>/hr</span></span>
                </div>
                
                <div className="flex items-center text-muted gap-2 mb-4">
                  <MapPin size={14} /> <span className="text-sm">{field.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-6 text-sm text-muted">
                  <Users size={14} /> 
                  <span>{field.capacity} jg.</span>
                </div>

                <div className="mt-auto">
                  <Link href={`/fields/${field.id}`} className="btn btn-primary w-full gap-2">
                    <Calendar size={14} /> Ver Horarios
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
