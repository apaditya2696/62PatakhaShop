const fs = require('fs');

// 1. Update src/app/layout.tsx
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(
  /family=Cormorant\+Garamond[^"']*/g,
  'family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
);
fs.writeFileSync('src/app/layout.tsx', layout);

// 2. Update src/app/globals.css
let globals = fs.readFileSync('src/app/globals.css', 'utf8');
globals = globals.replace(
  /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant\+Garamond[^;]*;/g,
  "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');"
);
globals = globals.replace(
  /--font-serif:\s*'Cormorant Garamond'[^;]*;/g,
  "--font-serif: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
);
fs.writeFileSync('src/app/globals.css', globals);
console.log('Fonts updated successfully');
