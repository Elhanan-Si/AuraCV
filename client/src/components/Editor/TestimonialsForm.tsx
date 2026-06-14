import React from 'react';
import { Testimonial } from 'shared/types';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { UI_TRANSLATIONS } from '../../utils/translations';

interface TestimonialsFormProps {
  items: Testimonial[];
  language: 'he' | 'en';
  onAdd: (item: Testimonial) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export const TestimonialsForm: React.FC<TestimonialsFormProps> = ({
  items = [],
  language,
  onAdd,
  onUpdate,
  onDelete,
  onMove
}) => {
  const t = UI_TRANSLATIONS[language || 'he'];
  
  const handleAddTestimonial = () => {
    onAdd({
      id: `test-${Date.now()}`,
      name: '',
      title: '',
      phone: ''
    });
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-xs bg-slate-50 focus:bg-white text-slate-800 font-medium text-start";

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100"
            >
              {/* Testimonial Fields Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder={language === 'he' ? "שם הממליץ" : "Name"}
                  className={inputClass}
                  value={item.name}
                  onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder={language === 'he' ? "תפקיד / כותרת" : "Title / Affiliation"}
                  className={inputClass}
                  value={item.title}
                  onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder={language === 'he' ? "מספר טלפון" : "Phone Number"}
                  className={inputClass}
                  value={item.phone}
                  onChange={(e) => onUpdate(item.id, 'phone', e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMove(index, 'up')}
                  className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => onMove(index, 'down')}
                  className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs italic text-slate-400">
            {language === 'he' ? "אין ממליצים רשומים." : "No references added yet."}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddTestimonial}
        className="w-full py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        {t.addTestimonial}
      </button>
    </div>
  );
};

export default TestimonialsForm;
