import { useState, useEffect } from 'react';
import { CVData, PersonalDetails, CVSettings, WorkExperience, Education, Skill, Language, CustomSection, CustomSectionItem, LinkItem } from 'shared/types';
import { SAMPLE_HEBREW_DATA, SAMPLE_ENGLISH_DATA } from '../utils/sampleData';

const LOCAL_STORAGE_KEY = 'cv_wizard_editor_state';

export const useCVState = () => {
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load CV data from localStorage', e);
    }
    // Default to Hebrew RTL sample data (Constraint #1)
    return SAMPLE_HEBREW_DATA;
  });

  // Save to localStorage on any state modification
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      console.error('Failed to persist CV state', e);
    }
  }, [cvData]);

  const updatePersonalDetails = (field: keyof PersonalDetails, value: any) => {
    setCvData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const updateSummary = (value: string) => {
    setCvData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const updateSettings = (field: keyof CVSettings, value: any) => {
    setCvData(prev => {
      const updatedSettings = {
        ...prev.settings,
        [field]: value
      };
      
      // Auto-set beautiful default fonts when language toggle shifts
      if (field === 'language') {
        updatedSettings.fontFamily = value === 'he' ? 'Rubik' : 'Inter';
      }

      return {
        ...prev,
        settings: updatedSettings
      };
    });
  };

  // Generic List operations (Work, Education, Skills, Languages)
  const addListItem = <K extends 'workExperience' | 'education' | 'skills' | 'languages'>(
    key: K,
    item: any
  ) => {
    setCvData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), item]
    }));
  };

  const updateListItem = <K extends 'workExperience' | 'education' | 'skills' | 'languages'>(
    key: K,
    id: string,
    field: string,
    value: any
  ) => {
    setCvData(prev => ({
      ...prev,
      [key]: prev[key].map((item: any) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteListItem = <K extends 'workExperience' | 'education' | 'skills' | 'languages'>(
    key: K,
    id: string
  ) => {
    setCvData(prev => ({
      ...prev,
      [key]: prev[key].filter((item: any) => item.id !== id)
    }));
  };

  const moveListItem = <K extends 'workExperience' | 'education' | 'skills' | 'languages'>(
    key: K,
    index: number,
    direction: 'up' | 'down'
  ) => {
    setCvData(prev => {
      const items = [...prev[key]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      
      // Swap elements
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      
      return {
        ...prev,
        [key]: items
      };
    });
  };

  // Custom Links List inside Personal Details
  const addLink = (link: LinkItem) => {
    setCvData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        links: [...(prev.personalDetails.links || []), link]
      }
    }));
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        links: prev.personalDetails.links.map(link => 
          link.id === id ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  const deleteLink = (id: string) => {
    setCvData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        links: prev.personalDetails.links.filter(link => link.id !== id)
      }
    }));
  };

  // Custom Sections operations
  const addCustomSection = (section: CustomSection) => {
    setCvData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), section]
    }));
  };

  const updateCustomSectionTitle = (sectionId: string, title: string) => {
    setCvData(prev => ({
      ...prev,
      customSections: prev.customSections.map(sec => 
        sec.id === sectionId ? { ...sec, title } : sec
      )
    }));
  };

  const deleteCustomSection = (sectionId: string) => {
    setCvData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(sec => sec.id !== sectionId)
    }));
  };

  const addCustomSectionItem = (sectionId: string, item: CustomSectionItem) => {
    setCvData(prev => ({
      ...prev,
      customSections: prev.customSections.map(sec => 
        sec.id === sectionId ? { ...sec, items: [...sec.items, item] } : sec
      )
    }));
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: any
  ) => {
    setCvData(prev => ({
      ...prev,
      customSections: prev.customSections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      })
    }));
  };

  const deleteCustomSectionItem = (sectionId: string, itemId: string) => {
    setCvData(prev => ({
      ...prev,
      customSections: prev.customSections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.filter(item => item.id !== itemId)
        };
      })
    }));
  };

  const moveCustomSectionItem = (
    sectionId: string,
    index: number,
    direction: 'up' | 'down'
  ) => {
    setCvData(prev => {
      return {
        ...prev,
        customSections: prev.customSections.map(sec => {
          if (sec.id !== sectionId) return sec;
          const items = [...sec.items];
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          
          if (targetIndex < 0 || targetIndex >= items.length) return sec;
          
          const temp = items[index];
          items[index] = items[targetIndex];
          items[targetIndex] = temp;
          
          return {
            ...sec,
            items
          };
        })
      };
    });
  };

  const resetToSample = () => {
    // Dynamic mock loading based on active language setting (Step 2)
    setCvData(cvData.settings.language === 'he' ? SAMPLE_HEBREW_DATA : SAMPLE_ENGLISH_DATA);
  };

  const clearAll = () => {
    // Clear keeping the active language selection intact
    setCvData(prev => ({
      personalDetails: {
        firstName: '',
        lastName: '',
        jobTitle: '',
        email: '',
        phone: '',
        photo: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        links: []
      },
      summary: '',
      workExperience: [],
      education: [],
      skills: [],
      languages: [],
      customSections: [],
      settings: {
        templateId: prev.settings.templateId,
        language: prev.settings.language,
        themeColor: prev.settings.themeColor,
        textColor: prev.settings.textColor,
        fontFamily: prev.settings.language === 'he' ? 'Rubik' : 'Inter',
        fontSize: prev.settings.fontSize,
        spacing: prev.settings.spacing,
        sectionsOrder: prev.settings.sectionsOrder
      }
    }));
  };

  return {
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
  };
};
