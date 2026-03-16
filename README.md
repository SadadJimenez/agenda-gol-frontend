# AgendaGol Frontend ⚽

Aplicación web moderna para la gestión de reservas de canchas de fútbol consumiendo una arquitectura de microservicios backend.

## 🌟 Características

- **Diseño Glassmorphism**: Interfaz moderna, limpia y atractiva sin dependencias de frameworks CSS pesados (Vanilla CSS puro enfocado en el rendimiento).
- **Animaciones fluidas**: Desarrollado con `framer-motion` para una experiencia inmersiva e interactiva.
- **Autenticación**: Registro dinámico, inicio de sesión (JWT) y manejo de auto-sesión con persistencia (Zustand).
- **Control de Acceso Dinámico**: Rutas y elementos de menú que responden al rol del usuario (Ej. Dashboard Administrativo).
- **Integración Transparente**: Componentizado para hablar directamente y de forma segura con los microservicios creados previamente.
- **Responsive Design**: Accesible perfectamente desde dispositivos móviles y de escritorio.

## 🛠️ Stack Tecnológico

- **Framework**: `Next.js 15` (App Router) + `React 19`
- **Lenguaje**: `TypeScript` (Tipado riguroso, mejor mantenimiento a largo plazo)
- **Estilos**: Vanilla CSS con Variables Nativas y soporte nativo de modo claro/oscuro
- **Estado Global**: `Zustand` (Elegido por ser mucho más ligero y limpio que Redux, lo que reduce la carga inicial sin perder funcionalidades como `persist()`).
- **HTTP**: `Axios` para la comunicación con interceptores integrados (para pasar el JWT Bearer de forma automática).
- **Animaciones**: `framer-motion`

## 📁 Estructura del Proyecto

```text
src/
├── app/
│   ├── auth/              # Rutas de autenticación (Login/Registro)
│   ├── fields/            # Directorio y detalle de canchas
│   ├── reservations/      # Listado y cancelación de reservas del usuario
│   ├── dashboard/         # Dashboard estadístico exclusivo para Admins
│   ├── globals.css        # Sistema de Diseño y Tokens CSS
│   └── layout.tsx         # Contenedor principal
├── components/            # Componentes reutilizables (Navbar, Providers)
├── lib/                   # Configuración global (ej. instanciación de Axios)
└── store/                 # Almacenes de estados globales (authStore.ts)
```

## ⚙️ Configuración y Ejecución Local

### Prerrequisitos
- Node.js (v18+)
- Tener los microservicios backend corriendo como indica su propia documentación.

### Instalación
1. Clonar este repositorio.
2. Instalar las dependencias en el directorio raíz del frontend (`agenda-gol-frontend`):
   ```bash
   npm install
   ```
3. Generar archivo `.env.local` usando como base los servicios locales:
   ```env
   NEXT_PUBLIC_AUTH_API_URL=http://localhost:8000/auth
   NEXT_PUBLIC_ROLES_API_URL=http://localhost:8001
   NEXT_PUBLIC_FIELDS_API_URL=http://localhost:8002/fields
   NEXT_PUBLIC_RESERVATIONS_API_URL=http://localhost:8003/reservations
   NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8004/dashboard
   ```

### Ejecutar Desarrollo
```bash
npm run dev
```

El proyecto estará corriendo en [http://localhost:3000](http://localhost:3000).

---

## 💡 Decisiones Técnicas

1. **Uso de App Router (Next.js)**: Al tratarse de una aplicación que crece o puede requerir fuerte control de layout y SSR futuro, Next.js garantiza un ecosistema ordenado, con performance y buenas utilidades nativas.
2. **Vanilla CSS con Tokens Nativos vs Tailwind**: Aunque Tailwind es excelente, se optó por un archivo `globals.css` limpio. Al aislar CSS se demuestran profundos conocimientos y control sobre responsividad (`media queries`), temáticas de colores e interacciones fluidas (glass effects).
3. **Zustand para Session State Control**: Se implementó `Zustand` por la necesidad de simplificar la autenticación. Su middleware `persist()` envía automáticamente la sesión al Local Storage de tal manera que el estado de autenticación (tokens, roles) está disponible instantáneamente tras recargar, todo esto sin prop-drilling.
4. **Axios e Interceptores**: La comunicación segura requiere pasar constantemente cabeceras de `Authorization`. Configurar instancias de Axios por cada microservicio y atarles un interceptor global reduce código repetitivo en la lógica de cada componente y maneja errores de autenticación comunes como el `401 Unauthorized` (para destruir la sesión si el token expira).
5. **Componentización**: El uso de módulos aislados y enrutados por subrutas, como `/reservations` y `/fields/[id]`, permite un claro Separation of Concerns (SoC).
