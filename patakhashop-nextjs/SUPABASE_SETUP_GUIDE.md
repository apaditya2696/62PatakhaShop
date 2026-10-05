# 62 Patakha Shop — Supabase & Admin Configuration Guide

This Next.js application is built with **hybrid database sync**:
- Works instantly with local zero-latency storage (`src/data/products.json`, `src/data/orders.json`, `src/data/leads.json`).
- Directly connects to **Supabase** as soon as you plug in your credentials below.

---

## 🛠️ Step 1: Run the Database SQL in Supabase

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g. `62-patakha-shop`).
3. In the left sidebar, click **SQL Editor** -> **New query**.
4. Open the SQL file provided in this repository:
   - [schema.sql](file:///c:/phatka%20shop/patakhashop-nextjs/supabase/schema.sql)
5. Paste the entire SQL content into the Supabase query editor and click **Run**.
   - This creates the `products`, `orders`, and `leads` tables, plus the `product-images` storage bucket.

---

## 📦 Step 2: Seed the 208 Fireworks Products

1. In Supabase **SQL Editor**, click **New query**.
2. Open the seed file provided in this repository:
   - [seed_products.sql](file:///c:/phatka%20shop/patakhashop-nextjs/supabase/seed_products.sql)
3. Paste the content and click **Run**.
   - This will populate all 208 products with their initial prices, brands, categories, and image links into your Supabase database.

---

## 🔑 Step 3: Connect Supabase to the Website

1. In Supabase, go to **Project Settings** -> **API**.
2. Copy your **Project URL**, **anon public key**, and **service_role key**.
3. Create a `.env.local` file inside `patakhashop-nextjs/` with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Admin Master Password
ADMIN_KEY=patakha62admin
```

4. Restart your Next.js server (`npm run dev` or redeploy to Vercel).
5. All live updates in the `/admin` dashboard (stock changes, price updates, new products, image uploads, orders, and inquiries) will sync directly to Supabase in real time!
