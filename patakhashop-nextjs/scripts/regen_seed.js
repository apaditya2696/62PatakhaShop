const fs = require('fs');
const path = require('path');

const prods = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf8'));

let sql = `-- 62 Patakha Shop - Supabase Products Seed (Clean Authentic Sivakasi Firecrackers)
-- Total Products: ${prods.length}

INSERT INTO products (id, name, brand, category, original_price, discount_price, image, in_stock, stock_quantity, tags)
VALUES
`;

const rows = prods.map(p => {
  const esc = (s) => (s ? String(s).replace(/'/g, "''") : '');
  const tagsArr = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : []);
  const tagsStr = tagsArr.map(t => `'${esc(t.trim())}'`).join(', ');
  return `  ('${esc(p.id)}', '${esc(p.name)}', '${esc(p.brand)}', '${esc(p.category)}', ${Number(p.original_price) || 0}, ${Number(p.discount_price) || 0}, '${esc(p.image)}', ${p.in_stock ? 'TRUE' : 'FALSE'}, ${Number(p.stock_quantity) || 50}, ARRAY[${tagsStr}])`;
});

sql += rows.join(',\n') + `
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  original_price = EXCLUDED.original_price,
  discount_price = EXCLUDED.discount_price,
  image = EXCLUDED.image,
  in_stock = EXCLUDED.in_stock,
  stock_quantity = EXCLUDED.stock_quantity,
  tags = EXCLUDED.tags;
`;

fs.writeFileSync(path.join(__dirname, '../supabase_seed_products.sql'), sql, 'utf8');
console.log('Successfully regenerated supabase_seed_products.sql with', prods.length, 'products');
