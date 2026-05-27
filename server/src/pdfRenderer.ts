import puppeteer from 'puppeteer';

export const renderPDF = async (htmlContent: string): Promise<Buffer> => {
  // Launch Puppeteer headless browser instance
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--font-render-hinting=none'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport dimensions to Standard A4 
    await page.setViewport({
      width: 794, // 210mm at 96 DPI
      height: 1123, // 297mm at 96 DPI
      deviceScaleFactor: 1
    });

    // Feed HTML compiled string directly into Chrome
    // Constraint #3: Wait for 'networkidle0' to ensure complete downloads of external Google Fonts
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0' as any
    });

    // Compile vector-based, high fidelity PDF 
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};
export default renderPDF;
