import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { supportedLanguages, getCurrentLanguage, setCurrentLanguage } from '../../config/i18n';

const LanguageToggle = ({ onLanguageChange }) => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    window.location.reload();
  };

  const currentLanguage = supportedLanguages.find(l => l.code === currentLang);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage?.nativeName || 'English'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition flex items-center justify-between ${
                currentLang === lang.code ? 'bg-purple-600/20 text-purple-400' : 'text-white'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                {lang.code !== 'en' && (
                  <span className="text-xs text-gray-400">{lang.name}</span>
                )}
              </div>
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
