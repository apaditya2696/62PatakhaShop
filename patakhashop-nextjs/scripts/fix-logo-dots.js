const fs = require('fs');

// 1. Fix globals.css button min-height rule that distorted dots and icon buttons
let globals = fs.readFileSync('src/app/globals.css', 'utf8');
globals = globals.replace(
  /button,\s*a\s*\{\s*min-height:\s*44px;\s*display:\s*inline-flex;\s*align-items:\s*center;\s*\}/,
  '/* Touch target exclusion for micro-buttons and dots */\n  .btn-aurora-primary, .btn-aurora-secondary, .btn-aurora-gold {\n    min-height: 44px;\n  }'
);
fs.writeFileSync('src/app/globals.css', globals);

// 2. Fix Navbar.module.css logo aspect ratio & perfectly round circle
let nav = fs.readFileSync('src/components/Navbar.module.css', 'utf8');
nav = nav.replace(
  /\.brandLogoWrap\s*\{[\s\S]*?box-shadow:[^\}]*?\}/,
  `.brandLogoWrap {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  aspect-ratio: 1 / 1;
  border-radius: 50% !important;
  overflow: hidden;
  border: 1.5px solid var(--gold-border);
  box-shadow: 0 2px 10px rgba(201, 158, 82, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}`
);

nav = nav.replace(
  /\.brandLogo\s*\{[\s\S]*?\}/,
  `.brandLogo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 50%;
}`
);
fs.writeFileSync('src/components/Navbar.module.css', nav);

// 3. Fix HeroParallax.module.css dot styling
let hero = fs.readFileSync('src/components/HeroParallax.module.css', 'utf8');
hero = hero.replace(
  /\.dot\s*\{[\s\S]*?\}/,
  `.dot {
  width: 8px !important;
  height: 8px !important;
  min-height: 8px !important;
  max-height: 8px !important;
  border-radius: 4px !important;
  background: rgba(255, 255, 255, 0.4) !important;
  border: none !important;
  cursor: pointer;
  padding: 0 !important;
  margin: 0 !important;
  transition: all 0.3s ease !important;
  display: inline-block !important;
  flex-shrink: 0;
}`
);

hero = hero.replace(
  /\.dotActive\s*\{[\s\S]*?\}/,
  `.dotActive {
  width: 24px !important;
  height: 8px !important;
  background: var(--gold-light) !important;
  box-shadow: 0 0 10px rgba(223, 196, 136, 0.8) !important;
}`
);
fs.writeFileSync('src/components/HeroParallax.module.css', hero);

console.log('Successfully fixed logo circle and slideshow dots');
