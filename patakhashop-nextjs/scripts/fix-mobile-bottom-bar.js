const fs = require('fs');

// In MobileBottomBar.module.css:
// Make background fully opaque (#FFFFFF), with crisp drop shadow so products behind do not bleed through
let css = fs.readFileSync('src/components/MobileBottomBar.module.css', 'utf8');
css = css.replace(
  /background:\s*rgba\(251,\s*248,\s*242,\s*0\.94\);[\s\S]*?box-shadow:[^\;]*?;/,
  `background: #FFFFFF;
    border-radius: var(--radius-pill);
    border: 1px solid rgba(201, 158, 82, 0.45);
    box-shadow: 0 12px 35px rgba(28, 26, 23, 0.22), 0 2px 10px rgba(201, 158, 82, 0.2);`
);
fs.writeFileSync('src/components/MobileBottomBar.module.css', css);

// In globals.css:
// Increase mobile body padding-bottom from 76px to 110px so content scrolls safely clear of the bottom bar
let globals = fs.readFileSync('src/app/globals.css', 'utf8');
globals = globals.replace(
  /padding-bottom:\s*calc\(76px\s*\+\s*env\(safe-area-inset-bottom,\s*0px\)\);/,
  'padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px));'
);
fs.writeFileSync('src/app/globals.css', globals);

console.log('Mobile bottom bar made fully opaque and body bottom clearance increased');
