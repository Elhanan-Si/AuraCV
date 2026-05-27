export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface PersonalDetails {
  jobTitle?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photo?: string; // strictly Base64 string for Puppeteer inline rendering safety
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  drivingLicense?: string;
  gender?: string;
  links: LinkItem[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  employer: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description?: string; // long text with list/split support
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: number; // 1 to 5 dots/stars for proficiency rating
}

export interface Language {
  id: string;
  name: string;
  level?: string; // e.g. "Native", "Fluent", "Conversational", "C1"
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CVSettings {
  templateId: 'professional' | 'creative' | 'minimalist';
  language: 'he' | 'en'; // Dynamic toggle field supporting RTL/LTR layouts
  themeColor: string; // Primary hex color preset
  customHex?: string; // User-specified custom hex override
  textColor: string; // Dynamic body text color
  fontFamily: 'Rubik' | 'Assistant' | 'Heebo' | 'Inter' | 'Montserrat'; // Hebrew & English supporting Google Fonts
  fontSize: 'sm' | 'md' | 'lg';
  spacing: 'compact' | 'comfortable' | 'spacious';
  sectionsOrder: string[]; // Dynamic array to allow re-ordering of sections
}

export interface CVData {
  personalDetails: PersonalDetails;
  summary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  customSections: CustomSection[];
  settings: CVSettings;
}
