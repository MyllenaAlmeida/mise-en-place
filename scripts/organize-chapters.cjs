const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, '../temp');
const outputDir = path.join(__dirname, '../src/chapters');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Chapter mapping from TOC
const chapters = [
  { file: 'Mise_En_Place_split_000.xhtml', title: 'Preface', output: '00-preface.html' },
  { file: 'Mise_En_Place_split_002.xhtml', title: 'Chapter 1: Raízes e Memórias', output: '01-chapter-1.html' },
  { file: 'Mise_En_Place_split_003.xhtml', title: 'Chapter 2: O fio da faca', output: '02-chapter-2.html' },
  { file: 'Mise_En_Place_split_004.xhtml', title: 'Chapter 3: Recomeço', output: '03-chapter-3.html' },
  { file: 'Mise_En_Place_split_005.xhtml', title: 'Chapter 4: Fogo Brando', output: '04-chapter-4.html' },
  { file: 'Mise_En_Place_split_006.xhtml', title: 'Chapter 5: Confraternizar', output: '05-chapter-5.html' },
  { file: 'Mise_En_Place_split_007.xhtml', title: 'Chapter 6: Fora do Menu', output: '06-chapter-6.html' },
  { file: 'Mise_En_Place_split_008.xhtml', title: 'Chapter 7: Bala Juquinha', output: '07-chapter-7.html' },
  { file: 'Mise_En_Place_split_009.xhtml', title: 'Chapter 8: Respiração Quadrada', output: '08-chapter-8.html' },
  { file: 'Mise_En_Place_split_010.xhtml', title: 'Chapter 9: Habeas Copos', output: '09-chapter-9.html' },
  { file: 'Mise_En_Place_split_011.xhtml', title: 'Chapter 10: After', output: '10-chapter-10.html' },
  { file: 'Mise_En_Place_split_012.xhtml', title: 'Chapter 11: Um Dia de Cada Vez', output: '11-chapter-11.html' },
  { file: 'Mise_En_Place_split_013.xhtml', title: 'Chapter 12: Pensamentos', output: '12-chapter-12.html' },
  { file: 'Mise_En_Place_split_014.xhtml', title: 'Afterword', output: '13-afterword.html' },
];

chapters.forEach(chapter => {
  const inputPath = path.join(tempDir, chapter.file);
  const outputPath = path.join(outputDir, chapter.output);
  
  if (fs.existsSync(inputPath)) {
    let content = fs.readFileSync(inputPath, 'utf-8');
    
    // Extract body content
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      content = bodyMatch[1];
    }
    
    // Clean up HTML - remove Calibre-specific elements
    content = content.replace(/<meta[^>]*>/gi, '');
    content = content.replace(/<link[^>]*>/gi, '');
    
    // Create clean HTML with proper structure
    const cleanHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chapter.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Cormorant Garamond', Georgia, serif;
      line-height: 1.8;
      max-width: 800px;
      margin: 0 auto;
      padding: 60px 40px;
      color: #2c2c2c;
      background: transparent;
    }
    
    h1, h2, h3 {
      font-family: 'Playfair Display', Georgia, serif;
      color: #8c2727;
      font-weight: 600;
      margin-top: 2em;
      margin-bottom: 1em;
    }
    
    p {
      margin-bottom: 1.5em;
      text-align: justify;
      text-indent: 2em;
      line-height: 1.8;
    }
    
    p:first-of-type {
      text-indent: 0;
    }
    
    .chapter-title {
      text-align: center;
      font-size: 2.5em;
      margin-bottom: 2.5em;
      padding-bottom: 1.5em;
      border-bottom: 3px solid #de4f4f;
      font-family: 'Playfair Display', Georgia, serif;
      color: #8c2727;
      font-weight: 600;
    }
    
    .calibre7, .userstuff1, .userstuff2, .calibre1 {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    
    .heading {
      font-family: 'Playfair Display', Georgia, serif;
      color: #8c2727;
      font-size: 2em;
      text-align: center;
      margin: 2em 0;
    }
  </style>
</head>
<body>
  <h1 class="chapter-title">${chapter.title}</h1>
  ${content}
</body>
</html>`;
    
    fs.writeFileSync(outputPath, cleanHtml, 'utf-8');
    console.log(`✓ Processed: ${chapter.title} -> ${chapter.output}`);
  } else {
    console.log(`✗ Not found: ${chapter.file}`);
  }
});

console.log('\n✅ All chapters extracted and organized!');
