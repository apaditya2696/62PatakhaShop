import pymupdf
import os
import sys
import io
import json
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'c:\phatka shop\Fireworks Product Catalogue.pdf'
doc = pymupdf.open(pdf_path)
output_dir = r'c:\phatka shop\patakhashop-nextjs\public\products'
os.makedirs(output_dir, exist_ok=True)

print(f'Opened PDF with {len(doc)} pages.')

# We will parse all product cards from the PDF
pdf_items = []
hd_image_map = {} # key: (clean_brand, clean_name), val: image_url

extracted_img_count = 0

for page_idx in range(1, len(doc)): # Pages 2 to 90
    page = doc[page_idx]
    image_list = page.get_images()
    blocks = page.get_text('blocks')
    
    # Filter out header/footer blocks
    valid_blocks = []
    for b in blocks:
        txt = b[4].strip()
        if txt and 'Fireworks Product Catalogue' not in txt and 'file:///' not in txt:
            valid_blocks.append(b)
            
    # Group text blocks into 3x3 grid cells
    cells = {}
    for r in range(3):
        for c in range(3):
            cells[(r, c)] = []
            
    for b in valid_blocks:
        cx = (b[0] + b[2]) / 2.0
        cy = (b[1] + b[3]) / 2.0
        c = 0 if cx < 205 else (1 if cx < 390 else 2)
        r = 0 if cy < 270 else (1 if cy < 520 else 2)
        cells[(r, c)].append(b[4].strip())
        
    # Map images on page to cells based on page layout
    # PyMuPDF image_list is sorted by page position
    # Let's match each cell with text to an image if available
    img_idx = 0
    for r in range(3):
        for c in range(3):
            texts = cells[(r, c)]
            if not texts:
                continue
                
            clean_text = ' '.join(texts)
            lines = [l.strip() for txt in texts for l in txt.split('\n') if l.strip()]
            
            if not lines:
                continue
                
            # First line might be category header if header block was included
            i = 0
            if lines[0].startswith('Category') or lines[0].startswith('Fancy') or 'Products' in lines[0] or lines[0].isupper() and len(lines[0]) > 20:
                i += 1
                
            brand = lines[i] if i < len(lines) else ''
            name = lines[i+1] if i+1 < len(lines) else ''
            desc = ' '.join(lines[i+2:]) if i+2 < len(lines) else ''
            
            img_url = None
            if img_idx < len(image_list):
                xref = image_list[img_idx][0]
                try:
                    base_img = doc.extract_image(xref)
                    img_bytes = base_img['image']
                    pil_img = Image.open(io.BytesIO(img_bytes))
                    
                    # Verify resolution is 400x400 HD
                    if pil_img.width >= 250 and pil_img.height >= 250 and 'PHOTO COMING SOON' not in clean_text.upper():
                        fname = f'hd_p{page_idx+1}_r{r}_c{c}.jpg'
                        fpath = os.path.join(output_dir, fname)
                        
                        if pil_img.mode in ('RGBA', 'P'):
                            pil_img = pil_img.convert('RGB')
                            
                        # Save with high quality 95% JPEG compression
                        pil_img.save(fpath, 'JPEG', quality=95)
                        img_url = f'/products/{fname}'
                        extracted_img_count += 1
                except Exception as e:
                    pass
                img_idx += 1
                
            pdf_items.append({
                'brand': brand,
                'name': name,
                'desc': desc,
                'image': img_url,
                'raw_text': clean_text
            })

print(f'Extracted {len(pdf_items)} product items from PDF.')
print(f'Saved {extracted_img_count} crisp 400x400 HD product images.')

# Let's inspect sample items
for item in pdf_items[:5]:
    print(f"Brand: {item['brand']} | Name: {item['name']} | Image: {item['image']}")
