import React from 'react';
import { UI_TRANSLATIONS } from '../../utils/translations';

interface SummaryFormProps {
  value: string;
  language: 'he' | 'en';
  onChange: (value: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ value, language, onChange }) => {
  const t = UI_TRANSLATIONS[language || 'he'];
  
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {t.summary}
      </label>
      <textarea
        rows={6}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-sm bg-slate-50 focus:bg-white text-slate-800 leading-relaxed resize-y font-normal"
        placeholder={t.summaryPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
export default SummaryForm;
