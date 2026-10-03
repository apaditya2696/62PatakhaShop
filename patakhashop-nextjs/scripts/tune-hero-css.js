const fs = require('fs');

let css = fs.readFileSync('src/components/HeroParallax.module.css', 'utf8');

// Ensure slideLayer has proper z-index and slideActive is on top
css = css.replace(
  /\.slideLayer\s*\{[\s\S]*?pointer-events:\s*none;\s*\}/,
  `.slideLayer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}`
);

css = css.replace(
  /\.slideActive\s*\{[\s\S]*?\}/,
  `.slideActive {
  opacity: 1 !important;
  z-index: 2 !important;
}`
);

// Reduce overlay darkness so the actual shop photos pop vibrant and clean
css = css.replace(
  /\.overlayDim\s*\{[\s\S]*?z-index:\s*2;\s*\}/,
  `.overlayDim {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(18, 16, 14, 0.78) 0%, rgba(18, 16, 14, 0.5) 55%, rgba(18, 16, 14, 0.3) 100%);
  z-index: 3;
}`
);

css = css.replace(
  /\.overlayTop\s*\{[\s\S]*?z-index:\s*2;\s*\}/,
  `.overlayTop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(180deg, rgba(18, 16, 14, 0.75) 0%, transparent 100%);
  z-index: 3;
}`
);

css = css.replace(
  /\.overlayBottom\s*\{[\s\S]*?z-index:\s*2;\s*\}/,
  `.overlayBottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 220px;
  background: linear-gradient(0deg, var(--bg-primary) 0%, rgba(251, 248, 242, 0.82) 40%, transparent 100%);
  z-index: 3;
}`
);

fs.writeFileSync('src/components/HeroParallax.module.css', css);
console.log('HeroParallax CSS tuned for clarity and layering');
