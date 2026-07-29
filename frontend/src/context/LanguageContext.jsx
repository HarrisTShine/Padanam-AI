import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    appTitle: "Padanam AI",
    subTitle: "SCERT Kerala Adaptive Tutor",
    dashboard: "Dashboard",
    courses: "Subjects",
    quizzes: "Quizzes",
    analytics: "Progress",
    studyPlan: "Study Plan",
    teacherDashboard: "Teacher Portal",
    parentDashboard: "Parent Portal",
    adminDashboard: "Admin Management",
    settings: "Settings",
    logout: "Log Out",
    welcomeBack: "Welcome back",
    overallMastery: "Overall Mastery",
    weakTopics: "Topics Needing Review",
    recommendedNext: "Recommended Next Lesson",
    askAITutor: "Ask AI Tutor",
    generateQuiz: "Start Diagnostic Quiz",
    languagePreference: "Language Preference",
    english: "English",
    malayalam: "മലയാളം (Malayalam)"
  },
  ml: {
    appTitle: "പഠനം AI",
    subTitle: "എസ്.സി.ഇ.ആർ.ടി കേരള വ്യക്തിഗത പഠന സഹായി",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    courses: "വിഷയങ്ങൾ",
    quizzes: "ക്വിസുകൾ",
    analytics: "പുരോഗതി",
    studyPlan: "പഠന പദ്ധതി",
    teacherDashboard: "അധ്യാപക പോർട്ടൽ",
    parentDashboard: "രക്ഷാകർതൃ പോർട്ടൽ",
    adminDashboard: "അഡ്മിൻ മാനേജ്മെന്റ്",
    settings: "ക്രമീകരണങ്ങൾ",
    logout: "ലോഗ് ഔട്ട്",
    welcomeBack: "വീണ്ടും സ്വാഗതം",
    overallMastery: "മൊത്തത്തിലുള്ള നൈപുണ്യം",
    weakTopics: "ശ്രദ്ധിക്കേണ്ട വിഷയങ്ങൾ",
    recommendedNext: "അടുത്തതായി പഠിക്കേണ്ട പാഠം",
    askAITutor: "എ.ഐ ട്യൂട്ടറോട് ചോദിക്കൂ",
    generateQuiz: "ക്വിസ് ആരംഭിക്കുക",
    languagePreference: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    english: "English",
    malayalam: "മലയാളം (Malayalam)"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('padanam_lang') || 'en');

  const toggleLanguage = (lang) => {
    const newLang = lang || (language === 'en' ? 'ml' : 'en');
    setLanguage(newLang);
    localStorage.setItem('padanam_lang', newLang);
  };

  const t = (key) => translations[language]?.[key] || translations['en']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
