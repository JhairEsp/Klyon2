# Guía Rápida: Crear Usuario SuperAdmin

## Problema
No puedes entrar con `jhairoswaldo@gmail.com` porque el usuario aún no existe en Supabase.

## Solución

### Opción 1: Crear usuario directamente en Supabase (RECOMENDADO)

1. **Abre Supabase Dashboard**
   - Ve a tu proyecto en supabase.com
   - Haz clic en **Authentication** (izquierda)
   - Click en **Users** (pestaña)
   - Click en **+ Create New User**

2. **Llena el formulario:**
   - **Email**: `jhairoswaldo@gmail.com`
   - **Password**: `Endgamer123_`
   - Marca: "Auto send invitation email" (DESACTIVA - no queremos invitaciones)
   - Click **Create User**

3. **Agrega el registro en la tabla users:**
   - Ve a **SQL Editor**
   - Copia y ejecuta este SQL:

```sql
-- Reemplaza USER_ID con el ID del usuario creado (aparece en Users)
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
  'USER_ID_AQUI',  -- Reemplaza con el ID real
  'jhairoswaldo@gmail.com',
  'Jhair',
  'Oswaldo',
  'super_admin',
  true,
  now(),
  now()
);
```

4. **Listo!** Ahora puedes entrar

---

### Opción 2: Crear usuario vía SQL (Si prefieres)

1. En **SQL Editor** de Supabase, ejecuta:

```sql
-- Crear usuario en auth
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'jhairoswaldo@gmail.com',
  crypt('Endgamer123_', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Obtener el ID del usuario creado
SELECT id FROM auth.users WHERE email = 'jhairoswaldo@gmail.com';

-- Usar ese ID en el siguiente comando
INSERT INTO public.users (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
) SELECT
  id,
  'jhairoswaldo@gmail.com',
  'Jhair',
  'Oswaldo',
  'super_admin',
  true,
  now(),
  now()
FROM auth.users WHERE email = 'jhairoswaldo@gmail.com';
```

---

## Verificación

Después de crear el usuario:

1. Ve a `/auth/login`
2. Ingresa:
   - Email: `jhairoswaldo@gmail.com`
   - Contraseña: `Endgamer123_`
3. Deberías ver el Dashboard

Si aún no funciona, verifica:
- [ ] El email en Supabase es exactamente `jhairoswaldo@gmail.com`
- [ ] La tabla `users` existe (ejecuta el schema SQL)
- [ ] El registro en `users` tiene `role = 'super_admin'`
- [ ] El registro en `users` tiene `id` igual al del usuario en `auth.users`

---

## Ayuda

Si sigue sin funcionar, usa el browser console (F12) y mira los errores. El error te dirá exactamente qué está mal.
