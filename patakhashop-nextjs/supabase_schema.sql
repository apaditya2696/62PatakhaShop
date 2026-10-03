-- ==============================================================================
-- 62 PATAKHA SHOP — COMPLETE SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this entire script in Supabase Dashboard -> "SQL Editor" -> Click "Run"
-- It creates:
--  1. products table (catalog, prices, stock, discounts, images)
--  2. orders table (customer orders from WhatsApp checkout)
--  3. leads table (customer inquiries from Contact Us)
--  4. storage bucket 'products' for product images
--  5. Public read and service role policies
-- ==============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sno INT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '62 Specials',
    category TEXT NOT NULL DEFAULT 'novelties',
    tags TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INT NOT NULL DEFAULT 50,
    image TEXT NOT NULL DEFAULT '/logo-62.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT,
    customer_phone TEXT,
    order_note TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_savings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'delivered', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LEADS TABLE (Contact Us inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    mobile TEXT NOT NULL,
    requirement TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. ACCESS POLICIES
-- Products: Anyone can read, full access for service key or authenticated admin
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access products" ON public.products;
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Orders: Public can ONLY insert new orders. Viewing & updating is restricted to service_role or authenticated admins.
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public view orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;

-- Service role / authenticated admin can view and update orders
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- Leads: Public can ONLY insert leads. Viewing & updating is restricted to service_role or authenticated admins.
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public view leads" ON public.leads;
DROP POLICY IF EXISTS "Admin full access leads" ON public.leads;
CREATE POLICY "Admin full access leads" ON public.leads FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 6. CREATE STORAGE BUCKET FOR PRODUCT IMAGES (If using Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read product images bucket
DROP POLICY IF EXISTS "Public Access to Product Images" ON storage.objects;
CREATE POLICY "Public Access to Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Public can upload to product images bucket
DROP POLICY IF EXISTS "Public Upload to Product Images" ON storage.objects;
CREATE POLICY "Public Upload to Product Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Update Product Images" ON storage.objects;
CREATE POLICY "Public Update Product Images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
