import json
import pymupdf
import sys
import io
import os
import re
import urllib.request
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load products.json
json_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products.json'
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# 2. Extract PDF product slots and HD images
pdf_path = r'c:\phatka shop\Fireworks Product Catalogue.pdf'
doc = pymupdf.open(pdf_path)
output_dir = r'c:\phatka shop\patakhashop-nextjs\public\products'

pdf_items = []
for page_idx in range(1, len(doc)):
    page = doc[page_idx]
    image_list = page.get_images()
    blocks = page.get_text('blocks')
    
    valid_blocks = [b for b in blocks if b[4].strip() and 'Fireworks Product Catalogue' not in b[4] and 'file:///' not in b[4]]
    cells = {(r, c): [] for r in range(3) for c in range(3)}
    
    for b in valid_blocks:
        cx = (b[0] + b[2]) / 2.0
        cy = (b[1] + b[3]) / 2.0
        c = 0 if cx < 205 else (1 if cx < 390 else 2)
        r = 0 if cy < 270 else (1 if cy < 520 else 2)
        cells[(r, c)].append(b[4].strip())
        
    for r in range(3):
        for c in range(3):
            texts = cells[(r, c)]
            if not texts: continue
            clean = ' '.join(texts)
            lines = [l.strip() for txt in texts for l in txt.split('\n') if l.strip()]
            if not lines: continue
            
            img_filename = f'hd_p{page_idx+1}_r{r}_c{c}.jpg'
            img_filepath = os.path.join(output_dir, img_filename)
            
            if os.path.exists(img_filepath):
                pdf_items.append({
                    'clean': clean.lower(),
                    'lines': lines,
                    'image': f'/products/{img_filename}',
                    'desc': clean
                })

print(f'Available HD PDF items with images: {len(pdf_items)}')

def clean_str(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

hd_updated = 0
for p in products:
    p_name_clean = clean_str(p['name'])
    p_brand_clean = clean_str(p['brand'])
    
    best_match = None
    # Level 1: Name + Brand exact match
    for item in pdf_items:
        item_clean = clean_str(item['desc'])
        if p_name_clean in item_clean and p_brand_clean in item_clean:
            best_match = item
            break
            
    # Level 2: Name match alone (if name length > 4)
    if not best_match and len(p_name_clean) > 4:
        for item in pdf_items:
            item_clean = clean_str(item['desc'])
            if p_name_clean in item_clean:
                best_match = item
                break
                
    if best_match:
        p['image'] = best_match['image']
        hd_updated += 1

print(f'Successfully upgraded {hd_updated} of {len(products)} products to 400x400 HD crisp PDF images!')

# Save updated products.json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Backup path
backup_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products_backup_full.json'
with open(backup_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Update seed_products.sql
sql_lines = [
    '-- Supabase Seed Data for Products (Generated with 400x400 Crisp HD Images)',
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

print('Saved products.json and seed_products.sql successfully.')
