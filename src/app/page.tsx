'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Search, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '4rem', marginTop: '2rem' }}>
      <section className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Reserva tu Cancha en Segundos
        </motion.h1>
        <motion.p 
          className="text-muted mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: '1.25rem', lineHeight: 1.6 }}
        >
          AgendaGol es el sistema más rápido y moderno para gestionar reservas de canchas de fútbol. 
          Encuentra disponibilidad, elige tu horario y asegúrate el mejor partido.
        </motion.p>
        
        <motion.div 
          className="flex-center mt-8" 
          style={{ gap: '1rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/fields" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <Search size={20} /> Ver Canchas Disponibles
          </Link>
          <Link href="/auth/register" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Registrarse
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-3" style={{ gap: '2rem', marginTop: '3rem' }}>
        {[
          { icon: <Zap size={32} color="var(--primary)" />, title: "Rápido y Fácil", desc: "Elige un horario, confirma y listo en menos de 2 minutos." },
          { icon: <Calendar size={32} color="var(--secondary)" />, title: "Sincronizado", desc: "La disponibilidad se actualiza en tiempo real. Cero errores." },
          { icon: <ShieldCheck size={32} color="var(--accent)" />, title: "Seguro y Confiable", desc: "Historial de reservas, cancelación sencilla y atención dedicada." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            className="glass-panel" 
            style={{ padding: '2rem', textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex-center mb-4">{feat.icon}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feat.title}</h3>
            <p className="text-muted">{feat.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
