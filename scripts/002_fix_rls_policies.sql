-- ============================================================================
-- FIX RLS POLICIES - SOLVE INFINITE RECURSION
-- ============================================================================
-- This script fixes the infinite recursion in RLS policies by dropping
-- the old problematic policies and replacing them with simpler, working ones.

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "super_admin_all_users" ON public.users;
DROP POLICY IF EXISTS "super_admin_all_businesses" ON public.businesses;
DROP POLICY IF EXISTS "users_see_own" ON public.users;
DROP POLICY IF EXISTS "business_owner_access" ON public.businesses;
DROP POLICY IF EXISTS "business_employee_read" ON public.businesses;
DROP POLICY IF EXISTS "tables_business_access" ON public.restaurant_tables;
DROP POLICY IF EXISTS "menu_business_access" ON public.menu_items;
DROP POLICY IF EXISTS "orders_business_access" ON public.orders;
DROP POLICY IF EXISTS "order_items_business_access" ON public.order_items;
DROP POLICY IF EXISTS "inventory_business_access" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_history_business_access" ON public.inventory_history;
DROP POLICY IF EXISTS "barbers_business_access" ON public.barbers;
DROP POLICY IF EXISTS "appointments_business_access" ON public.appointments;
DROP POLICY IF EXISTS "haircut_records_business_access" ON public.haircut_records;
DROP POLICY IF EXISTS "customer_loyalty_business_access" ON public.customer_loyalty;
DROP POLICY IF EXISTS "queue_entries_business_access" ON public.queue_entries;

-- SIMPLIFIED RLS POLICIES TO AVOID RECURSION
-- Super admin (jhairoswaldo@gmail.com) can access everything
-- Other users see only their business data

-- Users table: Users can see themselves and superadmins can see all
CREATE POLICY "users_can_see_own_profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "superadmin_can_see_all_users" ON public.users
  FOR SELECT USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "admin_can_update_own_profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "superadmin_can_manage_all_users" ON public.users
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

-- Businesses table: Owner or superadmin access
CREATE POLICY "businesses_superadmin_access" ON public.businesses
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "businesses_owner_access" ON public.businesses
  FOR ALL USING (owner_id = auth.uid());

-- All other tables: Superadmin full access + business_id based access
CREATE POLICY "tables_superadmin_all" ON public.restaurant_tables
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "tables_business_access" ON public.restaurant_tables
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "menu_superadmin_all" ON public.menu_items
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "menu_business_access" ON public.menu_items
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "orders_superadmin_all" ON public.orders
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "orders_business_access" ON public.orders
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "order_items_superadmin_all" ON public.order_items
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "order_items_business_access" ON public.order_items
  FOR ALL USING (
    order_id IN (
      SELECT id FROM public.orders WHERE business_id IN (
        SELECT id FROM public.businesses WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "inventory_superadmin_all" ON public.inventory_items
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "inventory_business_access" ON public.inventory_items
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "inventory_history_superadmin_all" ON public.inventory_history
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "inventory_history_business_access" ON public.inventory_history
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "barbers_superadmin_all" ON public.barbers
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "barbers_business_access" ON public.barbers
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "appointments_superadmin_all" ON public.appointments
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "appointments_business_access" ON public.appointments
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "haircut_records_superadmin_all" ON public.haircut_records
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "haircut_records_business_access" ON public.haircut_records
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "customer_loyalty_superadmin_all" ON public.customer_loyalty
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "customer_loyalty_business_access" ON public.customer_loyalty
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "queue_superadmin_all" ON public.queue_entries
  FOR ALL USING (auth.jwt()->>'email' = 'jhairoswaldo@gmail.com');

CREATE POLICY "queue_business_access" ON public.queue_entries
  FOR ALL USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );
