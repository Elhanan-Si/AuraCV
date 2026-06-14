import React, { useRef, useEffect, useState } from 'react';
import { CVData } from 'shared/types';
import { TemplateWrapper } from '../Templates/TemplateWrapper';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface PreviewFrameProps {
  data: CVData;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ data }) => {
  const [zoom, setZoom] = useState<number>(0.75);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Auto-scale to fit container width initially
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && pageRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // padding spacing
        const pageWidth = pageRef.current.clientWidth;
        if (containerWidth > 0 && pageWidth > 0) {
          const fitScale = containerWidth / pageWidth;
          setZoom(Math.max(0.4, Math.min(2.0, parseFloat(fitScale.toFixed(2)))));
        }
      }
    };

    // Small delay to ensure render is completed
    const timer = setTimeout(handleResize, 150);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(2.5, parseFloat((prev + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoom(prev => Math.max(0.4, parseFloat((prev - 0.1).toFixed(1))));
  const handleZoomReset = () => {
    if (containerRef.current && pageRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const pageWidth = pageRef.current.clientWidth;
      const fitScale = containerWidth / pageWidth;
      setZoom(Math.max(0.4, Math.min(2.0, parseFloat(fitScale.toFixed(2)))));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-200 select-none">
      
      {/* Dynamic Mini Tool Overlay Panel */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-300/40 border-b border-slate-300/60 backdrop-blur-md">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Live Document Simulator (A4)</span>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-lg border border-slate-300/40 shadow-3xs">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-slate-600 px-2 min-w-[45px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-slate-300 mx-1" />
          <button
            onClick={handleZoomReset}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Fit Width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Workspace Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex justify-center items-start scroll-smooth"
      >
        {/* Aspect locked A4 Page Box */}
        <div 
          ref={pageRef}
          className="bg-white a4-preview-shadow w-[210mm] min-h-[297mm] transition-transform duration-200 ease-out origin-top flex-shrink-0 relative"
          style={{ 
            transform: `scale(${zoom})`,
            marginBottom: `calc((297mm * (${zoom} - 1)) + 24px)` // Offset bottom whitespace margins
          }}
        >
          <TemplateWrapper data={data} />
          
          {/* Visual page break indicator lines for real-time editor awareness */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <div className="absolute top-[297mm] left-0 right-0 border-t-2 border-dashed border-red-400/80 z-20 flex items-center justify-center">
              <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm mt-[-8px]">
                {data.settings.language === 'he' ? 'גבול עמוד 1 / עמוד 2' : 'Page 1 / Page 2 Break'}
              </span>
            </div>
            <div className="absolute top-[594mm] left-0 right-0 border-t-2 border-dashed border-red-400/80 z-20 flex items-center justify-center">
              <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm mt-[-8px]">
                {data.settings.language === 'he' ? 'גבול עמוד 2 / עמוד 3' : 'Page 2 / Page 3 Break'}
              </span>
            </div>
            <div className="absolute top-[891mm] left-0 right-0 border-t-2 border-dashed border-red-400/80 z-20 flex items-center justify-center">
              <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm mt-[-8px]">
                {data.settings.language === 'he' ? 'גבול עמוד 3 / עמוד 4' : 'Page 3 / Page 4 Break'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default PreviewFrame;
