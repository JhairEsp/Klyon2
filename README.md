# BizManager - SaaS Multi-Tenant

Sistema completo para gestionar restaurantes y barberías con dashboards en tiempo real, gestión de insumos, sistema de lealtad y análiticas.

## Características

### Restaurante
- ✅ Gestión de mesas en tiempo real
- ✅ Sistema de pedidos con estados
- ✅ Kitchen Display System (KDS)
- ✅ Gestión completa de inventario/insumos
- ✅ Alertas de stock bajo
- ✅ Historial de consumo

### Barbería
- ✅ Sistema de citas
- ✅ Cola de espera en tiempo real
- ✅ Gestión de barberos
- ✅ Registro de cortes (citas + walk-ins)
- ✅ Programa de lealtad (5 cortes = 1 gratis)
- ✅ Analytics de insumos por barbero

### Admin
- ✅ Panel Super Admin solo para jhairoswaldo@gmail.com
- ✅ Gestión de negocios
- ✅ Gestión de usuarios y permisos
- ✅ Multi-tenant con RLS de Supabase
- ✅ Row Level Security para proteger datos

## Tecnología

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Real-time**: Supabase Realtime (listo para implementar)

## Instalación Rápida

### 1. Clonar y Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### 2. Configurar Supabase

Sigue las instrucciones en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 3. Variables de Entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## Acceso SuperAdmin

- **Email**: jhairoswaldo@gmail.com
- **Contraseña**: Endgamer123_

Solo esta cuenta puede acceder al panel de administración.

## Estructura del Proyecto

```
app/
├── auth/
│   ├── login/          # Página de login
│   ├── signup/         # Signup deshabilitado
│   └── callback/       # Callback de Supabase
├── dashboard/          # Dashboard principal (protegido)
└── admin/
    ├── businesses/     # Gestión de negocios
    └── users/          # Gestión de usuarios
lib/
├── supabase/           # Clientes de Supabase
├── types.ts            # Tipos TypeScript
└── supabase-utils.ts   # Utilidades
components/
└── ui/                 # shadcn/ui components
```

## Responsive Design

La aplicación es **100% responsive**:
- ✅ Mobile-first
- ✅ Sidebar colapsable en móvil
- ✅ Cards/tablas stacked en móvil
- ✅ Buttons touch-friendly
- ✅ Optimizado para sm/md/lg/xl breakpoints

## Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Datos aislados por negocio (multi-tenant)
- ✅ Solo SuperAdmin accede a configuración
- ✅ Session management con HTTP-only cookies
- ✅ Password hashing automático

## Próximas Características

- [ ] Realtime updates con Supabase Realtime
- [ ] Notificaciones en tiempo real
- [ ] Reportes avanzados
- [ ] Exportación de datos (CSV/PDF)
- [ ] Integraciones de pago
- [ ] API pública para integraciones

## Solución de Problemas

### Error: "Supabase URL not configured"
- Verifica que NEXT_PUBLIC_SUPABASE_URL esté en `.env.local`
- Reinicia el servidor de desarrollo

### Error: "User not found after login"
- Verifica que ejecutaste el SQL de configuración en Supabase
- Verifica que el usuario existe en la tabla `users`

### RLS está denegando acceso
- Verifica que estés autenticado (session activa)
- Verifica que el `business_id` en los datos sea correcto
- Consulta SUPABASE_SETUP.md para debugging

## Licencia

Privado - BizManager 2026
