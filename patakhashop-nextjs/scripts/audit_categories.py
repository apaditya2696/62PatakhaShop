import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

json_path = r'c:\phatka shop\patakhashop-nextjs\src\data\products.json'
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"==================================================")
print(f" FULL CATEGORY AUDIT REPORT FOR 697 PRODUCTS")
print(f"==================================================")

categories = [
    'aerial cakes', 'skyshots', 'flowerpots', 'crackers',
    'bombs', 'sparklers', 'chakkar', 'torches', 'rockets', 'kids special'
]

flagged_items = []

for p in products:
    name = (p.get('name') or '').strip()
    brand = (p.get('brand') or '').strip()
    cat = (p.get('category') or '').strip()
    tags = (p.get('tags') or '').strip()
    
    name_l = name.lower()
    cat_l = cat.lower()
    full_l = f"{name_l} {tags.lower()}"

    # Checking for specific misclassifications:
    
    # 1. Crackers audit: Should not contain sky shots, flower pots, rockets, sparklers, candles
    if cat_l == 'crackers':
        if any(k in name_l for k in ['flower pot', 'anar', 'fountain', 'sparkler', 'rocket', 'aerial', 'skyshot', 'candle', 'torch', 'pipe']):
            flagged_items.append((p, 'crackers', f"Contains non-cracker keyword in name: {name}"))

    # 2. Bombs audit: Should not contain flower pots, fountains, sparklers, rockets, torches
    elif cat_l == 'bombs':
        if any(k in name_l for k in ['flower pot', 'anar', 'fountain', 'sparkler', 'rocket', 'candle', 'torch']):
            flagged_items.append((p, 'bombs', f"Contains non-bomb keyword in name: {name}"))

    # 3. Multi-shot cakes audit: Should not be a single pipe shell or fountain or sparkler
    elif cat_l == 'aerial cakes':
        if any(k in name_l for k in ['flower pot', 'anar', 'sparkler', 'ground chakkar', 'pop pop']):
            flagged_items.append((p, 'aerial cakes', f"Contains non-cake keyword in name: {name}"))

    # 4. Sky Shots audit: Should not be multi-shot cakes or sound crackers or sparklers
    elif cat_l == 'skyshots':
        if any(k in name_l for k in ['flower pot', 'anar', 'sparkler', 'ground chakkar', 'pop pop', 'chut put']):
            flagged_items.append((p, 'skyshots', f"Contains non-skyshot keyword in name: {name}"))

    # 5. Flowerpots audit: Should not be rockets or sparklers or bombs
    elif cat_l == 'flowerpots':
        if any(k in name_l for k in ['rocket', 'sparkler', 'bomb', 'lar', 'chorsa']):
            flagged_items.append((p, 'flowerpots', f"Contains non-flowerpot keyword in name: {name}"))

    # 6. Sparklers audit: Should not be bombs or rockets or flower pots
    elif cat_l == 'sparklers':
        if any(k in name_l for k in ['rocket', 'bomb', 'pipe', 'shell', 'lar']):
            flagged_items.append((p, 'sparklers', f"Contains non-sparkler keyword in name: {name}"))

print(f"Audit completed. Total flagged items needing re-assignment: {len(flagged_items)}")

for item, old_cat, reason in flagged_items:
    print(f"ID {item['id']} [{old_cat}]: {item['name']} ({item['brand']}) -> {reason}")
