const fs = require('fs');

let c = fs.readFileSync('src/components/ProductCard.module.css', 'utf8');
c = c.replace(
  /font-family:\s*var\(--font-serif\);/,
  "font-family: var(--font-sans);\n  font-weight: 600;\n  letter-spacing: -0.01em;"
);
fs.writeFileSync('src/components/ProductCard.module.css', c);
console.log('ProductCard name font updated to clean sans-serif');
