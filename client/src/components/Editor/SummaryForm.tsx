import React from 'react';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { RichTextEditor } from './RichTextEditor';

interface SummaryFormProps {
  value: string;
  language: 'he' | 'en';
  onChange: (value: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ value, language, onChange }) => {
  const t = UI_TRANSLATIONS[language || 'he'];
  
  return (
    <div className="space-y-2 text-start">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {t.summary}
      </label>
      <RichTextEditor
        rows={6}
        placeholder={t.summaryPlaceholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
export default SummaryForm;
