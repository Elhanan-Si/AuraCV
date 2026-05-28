import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Google Fonts URL with Hebrew & Latin supports for 400 (Regular) and 700 (Bold) weights
const FONTS_URL = 'https://fonts.googleapis.com/css2?' + 
  'family=Rubik:wght@400;700' +
  '&family=Assistant:wght@400;700' +
  '&family=Heebo:wght@400;700' +
  '&family=Inter:wght@400;700' +
  '&family=Montserrat:wght@400;700' +
  '&display=swap';

// Set standard modern Chrome User-Agent to force WOFF2 response formats
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const OUTPUT_PATH = path.resolve(__dirname, '../src/fonts.css');

// Helper to make HTTPS requests returning a buffer
function fetchURL(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Server returned code ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', err => reject(err));
    }).on('error', err => reject(err));
  });
}

function writeSystemFallbacks() {
  const fallbackCSS = `
/* ===================================================================
   AURACV SYSTEM OFFLINE FONTS FALLBACK
   Since the build server was compiled in an offline sandboxed state,
   we map Google Font tokens to premium Windows system fonts natively.
   This guarantees visual excellence and type safety offline.
   =================================================================== */

@font-face {
  font-family: 'Rubik';
  font-weight: 400;
  src: local('Segoe UI'), local('Arial'), sans-serif;
}
@font-face {
  font-family: 'Rubik';
  font-weight: 700;
  src: local('Segoe UI Semibold'), local('Segoe UI'), local('Arial Bold'), local('Arial'), sans-serif;
}

@font-face {
  font-family: 'Assistant';
  font-weight: 400;
  src: local('Segoe UI Light'), local('Segoe UI'), local('Calibri'), local('Arial'), sans-serif;
}
@font-face {
  font-family: 'Assistant';
  font-weight: 700;
  src: local('Segoe UI Semibold'), local('Segoe UI'), local('Arial Bold'), local('Arial'), sans-serif;
}

@font-face {
  font-family: 'Heebo';
  font-weight: 400;
  src: local('Segoe UI'), local('Arial'), sans-serif;
}
@font-face {
  font-family: 'Heebo';
  font-weight: 700;
  src: local('Segoe UI Semibold'), local('Segoe UI'), local('Arial Bold'), local('Arial'), sans-serif;
}

@font-face {
  font-family: 'Inter';
  font-weight: 400;
  src: local('Segoe UI'), local('Arial'), sans-serif;
}
@font-face {
  font-family: 'Inter';
  font-weight: 700;
  src: local('Segoe UI Semibold'), local('Segoe UI'), local('Arial Bold'), local('Arial'), sans-serif;
}

@font-face {
  font-family: 'Montserrat';
  font-weight: 400;
  src: local('Segoe UI'), local('Arial'), sans-serif;
}
@font-face {
  font-family: 'Montserrat';
  font-weight: 700;
  src: local('Segoe UI Semibold'), local('Segoe UI'), local('Arial Bold'), local('Arial'), sans-serif;
}
`;
  
  const srcDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, fallbackCSS);
  console.log('Successfully generated system-local font fallbacks in client/src/fonts.css');
}

async function run() {
  console.log('==================================================');
  console.log('AURACV FONT BUNDLER: Fetching Google Fonts CSS...');
  console.log(`URL: ${FONTS_URL}`);
  console.log('==================================================');

  try {
    // 1. Fetch stylesheet from Google Fonts
    const cssBuffer = await fetchURL(FONTS_URL, { 'User-Agent': USER_AGENT });
    let cssText = cssBuffer.toString('utf-8');
    
    // 2. Locate all remote WOFF2 urls in CSS
    const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
    const urls = [];
    let match;
    
    while ((match = urlRegex.exec(cssText)) !== null) {
      urls.push(match[1]);
    }
    
    // De-duplicate URLs
    const uniqueUrls = Array.from(new Set(urls));
    console.log(`Found ${uniqueUrls.length} unique font asset URLs to download and encode...`);

    // Create src directory if not exist
    const srcDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

    // 3. Download each binary asset and substitute with Base64 WOFF2 URL
    let downloadedCount = 0;
    for (const fontUrl of uniqueUrls) {
      downloadedCount++;
      console.log(`[${downloadedCount}/${uniqueUrls.length}] Downloading: ${path.basename(fontUrl)}`);
      
      try {
        const fontBuffer = await fetchURL(fontUrl);
        const base64Font = fontBuffer.toString('base64');
        
        // Globally replace the font url in CSS
        cssText = cssText.split(fontUrl).join(`data:font/woff2;base64,${base64Font}`);
      } catch (err) {
        console.error(`Failed to download font style from: ${fontUrl}`, err);
        throw err;
      }
    }

    // 4. Save self-contained stylesheet fonts.css
    fs.writeFileSync(OUTPUT_PATH, cssText);
    
    console.log('\n==================================================');
    console.log('SUCCESS: Self-contained fonts.css generated!');
    console.log(`Destination: ${OUTPUT_PATH}`);
    console.log(`Size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(2)} KB`);
    console.log('==================================================');
  } catch (error) {
    console.warn('\n--------------------------------------------------');
    console.warn('WARNING: Build environment is offline or dns blocked.');
    console.warn('Reason:', error.message);
    console.warn('Writing visual fallback system fonts definitions (Segoe UI, Calibri, Arial)...');
    console.warn('--------------------------------------------------\n');
    
    // Write system local fallbacks
    writeSystemFallbacks();
  }
}

run();
