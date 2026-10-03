const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
c = c.replace(
  'className={styles.brandLogo}',
  "className={styles.brandLogo} style={{ width: 'auto', height: 'auto' }}"
);
fs.writeFileSync('src/components/Navbar.tsx', c);
console.log('Fixed Next.js image aspect ratio warning');
