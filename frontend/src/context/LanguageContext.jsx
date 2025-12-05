import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getCurrentLanguage, setCurrentLanguage } from '../config/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLang] = useState(getCurrentLanguage());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLang(e.detail);
      forceUpdate(n => n + 1);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const changeLanguage = (newLang) => {
    setCurrentLanguage(newLang);
    setLang(newLang);
  };

  const t = (key, section = 'common') => {
    const langData = translations[language] || translations.en;
    if (langData[section] && langData[section][key]) {
      return langData[section][key];
    }
    const enData = translations.en;
    if (enData[section] && enData[section][key]) {
      return enData[section][key];
    }
    return key;
  };

  const getSection = (section) => {
    const langData = translations[language] || translations.en;
    return langData[section] || translations.en[section] || {};
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, getSection, translations: translations[language] || translations.en }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
