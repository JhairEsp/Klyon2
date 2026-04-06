# Troubleshooting - Soluciones Rápidas

## Error: 42501 - RLS Policy Violation

### Síntoma
```
Error creating business: code '42501'
message: 'new row violates row-level security policy for table "businesses"'
```

### Solución Rápida

**En Supabase, ejecuta este SQL:**

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.haircut_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_loyalty DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_entries DISABLE ROW LEVEL SECURITY;
```

Click **Run** → Espera "Success" → Actualiza tu app (F5)

---

## Error: Cannot find module '@supabase/ssr'

### Síntoma
```
Module not found: Can't resolve '@supabase/ssr'
at ./lib/supabase/proxy.ts
```

### Causa
Archivos middleware/proxy todavía existen y están rotos.

### Solución
Ya está solucionado. Los archivos fueron eliminados.  
Si ves este error, actualiza la página (F5).

---

## Error: User not found at login

### Síntoma
Login falla con "User not found" o similar.

### Solución

En Supabase SQL Editor, crea la cuenta:

```sql
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

Luego crea el registro en tabla users:

```sql
INSERT INTO users (
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
  email,
  'Jhair',
  'Oswaldo',
  'super_admin',
  true,
  now(),
  now()
FROM auth.users WHERE email = 'jhairoswaldo@gmail.com';
```

---

## Error: "NEXT_PUBLIC_SUPABASE_URL is not configured"

### Síntoma
App no se conecta a Supabase.

### Solución
1. Click Settings (arriba derecha de v0)
2. Click "Vars"
3. Agrega:
   ```
   NEXT_PUBLIC_SUPABASE_URL = tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_anon_key
   ```
4. Actualiza la app (F5)

---

## Las animaciones se ven lentas/choppy

### Síntoma
Las animaciones no son smooth.

### Solución
- Cierra otras pestañas
- Desactiva extensiones del navegador
- Usa navegador moderno (Chrome, Firefox, Safari)
- Las animaciones usan CSS puro, no JavaScript

---

## Todavía sale error 42501 después del SQL

### Síntoma
Ejecuté el SQL pero sigue sin funcionar.

### Solución Paso a Paso

1. **Verifica que el SQL ejecutó sin errores**
   - Supabase debe mostrar "Success" o "Executed"
   - Si dice "Error", copia el mensaje exacto

2. **Recarga la página**
   - F5 (Windows) o Cmd+R (Mac)
   - Espera 5 segundos para que se propague

3. **Limpia cache del navegador**
   - Ctrl+Shift+Delete (Windows) o Cmd+Shift+Delete (Mac)
   - Selecciona "Cookies and cached images"
   - Click Clear

4. **Cierra el navegador y reabre**

5. **Si todavía falla: Resetea la BD**
   - Supabase → Project Settings → Danger Zone
   - Click "Reset Database"
   - Espera 30 segundos
   - Vuelve a ejecutar el SQL arriba

---

## No puedo ver mis negocios creados

### Síntoma
Creo un negocio pero no aparece en la lista.

### Solución

1. **Actualiza la página** (F5)
2. **Verifica que creaste uno**
   - Deberías ver el formulario completarse
   - Click "Crear Negocio"
   - Debería cerrar el form

3. **Si no aparece en lista:**
   - Consulta Supabase directamente
   - Supabase → SQL Editor
   - Ejecuta: `SELECT * FROM businesses;`
   - Si hay datos, el problema es en el cliente

---

## Dashboard está vacío / sin datos

### Síntoma
El dashboard muestra 0 negocios, 0 usuarios.

### Solución

Esto es **normal** si:
- Acabas de crear la base de datos
- No has creado datos todavía

Para probar, crea un negocio:
1. Dashboard → Negocios
2. Click "Nuevo Negocio"
3. Llena todos los campos
4. Click "Crear Negocio"

---

## La app no se ve responsiva

### Síntoma
La app no se adapta bien en móvil.

### Solución
Usa el DevTools:
- Chrome: F12 → Click icono dispositivo (arriba izquierda)
- Verifica que esté en "Responsive Design Mode"
- La app debería adaptarse al tamaño

---

## ¿Cómo reseteo todo?

### Opción 1: Resetear solo la BD (Recomendado)

1. Supabase → Project Settings
2. Click "Danger Zone" (abajo)
3. Click "Reset Database"
4. Escribe "Reset" para confirmar
5. Espera 30 segundos

Luego:
- Vuelve a ejecutar el SQL de crear schema
- Vuelve a crear SuperAdmin
- Vuelve a deshabilitar RLS

### Opción 2: Resetear Proyecto Completo

1. Supabase → Project Settings
2. Click "Danger Zone"
3. Click "Delete project"
4. Crea uno nuevo

---

## ¿Dónde está X funcionalidad?

| Funcionalidad | Ubicación |
|---|---|
| **Crear Negocio** | Dashboard → Negocios → Nuevo Negocio |
| **Ver Negocios** | Dashboard → Negocios |
| **Ver Usuarios** | Dashboard → Usuarios |
| **Editar Negocio** | Dashboard → Negocios → Card → Editar |
| **Eliminar Negocio** | Dashboard → Negocios → Card → Eliminar |
| **Buscar Usuarios** | Dashboard → Usuarios → Search box |
| **Salir** | Dashboard → Botón "Salir" (esquina superior) |

---

## Necesito ayuda

Si el error no está en esta lista:

1. **Copia el mensaje exacto del error**
2. **Anota qué estabas haciendo**
3. **Abre los debug logs**
   - Settings → Logs
   - O F12 en el navegador
4. **Comparte la información**

---

**Última actualización**: 2026-04-06  
**Versión**: BizManager 1.0
