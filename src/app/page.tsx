'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 mt-8">
      <section className="flex flex-col mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '4rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ maxWidth: '700px' }}
        >
          <div className="badge badge-secondary mb-4" style={{ borderRadius: '4px' }}>
            Prueba Técnica - Naowee
          </div>
          <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.04em', lineHeight: '1.05', marginBottom: '1.5rem' }}>
            Reserva una cancha. <br />
            <span style={{ color: 'var(--primary)' }}>Sin fricción.</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '500px', marginBottom: '2.5rem' }}>
            El sistema definitivo para gestionar reservas, consultar disponibilidad en tiempo real y coordinar tus partidos de fútbol con la mejor infraestructura moderna.
          </p>
          
          <div className="flex gap-4">
            <Link href="/fields" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '4px' }}>
              Explorar Canchas <ArrowRight size={16} />
            </Link>
            <Link href="/auth/login" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: '4px' }}>
              Iniciar Sesión
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold" style={{ fontSize: '1rem' }}>Por qué AgendaGol</h3>
      </div>

      <section className="grid grid-cols-3 gap-6">
        {[
          { icon: <Search size={20} color="var(--primary)" />, title: "Disponibilidad Inmediata", desc: "Sincronización en tiempo real con microservicios de agenda." },
          { icon: <Calendar size={20} color="var(--primary)" />, title: "Pagos y Confirmación", desc: "No pierdas tu cupo. Reserva en bloques exactos de 1 o 2 horas." },
          { icon: <ShieldCheck size={20} color="var(--primary)" />, title: "Seguridad y Roles", desc: "Gestión avanzada de permisos y dashboard para administradores." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            className="card flex flex-col justify-between" 
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
          >
            <div className="mb-8" style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '4px', display: 'inline-flex' }}>
              {feat.icon}
            </div>
            <div>
              <h4 className="font-medium" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{feat.title}</h4>
              <p className="text-muted text-sm">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
