import React from 'react';
import { CVData } from 'shared/types';
import { parseMarkdown } from '../../utils/textFormatter';

interface TemplateProps {
  data: CVData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, summary, workExperience, education, skills, languages, customSections, settings } = data;
  
  const activeColor = settings.customHex || settings.themeColor;
  const isRTL = settings.language === 'he';
  
  // Font Size classes
  const fontSizes = {
    sm: {
      name: 'text-2xl',
      title: 'text-base',
      subtitle: 'text-xs',
      body: 'text-xs',
      spacing: 'space-y-1 mb-1.5',
      blockSpacing: 'space-y-2'
    },
    md: {
      name: 'text-3xl',
      title: 'text-lg',
      subtitle: 'text-sm',
      body: 'text-sm',
      spacing: 'space-y-2 mb-3',
      blockSpacing: 'space-y-3'
    },
    lg: {
      name: 'text-4xl',
      title: 'text-xl',
      subtitle: 'text-base',
      body: 'text-base',
      spacing: 'space-y-3 mb-4.5',
      blockSpacing: 'space-y-4'
    }
  }[settings.fontSize || 'md'];

  const blockPadding = {
    compact: 'py-0.5',
    comfortable: 'py-1.5',
    spacious: 'py-3'
  }[settings.spacing || 'comfortable'];

  const asidePadding = {
    compact: 'pt-[12mm] pb-[12mm] ps-[10mm] pe-[8mm]',
    comfortable: 'pt-[18mm] pb-[18mm] ps-[14mm] pe-[10mm]',
    spacious: 'pt-[24mm] pb-[24mm] ps-[18mm] pe-[12mm]'
  }[settings.spacing || 'comfortable'];

  const mainPadding = {
    compact: 'pt-[12mm] pb-[12mm] pe-[10mm] ps-[8mm]',
    comfortable: 'pt-[18mm] pb-[18mm] pe-[14mm] ps-[10mm]',
    spacious: 'pt-[24mm] pb-[24mm] pe-[18mm] ps-[12mm]'
  }[settings.spacing || 'comfortable'];

  const asideGap = {
    compact: 'gap-y-4',
    comfortable: 'gap-y-6',
    spacious: 'gap-y-8'
  }[settings.spacing || 'comfortable'];

  const mainGap = {
    compact: 'gap-y-4',
    comfortable: 'gap-y-6',
    spacious: 'gap-y-8'
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
      className={`${currentFontFamily} ${fontSizes.body} ${leadingStyle} text-slate-700 bg-white w-full h-full p-0 flex relative text-start`}
    >
      {/* Sidebar - Creative Color panel (Occupies 28% width) */}
      <aside className={`w-[28%] bg-slate-50 border-e border-slate-100 flex flex-col ${asidePadding} box-border relative select-none`}>
        {/* Sidebar Highlight Line */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: activeColor }} />

        {/* Profile Avatar Center Box */}
        {personalDetails.photo && (
          <div className="flex justify-center mb-6 mt-4 pdf-avoid-break">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-sm" style={{ borderColor: activeColor }}>
              <img 
                src={personalDetails.photo} 
                alt={`${personalDetails.firstName || 'Profile'} Avatar`} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}

        <div className={`flex flex-col ${asideGap} ${!personalDetails.photo ? 'mt-4' : ''}`}>
          {/* Details Section */}
          <section className="pdf-avoid-break">
            <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-3 flex items-center gap-1.5`} style={{ color: activeColor }}>
              {isRTL ? 'פרטי קשר' : 'Contact'}
            </h2>
            <ul className="space-y-2 text-xs">
              {personalDetails.email && (
                <li className="break-all">
                  <span className="font-semibold text-slate-500 block uppercase text-[10px]">{isRTL ? 'אימייל' : 'Email'}</span>
                  <span className="text-slate-700">{personalDetails.email}</span>
                </li>
              )}
              {personalDetails.phone && (
                <li>
                  <span className="font-semibold text-slate-500 block uppercase text-[10px]">{isRTL ? 'טלפון' : 'Phone'}</span>
                  <span className="text-slate-700">{personalDetails.phone}</span>
                </li>
              )}
              {(personalDetails.address || personalDetails.city) && (
                <li>
                  <span className="font-semibold text-slate-500 block uppercase text-[10px]">{isRTL ? 'מיקום' : 'Location'}</span>
                  <span className="text-slate-700">
                    {[personalDetails.address, personalDetails.city, personalDetails.country].filter(Boolean).join(', ')}
                  </span>
                </li>
              )}
              {personalDetails.dateOfBirth && (
                <li>
                  <span className="font-semibold text-slate-500 block uppercase text-[10px]">{isRTL ? 'תאריך לידה' : 'Birthdate'}</span>
                  <span className="text-slate-700">{personalDetails.dateOfBirth}</span>
                </li>
              )}
            </ul>
          </section>

          {/* Social Icons Links */}
          {personalDetails.links && personalDetails.links.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-3`} style={{ color: activeColor }}>
                {isRTL ? 'קישורים' : 'Socials'}
              </h2>
              <ul className="space-y-2 text-xs">
                {personalDetails.links.map(link => (
                  <li key={link.id} className="truncate">
                    <span className="font-semibold text-slate-500 block uppercase text-[10px]">{link.label}</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-85 font-medium" style={{ color: activeColor }}>
                      {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Creative Chips Skills */}
          {skills && skills.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-3`} style={{ color: activeColor }}>
                {isRTL ? 'כישורים' : 'Skills'}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className="text-xs px-2.5 py-1 rounded-md font-medium inline-block text-slate-700 border"
                    style={{ borderColor: 'rgba(203, 213, 225, 0.5)', backgroundColor: 'white' }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-3`} style={{ color: activeColor }}>
                {isRTL ? 'שפות' : 'Languages'}
              </h2>
              <ul className="space-y-2 text-xs">
                {languages.map(lang => (
                  <li key={lang.id} className="flex flex-col border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-700">{lang.name}</span>
                    {lang.level && <span className="text-slate-500 italic text-[11px]">{lang.level}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <section className="pdf-avoid-break">
              <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-3`} style={{ color: activeColor }}>
                {isRTL ? 'ממליצים' : 'References'}
              </h2>
              <ul className="space-y-3 text-xs text-start">
                {data.testimonials.map(item => (
                  <li key={item.id} className="flex flex-col border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-800">{item.name}</span>
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
        </div>
      </aside>

      {/* Main Panel (Occupies 72% width) - logical padding classes */}
      <main className={`w-[72%] flex flex-col ${mainPadding} box-border ${mainGap} flex-grow`}>
        {/* Name and Header Block */}
        <section className="pdf-avoid-break">
          <h1 className={`${fontSizes.name} font-black tracking-tight text-slate-800 uppercase leading-none`}>
            {personalDetails.firstName || ''} <span style={{ color: activeColor }}>{personalDetails.lastName || ''}</span>
          </h1>
          {personalDetails.jobTitle && (
            <p className={`${fontSizes.subtitle} font-bold text-slate-400 uppercase tracking-widest mt-1.5`}>
              {personalDetails.jobTitle}
            </p>
          )}
        </section>

        {/* Profile/Summary */}
        {summary && (
          <section className="pdf-avoid-break border-s-4 ps-4" style={{ borderColor: activeColor }}>
            <p className="text-slate-600 text-justify text-xs sm:text-sm">
              {parseMarkdown(summary)}
            </p>
          </section>
        )}

        {/* Experiences Timeline */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-1.5 border-b pb-1 flex items-center`} style={{ color: activeColor }}>
              {isRTL ? 'ניסיון תעסוקתי' : 'Experience'}
            </h2>
            <div className="space-y-4">
              {workExperience.map(work => (
                <div key={work.id} className={`pdf-allow-break relative ps-5 border-s-2 ms-1 pb-1 ${blockPadding}`} style={{ borderColor: '#e2e8f0' }}>
                  {/* Timeline bullet dot - dynamically switches sides using variants (Step 4) */}
                  <div 
                    className="absolute w-3 h-3 rounded-full top-2 border-2 border-white shadow-sm ltr:-left-[7px] rtl:-right-[7px]" 
                    style={{ backgroundColor: activeColor }} 
                  />
                  
                  <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight inline-block">
                        {work.jobTitle}
                      </h3>
                      {(work.employer || [work.city, work.country].filter(Boolean).length > 0) && (
                        <span className="font-semibold text-xs ml-2 mr-2" style={{ color: activeColor }}>
                          {work.employer}{[work.city, work.country].filter(Boolean).length > 0 ? `, ${[work.city, work.country].filter(Boolean).join(', ')}` : ''}
                        </span>
                      )}
                    </div>
                    {(work.startDate || work.endDate || work.current) && (
                      <span className="text-slate-400 font-semibold text-xs whitespace-nowrap">
                        {work.startDate ? formatDate(work.startDate) : ''}
                        {work.startDate && (work.endDate || work.current) ? ' – ' : ''}
                        {work.current ? (isRTL ? 'היום' : 'Present') : (work.endDate ? formatDate(work.endDate) : '')}
                      </span>
                    )}
                  </div>
                  {work.description && (
                    <p className="text-slate-600 mt-1 whitespace-pre-line text-xs sm:text-sm pdf-allow-break text-justify">
                      {parseMarkdown(work.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Timeline */}
        {education && education.length > 0 && (
          <section>
            <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-1.5 border-b pb-1`} style={{ color: activeColor }}>
              {isRTL ? 'השכלה' : 'Education'}
            </h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className={`pdf-allow-break relative ps-5 border-s-2 ms-1 pb-1 ${blockPadding}`} style={{ borderColor: '#e2e8f0' }}>
                  <div 
                    className="absolute w-3 h-3 rounded-full top-2 border-2 border-white shadow-sm ltr:-left-[7px] rtl:-right-[7px]" 
                    style={{ backgroundColor: activeColor }} 
                  />
                  
                  <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight inline-block">
                        {edu.degree}
                      </h3>
                      {(edu.institution || [edu.city, edu.country].filter(Boolean).length > 0) && (
                        <span className="font-semibold text-xs ml-2 mr-2" style={{ color: activeColor }}>
                          {edu.institution}{[edu.city, edu.country].filter(Boolean).length > 0 ? `, ${[edu.city, edu.country].filter(Boolean).join(', ')}` : ''}
                        </span>
                      )}
                    </div>
                    {(edu.startDate || edu.endDate || edu.current) && (
                      <span className="text-slate-400 font-semibold text-xs whitespace-nowrap">
                        {edu.startDate ? formatDate(edu.startDate) : ''}
                        {edu.startDate && (edu.endDate || edu.current) ? ' – ' : ''}
                        {edu.current ? (isRTL ? 'היום' : 'Present') : (edu.endDate ? formatDate(edu.endDate) : '')}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <p className="text-slate-600 mt-1 whitespace-pre-line text-xs sm:text-sm pdf-allow-break">
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
              <h2 className={`${fontSizes.title} font-extrabold uppercase tracking-wide mb-1.5 border-b pb-1`} style={{ color: activeColor }}>
                {sec.title}
              </h2>
              <div className="space-y-4">
                {sec.items.map(item => (
                  <div key={item.id} className={`pdf-allow-break relative ps-5 border-s-2 ms-1 pb-1 ${blockPadding}`} style={{ borderColor: '#e2e8f0' }}>
                    <div 
                      className="absolute w-3 h-3 rounded-full top-2 border-2 border-white shadow-sm ltr:-left-[7px] rtl:-right-[7px]" 
                      style={{ backgroundColor: activeColor }} 
                    />
                    
                    <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight inline-block">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <span className="italic text-slate-600 text-xs ml-2 mr-2">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                      {item.date && (
                        <span className="text-slate-400 font-semibold text-xs whitespace-nowrap">
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-slate-600 mt-1 whitespace-pre-line text-xs sm:text-sm pdf-allow-break">
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
    </article>
  );
};
