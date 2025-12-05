import { translations, getCurrentLanguage } from './i18n';

const purposeIcons = {
  personal: {
    layers: {
      bioHardware: '💪',
      internalOS: '🧠',
      culturalSoftware: '❤️',
      socialInstance: '👨‍👩‍👧‍👦',
      consciousUser: '👁️'
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
      bioHardware: '⚡',
      internalOS: '🤝',
      culturalSoftware: '📋',
      socialInstance: '👥',
      consciousUser: '🧭'
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
      bioHardware: '💰',
      internalOS: '👥',
      culturalSoftware: '⚙️',
      socialInstance: '📢',
      consciousUser: '🎯'
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
      bioHardware: '🏥',
      internalOS: '🏛️',
      culturalSoftware: '📜',
      socialInstance: '⚖️',
      consciousUser: '🔬'
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

const navItemOrder = {
  personal: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'tools', 'layerguide', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help'],
  team: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'tools', 'layerguide', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help'],
  business: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'tools', 'layerguide', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help'],
  policy: ['dashboard', 'checkin', 'quests', 'stackscore', 'assessment', 'challenges', 'leaderboard', 'achievements', 'community', 'mood', 'tools', 'layerguide', 'timeline', 'analysis', 'diagnosis', 'chat', 'profile', 'help']
};

export const getPurposeConfig = (purpose, lang = null) => {
  const currentLang = lang || getCurrentLanguage();
  const t = translations[currentLang] || translations.en;
  const purposeTranslations = t.purposeConfig?.[purpose] || translations.en.purposeConfig?.[purpose] || translations.en.purposeConfig.personal;
  const icons = purposeIcons[purpose] || purposeIcons.personal;
  const order = navItemOrder[purpose] || navItemOrder.personal;
  
  const layers = {};
  Object.keys(icons.layers).forEach(layerKey => {
    layers[layerKey] = {
      name: purposeTranslations.layers?.[layerKey]?.name || layerKey,
      description: purposeTranslations.layers?.[layerKey]?.description || '',
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
    headerTitles
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

export const getNavItems = (purpose, lang = null) => {
  const config = getPurposeConfig(purpose, lang);
  return config.navItems;
};

export const getHeaderTitle = (purpose, page, lang = null) => {
  const config = getPurposeConfig(purpose, lang);
  return config.headerTitles[page] || 'Summary';
};
