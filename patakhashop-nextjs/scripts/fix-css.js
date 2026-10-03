const fs = require('fs');
let c = fs.readFileSync('src/app/globals.css', 'utf8');
const lines = c.split('\n');
for (let i = 0; i < 15; i++) {
  if (lines[i].includes('@import url')) {
    lines[i] = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');";
    break;
  }
}
fs.writeFileSync('src/app/globals.css', lines.join('\n'));
console.log('Successfully fixed line 7');
