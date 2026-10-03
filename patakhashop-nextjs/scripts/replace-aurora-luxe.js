const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (/\.(tsx?|jsx?|css|json|md|html)$/.test(file)) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);
let totalReplacements = 0;
let filesModified = 0;

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Exact uppercase replacements first
  content = content.replace(/AURORA\s+LUXE/g, '62 PATAKHA SHOP');
  // Title / standard casing replacements
  content = content.replace(/Aurora\s+Luxe/g, '62 Patakha Shop');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    console.log(`Modified: ${path.relative(srcDir, filePath)}`);
  }
});

console.log(`\nDone! Modified ${filesModified} files.`);
