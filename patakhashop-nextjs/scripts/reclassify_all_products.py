import json
import re
import os

json_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products.json'
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

def get_precise_category(p):
    name = (p.get('name') or '').lower()
    brand = (p.get('brand') or '').lower()
    tags = (p.get('tags') or '').lower()
    full = f'{name} {brand} {tags}'

    # 1. Multi-Shot Aerial Cakes (Priority 1)
    is_multi_shot = (
        'cake' in full or 'multishot' in full or 'multi shot' in full or 'fan cake' in full or 'salute' in full or
        re.search(r'\b(7|10|12|15|20|24|25|30|50|60|72|80|100|120|130|150|160|180|200|240|300|500|1000)\s*(shot|shots|sh\b|salute)', full)
    )
    
    # Check single pipe aerials (e.g. 'pipe 2″', '1.5″ shell', 'single pipe', 'single shot')
    is_single_pipe = ('pipe' in full or 'shell' in full or 'bazooka' in full or 'single shot' in full or '1.5″' in full or '2″' in full or '2.25″' in full or '2.5″' in full or '3″' in full or '3.5″' in full or '4″' in full or '4.5″' in full or '5″' in full)
    
    # If it is a multi-shot cake (has shot count e.g., '120 shot' or 'multi shot') and not just a single pipe size designation
    if is_multi_shot and not ('pipe' in full and not any(k in name for k in ['shot', 'shots', 'cake', 'salute'])):
        return 'aerial cakes'

    # 2. Single Sky Shots & Shells
    if is_single_pipe or 'sky shot' in full or 'skyshot' in full or 'aerial' in full or 'rider' in full or 'bazooka' in full:
        return 'skyshots'

    # 3. Sky Rockets
    if 'rocket' in full:
        return 'rockets'

    # 4. Flower Pots & Anars & Fountains
    if 'pot' in full or 'anar' in full or 'fountain' in full or 'ashoka' in full or 'rangeela' in full:
        return 'flowerpots'

    # 5. Sparklers / Phuljhadi
    if 'sparkler' in full or 'phuljhadi' in full or 'electric' in full and 'spark' in full:
        return 'sparklers'

    # 6. Torches & Roman Candles & Pencils
    if 'torch' in full or 'candle' in full or 'pencil' in full or 'flare' in full:
        return 'torches'

    # 7. Ground Chakkars & Spinners
    if 'chakkar' in full or 'chakra' in full or 'spinner' in full or 'wheel' in full or 'zamin' in full:
        return 'chakkar'

    # 8. Bombs
    if 'bomb' in full or 'hydro' in full or 'atom' in full or 'time bomb' in full or 'cartridge' in full:
        return 'bombs'

    # 9. Sound Crackers & Lar
    if 'cracker' in full or 'lar' in full or 'chorsa' in full or 'ladi' in full or 'sound' in full or 'bijli' in full or 'garland' in full:
        return 'crackers'

    # 10. Kids Special & Novelties (Fallback for pop pop, chut put, toys, guns, etc.)
    return 'kids special'

counts = {}
for p in products:
    cat = get_precise_category(p)
    p['category'] = cat
    counts[cat] = counts.get(cat, 0) + 1

print('Updated Category Distribution across all 697 products:')
for cat, count in sorted(counts.items(), key=lambda x: x[1], reverse=True):
    print(f'  {cat}: {count} products')

# Save updated products.json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Backup path
backup_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products_backup_full.json'
with open(backup_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Write seed_products.sql
sql_lines = [
    '-- Supabase Seed Data for Products (Fully Categorized 697 Products)',
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
