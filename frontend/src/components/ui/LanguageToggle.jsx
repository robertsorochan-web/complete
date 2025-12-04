import React from 'react';
import { Globe } from 'lucide-react';
import { supportedLanguages, getCurrentLanguage, setCurrentLanguage } from '../../config/i18n';

const LanguageToggle = ({ onLanguageChange }) => {
  const [currentLang, setCurrentLang] = React.useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  const currentLanguage = supportedLanguages.find(l => l.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage?.nativeName || 'English'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                currentLang === lang.code ? 'bg-purple-600/20 text-purple-400' : ''
              }`}
            >
              <span>{lang.nativeName}</span>
              {currentLang === lang.code && (
                <span className="text-purple-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
