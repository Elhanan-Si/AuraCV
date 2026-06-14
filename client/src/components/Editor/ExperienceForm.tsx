import React, { useState } from 'react';
import { WorkExperience, Education } from 'shared/types';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, Briefcase, GraduationCap } from 'lucide-react';
import { UI_TRANSLATIONS } from '../../utils/translations';
import { RichTextEditor } from './RichTextEditor';

interface ExperienceFormProps {
  type: 'work' | 'education';
  items: Array<any>;
  language: 'he' | 'en'; // Localization prop
  onAdd: (item: any) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  type,
  items,
  language,
  onAdd,
  onUpdate,
  onDelete,
  onMove
}) => {
  const t = UI_TRANSLATIONS[language || 'he'];
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const handleAddItem = () => {
    const newId = `${type}-${Date.now()}`;
    const newItem = type === 'work'
      ? {
          id: newId,
          jobTitle: '',
          employer: '',
          city: '',
          country: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        } as WorkExperience
      : {
          id: newId,
          degree: '',
          institution: '',
          city: '',
          country: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        } as Education;
    
    onAdd(newItem);
    setExpandedId(newId);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-xs bg-slate-50 focus:bg-white text-slate-800";
  const labelClass = "block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider text-start";

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const cardTitle = type === 'work' 
              ? (item.jobTitle || (language === 'he' ? 'תפקיד ללא כותרת' : 'Untitled Position'))
              : (item.degree || (language === 'he' ? 'תואר ללא כותרת' : 'Untitled Qualification'));
            const cardSubtitle = type === 'work'
              ? (item.employer || (language === 'he' ? 'לא צוין מעסיק' : 'No Company Specified'))
              : (item.institution || (language === 'he' ? 'לא צוין מוסד לימודים' : 'No Institution Specified'));

            return (
              <div 
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Accordion Item Header */}
                <div 
                  className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-100 cursor-pointer select-none"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center gap-3 w-[70%]">
                    {type === 'work' ? (
                      <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <GraduationCap className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                    )}
                    <div className="truncate text-left rtl:text-right">
                      <h4 className="text-xs font-bold text-slate-700 truncate">{cardTitle}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{cardSubtitle}</p>
                    </div>
                  </div>

                  {/* Actions & Chevron controls */}
                  <div className="flex items-center gap-1.5 onClick-stop-propagation" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMove(index, 'up')}
                      className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => onMove(index, 'down')}
                      className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Accordion Item Body */}
                <div 
                  className={`accordion-transition overflow-hidden ${
                    isExpanded ? 'max-h-[800px] border-t border-slate-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white text-slate-600">
                    {type === 'work' ? (
                      <>
                        <div>
                          <label className={labelClass}>{language === 'he' ? "כותרת תפקיד" : "Job Title"}</label>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Lead Developer"
                            value={item.jobTitle || ''}
                            onChange={(e) => onUpdate(item.id, 'jobTitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{language === 'he' ? "מעסיק / חברה" : "Employer / Company"}</label>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. TechVanguard"
                            value={item.employer || ''}
                            onChange={(e) => onUpdate(item.id, 'employer', e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className={labelClass}>{language === 'he' ? "תואר / תעודה" : "Degree / Qualification"}</label>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. B.S. in Software Engineering"
                            value={item.degree || ''}
                            onChange={(e) => onUpdate(item.id, 'degree', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{language === 'he' ? "מוסד לימודים" : "Institution / School"}</label>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Stanford University"
                            value={item.institution || ''}
                            onChange={(e) => onUpdate(item.id, 'institution', e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className={labelClass}>{language === 'he' ? "עיר / מחוז" : "City / State"}</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Austin, TX"
                        value={item.city || ''}
                        onChange={(e) => onUpdate(item.id, 'city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.country}</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. United States"
                        value={item.country || ''}
                        onChange={(e) => onUpdate(item.id, 'country', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>{t.startDate}</label>
                      <input
                        type="month"
                        className={inputClass}
                        value={item.startDate || ''}
                        onChange={(e) => onUpdate(item.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className={labelClass}>{t.endDate}</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            id={`current-${item.id}`}
                            className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3 cursor-pointer"
                            checked={item.current || false}
                            onChange={(e) => onUpdate(item.id, 'current', e.target.checked)}
                          />
                          <label htmlFor={`current-${item.id}`} className="text-[9px] font-bold text-slate-500 uppercase tracking-wide cursor-pointer select-none">
                            {t.current}
                          </label>
                        </div>
                      </div>
                      <input
                        type="month"
                        className={inputClass}
                        disabled={item.current || false}
                        value={item.current ? '' : (item.endDate || '')}
                        onChange={(e) => onUpdate(item.id, 'endDate', e.target.value)}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>{t.description}</label>
                      <RichTextEditor
                        rows={5}
                        placeholder={
                          type === 'work'
                            ? (language === 'he' ? "• הובלתי צוות מפתחים...\n• אופטימיזציה של מסדי נתונים..." : "• Led the frontend team...\n• Optimized response rates by 25%...")
                            : (language === 'he' ? "• התמחות במערכות מבוזרות...\n• סיום תואר בהצטיינות..." : "• Specialized in database design...\n• Graduated with top marks...")
                        }
                        value={item.description || ''}
                        onChange={(val) => onUpdate(item.id, 'description', val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs italic text-slate-400">
            {type === 'work' 
              ? (language === 'he' ? "אין ניסיון תעסוקתי רשום." : "No work experiences added yet.")
              : (language === 'he' ? "אין היסטוריית השכלה רשומה." : "No education details added yet.")
            }
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        {type === 'work' ? t.addWork : t.addEdu}
      </button>
    </div>
  );
};
export default ExperienceForm;
