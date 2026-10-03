# Patakha Shop - Project Configuration & Saved Chat Context

## 1. Project Overview
- **Project Name**: Patakha Shop (62 Patakha Shop, Hawa Mahal Bazar, Jaipur)
- **Framework**: Next.js 16 (App Router) + TypeScript + Vanilla CSS Modules
- **Main Admin File**: `patakhashop-nextjs/src/app/admin/AdminClient.tsx`
- **Main Admin CSS**: `patakhashop-nextjs/src/app/admin/AdminClient.module.css`
- **Port**: `http://localhost:3000` (Admin at `/admin`)

## 2. Terminology & Branding Guidelines
- Use **Admin** (not Curator).
- Admin Portal Title in Hindi: `एडमिन पोर्टल (बिलिंग)`.

## 3. Bilingual Order Status Options (English / Hindi)
In `AdminClient.tsx`, order status values use the following exact Hindi terms requested by the shop team:
- `pending` ➔ **`लंबित (पेंडिंग)`**
- `confirmed` ➔ **`भुगतान प्राप्त (कन्फर्म)`**
- `delivered` ➔ **`डिलीवर हो गया`**
- `cancelled` ➔ **`रद्द कर दिया`**

## 4. Real-World Market Resiliency & UX Hardening
1. **Network Fluctuation / Timeout**: Graceful offline toast error handling, local disk draft saves.
2. **Auto Sync on Unlock**: `window.focus` event listener triggers silent background re-sync of products and active orders when phone screen is unlocked.
3. **PWA Support**: Web manifest at `/manifest.webmanifest` and PWA install prompt banner for quick launch from phone home screen.
4. **Counter / Walk-in Billing**: Quick counter billing modal with direct receipt printing (`window.print()`).
5. **Zero Horizontal Scroll & Responsive Mobile Grid**: Equal 3-column tab bar, flex wrap filter tracks, 100% viewport modals.
6. **Safety Confirmations**: Custom `ConfirmModal` (Mobile Bottom Sheet / Desktop Centered Dialog) for Logout, Stock Report Print, and marking high-inventory items Out of Stock.
7. **Instant Tab Switching (0ms)**: CSS visibility toggles (`display: none` / `block`) prevent DOM unmounting/remounting lag.

## 5. High Performance Architecture & Speed Optimizations
1. **Zero-Copy RAM Caching**: Node.js RAM buffer response caching across `/api/products`, `/api/orders`, `/api/leads`.
2. **Non-blocking Data Store**: `src/lib/memoryStore.ts` eliminates synchronous disk write latency (`fs.writeFileSync`).
3. **Fast Admin Render Diffing**: Replaced expensive `JSON.stringify` state diffing with primitive shallow equality checkers (`areProductsEqual`, `areOrdersEqual`, `areLeadsEqual`).

## 6. Security, Database & Validation Hardening
1. **Atomic Stock Decrement (`decrement_stock_atomic.sql`)**: PostgreSQL RPC function [`src/lib/decrement_stock_atomic.sql`](file:///c:/phatka%20shop/patakhashop-nextjs/src/lib/decrement_stock_atomic.sql) using `FOR UPDATE` row locks to prevent overselling during peak Diwali traffic.
2. **Timing-Safe Auth**: Auth comparisons use `crypto.timingSafeEqual` over fixed-length buffer hashes.
3. **Zod Validation**: Input sanitization and schema checks (`src/lib/validations.ts`) for orders and leads.

## 7. Mobile Quality Assurance (QA) Standards
1. **Clean Single-Line Category Navigation**: Minimalist `← PREVIOUS: Sky Shots` | `NEXT: Bombs →` links without card clutter or vertical divider lines.
2. **Dynamic Dropdown Alignment (`CustomSelect.tsx`)**: Bounded dropdown menus automatically switch between `.alignLeft` and `.alignRight` to prevent off-screen bleeding.
3. **iOS 16px Auto-Zoom Protection**: Inputs enforce `16px` base font size to prevent iOS Safari auto-zooming.
4. **Safe Area Clearance**: Catalog wrapper includes `padding-bottom: calc(140px + env(safe-area-inset-bottom))` for mobile bottom navigation bar clearance.
