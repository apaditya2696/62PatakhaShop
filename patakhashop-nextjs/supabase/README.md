# 62 Patakha Shop — Supabase Database Architecture & Management

This folder contains all SQL migrations, table definitions, RLS security policies, and product seeds for **62 Patakha Shop**.

---

### 📂 Directory Structure

```text
supabase/
├── README.md                           # This guide & reference documentation
├── schema.sql                          # Primary database creation script (tables, RLS policies, storage bucket)
├── seed_products.sql                   # Initial dataset seeding 208 authentic Sivakasi firecracker products
└── migrations/
    └── 20261001_decrement_stock_atomic.sql  # Postgres RPC function for atomic stock updates with FOR UPDATE row locks
```

---

### 🛠️ Quick Setup Instructions

1. **Create Database Tables & RLS Policies**:
   - Open your [Supabase Dashboard](https://supabase.com/dashboard).
   - Go to **SQL Editor ➔ New query**.
   - Copy & paste the contents of `supabase/schema.sql` and click **Run**.

2. **Run Atomic Stock Decrement RPC Function**:
   - In SQL Editor, run `supabase/migrations/20261001_decrement_stock_atomic.sql`.
   - This ensures safe concurrent stock management during high festive traffic.

3. **Seed Products Catalog**:
   - In SQL Editor, run `supabase/seed_products.sql`.
   - Populates 208 authentic Sivakasi products into the `products` table.

4. **Environment Configuration**:
   - Add your Supabase project keys to `patakhashop-nextjs/.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
     ADMIN_KEY=patakha62admin
     ```
