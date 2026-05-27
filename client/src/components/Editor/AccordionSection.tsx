import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs hover:border-slate-200 transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-400">{icon}</span>
          <span>{title}</span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
        />
      </button>

      {/* Accordion Content Panel */}
      <div 
        className={`accordion-transition overflow-hidden ${
          isOpen ? 'max-h-[3000px] border-t border-slate-50 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 bg-white text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AccordionSection;
