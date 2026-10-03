import openpyxl, json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

wb = openpyxl.load_workbook(r'C:\phatka shop\Sheet_for_Online_Marked_Green (2).xlsx', data_only=True)
ws1 = wb['Sheet1']
ws_main = wb['Sheet Main']

with open(r'C:\phatka shop\patakhashop-nextjs\src\data\products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

sheet1_rows = []
for r_idx, r in enumerate(ws1.iter_rows(min_row=2), start=2):
    is_green = any(c.fill and c.fill.fgColor and getattr(c.fill.fgColor, 'rgb', None) == '00D4EDDA' for c in r)
    sheet1_rows.append({
        'row': r_idx,
        'item_code': str(r[0].value or '').strip(),
        'upc': str(r[1].value or '').strip(),
        'product_code': str(r[2].value or '').strip(),
        'brand': str(r[3].value or '').strip(),
        'name': str(r[4].value or '').strip(),
        'cat': str(r[5].value or '').strip(),
        'subcat': str(r[6].value or '').strip(),
        'type': str(r[7].value or '').strip(),
        'is_green': is_green
    })

print(f"Sheet1 total rows: {len(sheet1_rows)}, green rows: {sum(1 for x in sheet1_rows if x['is_green'])}")

for p in products[:15]:
    pid = str(p['id'])
    pname = p['name']
    pbrand = p['brand']
    
    candidates = []
    for r in sheet1_rows:
        if pid == r['item_code'] or pid in r['item_code'] or pid == r['upc'] or pid in r['upc'] or pid == r['product_code']:
            candidates.append(r)
        elif r['name'].lower() == pname.lower() or pname.lower().startswith(r['name'].lower()):
            candidates.append(r)
            
    print(f"Prod #{p['sno']} [{pbrand}] '{pname}' (id: {pid}) -> Candidates: {len(candidates)}")
    for c in candidates[:2]:
        print(f"    Row {c['row']}: [{c['brand']}] '{c['name']}' (is_green={c['is_green']}) item_code={c['item_code']} upc={c['upc']}")
