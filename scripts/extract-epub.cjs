const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const epubPath = '/home/mrma/Downloads/Mise_En_Place.epub';
const outputDir = path.join(__dirname, '../src/chapters');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  const zip = new AdmZip(epubPath);
  const zipEntries = zip.getEntries();
  
  console.log('Extracting EPUB contents...');
  
  // Extract all files to a temp directory
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  zip.extractAllTo(tempDir, true);
  
  console.log('Files extracted to temp directory');
  console.log('Looking for content files...');
  
  // List all extracted files
  function listFiles(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        console.log(`${prefix}${file}/`);
        listFiles(filePath, prefix + '  ');
      } else {
        console.log(`${prefix}${file}`);
      }
    });
  }
  
  listFiles(tempDir);
  
} catch (error) {
  console.error('Error extracting EPUB:', error);
}
