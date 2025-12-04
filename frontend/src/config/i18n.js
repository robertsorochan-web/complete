export const translations = {
  en: {
    common: {
      welcome: 'Welcome',
      next: 'Next',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      share: 'Share',
      print: 'Print',
      download: 'Download'
    },
    home: {
      title: 'Stop Chasing Symptoms. Fix The Real Problem.',
      subtitle: 'You dey try different things but nothing dey work? Akↄfa shows you exactly what dey hold you back.',
      startFree: 'Start Free - Takes 2 Minutes',
      login: 'I Get Account Already',
      howItWorks: 'How Akↄfa Work',
      step1Title: 'Answer Simple Questions',
      step1Desc: 'Just rate 5 areas of your life honestly. No long form. 2 minutes max.',
      step2Title: 'See The Real Problem',
      step2Desc: 'Akↄfa go analyze your answers and show you exactly wetin dey hold you back.',
      step3Title: 'Get Clear Steps',
      step3Desc: 'Receive practical things you fit do today - not theory. Real action steps.'
    },
    assessment: {
      title: 'Rate Your 5 Areas',
      instruction: 'Move the slider to rate each area from 1-10',
      money: 'Money & Resources',
      team: 'Your Team',
      systems: 'Your Systems',
      communication: 'Communication',
      vision: 'Your Vision'
    },
    dashboard: {
      overview: 'Your Overview',
      strength: 'Your Strength',
      needsWork: 'Needs Work',
      doFirst: 'Do This First',
      yourScore: 'Your Score'
    },
    share: {
      whatsapp: 'Share on WhatsApp',
      sms: 'Share via SMS',
      copy: 'Copy Link',
      copied: 'Copied!'
    }
  },
  tw: {
    common: {
      welcome: 'Akwaaba',
      next: 'Kↄ so',
      back: 'San kↄ',
      save: 'Sie',
      cancel: 'Gyae',
      loading: 'Ɛreload...',
      error: 'Mfomso',
      success: 'Ayɛ yie',
      share: 'Kyɛ',
      print: 'Print',
      download: 'Download'
    },
    home: {
      title: 'Gyae symptom awie. Fix wahala papa no.',
      subtitle: 'Wo try things bebree but nothing no work? Akↄfa bɛkyerɛ wo deɛ ɛkyere wo mu.',
      startFree: 'Start Free - 2 Minutes pɛ',
      login: 'Me wↄ account dada',
      howItWorks: 'Sɛnea Akↄfa yɛ adwuma',
      step1Title: 'Bua nsɛm mforoso',
      step1Desc: 'Rate wo life areas 5 no honestly. Form tenten biara nni mu. 2 minutes pɛ.',
      step2Title: 'Hu wahala papa no',
      step2Desc: 'Akↄfa bɛhwehwɛ wo answers mu akyerɛ wo deɛ ɛkyere wo mu papa.',
      step3Title: 'Nya steps a ɛyɛ pɛpɛɛpɛ',
      step3Desc: 'Nya nneɛma a wobɛtumi ayɛ nnɛ - ɛnyɛ theory. Action steps papa.'
    },
    assessment: {
      title: 'Rate wo Areas 5',
      instruction: 'Twe slider no rate area biara fi 1-10',
      money: 'Sika ne Resources',
      team: 'Wo Team',
      systems: 'Wo Systems',
      communication: 'Communication',
      vision: 'Wo Vision'
    },
    dashboard: {
      overview: 'Wo Overview',
      strength: 'Wo Strength',
      needsWork: 'Ɛhia adwuma',
      doFirst: 'Yɛ eyi kan',
      yourScore: 'Wo Score'
    },
    share: {
      whatsapp: 'Kyɛ wↄ WhatsApp so',
      sms: 'Kyɛ via SMS',
      copy: 'Copy Link',
      copied: 'Ayi!'
    }
  }
};

export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let value = translations[lang] || translations.en;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

export const t = (key, lang = 'en') => getTranslation(lang, key);

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi' }
];

export const getCurrentLanguage = () => {
  return localStorage.getItem('akofa_language') || 'en';
};

export const setCurrentLanguage = (lang) => {
  localStorage.setItem('akofa_language', lang);
};
