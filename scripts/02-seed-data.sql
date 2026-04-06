-- ============================================================================
-- KLYON2 - DATOS INICIALES
-- ============================================================================
-- 
-- Este script crea SOLO la cuenta de Super Admin
-- Los negocios y usuarios adicionales se crearán a través de la interfaz
-- 
-- ============================================================================

-- 1. Crear organización principal
insert into organizations (id, name, owner_email)
values (
  'org-super-admin',
  'Klyon2 Sistema',
  'jhairoswaldo@gmail.com'
) on conflict do nothing;

-- 2. Crear usuario Super Admin
-- Email: jhairoswaldo@gmail.com
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
-- FIN - DATOS INICIALES
-- ============================================================================
-- 
-- PRÓXIMOS PASOS:
-- 1. Usa el panel Super Admin para crear tus negocios
-- 2. Luego crea admins para cada negocio
-- 3. Los admins podrán crear usuarios adicionales (meseros, cocineros, barberos)
--
-- NOTAS IMPORTANTES:
-- 1. El password_hash mostrado es PLACEHOLDER y DEBE ser reemplazado
--    con hash real generado usando bcrypt:
--    - Contraseña: Endgamer123_
--    - Usa: npx bcrypt hash "Endgamer123_" 10
--
-- 2. Los IDs mostrados son ejemplos. En producción, usa gen_random_uuid()
--
-- 3. Configura Row Level Security (RLS) para multi-tenancy
--
-- 4. Implementa autenticación con Supabase Auth
