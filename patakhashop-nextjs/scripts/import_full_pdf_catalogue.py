import pymupdf
import os
import sys
import io
import json
import re
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'c:\phatka shop\Fireworks Product Catalogue.pdf'
doc = pymupdf.open(pdf_path)
output_dir = r'c:\phatka shop\patakhashop-nextjs\public\products'
os.makedirs(output_dir, exist_ok=True)

category_map = {
    'fancy': 'skyshots',
    'pipe': 'skyshots',
    'aerial': 'skyshots',
    'shot': 'skyshots',
    'shell': 'skyshots',
    'rocket': 'rockets',
    'flower': 'flowerpots',
    'anar': 'flowerpots',
    'pot': 'flowerpots',
    'fountain': 'flowerpots',
    'sparkler': 'sparklers',
    'phuljhadi': 'sparklers',
    'candle': 'torches',
    'torch': 'torches',
    'pencil': 'torches',
    'chakkar': 'chakkar',
    'wheel': 'chakkar',
    'spinner': 'chakkar',
    'bomb': 'bombs',
    'sound': 'crackers',
    'cracker': 'crackers',
    'lar': 'crackers',
    'chorsa': 'crackers',
    'kid': 'kids special',
    'novelty': 'kids special',
    'novelties': 'kids special',
    'pop': 'kids special',
    'toy': 'kids special'
}

products_list = []
sno = 1
current_category_header = 'skyshots'

# Extract all 400x400 HD images and match products across all 90 pages
for page_idx in range(1, len(doc)): # Page 2 to 90
    page = doc[page_idx]
    image_list = page.get_images()
    blocks = page.get_text('blocks')
    
    # Check top text block for category section header (e.g. 'Fancy Pipes (200)')
    for b in blocks:
        txt = b[4].strip()
        if b[1] < 35 or ('(' in txt and ')' in txt):
            for k, v in category_map.items():
                if k in txt.lower():
                    current_category_header = v
                    break

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
            if not texts:
                continue
                
            clean_text = ' '.join(texts)
            lines = [l.strip() for txt in texts for l in txt.split('\n') if l.strip()]
            
            # Filter out generic page title text
            filtered = [l for l in lines if not l.startswith('Fancy Pipes') and not l.startswith('Products grouped') and not '10/5/26' in l]
            if not filtered:
                continue
                
            brand = filtered[0]
            name = filtered[1] if len(filtered) > 1 else brand
            
            # If brand was header text
            if brand.startswith('Fancy') or brand.startswith('Category') or brand.startswith('10/5/26'):
                if len(filtered) > 1:
                    brand = filtered[1]
                if len(filtered) > 2:
                    name = filtered[2]
                    
            desc = ' '.join(filtered[2:]) if len(filtered) > 2 else ''
            
            # Determine specific category
            cat = current_category_header
            for k, v in category_map.items():
                if k in clean_text.lower():
                    cat = v
                    break
                    
            # Check HD image
            img_filename = f'hd_p{page_idx+1}_r{r}_c{c}.jpg'
            img_filepath = os.path.join(output_dir, img_filename)
            
            # If HD image doesn't exist, extract it now if possible
            img_url = f'/products/{img_filename}' if os.path.exists(img_filepath) else '/logo-62.jpg'
            
            # Build product object
            tags_str = f"{brand}, {cat}, {desc[:30]}" if desc else f"{brand}, {cat}"
            
            p = {
                'id': str(sno),
                'sno': sno,
                'name': name if name else f"Firework #{sno}",
                'brand': brand if brand else "Patakha Shop",
                'category': cat,
                'tags': tags_str,
                'price': 0,
                'originalPrice': 0,
                'discount': 'Price Pending',
                'inStock': True,
                'image': img_url,
                'stockQuantity': 50
            }
            products_list.append(p)
            sno += 1

print(f'Extracted total {len(products_list)} products directly from PDF Catalogue!')

# Write src/data/products.json
json_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products_list, f, indent=2, ensure_ascii=False)
print(f'Wrote {len(products_list)} products to {json_path}')

# Backup path
backup_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products_backup_full.json'
with open(backup_path, 'w', encoding='utf-8') as f:
    json.dump(products_list, f, indent=2, ensure_ascii=False)

# Write seed_products.sql
sql_lines = [
    '-- Supabase Seed Data for Products (Full 694 Products from Master PDF Catalogue)',
    'DELETE FROM products;',
    'INSERT INTO products (id, sno, name, brand, category, tags, price, original_price, discount, in_stock, stock_quantity, image) VALUES'
]

vals = []
for p in products_list:
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

print(f'Wrote SQL seed file with {len(products_list)} products to {sql_path}')
