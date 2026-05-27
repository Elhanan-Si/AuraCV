import React from 'react';
import { CVData } from 'shared/types';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';

interface TemplateWrapperProps {
  data: CVData;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ data }) => {
  switch (data.settings.templateId) {
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'minimalist':
      return <MinimalistTemplate data={data} />;
    case 'professional':
    default:
      return <ProfessionalTemplate data={data} />;
  }
};
export default TemplateWrapper;
