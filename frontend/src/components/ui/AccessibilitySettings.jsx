import React, { useState, useEffect } from 'react';
import { Eye, Volume2, Type, Sun, Moon, Accessibility, X } from 'lucide-react';

const AccessibilitySettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('akofa_accessibility');
    return saved ? JSON.parse(saved) : {
      highContrast: false,
      largeText: false,
      reduceMotion: false
    };
  });

  useEffect(() => {
    localStorage.setItem('akofa_accessibility', JSON.stringify(settings));
    
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (settings.largeText) {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '';
    }
    
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings]);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg transition md:bottom-4"
        title="Accessibility Options"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-800 rounded-t-2xl md:rounded-2xl p-6 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-purple-400" />
                Accessibility
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => toggleSetting('highContrast')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition ${
                  settings.highContrast 
                    ? 'border-yellow-500 bg-yellow-900/20' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.highContrast ? 'bg-yellow-500' : 'bg-slate-600'
                }`}>
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">High Contrast</div>
                  <div className="text-sm text-gray-400">For better visibility - good for older eyes</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  settings.highContrast ? 'border-yellow-500 bg-yellow-500' : 'border-slate-500'
                }`}>
                  {settings.highContrast && <span className="text-white text-sm">✓</span>}
                </div>
              </button>

              <button
                onClick={() => toggleSetting('largeText')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition ${
                  settings.largeText 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.largeText ? 'bg-blue-500' : 'bg-slate-600'
                }`}>
                  <Type className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">Bigger Text</div>
                  <div className="text-sm text-gray-400">Make everything easier to read</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  settings.largeText ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                }`}>
                  {settings.largeText && <span className="text-white text-sm">✓</span>}
                </div>
              </button>

              <button
                onClick={() => toggleSetting('reduceMotion')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition ${
                  settings.reduceMotion 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.reduceMotion ? 'bg-green-500' : 'bg-slate-600'
                }`}>
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">Reduce Motion</div>
                  <div className="text-sm text-gray-400">Stop animations - save data and battery</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  settings.reduceMotion ? 'border-green-500 bg-green-500' : 'border-slate-500'
                }`}>
                  {settings.reduceMotion && <span className="text-white text-sm">✓</span>}
                </div>
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Your settings go save automatically
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .reduce-motion * {
          animation: none !important;
          transition: none !important;
        }
      `}</style>
    </>
  );
};

export default AccessibilitySettings;
