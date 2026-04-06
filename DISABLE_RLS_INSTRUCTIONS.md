# Cómo Deshabilitar RLS en Supabase

El error que recibiste al crear un negocio es porque **Row Level Security (RLS) está habilitado** pero no tiene políticas configuradas que permitan las operaciones.

## Solución: Ejecutar SQL en Supabase

### Paso 1: Abre Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto

### Paso 2: Abre el SQL Editor
1. En el menú izquierdo, busca **"SQL Editor"**
2. Haz clic en el icono de **"+"** verde para crear una nueva query
3. O selecciona **"New Query"** en el botón superior

### Paso 3: Copia y Pega este SQL

Copia TODO el código abajo y pégalo en el editor SQL de Supabase:

```sql
-- Deshabilitar RLS en todas las tablas
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

### Paso 4: Ejecuta el SQL
1. Haz clic en el botón **"Run"** o presiona **Ctrl+Enter** (o **Cmd+Enter** en Mac)
2. Espera a que aparezca el mensaje de éxito (generalmente dice "Query successful" o similar)

### Paso 5: Verifica que funcionó
- Regresa a tu aplicación
- Intenta **crear un negocio nuevamente**
- Ahora debería funcionar sin errores

## ¿Qué significa esto?

- **RLS (Row Level Security)**: Es un sistema de permisos a nivel de fila
- **Habilitado pero sin políticas**: La base de datos rechaza TODAS las operaciones
- **Deshabilitado**: Todos pueden hacer cualquier cosa (OK para desarrollo)
- **Producción**: Deberemos implementar RLS correctamente con políticas seguras

## Si necesitas resetear la base de datos completa

Si algo sale mal y necesitas empezar de cero:
1. Ve a Supabase → Project Settings → Danger Zone
2. Selecciona "Reset Database"
3. Espera a que se reinicie

Luego vuelve a ejecutar el SQL del archivo `scripts/001_create_schema.sql` en Supabase.

---

**¿Pregunta?** Si el SQL no funciona o tienes errores, copia el mensaje exacto de error y te ayudaré a resolverlo.
