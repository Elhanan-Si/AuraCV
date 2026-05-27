import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { CVData } from '../../shared/types';
import { compileTemplate } from './templateCompiler';
import { renderPDF } from './pdfRenderer';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS and high limits for Base64 image strings (Constraint #1)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to fetch or read Tailwind production/development CSS dynamically (Constraint #2)
const getTailwindCSS = async (): Promise<string> => {
  // Path 1: Seek compiled production asset in client/dist/assets
  try {
    const distAssetsPath = path.resolve(__dirname, '../../client/dist/assets');
    if (fs.existsSync(distAssetsPath)) {
      const files = fs.readdirSync(distAssetsPath);
      const cssFile = files.find(f => f.endsWith('.css'));
      if (cssFile) {
        console.log(`[CSS] Loading production stylesheet: ${cssFile}`);
        return fs.readFileSync(path.join(distAssetsPath, cssFile), 'utf-8');
      }
    }
  } catch (err) {
    console.warn('[CSS] Production build CSS directory search bypassed or empty.');
  }

  // Path 2: Fetch dynamically from Vite local dev server
  try {
    console.log('[CSS] Attempting connection to local Vite dev server...');
    const response = await fetch('http://localhost:5173/src/index.css');
    if (response.ok) {
      const css = await response.text();
      console.log('[CSS] Loaded live CSS from Vite dev server.');
      return css;
    }
  } catch (err) {
    console.warn('[CSS] Vite dev server CSS unavailable. Local server may be offline.');
  }

  // Path 3: Offline cached basic reset stylesheet fallback
  try {
    const fallbackPath = path.resolve(__dirname, '../cached-index.css');
    if (fs.existsSync(fallbackPath)) {
      console.log('[CSS] Loaded local fallback cached-index.css.');
      return fs.readFileSync(fallbackPath, 'utf-8');
    }
  } catch (_) {}

  // Ultimate fallback
  console.log('[CSS] Falling back to default Tailwind v4 imports.');
  return '@import "tailwindcss";';
};

// API POST Route for vector PDF compilation
app.post('/api/generate-pdf', async (req, res) => {
  const cvData: CVData = req.body;

  if (!cvData || !cvData.personalDetails) {
    res.status(400).json({ error: 'Invalid resume payload. Please provide full CVData state.' });
    return;
  }

  console.log(`[API] Processing PDF request for ${cvData.personalDetails.firstName || 'User'} (${cvData.settings.templateId})`);

  try {
    // 1. Fetch Tailwind CSS
    const tailwindCSS = await getTailwindCSS();

    // 2. SSR Compile React templates to HTML
    const compiledHTML = compileTemplate(cvData, tailwindCSS);

    // 3. Render vector-based PDF via Puppeteer
    const pdfBuffer = await renderPDF(compiledHTML);

    // 4. Stream PDF back as direct attachment
    const rawFileName = `${cvData.personalDetails.firstName || 'resume'}_cv.pdf`;
    const safeFileName = encodeURIComponent(rawFileName);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
    
    console.log('[API] PDF compiled and transmitted successfully.');
  } catch (error: any) {
    console.error('[API] Critical failure compiling PDF:', error);
    res.status(500).json({ 
      error: 'Failed to compile resume into a downloadable PDF.', 
      details: error.message 
    });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  AURACV PDF SERVICE RUNNING ON PORT ${PORT} `);
  console.log(`  Target proxy URL: http://localhost:${PORT}        `);
  console.log(`==================================================`);
});
