# KLYON2 - Configuración Completa de Supabase

## Tabla de Contenidos
1. [Estructura de Base de Datos](#estructura-de-base-de-datos)
2. [Pasos de Configuración](#pasos-de-configuración)
3. [Autenticación](#autenticación)
4. [Seguridad Multi-Tenant](#seguridad-multi-tenant)
5. [APIs y Funciones](#apis-y-funciones)

---

## Estructura de Base de Datos

### 1. TABLAS PRINCIPALES

#### `organizations`
Nivel superior del sistema - Para super admins.
```
- id (UUID): ID único
- name (TEXT): Nombre de la organización
- owner_email (TEXT): Email del propietario
- created_at, updated_at (TIMESTAMP)
```

#### `businesses`
Los negocios (restaurantes o barberías).
```
- id (UUID): ID único
- organization_id (FK): Referencia a organization
- name (TEXT): Nombre del negocio
- type (TEXT): 'restaurant' | 'barbershop'
- address (TEXT): Dirección
- phone (TEXT): Teléfono
- active (BOOLEAN): Estado del negocio
- created_at, updated_at (TIMESTAMP)
```

#### `users`
Todos los usuarios del sistema.
```
- id (UUID): ID único
- email (TEXT): Email único
- password_hash (TEXT): Hash bcrypt de contraseña
- name (TEXT): Nombre del usuario
- role (TEXT): 'super_admin' | 'admin_negocio' | 'mesero' | 'cocina' | 'barbero'
- organization_id (FK): Referencia a organization
- business_id (FK): Referencia a business (null para super_admin)
- avatar_url (TEXT): URL de avatar
- active (BOOLEAN): Usuario activo
- created_at, updated_at (TIMESTAMP)
```

### 2. TABLAS DE RESTAURANTE

#### `restaurant_tables`
Mesas del restaurante.
```
- id (UUID)
- business_id (FK): Qué restaurante
- table_number (INT): Número de mesa
- capacity (INT): Cuántas personas
- status (TEXT): 'libre' | 'ocupada' | 'pagando'
- waiter_id (FK): Mesero asignado
```

#### `products`
Menú/Productos.
```
- id (UUID)
- business_id (FK)
- name (TEXT): Nombre del producto
- description (TEXT)
- price (DECIMAL): Precio
- category (TEXT): Categoría
- area (TEXT): 'cocina' | 'bar' (dónde se prepara)
- available (BOOLEAN)
- image_url (TEXT)
- order_number (INT): Orden en menú
```

#### `orders`
Pedidos principales.
```
- id (UUID)
- business_id (FK)
- table_id (FK): Qué mesa
- user_id (FK): Quién hizo el pedido (mesero)
- status (TEXT): 'pendiente' | 'en_preparacion' | 'listo' | 'entregado'
- total_amount (DECIMAL)
- notes (TEXT)
- created_at, completed_at, updated_at (TIMESTAMP)
```

#### `order_items`
Detalles de cada item en un pedido.
```
- id (UUID)
- order_id (FK): Qué pedido
- product_id (FK): Qué producto
- quantity (INT)
- price_at_time (DECIMAL): Precio en ese momento
- status (TEXT): 'pendiente' | 'preparando' | 'listo'
- notes (TEXT): Notas especiales
- area (TEXT): 'cocina' | 'bar'
```

### 3. TABLAS DE BARBERÍA

#### `barber_services`
Servicios que ofrece la barbería.
```
- id (UUID)
- business_id (FK)
- name (TEXT): Nombre del servicio
- description (TEXT)
- duration_minutes (INT): Cuántos minutos toma
- price (DECIMAL)
- active (BOOLEAN)
- order_number (INT)
```

#### `barbers`
Barberos/empleados.
```
- id (UUID)
- business_id (FK)
- user_id (FK): Referencia al usuario
- available (BOOLEAN)
- working_hours_start (TEXT): Ej: "09:00"
- working_hours_end (TEXT): Ej: "18:00"
- current_appointment_id (FK): Cita actual
- notes (TEXT)
```

#### `appointments`
Citas programadas.
```
- id (UUID)
- business_id (FK)
- barber_id (FK): Qué barbero
- client_name (TEXT)
- client_phone (TEXT)
- client_email (TEXT)
- service_id (FK): Qué servicio
- appointment_date (DATE)
- appointment_time (TIME)
- status (TEXT): 'pendiente' | 'en_proceso' | 'finalizado' | 'cancelado'
```

#### `queue`
Cola de espera.
```
- id (UUID)
- business_id (FK)
- client_name (TEXT)
- client_phone (TEXT)
- service_id (FK): Servicio deseado
- barber_id (FK): Barbero deseado
- position (INT): Posición en cola
- status (TEXT): 'esperando' | 'en_proceso' | 'finalizado'
- estimated_wait_minutes (INT)
```

---

## Pasos de Configuración

### PASO 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Espera a que se inicialice
4. Ve a "SQL Editor" y copia el contenido de `scripts/01-create-tables.sql`
5. Ejecuta el script para crear todas las tablas

### PASO 2: Insertar Datos Iniciales

1. En "SQL Editor", copia el contenido de `scripts/02-seed-data.sql`
2. IMPORTANTE: Reemplaza los password_hash placeholders con hashs reales
3. Para generar un hash bcrypt de "Endgamer123_":
   ```bash
   npx bcrypt hash "Endgamer123_" 10
   ```
4. Ejecuta el script

### PASO 3: Configurar Row Level Security (RLS)

Esto es CRÍTICO para seguridad multi-tenant:

```sql
-- Enable RLS on all tables
alter table organizations enable row level security;
alter table businesses enable row level security;
alter table users enable row level security;
alter table restaurant_tables enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table barber_services enable row level security;
alter table barbers enable row level security;
alter table appointments enable row level security;
alter table queue enable row level security;

-- Política para organizations (solo super admin)
create policy "super_admin_access_organizations" on organizations
  for all
  using (
    auth.uid() in (
      select id from users where role = 'super_admin'
    )
  );

-- Política para businesses
create policy "users_access_own_business" on businesses
  for all
  using (
    id in (
      select business_id from users where id = auth.uid()
    )
    or
    auth.uid() in (
      select id from users where role = 'super_admin'
    )
  );

-- Similar para otras tablas según el role y business_id
```

### PASO 4: Configurar Variables de Entorno

En tu proyecto v0, configura las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Autenticación

### Flujo de Login

1. Usuario ingresa email y contraseña
2. Sistema busca en tabla `users` por email
3. Compara password hasheado con bcrypt
4. Si es válido:
   - Crea sesión en Supabase Auth
   - Obtiene `user_id`, `role`, `business_id`
   - Redirige a dashboard según su role

### Implementación en Next.js

```typescript
// lib/supabase/auth.ts
import { createClient } from '@/lib/supabase/client'
import bcrypt from 'bcrypt'

export async function loginUser(email: string, password: string) {
  const supabase = createClient()
  
  // Obtener usuario
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password_hash, role, business_id, name')
    .eq('email', email)
    .single()
  
  if (error || !user) {
    throw new Error('Usuario no encontrado')
  }
  
  // Verificar contraseña
  const validPassword = await bcrypt.compare(password, user.password_hash)
  if (!validPassword) {
    throw new Error('Contraseña incorrecta')
  }
  
  // Crear sesión
  await supabase.auth.signInWithPassword({
    email,
    password: user.password_hash // Esto necesita ajuste
  })
  
  return user
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  businessId: string,
  role: 'mesero' | 'cocina' | 'barbero' = 'mesero'
) {
  const supabase = createClient()
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Crear usuario
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: hashedPassword,
      name,
      role,
      business_id: businessId,
      active: true
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

---

## Seguridad Multi-Tenant

### Principios Clave

1. **Aislamiento de Datos**: Un negocio NO puede ver datos de otro
2. **Control de Acceso**: Roles determinan qué puede hacer cada usuario
3. **Auditoría**: Registrar quién hizo qué y cuándo

### Implementación RLS

```sql
-- Ejemplo: Usuario solo ve su negocio
create policy "tenant_isolation" on products
  for select
  using (
    business_id = (
      select business_id from users where id = auth.uid()
    )
    or
    auth.uid() in (select id from users where role = 'super_admin')
  );
```

### Roles y Permisos

| Role | Ver | Crear | Editar | Eliminar |
|------|-----|-------|--------|----------|
| super_admin | Todo | Todo | Todo | Todo |
| admin_negocio | Su negocio | Su negocio | Su negocio | Su negocio |
| mesero | Mesas/Pedidos | Pedidos | Pedidos propios | No |
| cocina | Items | No | Items | No |
| barbero | Citas | No | Citas | No |

---

## APIs y Funciones

### Funciones TypeScript para CRUD

```typescript
// lib/api/businesses.ts
export async function createBusiness(
  organizationId: string,
  name: string,
  type: 'restaurant' | 'barbershop',
  address?: string,
  phone?: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      organization_id: organizationId,
      name,
      type,
      address,
      phone,
      active: true
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getBusinessesByOrganization(orgId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('organization_id', orgId)
  
  if (error) throw error
  return data
}

export async function updateBusiness(
  businessId: string,
  updates: Partial<Business>
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', businessId)
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

### Realtime Subscriptions

```typescript
// Para ver cambios en tiempo real
export function subscribeToOrders(businessId: string, callback: (order: Order) => void) {
  const supabase = createClient()
  
  return supabase
    .from(`orders:business_id=eq.${businessId}`)
    .on('*', (payload) => {
      callback(payload.new as Order)
    })
    .subscribe()
}
```

---

## Estructura de Carpetas

```
/vercel/share/v0-project/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── actions.ts
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── restaurant/
│   │   └── barber/
│   └── layout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── auth.ts
│   ├── api/
│   │   ├── businesses.ts
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── appointments.ts
│   ├── app-context.tsx
│   └── types.ts
├── scripts/
│   ├── 01-create-tables.sql
│   ├── 02-seed-data.sql
│   └── 03-rls-policies.sql
└── SETUP.md (este archivo)
```

---

## Checklist de Implementación

- [ ] Crear proyecto en Supabase
- [ ] Ejecutar script 01 (crear tablas)
- [ ] Ejecutar script 02 (insertar datos)
- [ ] Configurar variables de entorno
- [ ] Implementar Row Level Security
- [ ] Conectar autenticación en Next.js
- [ ] Actualizar app context para usar Supabase
- [ ] Crear funciones de CRUD
- [ ] Configurar realtime subscriptions
- [ ] Pruebas de seguridad multi-tenant

---

## Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

## Soporte

Para preguntas sobre la estructura de BD o seguridad, contacta al equipo de desarrollo.
