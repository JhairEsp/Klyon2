# Configuración de Supabase

## Pasos para Configurar la Base de Datos

Este documento explica cómo configurar correctamente Supabase para que la aplicación BizManager funcione.

### 1. Crear la Cuenta SuperAdmin

Primero, debes crear la cuenta de superadministrador en Supabase:

```sql
-- Crear el usuario SuperAdmin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'jhairoswaldo@gmail.com',
  crypt('Endgamer123_', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role": "super_admin"}'::jsonb
);
```

### 2. Ejecutar el Script SQL de Schema

Dirígete a **SQL Editor** en Supabase y ejecuta el contenido del archivo `/scripts/001_create_schema.sql`

Este script crea todas las tablas necesarias:
- `businesses` - Negocios (restaurantes, barberías)
- `users` - Usuarios del sistema
- `restaurant_tables` - Mesas de restaurante
- `orders` - Pedidos
- `order_items` - Items de pedidos
- `menu_items` - Menú
- `inventory_items` - Insumos
- `inventory_history` - Historial de insumos
- `barbers` - Barberos
- `appointments` - Citas
- `haircut_records` - Registro de cortes
- `customer_loyalty` - Lealtad de clientes
- `queue_entries` - Cola de espera

### 3. Variables de Entorno

Añade estas variables de entorno en el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

Obtén estos valores de:
- Settings → Project Settings → API en tu dashboard de Supabase

### 4. Verificar la Configuración

Una vez configurado, intenta iniciar sesión con:
- **Email**: jhairoswaldo@gmail.com
- **Contraseña**: Endgamer123_

### 5. Row Level Security (RLS)

El script SQL crea automáticamente las políticas de RLS. Verifica que estén activadas:

1. Ve a la tabla en Supabase
2. Abre la pestaña "RLS"
3. Verifica que el RLS esté habilitado

### Estructura de Datos

#### Usuarios
- Solo el superadmin (jhairoswaldo@gmail.com) accede al panel de administración
- Los demás usuarios pueden ver solo sus propios datos (protegido por RLS)

#### Negocios
- Cada negocio puede ser: restaurante, barbería o ambos
- Cada negocio tiene sus propios usuarios, pedidos, citas, etc.
- Los datos están aislados por `business_id` (multi-tenant)

#### Insumos (Restaurante)
- Gestión completa de inventario
- Alerta de stock bajo
- Historial de consumo

#### Lealtad (Barbería)
- Registro de cortes (citas + walk-ins)
- Contador de lealtad: 5 cortes = 1 gratis
- Seguimiento de clientes

### Troubleshooting

**Error: "Email not confirmed"**
- El usuario necesita confirmar su email
- Para testing, puedes usar `email_confirmed_at = now()` en el SQL

**Error: "Permission denied"**
- Verifica que RLS esté habilitado
- Verifica que la política RLS sea correcta
- Prueba deshabilitando RLS temporalmente para debugging

**Datos no aparecen**
- Verifica que el `user_id` en las políticas RLS sea `auth.uid()`
- Verifica que estés haciendo las queries después de autenticarse
