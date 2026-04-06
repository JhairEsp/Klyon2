-- ============================================================================
-- KLYON2 - DATOS INICIALES DE DEMOSTRACIÓN
-- ============================================================================

-- 1. Crear organización principal
insert into organizations (id, name, owner_email)
values (
  'org-super-admin',
  'Klyon2 Sistema',
  'jhairoswaldo@gmail.com'
) on conflict do nothing;

-- 2. Crear usuario Super Admin
-- Password: Endgamer123_ (hasheado con bcrypt)
insert into users (id, email, password_hash, name, role, organization_id, active)
values (
  'user-super-admin',
  'jhairoswaldo@gmail.com',
  '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', -- Placeholder - reemplaza con hash real
  'Jhair Oswaldo',
  'super_admin',
  'org-super-admin',
  true
) on conflict (email) do nothing;

-- ============================================================================
-- NEGOCIOS DE DEMOSTRACIÓN
-- ============================================================================

-- 3. Restaurante Demo: La Trattoria
insert into businesses (id, organization_id, name, type, address, phone, active)
values (
  'bus-restaurant-1',
  'org-super-admin',
  'La Trattoria',
  'restaurant',
  'Calle Principal 123',
  '+1-555-0001',
  true
) on conflict do nothing;

-- 4. Barbería Demo: Barbershop Elite
insert into businesses (id, organization_id, name, type, address, phone, active)
values (
  'bus-barbershop-1',
  'org-super-admin',
  'Barbershop Elite',
  'barbershop',
  'Av. Comercio 456',
  '+1-555-0002',
  true
) on conflict do nothing;

-- ============================================================================
-- USUARIOS DEL RESTAURANTE
-- ============================================================================

-- 5. Admin Negocio - La Trattoria
insert into users (id, email, password_hash, name, role, organization_id, business_id, active)
values (
  'user-admin-rest',
  'admin@trattoria.com',
  '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', -- Placeholder
  'Carlos Garcia',
  'admin_negocio',
  'org-super-admin',
  'bus-restaurant-1',
  true
) on conflict (email) do nothing;

-- 6. Meseros
insert into users (id, email, password_hash, name, role, organization_id, business_id, active)
values
  ('user-waiter-1', 'juan@trattoria.com', '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', 'Juan Pérez', 'mesero', 'org-super-admin', 'bus-restaurant-1', true),
  ('user-waiter-2', 'maria@trattoria.com', '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', 'María López', 'mesero', 'org-super-admin', 'bus-restaurant-1', true)
on conflict (email) do nothing;

-- 7. Cocineros
insert into users (id, email, password_hash, name, role, organization_id, business_id, active)
values
  ('user-chef-1', 'chef@trattoria.com', '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', 'Roberto Chef', 'cocina', 'org-super-admin', 'bus-restaurant-1', true),
  ('user-bartender-1', 'bar@trattoria.com', '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', 'Antonio Bar', 'cocina', 'org-super-admin', 'bus-restaurant-1', true)
on conflict (email) do nothing;

-- ============================================================================
-- USUARIOS DE LA BARBERÍA
-- ============================================================================

-- 8. Admin Negocio - Barbershop Elite
insert into users (id, email, password_hash, name, role, organization_id, business_id, active)
values (
  'user-admin-barber',
  'admin@barbershop.com',
  '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', -- Placeholder
  'Pedro Martínez',
  'admin_negocio',
  'org-super-admin',
  'bus-barbershop-1',
  true
) on conflict (email) do nothing;

-- 9. Barberos
insert into users (id, email, password_hash, name, role, organization_id, business_id, active)
values
  ('user-barber-1', 'barber1@barbershop.com', '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', 'Luis Rodríguez', 'barbero', 'org-super-admin', 'bus-barbershop-1', true),
  ('user-barber-2', 'barber2@barbershop.com', '$2b$10$YIvxHwQQvgk.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8l6yd0W9k.8', 'Diego Sánchez', 'barbero', 'org-super-admin', 'bus-barbershop-1', true)
on conflict (email) do nothing;

-- ============================================================================
-- MESAS DEL RESTAURANTE
-- ============================================================================

insert into restaurant_tables (id, business_id, table_number, capacity, status, waiter_id)
values
  ('table-1', 'bus-restaurant-1', 1, 2, 'libre', null),
  ('table-2', 'bus-restaurant-1', 2, 2, 'libre', null),
  ('table-3', 'bus-restaurant-1', 3, 4, 'ocupada', 'user-waiter-1'),
  ('table-4', 'bus-restaurant-1', 4, 4, 'libre', null),
  ('table-5', 'bus-restaurant-1', 5, 6, 'libre', null),
  ('table-6', 'bus-restaurant-1', 6, 4, 'pagando', 'user-waiter-2'),
  ('table-7', 'bus-restaurant-1', 7, 8, 'libre', null),
  ('table-8', 'bus-restaurant-1', 8, 2, 'libre', null)
on conflict do nothing;

-- ============================================================================
-- PRODUCTOS DEL MENÚ
-- ============================================================================

-- Cocina
insert into products (id, business_id, name, description, price, category, area, available, order_number)
values
  ('prod-pasta-1', 'bus-restaurant-1', 'Spaghetti Carbonara', 'Clásica pasta italiana con huevo y tocino', 14.99, 'Pasta', 'cocina', true, 1),
  ('prod-pasta-2', 'bus-restaurant-1', 'Fettuccine Alfredo', 'Pasta cremosa con salsa de queso', 13.99, 'Pasta', 'cocina', true, 2),
  ('prod-meat-1', 'bus-restaurant-1', 'Bistec a la Pimienta', 'Carne premium con salsa de pimienta negra', 24.99, 'Carnes', 'cocina', true, 3),
  ('prod-meat-2', 'bus-restaurant-1', 'Pechuga de Pollo Rellena', 'Pollo con queso y jamón', 18.99, 'Carnes', 'cocina', true, 4),
  ('prod-fish-1', 'bus-restaurant-1', 'Salmón a la Mantequilla', 'Salmón fresco con salsa de mantequilla y limón', 22.99, 'Pescados', 'cocina', true, 5),
  ('prod-app-1', 'bus-restaurant-1', 'Tabla de Quesos y Embutidos', 'Selección de quesos y jamones ibéricos', 19.99, 'Entrada', 'cocina', true, 6),
  ('prod-app-2', 'bus-restaurant-1', 'Camarones al Ajillo', 'Camarones frescos salteados con ajo', 16.99, 'Entrada', 'cocina', true, 7),
  ('prod-salad-1', 'bus-restaurant-1', 'Ensalada César', 'Lechuga romana, queso parmesano y croutones', 9.99, 'Ensaladas', 'cocina', true, 8),
  ('prod-salad-2', 'bus-restaurant-1', 'Ensalada Mixta', 'Verduras frescas variadas', 8.99, 'Ensaladas', 'cocina', true, 9),
  ('prod-soup-1', 'bus-restaurant-1', 'Minestrone', 'Sopa italiana de verduras', 7.99, 'Sopas', 'cocina', true, 10)
on conflict do nothing;

-- Bar
insert into products (id, business_id, name, description, price, category, area, available, order_number)
values
  ('prod-wine-1', 'bus-restaurant-1', 'Vino Tinto Reserva', 'Vino tinto premium', 35.00, 'Vinos', 'bar', true, 1),
  ('prod-wine-2', 'bus-restaurant-1', 'Vino Blanco Crianza', 'Vino blanco joven', 28.00, 'Vinos', 'bar', true, 2),
  ('prod-beer-1', 'bus-restaurant-1', 'Cerveza Artesanal', 'Cerveza craft local', 6.99, 'Cervezas', 'bar', true, 3),
  ('prod-beer-2', 'bus-restaurant-1', 'Cerveza Importada', 'Cerveza premium importada', 7.99, 'Cervezas', 'bar', true, 4),
  ('prod-spirit-1', 'bus-restaurant-1', 'Negroni', 'Gin, Campari, vermouth rojo', 12.99, 'Cócteles', 'bar', true, 5),
  ('prod-spirit-2', 'bus-restaurant-1', 'Mojito', 'Ron blanco, menta, limón, azúcar', 10.99, 'Cócteles', 'bar', true, 6),
  ('prod-spirit-3', 'bus-restaurant-1', 'Margarita', 'Tequila, Cointreau, limón fresco', 11.99, 'Cócteles', 'bar', true, 7),
  ('prod-soft-1', 'bus-restaurant-1', 'Agua Mineral', 'Agua sin gas o con gas', 2.99, 'Bebidas', 'bar', true, 8),
  ('prod-soft-2', 'bus-restaurant-1', 'Jugo Natural', 'Jugos de frutas frescas', 4.99, 'Bebidas', 'bar', true, 9),
  ('prod-dessert-1', 'bus-restaurant-1', 'Tiramisu', 'Postre italiano clásico', 7.99, 'Postres', 'cocina', true, 11)
on conflict do nothing;

-- ============================================================================
-- SERVICIOS DE BARBERÍA
-- ============================================================================

insert into barber_services (id, business_id, name, description, duration_minutes, price, active, order_number)
values
  ('serv-cut-1', 'bus-barbershop-1', 'Corte de Cabello', 'Corte y peinado clásico', 30, 15.00, true, 1),
  ('serv-cut-2', 'bus-barbershop-1', 'Corte + Barba', 'Corte de cabello y arreglo de barba', 45, 25.00, true, 2),
  ('serv-barba-1', 'bus-barbershop-1', 'Arreglo de Barba', 'Perfilado y arreglo de barba', 20, 12.00, true, 3),
  ('serv-facial-1', 'bus-barbershop-1', 'Tratamiento Facial', 'Limpieza y tratamiento facial', 40, 35.00, true, 4),
  ('serv-haircolor-1', 'bus-barbershop-1', 'Coloración Capilar', 'Tintura y coloración profesional', 60, 45.00, true, 5),
  ('serv-premium-1', 'bus-barbershop-1', 'Paquete Premium', 'Corte + Barba + Facial', 75, 55.00, true, 6)
on conflict do nothing;

-- ============================================================================
-- BARBEROS (Relación usuario-barbería)
-- ============================================================================

insert into barbers (id, business_id, user_id, available, working_hours_start, working_hours_end)
values
  ('barber-1', 'bus-barbershop-1', 'user-barber-1', true, '09:00', '18:00'),
  ('barber-2', 'bus-barbershop-1', 'user-barber-2', true, '10:00', '19:00')
on conflict do nothing;

-- ============================================================================
-- CITAS DE EJEMPLO (barbería)
-- ============================================================================

insert into appointments (id, business_id, barber_id, client_name, client_phone, client_email, service_id, appointment_date, appointment_time, status)
values
  ('apt-1', 'bus-barbershop-1', 'barber-1', 'Juan Rodríguez', '+1-555-1001', 'juan@example.com', 'serv-cut-1', current_date, '10:00', 'pendiente'),
  ('apt-2', 'bus-barbershop-1', 'barber-2', 'Carlos López', '+1-555-1002', 'carlos@example.com', 'serv-cut-2', current_date, '11:00', 'pendiente'),
  ('apt-3', 'bus-barbershop-1', 'barber-1', 'Miguel Sánchez', '+1-555-1003', 'miguel@example.com', 'serv-barba-1', current_date, '14:30', 'pendiente')
on conflict do nothing;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 
-- 1. Los password_hash mostrados son PLACEHOLDERS y DEBEN ser reemplazados
--    con hashs reales generados usando bcrypt:
--    - Contraseña: Endgamer123_
--    - Usa: npx bcrypt hash "Endgamer123_" 10
--
-- 2. Los IDs mostrados son ejemplos. En producción, usa gen_random_uuid()
--
-- 3. Configura Row Level Security (RLS) para multi-tenancy
--
-- 4. Implementa autenticación con Supabase Auth
