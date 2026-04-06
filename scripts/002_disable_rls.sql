-- ============================================================================
-- DISABLE ROW LEVEL SECURITY (RLS) - DEVELOPMENT MODE
-- ============================================================================
-- This script disables RLS on all tables to allow full development access.
-- RLS will be properly implemented later with correct policies.

-- Disable RLS on all tables
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

-- Verify RLS is disabled
-- Run this query to verify: SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- Then for each table: SELECT tablename FROM information_schema.tables WHERE table_schema = 'public';
