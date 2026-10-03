const fs = require('fs');

let css = fs.readFileSync('src/components/HeroParallax.module.css', 'utf8');

// Replace the white/ivory blurry overlay with a crisp, minimal transparent edge fade
css = css.replace(
  /\.overlayBottom\s*\{[\s\S]*?z-index:\s*3;\s*\}/,
  `.overlayBottom {
  display: none;
}`
);

fs.writeFileSync('src/components/HeroParallax.module.css', css);
console.log('Removed white bottom blurriness from HeroParallax');
