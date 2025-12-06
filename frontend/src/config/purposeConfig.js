import { translations, getCurrentLanguage } from './i18n';

const purposeIcons = {
  personal: {
    layers: {
      environmentalMatrix: '🌍',
      bioHardware: '💪',
      internalOS: '🧠',
      culturalSoftware: '❤️',
      socialInstance: '👨‍👩‍👧‍👦',
      consciousUser: '👁️',
      existentialContext: '✨'
    },
    navIcons: {
      dashboard: '🏠',
      checkin: '✅',
      quests: '🎯',
      stackscore: '📈',
      assessment: '📊',
      challenges: '🏆',
      leaderboard: '🏅',
      achievements: '🎖️',
      community: '👥',
      mood: '💜',
      tools: '🧰',
      layerguide: '📚',
      timeline: '📅',
      analysis: '🔍',
      diagnosis: '🔧',
      chat: '💬',
      profile: '👤',
      help: '❓'
    }
  },
  team: {
    layers: {
      environmentalMatrix: '🏢',
      bioHardware: '⚡',
      internalOS: '🤝',
      culturalSoftware: '📋',
      socialInstance: '👥',
      consciousUser: '🧭',
      existentialContext: '🎯'
    },
    navIcons: {
      dashboard: '🏠',
      checkin: '✅',
      quests: '🎯',
      stackscore: '📈',
      assessment: '📊',
      challenges: '🏆',
      leaderboard: '🏅',
      achievements: '🎖️',
      community: '👥',
      mood: '💜',
      tools: '🧰',
      layerguide: '📚',
      timeline: '📅',
      analysis: '🔍',
      diagnosis: '🔧',
      chat: '💬',
      profile: '👤',
      help: '❓'
    }
  },
  business: {
    layers: {
      environmentalMatrix: '🌐',
      bioHardware: '💰',
      internalOS: '👥',
      culturalSoftware: '⚙️',
      socialInstance: '📢',
      consciousUser: '🎯',
      existentialContext: '🚀'
    },
    navIcons: {
      dashboard: '🏠',
      checkin: '✅',
      quests: '🎯',
      stackscore: '📈',
      assessment: '📊',
      tools: '🧰',
      layerguide: '📚',
      challenges: '🏆',
      leaderboard: '🏅',
      achievements: '🎖️',
      community: '👥',
      mood: '💜',
      timeline: '📅',
      analysis: '🔍',
      diagnosis: '🔧',
      chat: '💬',
      profile: '👤',
      help: '❓'
    }
  },
  policy: {
    layers: {
      environmentalMatrix: '🌏',
      bioHardware: '🏥',
      internalOS: '🏛️',
      culturalSoftware: '📜',
      socialInstance: '⚖️',
      consciousUser: '🔬',
      existentialContext: '🌟'
    },
    navIcons: {
      dashboard: '🏠',
      checkin: '✅',
      quests: '🎯',
      stackscore: '📈',
      assessment: '📊',
      challenges: '🏆',
      leaderboard: '🏅',
      achievements: '🎖️',
      community: '👥',
      mood: '💜',
      tools: '🧰',
      layerguide: '📚',
      timeline: '📅',
      analysis: '🔍',
      diagnosis: '🔧',
      chat: '💬',
      profile: '👤',
      help: '❓'
    }
  }
};

const layerOrder = [
  'environmentalMatrix',
  'bioHardware',
  'internalOS',
  'culturalSoftware',
  'socialInstance',
  'consciousUser',
  'existentialContext'
];

const defaultLayerTranslations = {
  environmentalMatrix: {
    name: 'Environmental Matrix',
    description: 'Your physical and digital environment - the container of your existence'
  },
  bioHardware: {
    name: 'Bio-Hardware',
    description: 'Your physical body - health, energy, sleep, nutrition'
  },
  internalOS: {
    name: 'Internal OS',
    description: 'Your mental operating system - beliefs, traumas, cognitive patterns'
  },
  culturalSoftware: {
    name: 'Cultural Software',
    description: 'Cultural programming - values, norms, ideologies from society'
  },
  socialInstance: {
    name: 'Social Instance',
    description: 'Your relationships and social expressions'
  },
  consciousUser: {
    name: 'Conscious User',
    description: 'Your awareness and ability to observe and choose responses'
  },
  existentialContext: {
    name: 'Existential Context',
    description: 'Meaning and purpose - why any of this matters'
  }
};

const navItemOrder = {
  personal: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'tools', 'layerguide', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help'],
  team: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'tools', 'layerguide', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help'],
  business: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'tools', 'layerguide', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help'],
  policy: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'tools', 'layerguide', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help']
};

export const getPurposeConfig = (purpose, lang = null) => {
  const currentLang = lang || getCurrentLanguage();
  const t = translations[currentLang] || translations.en;
  const purposeTranslations = t.purposeConfig?.[purpose] || translations.en.purposeConfig?.[purpose] || translations.en.purposeConfig?.personal || {};
  const icons = purposeIcons[purpose] || purposeIcons.personal;
  const order = navItemOrder[purpose] || navItemOrder.personal;
  
  const layers = {};
  layerOrder.forEach(layerKey => {
    const translatedLayer = purposeTranslations.layers?.[layerKey] || {};
    const defaultLayer = defaultLayerTranslations[layerKey] || {};
    layers[layerKey] = {
      name: translatedLayer.name || defaultLayer.name || layerKey,
      description: translatedLayer.description || defaultLayer.description || '',
      icon: icons.layers[layerKey]
    };
  });
  
  const navItems = order.map(id => ({
    id,
    label: purposeTranslations.navItems?.[id] || id,
    icon: icons.navIcons[id] || '📋'
  }));
  
  const headerTitles = {};
  order.forEach(id => {
    headerTitles[id] = purposeTranslations.navItems?.[id] || id;
  });
  
  return {
    name: purposeTranslations.name || purpose,
    description: purposeTranslations.description || '',
    layers,
    navItems,
    headerTitles,
    layerOrder
  };
};

export const purposeConfig = {
  get personal() { return getPurposeConfig('personal'); },
  get team() { return getPurposeConfig('team'); },
  get business() { return getPurposeConfig('business'); },
  get policy() { return getPurposeConfig('policy'); }
};

export const getLayerConfig = (purpose, lang = null) => {
  const config = getPurposeConfig(purpose, lang);
  return config.layers;
};

export const getLayerOrder = () => layerOrder;

export const getNavItems = (purpose, lang = null) => {
  const config = getPurposeConfig(purpose, lang);
  return config.navItems;
};

export const getHeaderTitle = (purpose, page, lang = null) => {
  const config = getPurposeConfig(purpose, lang);
  return config.headerTitles[page] || 'Summary';
};

export const geographicCureWarnings = {
  triggerPhrases: ['move cities', 'new country', 'change locations', 'different place', 'if I just lived in', 'this city is the problem'],
  responses: [
    'Research shows 80% of problems follow geographical moves',
    'Have you exhausted internal solutions first?',
    'Consider: What are you trying to escape versus actually fix?'
  ],
  carryTestQuestion: 'When you travel, do your problems disappear or come with you?',
  carryTestInterpretation: {
    'Mostly disappear': 'Genuine environmental factor',
    'Come with me': 'Internal/Cultural layer issue',
    'Mixed': 'Environment amplifies existing issues'
  }
};

export const adaptationFirstPrinciples = [
  'Change your relationship to environment before changing environment',
  'Micro-environmental tweaks before major changes',
  'Adaptation strategies over escape fantasies',
  'Environmental meaning-making before environmental changing'
];
