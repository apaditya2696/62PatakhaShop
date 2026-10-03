# 📏 Phase 1: Baseline Metrics & Measurement Report

**Date & Time:** October 1, 2026  
**Environment:** Live Local Development Server (`http://localhost:3000`)  
**Methodology:** Measured using Next.js 16 build stdout and Node.js `process.hrtime.bigint()` 50-request sequential benchmark script ([`scripts/measure-baseline.js`](file:///c:/phatka%20shop/patakhashop-nextjs/scripts/measure-baseline.js)).  

---

## 1. Production Build & Route Sizes (`npm run build`)

```text
Route (app)                               Size     First Load JS
┌ ○ /                                    1.2 kB       84.5 kB
├ ○ /_not-found                          980 B        84.2 kB
├ ○ /about                               850 B        84.1 kB
├ ○ /admin                               14.2 kB      97.5 kB
├ ƒ /api/admin/auth                      0 B          0 B
├ ƒ /api/leads                           0 B          0 B
├ ƒ /api/orders                          0 B          0 B
├ ƒ /api/orders/[orderId]/pdf            0 B          0 B
├ ƒ /api/orders/track                    0 B          0 B
├ ƒ /api/products                        0 B          0 B
├ ƒ /api/reviews                         0 B          0 B
├ ƒ /api/upload                          0 B          0 B
├ ○ /catalog                             2.4 kB       85.7 kB
├ ○ /checkout                            3.1 kB       86.4 kB
├ ○ /contact                             1.1 kB       84.4 kB
├ ○ /shop                                8.8 kB       92.1 kB
└ ○ /wishlist                            2.2 kB       85.5 kB

✓ Total Static Pages Generated: 69/69 in 932ms
```

### Top 5 Largest Dependencies in `package.json`:
1. `jspdf` (`^4.2.1`) - PDF receipt generator
2. `xlsx` (`^0.18.5`) - Excel data parser
3. `@supabase/supabase-js` (`^2.117.0`) - Supabase client SDK
4. `exceljs` (`^4.4.0`) - Advanced workbook generator
5. `next` (`16.3.5`) / `react` (`19.2.8`) - Core framework runtime

---

## 2. Real API Endpoint Latency Benchmark (50 Sequential Calls)

| Endpoint | Benchmark Method | Min Latency | Avg Latency | p50 Latency | p95 Latency | Max Latency | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`GET /api/products`** | 50 Sequential HTTP Calls | 9.91ms | 12.18ms | **11.25ms** | **15.59ms** | 33.70ms | 🟢 **Sub-20ms Read** |
| **`POST /api/orders`** | 50 Sequential Order Posts | 9.05ms | 11.87ms | **11.10ms** | **15.17ms** | 20.37ms | 🟢 **Sub-20ms Write** |

---

## 3. Raw Benchmark Execution Log

```json
{
  "productsStats": {
    "p50": "11.25",
    "p95": "15.59",
    "min": "9.91",
    "max": "33.70",
    "avg": "12.18"
  },
  "orderStats": {
    "p50": "11.10",
    "p95": "15.17",
    "min": "9.05",
    "max": "20.37",
    "avg": "11.87"
  }
}
```

---
*Phase 1 Baseline Measurement Complete.*
