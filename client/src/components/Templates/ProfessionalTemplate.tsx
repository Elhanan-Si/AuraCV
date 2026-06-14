import React from 'react';
import { CVData } from 'shared/types';
import { parseMarkdown } from '../../utils/textFormatter';

interface TemplateProps {
  data: CVData;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, summary, workExperience, education, skills, languages, customSections, settings } = data;
  
  const activeColor = settings.customHex || settings.themeColor;
  const isRTL = settings.language === 'he';
  
  // Font Size classes
  const fontSizes = {
    sm: {
      name: 'text-2xl',
      title: 'text-base',
      subtitle: 'text-sm',
      body: 'text-xs',
      spacing: 'space-y-1 mb-1.5',
      blockSpacing: 'space-y-2'
    },
    md: {
      name: 'text-3xl',
      title: 'text-lg',
      subtitle: 'text-base',
      body: 'text-sm',
      spacing: 'space-y-2 mb-3',
      blockSpacing: 'space-y-3'
    },
    lg: {
      name: 'text-4xl',
      title: 'text-xl',
      subtitle: 'text-lg',
      body: 'text-base',
      spacing: 'space-y-3 mb-4.5',
      blockSpacing: 'space-y-4'
    }
  }[settings.fontSize || 'md'];

  // Spacing presets
  const spacingStyles = {
    compact: 'gap-y-3 gap-x-4 my-2',
    comfortable: 'gap-y-5 gap-x-6 my-4',
    spacious: 'gap-y-8 gap-x-8 my-6'
  }[settings.spacing || 'comfortable'];

  const blockPadding = {
    compact: 'py-0.5',
    comfortable: 'py-1.5',
    spacious: 'py-3'
  }[settings.spacing || 'comfortable'];

  const pagePadding = {
    compact: 'p-[12mm]',
    comfortable: 'p-[16mm]',
    spacious: 'p-[22mm]'
  }[settings.spacing || 'comfortable'];

  const mainGap = {
    compact: 'gap-y-3',
    comfortable: 'gap-y-4',
    spacious: 'gap-y-6'
  }[settings.spacing || 'comfortable'];

  const asideGap = {
    compact: 'gap-y-3',
    comfortable: 'gap-y-4',
    spacious: 'gap-y-6'
  }[settings.spacing || 'comfortable'];

  const leadingStyle = {
    compact: 'leading-normal',
    comfortable: 'leading-relaxed',
    spacious: 'leading-loose'
  }[settings.spacing || 'comfortable'];

  const fontFamilies = {
    'Rubik': 'font-["Rubik"]',
    'Assistant': 'font-["Assistant"]',
    'Heebo': 'font-["Heebo"]',
    'Inter': 'font-["Inter"]',
    'Montserrat': 'font-["Montserrat"]'
  };

  const currentFontFamily = fontFamilies[settings.fontFamily || 'Rubik'];

  // Helper to format date strings for readability (e.g. 2022-01 to Jan 2022)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length >= 2) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
        if (settings.language === 'he') {
          return date.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
    } catch (_) {}
    return dateStr;
  };

  return (
    <article 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${currentFontFamily} ${fontSizes.body} ${leadingStyle} text-slate-700 bg-white w-full h-full ${pagePadding} box-border relative flex flex-col text-start`}
    >
      {/* Header Profile Panel */}
      <header className="border-b-2 pb-5 flex justify-between items-center" style={{ borderColor: activeColor }}>
        <div className="flex-1 pe-4">
          <h1 className={`${fontSizes.name} font-extrabold uppercase tracking-tight text-slate-800 leading-tight`}>
            {personalDetails.firstName || ''} {personalDetails.lastName || ''}
          </h1>
          {personalDetails.jobTitle && (
            <p className={`${fontSizes.subtitle} font-medium tracking-wide uppercase mt-1`} style={{ color: activeColor }}>
              {personalDetails.jobTitle}
            </p>
          )}
        </div>
        
        {/* Profile Image (strictly loaded inline Base64) */}
        {personalDetails.photo && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: activeColor }}>
            <img 
              src={personalDetails.photo} 
              alt={`${personalDetails.firstName || 'Profile'} Photo`} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
      </header>

      {/* Main Two-Column Layout */}
      <div className={`grid grid-cols-12 ${spacingStyles} flex-grow`}>
        {/* Sidebar (Occupies 25% Width - 3 cols) - logical border-e and padding-e */}
        <aside className={`col-span-3 border-e border-slate-200 pe-5 flex flex-col ${asideGap}`}>
          {/* Contact Details */}
          <section className="pdf-avoid-break">
            <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center`}>
              {isRTL ? 'פרטי קשר' : 'Contact'}
            </h2>
            <ul className="space-y-1 text-slate-600">
              {personalDetails.email && (
                <li className="break-all">
                  <span className="font-semibold text-slate-800">{isRTL ? 'אימייל: ' : 'Email: '}</span>
                  {personalDetails.email}
                </li>
              )}
              {personalDetails.phone && (
                <li>
                  <span className="font-semibold text-slate-800">{isRTL ? 'טלפון: ' : 'Phone: '}</span>
                  {personalDetails.phone}
                </li>
              )}
              {(personalDetails.address || personalDetails.city) && (
                <li>
                  <span className="font-semibold text-slate-800">{isRTL ? 'כתובת: ' : 'Address: '}</span>
                  {[personalDetails.address, personalDetails.city, personalDetails.country].filter(Boolean).join(', ')}
                </li>
              )}
              {personalDetails.dateOfBirth && (
                <li>
                  <span className="font-semibold text-slate-800">{isRTL ? 'ת. לידה: ' : 'Born: '}</span>
                  {personalDetails.dateOfBirth}
                </li>
              )}
            </ul>
          </section>

          {/* Social / Links */}
          {personalDetails.links && personalDetails.links.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider mb-2`}>
                {isRTL ? 'קישורים' : 'Links'}
              </h2>
              <ul className="space-y-1">
                {personalDetails.links.map(link => (
                  <li key={link.id} className="truncate">
                    <span className="font-semibold text-slate-800">{link.label}: </span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:opacity-85 font-medium" style={{ color: activeColor }}>
                      {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills with dots */}
          {skills && skills.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider mb-2`}>
                {isRTL ? 'כישורים' : 'Skills'}
              </h2>
              <div className="space-y-2">
                {skills.map(skill => (
                  <div key={skill.id} className="flex flex-col">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    {skill.level && (
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(idx => (
                          <div 
                            key={idx} 
                            className="w-2 h-2 rounded-full" 
                            style={{ 
                              backgroundColor: idx <= (skill.level || 0) ? activeColor : '#e2e8f0' 
                            }} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider mb-2`}>
                {isRTL ? 'שפות' : 'Languages'}
              </h2>
              <ul className="space-y-1">
                {languages.map(lang => (
                  <li key={lang.id} className="flex justify-between">
                    <span className="font-medium text-slate-700">{lang.name}</span>
                    {lang.level && <span className="text-slate-500 italic">{lang.level}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider mb-2`}>
                {isRTL ? 'ממליצים' : 'References'}
              </h2>
              <ul className="space-y-2 text-xs">
                {data.testimonials.map(item => (
                  <li key={item.id} className="flex flex-col border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    {item.title && <span className="text-slate-500 italic text-[11px]">{item.title}</span>}
                    {item.phone && (
                      <span className="text-slate-600 font-semibold font-mono text-[10px] mt-0.5" dir="ltr">
                        {item.phone}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Main Panel (75% Width - 9 cols) - logical padding-s */}
        <main className={`col-span-9 ps-5 flex flex-col ${mainGap}`}>
          {/* Professional Summary */}
          {summary && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider border-b pb-1 mb-2`} style={{ borderColor: activeColor }}>
                {isRTL ? 'תקציר מקצועי' : 'Profile'}
              </h2>
              <p className="text-slate-600 text-justify">
                {parseMarkdown(summary)}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <section>
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
                {isRTL ? 'ניסיון תעסוקתי' : 'Experience'}
              </h2>
              <div className={fontSizes.blockSpacing}>
                {workExperience.map(work => (
                  <div key={work.id} className={`pdf-allow-break ${blockPadding}`}>
                    <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">
                          {work.jobTitle}
                        </h3>
                        {(work.employer || [work.city, work.country].filter(Boolean).length > 0) && (
                          <span className="font-semibold text-xs sm:text-sm" style={{ color: activeColor }}>
                            {work.employer}{[work.city, work.country].filter(Boolean).length > 0 ? `, ${[work.city, work.country].filter(Boolean).join(', ')}` : ''}
                          </span>
                        )}
                      </div>
                      {(work.startDate || work.endDate || work.current) && (
                        <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">
                          {work.startDate ? formatDate(work.startDate) : ''}
                          {work.startDate && (work.endDate || work.current) ? ' – ' : ''}
                          {work.current ? (isRTL ? 'היום' : 'Present') : (work.endDate ? formatDate(work.endDate) : '')}
                        </span>
                      )}
                    </div>
                    {work.description && (
                      <p className="text-slate-600 mt-1 whitespace-pre-line pdf-allow-break text-justify">
                        {parseMarkdown(work.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
                {isRTL ? 'השכלה' : 'Education'}
              </h2>
              <div className={fontSizes.blockSpacing}>
                {education.map(edu => (
                  <div key={edu.id} className={`pdf-allow-break ${blockPadding}`}>
                    <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">
                          {edu.degree}
                        </h3>
                        {(edu.institution || [edu.city, edu.country].filter(Boolean).length > 0) && (
                          <span className="font-semibold text-xs sm:text-sm" style={{ color: activeColor }}>
                            {edu.institution}{[edu.city, edu.country].filter(Boolean).length > 0 ? `, ${[edu.city, edu.country].filter(Boolean).join(', ')}` : ''}
                          </span>
                        )}
                      </div>
                      {(edu.startDate || edu.endDate || edu.current) && (
                        <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">
                          {edu.startDate ? formatDate(edu.startDate) : ''}
                          {edu.startDate && (edu.endDate || edu.current) ? ' – ' : ''}
                          {edu.current ? (isRTL ? 'היום' : 'Present') : (edu.endDate ? formatDate(edu.endDate) : '')}
                        </span>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-slate-600 mt-1 whitespace-pre-line pdf-allow-break">
                        {parseMarkdown(edu.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections && customSections.map(sec => {
            if (!sec.items || sec.items.length === 0) return null;
            return (
              <section key={sec.id}>
                <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-wider border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
                  {sec.title}
                </h2>
                <div className={fontSizes.blockSpacing}>
                  {sec.items.map(item => (
                    <div key={item.id} className={`pdf-allow-break ${blockPadding}`}>
                      <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                        <div>
                          <h3 className="font-bold text-slate-800 leading-tight">
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <span className="font-medium italic text-slate-600 text-xs">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                        {item.date && (
                          <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-slate-600 mt-1 whitespace-pre-line pdf-allow-break">
                          {parseMarkdown(item.description)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </article>
  );
};
