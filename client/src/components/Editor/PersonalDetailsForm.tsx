import React, { useRef } from 'react';
import { PersonalDetails, LinkItem } from 'shared/types';
import { Plus, Trash2, Upload, User, Globe } from 'lucide-react';
import { UI_TRANSLATIONS } from '../../utils/translations';

interface PersonalDetailsFormProps {
  data: PersonalDetails;
  language: 'he' | 'en'; // Localization prop (Step 3)
  onChange: (field: keyof PersonalDetails, value: any) => void;
  onAddLink: (link: LinkItem) => void;
  onUpdateLink: (id: string, field: keyof LinkItem, value: string) => void;
  onDeleteLink: (id: string) => void;
}

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  data,
  language,
  onChange,
  onAddLink,
  onUpdateLink,
  onDeleteLink
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = UI_TRANSLATIONS[language || 'he'];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert(language === 'he' ? "התמונה גדולה מדי. אנא בחר תמונה קטנה מ-1.5MB." : "Image is too large. Please select an image smaller than 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange('photo', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddLink = () => {
    onAddLink({
      id: `link-${Date.now()}`,
      label: language === 'he' ? 'קישור חדש' : 'LinkedIn',
      url: 'https://'
    });
  };

  const inputClass = "w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-sm bg-slate-50 focus:bg-white text-slate-800";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      
      {/* Photo Uploader Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
        <div className="relative w-20 h-20 bg-slate-100 border rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-slate-400 group">
          {data.photo ? (
            <img src={data.photo} alt="Profile Photo" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-slate-300" />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t.photoTitle}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              {t.uploadPhoto}
            </button>
            {data.photo && (
              <button
                type="button"
                onClick={() => onChange('photo', '')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.removePhoto}
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Main Grid Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t.firstName}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "ישראל" : "John"}
            value={data.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.lastName}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "ישראלי" : "Doe"}
            value={data.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.jobTitle}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "מתכנת פול סטאק" : "Senior Product Designer"}
            value={data.jobTitle || ''}
            onChange={(e) => onChange('jobTitle', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.email}</label>
          <input
            type="email"
            className={inputClass}
            placeholder="israel@example.com"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.phone}</label>
          <input
            type="tel"
            className={inputClass}
            placeholder="050-1234567"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.address}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "הרצל 12" : "123 Creative Studio Lane"}
            value={data.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.city}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "תל אביב" : "San Francisco"}
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.country}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "ישראל" : "United States"}
            value={data.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.postalCode}</label>
          <input
            type="text"
            className={inputClass}
            placeholder="6423904"
            value={data.postalCode || ''}
            onChange={(e) => onChange('postalCode', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.dateOfBirth}</label>
          <input
            type="date"
            className={inputClass}
            value={data.dateOfBirth || ''}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.nationality}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "ישראלי" : "American"}
            value={data.nationality || ''}
            onChange={(e) => onChange('nationality', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t.drivingLicense}</label>
          <input
            type="text"
            className={inputClass}
            placeholder={language === 'he' ? "דרגה B" : "Class C"}
            value={data.drivingLicense || ''}
            onChange={(e) => onChange('drivingLicense', e.target.value)}
          />
        </div>
      </div>

      {/* Social / Web Links Panel */}
      <div className="border-t border-slate-100 pt-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t.links}</h3>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.addLink}
          </button>
        </div>

        {data.links && data.links.length > 0 ? (
          <div className="space-y-3">
            {data.links.map((link) => (
              <div key={link.id} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <input
                  type="text"
                  placeholder="Label"
                  className="w-1/3 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:border-blue-400 outline-hidden font-medium"
                  value={link.label}
                  onChange={(e) => onUpdateLink(link.id, 'label', e.target.value)}
                />
                <input
                  type="url"
                  placeholder="URL"
                  className="w-2/3 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:border-blue-400 outline-hidden"
                  value={link.url}
                  onChange={(e) => onUpdateLink(link.id, 'url', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => onDeleteLink(link.id)}
                  className="p-1.5 rounded-md bg-white border border-slate-100 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400 text-center py-2 bg-slate-50 rounded-lg">
            {language === 'he' ? "אין קישורים נוספים." : "No links added yet."}
          </p>
        )}
      </div>

    </div>
  );
};
export default PersonalDetailsForm;
