import React from 'react';
import { CVData } from 'shared/types';
import { parseMarkdown } from '../../utils/textFormatter';

interface TemplateProps {
  data: CVData;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, summary, workExperience, education, skills, languages, customSections, settings } = data;
  
  const activeColor = settings.customHex || settings.themeColor;
  const isRTL = settings.language === 'he';
  
  // Font Size classes
  const fontSizes = {
    sm: {
      name: 'text-xl',
      title: 'text-xs',
      subtitle: 'text-xs',
      body: 'text-xs',
      spacing: 'space-y-1 mb-1.5',
      blockSpacing: 'space-y-2'
    },
    md: {
      name: 'text-2xl',
      title: 'text-sm',
      subtitle: 'text-sm',
      body: 'text-sm',
      spacing: 'space-y-2 mb-3',
      blockSpacing: 'space-y-3'
    },
    lg: {
      name: 'text-3xl',
      title: 'text-base',
      subtitle: 'text-base',
      body: 'text-base',
      spacing: 'space-y-3 mb-4.5',
      blockSpacing: 'space-y-4'
    }
  }[settings.fontSize || 'md'];

  const blockPadding = {
    compact: 'py-0.5',
    comfortable: 'py-1.5',
    spacious: 'py-2.5'
  }[settings.spacing || 'comfortable'];

  const pagePadding = {
    compact: 'p-[12mm]',
    comfortable: 'p-[16mm]',
    spacious: 'p-[22mm]'
  }[settings.spacing || 'comfortable'];

  const blockGap = {
    compact: 'gap-y-3.5',
    comfortable: 'gap-y-5',
    spacious: 'gap-y-7'
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

  // Contacts listed inline separated by bullet points
  const contactDetails = [
    personalDetails.phone,
    personalDetails.email,
    [personalDetails.address, personalDetails.city].filter(Boolean).join(', '),
    personalDetails.country
  ].filter(Boolean);

  return (
    <article 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${currentFontFamily} ${fontSizes.body} ${leadingStyle} text-slate-600 bg-white w-full h-full ${pagePadding} box-border flex flex-col ${blockGap} select-text text-start`}
    >
      
      {/* Header section (strictly centered and highly elegant) */}
      <header className="text-center pdf-avoid-break">
        <h1 className={`${fontSizes.name} font-light tracking-widest text-slate-800 uppercase leading-none mb-1`}>
          {personalDetails.firstName || ''} <span className="font-semibold">{personalDetails.lastName || ''}</span>
        </h1>
        
        {personalDetails.jobTitle && (
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: activeColor }}>
            {personalDetails.jobTitle}
          </p>
        )}

        {/* Dynamic Inline Link Items */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 font-medium max-w-2xl mx-auto border-t border-b border-slate-100 py-1.5">
          {contactDetails.map((detail, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300 select-none">•</span>}
              <span>{detail}</span>
            </React.Fragment>
          ))}
          
          {personalDetails.links && personalDetails.links.map((link) => (
            <React.Fragment key={link.id}>
              <span className="text-slate-300 select-none">•</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:opacity-85 font-semibold" style={{ color: activeColor }}>
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary Profile */}
      {summary && (
        <section className="pdf-avoid-break text-center max-w-3xl mx-auto">
          <p className="text-slate-500 leading-relaxed italic text-xs sm:text-sm">
            "{parseMarkdown(summary)}"
          </p>
        </section>
      )}

      {/* Work Experiences */}
      {workExperience && workExperience.length > 0 && (
        <section>
          <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
            {isRTL ? 'ניסיון מקצועי' : 'Experience'}
          </h2>
          <div className={fontSizes.blockSpacing}>
            {workExperience.map(work => (
              <div key={work.id} className={`pdf-allow-break ${blockPadding}`}>
                <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm inline">
                      {work.jobTitle}
                    </h3>
                    {(work.employer || [work.city, work.country].filter(Boolean).length > 0) && (
                      <>
                        <span className="text-slate-400 select-none mx-2">|</span>
                        <span className="font-semibold text-xs sm:text-sm" style={{ color: activeColor }}>
                          {work.employer}{[work.city, work.country].filter(Boolean).length > 0 ? `, ${[work.city, work.country].filter(Boolean).join(', ')}` : ''}
                        </span>
                      </>
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
                  <p className="text-slate-500 mt-1 whitespace-pre-line text-xs sm:text-sm pdf-allow-break text-justify">
                    {parseMarkdown(work.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education History */}
      {education && education.length > 0 && (
        <section>
          <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
            {isRTL ? 'השכלה ולימודים' : 'Education'}
          </h2>
          <div className={fontSizes.blockSpacing}>
            {education.map(edu => (
              <div key={edu.id} className={`pdf-allow-break ${blockPadding}`}>
                <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm inline">
                      {edu.degree}
                    </h3>
                    {(edu.institution || [edu.city, edu.country].filter(Boolean).length > 0) && (
                      <>
                        <span className="text-slate-400 select-none mx-2">|</span>
                        <span className="font-semibold text-xs sm:text-sm" style={{ color: activeColor }}>
                          {edu.institution}{[edu.city, edu.country].filter(Boolean).length > 0 ? `, ${[edu.city, edu.country].filter(Boolean).join(', ')}` : ''}
                        </span>
                      </>
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
                  <p className="text-slate-500 mt-1 whitespace-pre-line text-xs sm:text-sm pdf-allow-break">
                    {parseMarkdown(edu.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills list (elegant comma-separated or inline tags) */}
      {skills && skills.length > 0 && (
        <section className="pdf-avoid-break">
          <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
            {isRTL ? 'כישורים ומיומנויות' : 'Skills'}
          </h2>
          <div className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            {skills.map((skill, idx) => (
              <span key={skill.id} className="inline-block mr-3 mb-1">
                <span className="font-semibold text-slate-700">{skill.name}</span>
                {skill.level && <span className="text-slate-400 text-[11px] ml-1">({skill.level}/5)</span>}
                {idx < skills.length - 1 && <span className="text-slate-300 ml-3 select-none">|</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages list */}
      {languages && languages.length > 0 && (
        <section className="pdf-avoid-break">
          <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
            {isRTL ? 'שפות' : 'Languages'}
          </h2>
          <div className="text-slate-500 text-xs sm:text-sm">
            {languages.map((lang, idx) => (
              <span key={lang.id} className="inline-block mr-4">
                <span className="font-semibold text-slate-700">{lang.name}</span>
                {lang.level && <span className="text-slate-400 italic ml-1">({lang.level})</span>}
                {idx < languages.length - 1 && <span className="text-slate-300 ml-4 select-none">•</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections && customSections.map(sec => {
        if (!sec.items || sec.items.length === 0) return null;
        return (
          <section key={sec.id}>
            <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
              {sec.title}
            </h2>
            <div className={fontSizes.blockSpacing}>
              {sec.items.map(item => (
                <div key={item.id} className={`pdf-allow-break ${blockPadding}`}>
                  <div className="pdf-avoid-break flex justify-between items-baseline mb-1">
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs sm:text-sm inline">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <>
                          <span className="text-slate-400 select-none mx-2">|</span>
                          <span className="font-medium italic text-slate-500 text-xs">
                            {item.subtitle}
                          </span>
                        </>
                      )}
                    </div>
                    {item.date && (
                      <span className="text-slate-400 font-semibold text-xs whitespace-nowrap">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-slate-500 mt-1 whitespace-pre-line text-xs sm:text-sm pdf-allow-break">
                      {parseMarkdown(item.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Testimonials */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className="pdf-avoid-break">
          <h2 className={`${fontSizes.title} font-bold text-slate-800 uppercase tracking-widest border-b pb-1 mb-1.5`} style={{ borderColor: activeColor }}>
            {isRTL ? 'ממליצים' : 'References'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-500 text-start">
            {data.testimonials.map(item => (
              <div key={item.id} className="flex flex-col">
                <span className="font-semibold text-slate-700">{item.name}</span>
                {item.title && <span className="text-slate-400 italic text-xs">{item.title}</span>}
                {item.phone && (
                  <span className="text-slate-500 font-mono text-xs mt-0.5" dir="ltr">
                    {item.phone}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
