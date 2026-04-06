# Guía: Resetear Base de Datos en Supabase

Si tienes problemas con las políticas RLS o quieres empezar de cero, sigue esta guía.

## Opción 1: Reset Completo (Recomendado)

### Paso 1: Acceder a Supabase Dashboard
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto BizManager
4. Ve a SQL Editor.

### Paso 2: Ejecutar Script de Reset
Copia y pega esto en el SQL Editor:

```sql
-- DROP ALL TABLES (WARNING: This deletes all data)
DROP TABLE IF EXISTS public.queue_entries CASCADE;
DROP TABLE IF EXISTS public.customer_loyalty CASCADE;
DROP TABLE IF EXISTS public.haircut_records CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.barbers CASCADE;
DROP TABLE IF EXISTS public.inventory_history CASCADE;
DROP TABLE IF EXISTS public.inventory_items CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.restaurant_tables CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- DROP extensions
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
```

Luego ejecuta los scripts en orden:
1. `/scripts/001_create_schema.sql`

### Paso 3: Crear Usuario SuperAdmin
Ejecuta este SQL:

```sql
INSERT INTO public.users (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'jhairoswaldo@gmail.com',
  'Jhairo',
  'Swaldo',
  'super_admin',
  true,
  now(),
  now()
);
```

### Paso 4: Crear Usuario en Auth de Supabase
1. Ve a "Authentication" → "Users"
2. Haz clic en "Add User"
3. Email: `jhairoswaldo@gmail.com`
4. Contraseña: `Endgamer123_`
5. Haz clic en "Send invite email" (O deja que confirme manualmente)

## Opción 2: Reset Solo de Datos (Mantener Schema)

```sql
-- DELETE ALL DATA (keeps tables)
DELETE FROM public.queue_entries;
DELETE FROM public.customer_loyalty;
DELETE FROM public.haircut_records;
DELETE FROM public.appointments;
DELETE FROM public.barbers;
DELETE FROM public.inventory_history;
DELETE FROM public.inventory_items;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.menu_items;
DELETE FROM public.restaurant_tables;
DELETE FROM public.businesses;
DELETE FROM public.users;
```

## Opción 3: Resetear Políticas RLS

Si tienes problemas con RLS, ejecuta esto para limpiar todas las políticas:

```sql
-- Drop all policies
DO $$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOR table_name IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  ) LOOP
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = table_name
    ) LOOP
      EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.' || table_name;
    END LOOP;
  END LOOP;
END
$$;
```

## Solución de Problemas

### Error: "infinite recursion detected in policy"
**Causa**: Las políticas RLS están haciendo lookups circulares
**Solución**: Desactivar RLS (ya está hecho en el código) y usar API routes para validación

### Error: "relation does not exist"
**Causa**: Las tablas aún no han sido creadas
**Solución**: Ejecutar `/scripts/001_create_schema.sql`

### Error: "permission denied"
**Causa**: RLS rechaza la operación
**Solución**: Verificar que RLS está desactivado o que tienes la política correcta

### Error: "jwt error"
**Causa**: El token JWT no es válido
**Solución**: Hacer logout y login nuevamente

## Checklist de Setup

- [ ] Base de datos creada en Supabase
- [ ] Variables de entorno configuradas (.env.local)
- [ ] Schema SQL ejecutado (001_create_schema.sql)
- [ ] Usuario SuperAdmin creado en Auth
- [ ] Usuario creado en tabla users
- [ ] RLS desactivado (para desarrollo)
- [ ] Test: Crear un negocio desde dashboard
- [ ] Test: Crear un usuario desde admin panel
- [ ] Test: Buscar y filtrar usuarios

## Variables de Entorno Necesarias

Estas deben estar en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Encuentra estas en Supabase → Settings → API

## Contacto y Soporte

Si tienes problemas:
1. Revisa los logs en `/scripts/`
2. Verifica que RLS está desactivado
3. Comprueba que el schema fue ejecutado correctamente
4. Abre un issue con los detalles del error

---

**Última actualización**: 2026-04-06
**Status**: RLS Disabled for Development
