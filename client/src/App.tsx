import React, { useState } from 'react';
import { useCVState } from './hooks/useCVState';
import { AccordionSection } from './components/Editor/AccordionSection';
import { PersonalDetailsForm } from './components/Editor/PersonalDetailsForm';
import { SummaryForm } from './components/Editor/SummaryForm';
import { ExperienceForm } from './components/Editor/ExperienceForm';
import { SkillsForm } from './components/Editor/SkillsForm';
import { LanguagesForm } from './components/Editor/LanguagesForm';
import { CustomSectionsForm } from './components/Editor/CustomSectionsForm';
import { PreviewFrame } from './components/Preview/PreviewFrame';
import { TemplateWrapper } from './components/Templates/TemplateWrapper';
import { COLOR_PALETTES } from './utils/sampleData';
import { UI_TRANSLATIONS } from './utils/translations';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  PlusCircle, 
  Sparkles,
  Download, 
  Upload,
  RefreshCw, 
  Trash2,
  Sliders,
  Type,
  Palette,
  Eye,
  Globe
} from 'lucide-react';

export const App: React.FC = () => {
  const {
    cvData,
    setCvData,
    updatePersonalDetails,
    updateSummary,
    updateSettings,
    addListItem,
    updateListItem,
    deleteListItem,
    moveListItem,
    addLink,
    updateLink,
    deleteLink,
    addCustomSection,
    updateCustomSectionTitle,
    deleteCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
    moveCustomSectionItem,
    resetToSample,
    clearAll
  } = useCVState();

  const language = cvData.settings.language || 'he';
  const t = UI_TRANSLATIONS[language];

  // Check if we are in Electron hidden print window mode
  const isPrintWindow = window.location.search.includes('print=true') || (window as any).isPrintMode;

  // Listen for Electron print data
  React.useEffect(() => {
    if ((window as any).electron?.onLoadCVData) {
      return (window as any).electron.onLoadCVData((data: any) => {
        setCvData(data);
        (window as any).cvDataReady = true;
      });
    }
  }, [setCvData]);

  if (isPrintWindow) {
    return (
      <div className="bg-white min-h-screen w-full overflow-visible">
        <TemplateWrapper data={cvData} />
      </div>
    );
  }

  // Left form active accordion sections management
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    work: false,
    education: false,
    skills: false,
    languages: false,
    custom: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // State to track PDF Generation Loading
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Export and Import JSON state handlers
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(cvData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${cvData.personalDetails.firstName || 'AuraCV'}_${cvData.personalDetails.lastName || 'Resume'}.json`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export JSON', err);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        const parsed = JSON.parse(result);
        if (parsed && typeof parsed === 'object' && parsed.personalDetails && parsed.settings) {
          setCvData(parsed);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          throw new Error('Invalid schema structure');
        }
      } catch (err) {
        console.error('Failed to import JSON', err);
        alert(language === 'he' 
          ? "קובץ שגוי. אנא ודא שהקובץ הוא קובץ גיבוי תקין של AuraCV." 
          : "Invalid file structure. Please upload a valid AuraCV JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Trigger PDF backend API stream download (Supports both Desktop Electron print and standard Web API print)
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      if ((window as any).electron?.generatePDF) {
        // Native Electron print bridge (Offline Windows app mode)
        const success = await (window as any).electron.generatePDF(cvData);
        if (!success) {
          throw new Error(language === 'he' ? 'יצירת ה-PDF בוטלה או נכשלה.' : 'PDF generation was cancelled or failed.');
        }
        return;
      }

      // Standard Web backend API print
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cvData)
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF. Server returned code ${response.status}`);
      }

      // Read as blob stream and launch download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `${cvData.personalDetails.firstName || 'Resume'}_${cvData.personalDetails.lastName || 'CV'}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Cleanups
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF Download Error', err);
      setDownloadError(err.message || (language === 'he' ? 'שגיאה בהורדת קובץ ה-PDF.' : 'Error occurred while building your PDF.'));
    } finally {
      setIsDownloading(false);
    }
  };

  const activeColor = cvData.settings.customHex || cvData.settings.themeColor;

  return (
    <div 
      dir={language === 'he' ? 'rtl' : 'ltr'} 
      className="h-screen w-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden font-sans select-none"
    >
      
      {/* Dynamic Floating Global Header Topbar */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200/80 shadow-xs z-30 select-none">
        
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Sparkles className="w-5 h-5 fill-white/20 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-800 tracking-tight leading-none">AuraCV</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {language === 'he' ? 'יוצר קורות חיים פרימיום' : 'Pixel-Perfect Builder'}
            </p>
          </div>
        </div>

        {/* Action controllers (templates & presets) */}
        <div className="flex items-center gap-4">
          
          {/* Language Toggle Switch (Step 3) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => updateSettings('language', 'he')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                language === 'he' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              עברית
            </button>
            <button
              type="button"
              onClick={() => updateSettings('language', 'en')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                language === 'en' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              English
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Preset templates selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['professional', 'creative', 'minimalist'] as const).map((tId) => (
              <button
                key={tId}
                type="button"
                onClick={() => updateSettings('templateId', tId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  cvData.settings.templateId === tId
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tId}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden lg:block" />

          {/* Reset / Cleanups triggers */}
          <div className="flex gap-2">
            <button
              onClick={resetToSample}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer shadow-3xs"
              title={t.loadSample}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.loadSample}</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer shadow-3xs"
              title={t.resetForm}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.resetForm}</span>
            </button>

            <div className="h-8 w-px bg-slate-200 hidden md:block self-center mx-1" />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer shadow-3xs"
              title={t.importJSON}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.importJSON}</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer shadow-3xs"
              title={t.exportJSON}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.exportJSON}</span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Premium Vector PDF Download Trigger */}
          <div className="relative">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {t.downloadPDF}
                </>
              )}
            </button>
            
            {downloadError && (
              <div className="absolute right-0 top-12 w-64 bg-red-50 border border-red-200 text-red-700 text-[10px] p-2.5 rounded-lg shadow-lg font-medium leading-relaxed">
                {downloadError}
              </div>
            )}
          </div>

        </div>

      </header>

      {/* Main Workspace Frame split panel */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Scrollable Form Area (60% Desktop width) */}
        <section 
          dir={language === 'he' ? 'rtl' : 'ltr'} 
          className="w-full lg:w-[50%] xl:w-[45%] h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-6 space-y-5 select-text"
        >
          
          {/* Controls Quick Settings panel */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 select-none">
            <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-blue-500" /> {t.layoutAppearance}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Preset Palette circle controls */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3 text-slate-400" /> {t.themeColor}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PALETTES.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => {
                        updateSettings('themeColor', palette.primary);
                        updateSettings('customHex', '');
                      }}
                      className="w-6 h-6 rounded-full border border-slate-200 shadow-2xs hover:scale-110 active:scale-95 transition-all cursor-pointer relative"
                      style={{ backgroundColor: palette.primary }}
                      title={palette.name}
                    >
                      {cvData.settings.themeColor === palette.primary && !cvData.settings.customHex && (
                        <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </button>
                  ))}
                  
                  {/* Custom Hex Color Override Input Card */}
                  <div className="relative w-7 h-7 rounded-full border border-slate-300 overflow-hidden cursor-pointer shadow-3xs flex items-center justify-center">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                      value={cvData.settings.customHex || cvData.settings.themeColor}
                      onChange={(e) => updateSettings('customHex', e.target.value)}
                    />
                    <div 
                      className="w-full h-full" 
                      style={{ backgroundColor: cvData.settings.customHex || '#e2e8f0' }} 
                    />
                    {cvData.settings.customHex && (
                      <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </div>

              {/* Typography Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Type className="w-3 h-3 text-slate-400" /> {t.fontFamily}
                </label>
                <select
                  value={cvData.settings.fontFamily}
                  onChange={(e) => updateSettings('fontFamily', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:bg-white text-slate-700 outline-hidden focus:border-blue-400 cursor-pointer"
                >
                  {language === 'he' ? (
                    <>
                      <option value="Rubik">Rubik (רוביק)</option>
                      <option value="Assistant">Assistant (אסיסטנט)</option>
                      <option value="Heebo">Heebo (היבו)</option>
                      <option value="Inter">Inter (אינטר)</option>
                      <option value="Montserrat">Montserrat (מונטסראט)</option>
                    </>
                  ) : (
                    <>
                      <option value="Inter">Inter (Classic Sans-serif)</option>
                      <option value="Montserrat">Montserrat (Geometric Sans)</option>
                      <option value="Rubik">Rubik (Soft Sans-serif)</option>
                      <option value="Assistant">Assistant (Minimal Sans)</option>
                      <option value="Heebo">Heebo (Bold Sans-serif)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Font Size Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.fontSize}</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg text-center">
                  {(['sm', 'md', 'lg'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => updateSettings('fontSize', size)}
                      className={`py-1 text-[10px] font-bold uppercase rounded-md cursor-pointer ${
                        cvData.settings.fontSize === size
                          ? 'bg-white text-slate-800 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Spacing Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.spacing}</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg text-center">
                  {(['compact', 'comfortable', 'spacious'] as const).map(spacing => (
                    <button
                      key={spacing}
                      onClick={() => updateSettings('spacing', spacing)}
                      className={`py-1 text-[10px] font-bold uppercase rounded-md cursor-pointer ${
                        cvData.settings.spacing === spacing
                          ? 'bg-white text-slate-800 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {spacing === 'comfortable' ? (language === 'he' ? 'רגיל' : 'comf') : spacing === 'compact' ? (language === 'he' ? 'דחוס' : 'comp') : (language === 'he' ? 'מרווח' : 'spac')}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Responsive Template Card Selector (Mobile version placeholder or double selection) */}
            <div className="block lg:hidden space-y-2 border-t border-slate-100 pt-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" /> {language === 'he' ? 'בחר תבנית עיצוב' : 'Choose Visual Layout'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['professional', 'creative', 'minimalist'] as const).map(tId => (
                  <button
                    key={tId}
                    onClick={() => updateSettings('templateId', tId)}
                    className={`py-2 text-xs font-bold rounded-lg border uppercase tracking-wider cursor-pointer ${
                      cvData.settings.templateId === tId
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tId === 'professional' ? (language === 'he' ? 'מקצועי' : 'Prof') : tId === 'creative' ? (language === 'he' ? 'יצירתי' : 'Creat') : (language === 'he' ? 'נקי' : 'Min')}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Form Accordion sections lists */}
          <div className="space-y-3.5 pb-20">
            
            <AccordionSection
              title={t.personalDetails}
              icon={<User className="w-4 h-4" />}
              isOpen={openSections.personal}
              onToggle={() => toggleSection('personal')}
            >
              <PersonalDetailsForm
                data={cvData.personalDetails}
                language={language}
                onChange={updatePersonalDetails}
                onAddLink={addLink}
                onUpdateLink={updateLink}
                onDeleteLink={deleteLink}
              />
            </AccordionSection>

            <AccordionSection
              title={t.summary}
              icon={<FileText className="w-4 h-4" />}
              isOpen={openSections.summary}
              onToggle={() => toggleSection('summary')}
            >
              <SummaryForm
                value={cvData.summary || ''}
                language={language}
                onChange={updateSummary}
              />
            </AccordionSection>

            <AccordionSection
              title={t.workExperience}
              icon={<Briefcase className="w-4 h-4" />}
              isOpen={openSections.work}
              onToggle={() => toggleSection('work')}
            >
              <ExperienceForm
                type="work"
                items={cvData.workExperience}
                language={language}
                onAdd={(item) => addListItem('workExperience', item)}
                onUpdate={(id, field, value) => updateListItem('workExperience', id, field, value)}
                onDelete={(id) => deleteListItem('workExperience', id)}
                onMove={(idx, dir) => moveListItem('workExperience', idx, dir)}
              />
            </AccordionSection>

            <AccordionSection
              title={t.education}
              icon={<GraduationCap className="w-4.5 h-4.5" />}
              isOpen={openSections.education}
              onToggle={() => toggleSection('education')}
            >
              <ExperienceForm
                type="education"
                items={cvData.education}
                language={language}
                onAdd={(item) => addListItem('education', item)}
                onUpdate={(id, field, value) => updateListItem('education', id, field, value)}
                onDelete={(id) => deleteListItem('education', id)}
                onMove={(idx, dir) => moveListItem('education', idx, dir)}
              />
            </AccordionSection>

            <AccordionSection
              title={t.skills}
              icon={<Award className="w-4 h-4" />}
              isOpen={openSections.skills}
              onToggle={() => toggleSection('skills')}
            >
              <SkillsForm
                items={cvData.skills}
                language={language}
                onAdd={(item) => addListItem('skills', item)}
                onUpdate={(id, field, value) => updateListItem('skills', id, field, value)}
                onDelete={(id) => deleteListItem('skills', id)}
                onMove={(idx, dir) => moveListItem('skills', idx, dir)}
              />
            </AccordionSection>

            <AccordionSection
              title={t.languages}
              icon={<Languages className="w-4 h-4" />}
              isOpen={openSections.languages}
              onToggle={() => toggleSection('languages')}
            >
              <LanguagesForm
                items={cvData.languages}
                language={language}
                onAdd={(item) => addListItem('languages', item)}
                onUpdate={(id, field, value) => updateListItem('languages', id, field, value)}
                onDelete={(id) => deleteListItem('languages', id)}
                onMove={(idx, dir) => moveListItem('languages', idx, dir)}
              />
            </AccordionSection>

            <AccordionSection
              title={t.customSections}
              icon={<PlusCircle className="w-4 h-4" />}
              isOpen={openSections.custom}
              onToggle={() => toggleSection('custom')}
            >
              <CustomSectionsForm
                sections={cvData.customSections}
                language={language}
                onAddSection={addCustomSection}
                onUpdateSectionTitle={updateCustomSectionTitle}
                onDeleteSection={deleteCustomSection}
                onAddItem={addCustomSectionItem}
                onUpdateItem={updateCustomSectionItem}
                onDeleteItem={deleteCustomSectionItem}
                onMoveItem={moveCustomSectionItem}
              />
            </AccordionSection>

          </div>

        </section>

        {/* Right Sticky Visual Preview Panel (50%-55% Desktop width) */}
        <section className="hidden lg:block lg:flex-1 h-full select-none">
          <PreviewFrame data={cvData} />
        </section>

      </div>

    </div>
  );
};
export default App;
