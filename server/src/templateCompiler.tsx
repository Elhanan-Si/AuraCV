import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVData } from '../../shared/types';
import { TemplateWrapper } from '../../client/src/components/Templates/TemplateWrapper';

export const compileTemplate = (data: CVData, tailwindCSS: string): string => {
  // SSR render the React template layout
  const templateMarkup = renderToStaticMarkup(
    <TemplateWrapper data={data} />
  );

  const language = data.settings.language || 'he';
  const isRTL = language === 'he';

  // Determine Google Font link tags based on selected font family (Hebrew and English compatible)
  const fontFamilies: Record<string, string> = {
    'Rubik': 'Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400',
    'Assistant': 'Assistant:wght@300;400;500;600;700;800',
    'Heebo': 'Heebo:wght@300;400;500;600;700;800',
    'Inter': 'Inter:wght@300;400;500;600;700;800',
    'Montserrat': 'Montserrat:wght@300;400;500;600;700;800'
  };

  const selectedFont = fontFamilies[data.settings.fontFamily || 'Rubik'];

  // Return full semantic HTML string with styles, font links, and custom print directives
  // Injects lang="he" dir="rtl" conditionally (Step 5)
  return `
    <!DOCTYPE html>
    <html lang="${language}" dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${data.personalDetails.firstName || 'Resume'}_${data.personalDetails.lastName || 'CV'}</title>
        
        <!-- Google Fonts preloading -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=${selectedFont}&display=swap" rel="stylesheet">
        
        <!-- Embedded Compiled Tailwind Styles -->
        <style>
          ${tailwindCSS}
          
          /* Custom PDF Print settings */
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Granular PDF Page Break Rules (Constraint #4) */
          .pdf-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .pdf-allow-break {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }

          /* Ensure text is selectable (Constraint #2 / ATS) */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Absolute assurance for correct complex layout direction in Hebrew */
          html[dir="rtl"] body {
            text-align: right !important;
          }
          html[dir="ltr"] body {
            text-align: left !important;
          }
        </style>
      </head>
      <body>
        <main class="pdf-allow-break">
          ${templateMarkup}
        </main>
      </body>
    </html>
  `;
};
export default compileTemplate;
