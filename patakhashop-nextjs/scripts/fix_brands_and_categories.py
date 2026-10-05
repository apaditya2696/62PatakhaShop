import json
import os
import re

json_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products.json'
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

valid_brands = [
    'ARIHARA', 'ARUMUGAM', 'AZAD', 'CHIMA', 'COCK', 'ANIL', 'GUDIYA', 'DZOKER',
    'HARIGIRIVAR', 'HINDUSTAN', 'JAI SARTHI', 'KRISHNASWAMI', 'MERCURY', 'MUNNA',
    'NYAGI', 'PANDYAN', 'RAJAN', 'RATHNA', 'ROHINI', 'RUDRA', 'SDS', 'SHIV SAKTI',
    'SONY', 'STANDARD', 'SUN', 'SUNSHINE', 'SWAMI', 'VADIVEL', 'VANITHA', 'VASANTHA',
    'SIVAKASI SELECT'
]

cleaned_count = 0
for p in products:
    b_raw = (p.get('brand') or '').strip().upper()
    
    # Try finding exact or substring match in valid_brands
    found = None
    for vb in valid_brands:
        if vb in b_raw or b_raw in vb:
            found = vb
            break
            
    if found:
        p['brand'] = found
    else:
        p['brand'] = 'Sivakasi Select'
        cleaned_count += 1

print(f'Cleaned {cleaned_count} brand labels.')

# Write updated products.json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Backup path
backup_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products_backup_full.json'
with open(backup_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Write seed_products.sql
sql_lines = [
    '-- Supabase Seed Data for Products (Fully Categorized & Cleaned Brands)',
    'DELETE FROM products;',
    'INSERT INTO products (id, sno, name, brand, category, tags, price, original_price, discount, in_stock, stock_quantity, image) VALUES'
]

vals = []
for p in products:
    esc_name = p['name'].replace("'", "''")
    esc_brand = p['brand'].replace("'", "''")
    esc_cat = p['category'].replace("'", "''")
    esc_tags = p['tags'].replace("'", "''")
    esc_disc = p['discount'].replace("'", "''")
    esc_img = p['image'].replace("'", "''")
    
    v = f"('{p['id']}', {p['sno']}, '{esc_name}', '{esc_brand}', '{esc_cat}', '{esc_tags}', 0, 0, '{esc_disc}', true, 50, '{esc_img}')"
    vals.append(v)

sql_lines.append(',\n'.join(vals) + ';')

sql_path = r'c:\phatka shop\patakhashop-nextjs\supabase\seed_products.sql'
with open(sql_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print('Saved products.json and seed_products.sql cleanly.')
