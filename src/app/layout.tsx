import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgendaGol - Reserva de Canchas',
  description: 'Sistema moderno de gestión de reservas de canchas de fútbol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container animate-fade-in" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
