-- ============================================================================
-- KLYON2 DATABASE SCHEMA
-- Multi-tenant SaaS platform para Restaurantes y Barberías
-- ============================================================================

-- 1. TABLA: organizations (Super Admin level)
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. TABLA: businesses (Negocios - Restaurantes o Barberías)
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  type text not null check(type in ('restaurant', 'barbershop')),
  address text,
  phone text,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. TABLA: users (Usuarios del Sistema)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  role text not null check(role in ('super_admin', 'admin_negocio', 'mesero', 'cocina', 'barbero')),
  organization_id uuid references organizations(id) on delete set null,
  business_id uuid references businesses(id) on delete set null,
  avatar_url text,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- TABLAS PARA RESTAURANTE
-- ============================================================================

-- 4. TABLA: restaurant_tables (Mesas del Restaurante)
create table if not exists restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  table_number integer not null,
  capacity integer not null,
  status text default 'libre' check(status in ('libre', 'ocupada', 'pagando')),
  waiter_id uuid references users(id) on delete set null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(business_id, table_number)
);

-- 5. TABLA: products (Productos/Menu)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  area text not null check(area in ('cocina', 'bar')),
  available boolean default true,
  image_url text,
  order_number integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 6. TABLA: orders (Pedidos)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  table_id uuid not null references restaurant_tables(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  status text default 'pendiente' check(status in ('pendiente', 'en_preparacion', 'listo', 'entregado')),
  total_amount numeric(10,2) not null,
  notes text,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- 7. TABLA: order_items (Items/Detalles de Pedidos)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity integer not null check(quantity > 0),
  price_at_time numeric(10,2) not null,
  status text default 'pendiente' check(status in ('pendiente', 'preparando', 'listo')),
  notes text,
  area text not null check(area in ('cocina', 'bar')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- TABLAS PARA BARBERÍA
-- ============================================================================

-- 8. TABLA: barber_services (Servicios de Barbería)
create table if not exists barber_services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null check(duration_minutes > 0),
  price numeric(10,2) not null,
  image_url text,
  active boolean default true,
  order_number integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 9. TABLA: barbers (Barberos)
create table if not exists barbers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  available boolean default true,
  working_hours_start text,
  working_hours_end text,
  current_appointment_id uuid references appointments(id) on delete set null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(business_id, user_id)
);

-- 10. TABLA: appointments (Citas)
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  barber_id uuid not null references barbers(id) on delete cascade,
  client_name text not null,
  client_phone text,
  client_email text,
  service_id uuid not null references barber_services(id) on delete restrict,
  appointment_date date not null,
  appointment_time time not null,
  status text default 'pendiente' check(status in ('pendiente', 'en_proceso', 'finalizado', 'cancelado')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 11. TABLA: queue (Cola de Espera)
create table if not exists queue (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  client_name text not null,
  client_phone text,
  service_id uuid references barber_services(id) on delete set null,
  barber_id uuid references barbers(id) on delete set null,
  position integer,
  status text default 'esperando' check(status in ('esperando', 'en_proceso', 'finalizado')),
  estimated_wait_minutes integer,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices para businesses
create index if not exists idx_businesses_organization_id on businesses(organization_id);
create index if not exists idx_businesses_active on businesses(active);

-- Índices para users
create index if not exists idx_users_organization_id on users(organization_id);
create index if not exists idx_users_business_id on users(business_id);
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_role on users(role);

-- Índices para restaurant
create index if not exists idx_restaurant_tables_business_id on restaurant_tables(business_id);
create index if not exists idx_restaurant_tables_status on restaurant_tables(status);
create index if not exists idx_products_business_id on products(business_id);
create index if not exists idx_products_available on products(available);
create index if not exists idx_orders_business_id on orders(business_id);
create index if not exists idx_orders_table_id on orders(table_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- Índices para barbería
create index if not exists idx_barber_services_business_id on barber_services(business_id);
create index if not exists idx_barbers_business_id on barbers(business_id);
create index if not exists idx_barbers_user_id on barbers(user_id);
create index if not exists idx_appointments_business_id on appointments(business_id);
create index if not exists idx_appointments_barber_id on appointments(barber_id);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_date on appointments(appointment_date);
create index if not exists idx_queue_business_id on queue(business_id);
create index if not exists idx_queue_status on queue(status);
