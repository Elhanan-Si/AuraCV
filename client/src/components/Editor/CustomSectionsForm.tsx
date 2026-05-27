import React, { useState } from 'react';
import { CustomSection, CustomSectionItem } from 'shared/types';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, Award, HelpCircle } from 'lucide-react';
import { UI_TRANSLATIONS } from '../../utils/translations';

interface CustomSectionsFormProps {
  sections: CustomSection[];
  language: 'he' | 'en';
  onAddSection: (section: CustomSection) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddItem: (sectionId: string, item: CustomSectionItem) => void;
  onUpdateItem: (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: any) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onMoveItem: (sectionId: string, index: number, direction: 'up' | 'down') => void;
}

export const CustomSectionsForm: React.FC<CustomSectionsFormProps> = ({
  sections,
  language,
  onAddSection,
  onUpdateSectionTitle,
  onDeleteSection,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem
}) => {
  const t = UI_TRANSLATIONS[language || 'he'];
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(sections[0]?.id || null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const handleAddSection = () => {
    const newSecId = `customsec-${Date.now()}`;
    const newSection: CustomSection = {
      id: newSecId,
      title: language === 'he' ? 'סעיף חדש' : 'New Custom Section',
      items: []
    };
    onAddSection(newSection);
    setExpandedSectionId(newSecId);
  };

  const handleAddItem = (sectionId: string) => {
    const newItemId = `citem-${Date.now()}`;
    const newItem: CustomSectionItem = {
      id: newItemId,
      title: '',
      subtitle: '',
      date: '',
      description: ''
    };
    onAddItem(sectionId, newItem);
    setExpandedItemId(newItemId);
  };

  const toggleSection = (id: string) => {
    setExpandedSectionId(expandedSectionId === id ? null : id);
  };

  const toggleItem = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-xs bg-slate-50 focus:bg-white text-slate-800";
  const labelClass = "block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider text-start";

  return (
    <div className="space-y-5">
      
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section) => {
            const isSectionExpanded = expandedSectionId === section.id;
            
            return (
              <div 
                key={section.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
              >
                {/* Custom Section Header */}
                <div 
                  className="flex items-center justify-between p-3.5 bg-slate-100/70 border-b border-slate-200 cursor-pointer select-none"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2.5 w-[65%]">
                    <Award className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <input
                      type="text"
                      className="font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-400 focus:bg-white px-1.5 py-0.5 rounded text-xs outline-hidden w-full text-start"
                      value={section.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateSectionTitle(section.id, e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onDeleteSection(section.id)}
                      className="p-1 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Delete entire section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <ChevronDown className={`w-4.5 h-4.5 transition-transform ${isSectionExpanded ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Custom Section Body */}
                <div 
                  className={`accordion-transition overflow-hidden ${
                    isSectionExpanded ? 'max-h-[1500px] border-t border-slate-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 bg-slate-50/30 space-y-4">
                    
                    {/* Section Items */}
                    {section.items && section.items.length > 0 ? (
                      <div className="space-y-3">
                        {section.items.map((item, index) => {
                          const isItemExpanded = expandedItemId === item.id;
                          const itemTitle = item.title || (language === 'he' ? 'פריט ללא כותרת' : 'Untitled Item');
                          
                          return (
                            <div 
                              key={item.id}
                              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs"
                            >
                              {/* Item Header */}
                              <div 
                                className="flex items-center justify-between p-2.5 bg-slate-50 cursor-pointer select-none"
                                onClick={() => toggleItem(item.id)}
                              >
                                <div className="truncate text-left rtl:text-right pl-1.5 pr-1.5 w-[65%]">
                                  <h5 className="text-[11px] font-bold text-slate-600 truncate">{itemTitle}</h5>
                                  {item.subtitle && <p className="text-[9px] text-slate-400 truncate">{item.subtitle}</p>}
                                </div>

                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => onMoveItem(section.id, index, 'up')}
                                    className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={index === section.items.length - 1}
                                    onClick={() => onMoveItem(section.id, index, 'down')}
                                    className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteItem(section.id, item.id)}
                                    className="p-1 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <div className="w-px h-4 bg-slate-200 mx-0.5" />
                                  <button
                                    type="button"
                                    onClick={() => toggleItem(item.id)}
                                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isItemExpanded ? 'rotate-180 text-blue-500' : ''}`} />
                                  </button>
                                </div>
                              </div>

                              {/* Item Details Form */}
                              <div 
                                className={`accordion-transition overflow-hidden ${
                                  isItemExpanded ? 'max-h-[500px] border-t border-slate-100' : 'max-h-0'
                                }`}
                              >
                                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                                  <div>
                                    <label className={labelClass}>{language === 'he' ? "כותרת" : "Item Title"}</label>
                                    <input
                                      type="text"
                                      placeholder={language === 'he' ? "לדוגמה: הסמכה מקצועית" : "e.g. AWS Certification"}
                                      className={inputClass}
                                      value={item.title}
                                      onChange={(e) => onUpdateItem(section.id, item.id, 'title', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelClass}>{language === 'he' ? "תת-כותרת / מארגן" : "Subtitle / Organizer"}</label>
                                    <input
                                      type="text"
                                      placeholder={language === 'he' ? "לדוגמה: משרד העבודה" : "e.g. Amazon Web Services"}
                                      className={inputClass}
                                      value={item.subtitle || ''}
                                      onChange={(e) => onUpdateItem(section.id, item.id, 'subtitle', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelClass}>{language === 'he' ? "תאריך / תקופה" : "Date / Period"}</label>
                                    <input
                                      type="text"
                                      placeholder={language === 'he' ? "לדוגמה: 2023" : "e.g. 2023 or Jan 2023"}
                                      className={inputClass}
                                      value={item.date || ''}
                                      onChange={(e) => onUpdateItem(section.id, item.id, 'date', e.target.value)}
                                    />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className={labelClass}>{language === 'he' ? "תיאור" : "Description"}</label>
                                    <textarea
                                      rows={3}
                                      placeholder={language === 'he' ? "פרטים והסברים נוספים..." : "Provide an overview, credentials ID, or key details..."}
                                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-xs bg-slate-50 focus:bg-white text-slate-800 resize-y leading-relaxed font-normal text-start"
                                      value={item.description || ''}
                                      onChange={(e) => onUpdateItem(section.id, item.id, 'description', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-5 bg-white rounded-lg border border-dashed border-slate-200">
                        <p className="text-[11px] italic text-slate-400">
                          {language === 'he' ? "אין פריטים רשומים בסעיף זה." : "No items added to this section yet."}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAddItem(section.id)}
                      className="w-full py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-xs font-semibold flex items-center justify-center gap-1 shadow-3xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {language === 'he' ? "הוסף פריט" : "Add Item"}
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs italic text-slate-400">
            {language === 'he' ? "צור סעיפים חדשים כגון 'הסמכות', 'פרויקטים' או 'תחביבים' כדי להתאים אישית את המבנה." : "Create custom sections like 'Certifications', 'Projects', or 'Interests' to customize your resume layout."}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddSection}
        className="w-full py-2.5 bg-blue-50 border border-blue-100 hover:border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        {t.createCustom}
      </button>

    </div>
  );
};
export default CustomSectionsForm;
