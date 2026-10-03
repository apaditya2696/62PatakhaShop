const fs = require('fs');

// 1. In Navbar.tsx: change '62 PATAKHA SHOP' text to 'PATAKHA SHOP'
let navTsx = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navTsx = navTsx.replace(
  '<span className={styles.brandTitle}>62 PATAKHA SHOP</span>',
  '<span className={styles.brandTitle}>PATAKHA SHOP</span>'
);
fs.writeFileSync('src/components/Navbar.tsx', navTsx);

// 2. In Navbar.module.css: refine brand styling and mobile responsiveness
let navCss = fs.readFileSync('src/components/Navbar.module.css', 'utf8');
navCss = navCss.replace(
  /\.brandTitle\s*\{[\s\S]*?\}/,
  `.brandTitle {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-primary);
  line-height: 1.15;
  white-space: nowrap;
}`
);

navCss = navCss.replace(
  /\.brandSubtitle\s*\{[\s\S]*?\}/,
  `.brandSubtitle {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-dark);
  font-weight: 600;
  white-space: nowrap;
}`
);

fs.writeFileSync('src/components/Navbar.module.css', navCss);
console.log('Removed text 62 from brand title and adjusted alignment');
