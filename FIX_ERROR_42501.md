# Solucionar Error 42501 - RLS Policy Violation

## El Error Exacto

```
Error creating business: {
  code: '42501',
  details: null,
  hint: null,
  message: 'new row violates row-level security policy for table "businesses"'
}
```

## ¿Qué Significa?

- **42501** = PostgreSQL error code para "RLS policy violation"
- **Traducción**: Row Level Security está habilitado pero no permite inserciones
- **Razón**: No hay políticas de seguridad configuradas para crear registros

## La Solución en 3 Pasos

### Paso 1: Abre Supabase
1. Ve a https://supabase.com
2. Inicia sesión
3. Selecciona tu proyecto

### Paso 2: Abre el SQL Editor
En el menú izquierdo:
- Busca **"SQL Editor"**
- Haz clic en el icono **"+"** verde
- O click en **"New Query"**

### Paso 3: Copia Este Código Exacto

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

### Paso 4: Pégalo en el Editor

1. Haz clic en el editor SQL
2. Presiona Ctrl+A para seleccionar todo (si hay algo)
3. Presiona Ctrl+V para pegar el código nuevo
4. Verifica que todo esté seleccionado

### Paso 5: Ejecuta

- Haz clic en el botón **"Run"** (de color verde)
- O presiona **Ctrl+Enter** (Cmd+Enter en Mac)

### Paso 6: Espera el Resultado

Deberías ver uno de estos mensajes:
- ✅ "Success"
- ✅ "Executed successfully"
- ✅ "Query executed" (sin errores)

**Si ves esto, ¡funcionó!**

---

## Prueba Que Funciona

1. Regresa a tu app (http://localhost:3000)
2. Navega a Dashboard → Negocios
3. Haz clic en **"Nuevo Negocio"**
4. Llena los campos:
   - **Nombre**: "Mi Primer Restaurante"
   - **Tipo**: "Restaurante"
   - **Email**: "admin@mirestaurante.com"
   - **Teléfono**: "+1234567890"
   - **Dirección**: "Calle Principal 123"
   - **Ciudad**: "Mi Ciudad"
5. Haz clic en **"Crear Negocio"**

✅ **Si aparece en la lista, ¡está funcionando!**

---

## ¿Por Qué Sucedió Esto?

1. La base de datos tiene **RLS habilitado** (medida de seguridad)
2. Pero **no hay políticas activas** para permitir operaciones
3. Resultado: PostgreSQL rechaza todo (error 42501)

**Solución**: Deshabilitamos RLS para desarrollo. En producción lo reactivaremos con políticas correctas.

---

## Si Todavía Sale Error

### "Query error" o "Syntax error"
- Copia **TODO** el código exactamente
- Sin líneas extra, sin cambios
- Intenta ejecutar línea por línea si es necesario

### "Still getting 42501"
1. Actualiza la página (F5 o Cmd+R)
2. Cierra y reabre el navegador
3. Espera 10 segundos (cache)

### "Connection refused"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` está en Settings → Vars
- Verifica que es la URL correcta de tu proyecto

---

## Siguiente Paso

¡Ahora sí puedes crear negocios! Prueba:
- Crear un negocio
- Crear un usuario
- Navegar entre secciones
- Ver las animaciones hermosas

Cualquier duda, avísame.
