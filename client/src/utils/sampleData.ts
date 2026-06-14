import { CVData } from 'shared/types';

export const SAMPLE_HEBREW_DATA: CVData = {
  personalDetails: {
    firstName: "אלכסנדר",
    lastName: "ונס",
    jobTitle: "מהנדס פול-סטאק בכיר",
    email: "alexander.vance@devmail.com",
    phone: "+1 (555) 382-9012",
    photo: "", // Empty by default; uploader sets Base64
    address: "דרך אורנים 492",
    city: "סן פרנסיסקו",
    postalCode: "94107",
    country: "ארה\"ב",
    dateOfBirth: "1994-11-12",
    nationality: "אמריקאי",
    drivingLicense: "דרגה B",
    gender: "זכר",
    links: [
      { id: "link-1", label: "LinkedIn", url: "https://linkedin.com/in/alexvance" },
      { id: "link-2", label: "GitHub", url: "https://github.com/alexvance" },
      { id: "link-3", label: "Portfolio", url: "https://vance.codes" }
    ]
  },
  summary: "מהנדס פול-סטאק בכיר דינמי ומוכוון תוצאות עם למעלה מ-8 שנות ניסיון בעיצוב, בנייה והרחבה של אפליקציות אינטרנט מורכבות. מתמחה ב-React, TypeScript, Node.js וארכיטקטורות ענן מבוזרות (AWS/GCP). בעל רקע עשיר בהובלת צוותים מולטי-דיסציפלינריים לאספקת ממשקי משתמש מרהיבים ומיקרו-שירותים בעלי תפוקה גבוהה, תוך ביצוע אופטימיזציות למהירות טעינה מקסימלית והשפעת SEO רחבה.",
  workExperience: [
    {
      id: "work-1",
      jobTitle: "מהנדס פול-סטאק בכיר",
      employer: "TechVanguard Solutions",
      city: "סן פרנסיסקו",
      country: "ארה\"ב",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description: "• הובלתי צוות הנדסי של 5 מפתחים לבנייה מחדש של פלטפורמת SaaS מרכזית באמצעות React, TypeScript ו-Vite, מה שהניב שיפור של 42% במדדי Core Web Vitals ועלייה של 14% בהמרות משתמשים חדשים.\n• הנדסתי ותכננתי שירות לוח שיתופי בזמן אמת באמצעות WebSockets ו-Redis, התומך ביציבות במעל ל-50,000 חיבורים סימולטניים פעילים ללא איבוד מידע.\n• עיצבתי ופיתחתי ספריית רכיבים פנימית מקיפה מבוססת Tailwind CSS, אשר קיצרה את זמני פיתוח הפרונט-אנד ב-30% והבטיחה אחידות עיצובית מלאה במערכות הארגון.\n• הטמעתי תהליכי CI/CD אוטומטיים רב-שלביים באמצעות GitHub Actions ו-Docker, שקיצרו את זמני הפריסה לייצור מ-45 דקות לפחות מ-6 דקות."
    },
    {
      id: "work-2",
      jobTitle: "מפתח תוכנה דרג II",
      employer: "CloudNova Systems",
      city: "אוסטין",
      country: "ארה\"ב",
      startDate: "2019-03",
      endDate: "2021-12",
      current: false,
      description: "• פיתחתי ממשקי API חסונים ומאובטחים מסוג RESTful ו-GraphQL באמצעות Node.js ו-Express, המטפלים ביותר מ-12 מיליון עסקאות יומיות עם זמני תגובה של פחות מ-80 מילישניות.\n• הובלתי בהצלחה פרויקט מיגרציה של בסיס נתונים ישן לתוך ארכיטקטורה מותאמת אישית של PostgreSQL, מה שקיצר את זמני ריצת השאילתות המורכבות ב-55% ללא השבתת שירות.\n• חנכתי והנחיתי 3 מפתחי תוכנה ג'וניורים, הובלתי סטנדרטים קפדניים של סקירת קוד והטמעתי בדיקות יחידה ואינטגרציה אוטומטיות באמצעות Vitest."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "מוסמך במדעי המחשב (M.S.)",
      institution: "אוניברסיטת סטנפורד",
      city: "סטנפורד",
      country: "ארה\"ב",
      startDate: "2017-09",
      endDate: "2019-06",
      current: false,
      description: "התמחות בהנדסת תוכנה, מערכות מבוזרות ותשתיות אינטרנט עתירות ביצועים. סיום תואר בהצטיינות יתרה."
    },
    {
      id: "edu-2",
      degree: "בוגר במדעי המחשב והנדסה (B.S.)",
      institution: "אוניברסיטת טקסס",
      city: "אוסטין",
      country: "ארה\"ב",
      startDate: "2013-09",
      endDate: "2017-05",
      current: false,
      description: "סיום תואר בהצטיינות יתרה (Magna Cum Laude). קורסי ליבה במבני נתונים מתקדמים, פיתוח אינטרנט ומערכות ניהול בסיסי נתונים."
    }
  ],
  skills: [
    { id: "skill-1", name: "TypeScript / JavaScript", level: 5 },
    { id: "skill-2", name: "React / Vite / Next.js", level: 5 },
    { id: "skill-3", name: "Node.js / Express / Fastify", level: 5 },
    { id: "skill-4", name: "Tailwind CSS / Vanilla CSS", level: 5 },
    { id: "skill-5", name: "PostgreSQL / MongoDB / Redis", level: 4 },
    { id: "skill-6", name: "AWS (S3, Lambda, EC2, RDS)", level: 4 },
    { id: "skill-7", name: "Docker / CI/CD Pipelines", level: 4 }
  ],
  languages: [
    { id: "lang-1", name: "עברית", level: "שפת אם / דו-לשוני" },
    { id: "lang-2", name: "אנגלית", level: "שליטה מלאה / שפת אם" },
    { id: "lang-3", name: "ספרדית", level: "רמה מקצועית" }
  ],
  customSections: [
    {
      id: "custom-1",
      title: "הסמכות והישגים",
      items: [
        {
          id: "citem-1",
          title: "AWS Certified Solutions Architect – Associate",
          subtitle: "Amazon Web Services",
          date: "2023",
          description: "מזהה הסמכה: AWS-ASA-9012"
        },
        {
          id: "citem-2",
          title: "מקום 1 - האקאתון TechVanguard העולמי",
          subtitle: "חטיבת מערכות ארגוניות",
          date: "2023",
          description: "פיתוח של מנוע מבוסס בינה מלאכותית לסקירת קוד קבוצתית בתוך 48 שעות, נבחר למקום הראשון מתוך 64 צוותים מתחרים."
        }
      ]
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "ד\"ר שרה כהן",
      title: "דירקטורית פיתוח ב-TechVanguard Solutions",
      phone: "+1 (555) 019-2834"
    },
    {
      id: "test-2",
      name: "מיכאל לוי",
      title: "ר”צ פרונט-אנד ב-CloudNova Systems",
      phone: "+1 (555) 014-9876"
    }
  ],
  settings: {
    templateId: "professional",
    language: "he", // Hebrew as default RTL mode (Constraint #1)
    themeColor: "#1e3a8a", // Royal Blue
    textColor: "#334155", // Slate 700
    fontFamily: "Rubik", // Default Hebrew font
    fontSize: "md",
    spacing: "comfortable",
    sectionsOrder: ["workExperience", "education", "skills", "languages", "customSections"]
  }
};

export const SAMPLE_ENGLISH_DATA: CVData = {
  personalDetails: {
    firstName: "Alexander",
    lastName: "Vance",
    jobTitle: "Senior Full-Stack Engineer",
    email: "alexander.vance@devmail.com",
    phone: "+1 (555) 382-9012",
    photo: "",
    address: "492 Pine Crest Way",
    city: "San Francisco",
    postalCode: "94107",
    country: "United States",
    dateOfBirth: "1994-11-12",
    nationality: "American",
    drivingLicense: "Class C",
    gender: "Male",
    links: [
      { id: "link-1", label: "LinkedIn", url: "https://linkedin.com/in/alexvance" },
      { id: "link-2", label: "GitHub", url: "https://github.com/alexvance" },
      { id: "link-3", label: "Portfolio", url: "https://vance.codes" }
    ]
  },
  summary: "Dynamic and results-driven Senior Full-Stack Engineer with 8+ years of experience designing, building, and scaling modern web applications. Specialized in React, TypeScript, Node.js, and serverless cloud architectures (AWS/GCP). Proven track record of leading high-performing cross-functional teams to deliver premium user interfaces and high-throughput microservices, optimizing for maximum system responsiveness and SEO performance.",
  workExperience: [
    {
      id: "work-1",
      jobTitle: "Senior Full-Stack Engineer",
      employer: "TechVanguard Solutions",
      city: "San Francisco",
      country: "USA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description: "• Led a high-performing engineering squad of 5 developers to completely rebuild a high-traffic SaaS storefront using React, TypeScript, and Vite, yielding a 42% improvement in Google PageSpeed Core Web Vitals and a 14% increase in user sign-ups.\n• Engineered a real-time collaborative whiteboarding service using WebSockets and Redis, scaling seamlessly to support over 50,000 concurrent active connections with zero message drops.\n• Designed and styled a comprehensive, reusable design system inside Tailwind CSS, reducing front-end development cycle times by 30% and standardizing brand aesthetic across 4 micro-frontends.\n• Automated multi-stage CI/CD pipelines via GitHub Actions and Docker, reducing production deployment times from 45 minutes to less than 6 minutes."
    },
    {
      id: "work-2",
      jobTitle: "Software Engineer II",
      employer: "CloudNova Systems",
      city: "Austin",
      country: "USA",
      startDate: "2019-03",
      endDate: "2021-12",
      current: false,
      description: "• Developed robust RESTful and GraphQL APIs in Node.js and Express, handling over 12 million daily client transactions with sub-80ms p95 latency parameters.\n• Successfully migrated a legacy monolith database into a highly optimized PostgreSQL relational structure, reducing complex analytics query runtimes by 55% with zero user downtime.\n• Mentored 3 junior software engineers, implemented strict git branching standards, and introduced automated unit and integration tests using Vitest, boosting code coverage to 92%."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "M.S. in Computer Science",
      institution: "Stanford University",
      city: "Stanford",
      country: "USA",
      startDate: "2017-09",
      endDate: "2019-06",
      current: false,
      description: "Specialized in Software Engineering, Distributed Systems, and High-Performance Web Infrastructures. Graduated with Honors."
    },
    {
      id: "edu-2",
      degree: "B.S. in Computer Science & Engineering",
      institution: "University of Texas",
      city: "Austin",
      country: "USA",
      startDate: "2013-09",
      endDate: "2017-05",
      current: false,
      description: "Graduated Magna Cum Laude. Core course load in Advanced Data Structures, Web Development, and Database Management Systems."
    }
  ],
  skills: [
    { id: "skill-1", name: "TypeScript / JavaScript", level: 5 },
    { id: "skill-2", name: "React / Vite / Next.js", level: 5 },
    { id: "skill-3", name: "Node.js / Express / Fastify", level: 5 },
    { id: "skill-4", name: "Tailwind CSS / Vanilla CSS", level: 5 },
    { id: "skill-5", name: "PostgreSQL / MongoDB / Redis", level: 4 },
    { id: "skill-6", name: "AWS (S3, Lambda, EC2, RDS)", level: 4 },
    { id: "skill-7", name: "Docker / CI/CD Systems", level: 4 }
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native / Bilingual" },
    { id: "lang-2", name: "Spanish", level: "Professional Working" },
    { id: "lang-3", name: "Japanese", level: "Conversational" }
  ],
  customSections: [
    {
      id: "custom-1",
      title: "Certifications & Achievements",
      items: [
        {
          id: "citem-1",
          title: "AWS Certified Solutions Architect – Associate",
          subtitle: "Amazon Web Services",
          date: "2023",
          description: "Credential ID: AWS-ASA-9012"
        },
        {
          id: "citem-2",
          title: "1st Place Winner – TechVanguard Hackathon",
          subtitle: "Enterprise Division",
          date: "2023",
          description: "Developed an AI-driven automated code review assistant in 48 hours, selected as 1st place among 64 competing teams."
        }
      ]
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Dr. Sarah Cohen",
      title: "Director of Engineering at TechVanguard Solutions",
      phone: "+1 (555) 019-2834"
    },
    {
      id: "test-2",
      name: "Michael Levi",
      title: "Frontend Team Lead at CloudNova Systems",
      phone: "+1 (555) 014-9876"
    }
  ],
  settings: {
    templateId: "professional",
    language: "en",
    themeColor: "#1e3a8a",
    textColor: "#334155",
    fontFamily: "Inter",
    fontSize: "md",
    spacing: "comfortable",
    sectionsOrder: ["workExperience", "education", "skills", "languages", "customSections"]
  }
};

export const COLOR_PALETTES = [
  { name: "Royal Blue", primary: "#1e3a8a", secondary: "#3b82f6" },
  { name: "Emerald", primary: "#065f46", secondary: "#10b981" },
  { name: "Slate Minimal", primary: "#334155", secondary: "#64748b" },
  { name: "Burgundy Wine", primary: "#7c2d12", secondary: "#c2410c" },
  { name: "Deep Charcoal", primary: "#111827", secondary: "#4b5563" },
  { name: "Sleek Violet", primary: "#5b21b6", secondary: "#8b5cf6" }
];
