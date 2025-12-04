export const purposeConfig = {
  personal: {
    name: 'My Life',
    description: 'Make my life better small small',
    layers: {
      bioHardware: {
        name: 'Body & Health',
        description: 'Your body, sleep, chop, energy - how your body dey',
        icon: '💪'
      },
      internalOS: {
        name: 'Inner Beliefs',
        description: 'What you dey tell yourself, your confidence, your inner peace',
        icon: '🧠'
      },
      culturalSoftware: {
        name: 'Values & Worldview',
        description: 'The things wey matter to you, your beliefs, your way of life',
        icon: '❤️'
      },
      socialInstance: {
        name: 'Daily Life',
        description: 'Your family, friends, community - the people around you',
        icon: '👨‍👩‍👧‍👦'
      },
      consciousUser: {
        name: 'Self-Awareness',
        description: 'How well you know yourself, making wise choices',
        icon: '👁️'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'My Summary', icon: '🏠' },
      { id: 'assessment', label: 'Check Myself', icon: '📊' },
      { id: 'analysis', label: 'See Clearly', icon: '🔍' },
      { id: 'diagnosis', label: 'Solve Problem', icon: '🔧' },
      { id: 'chat', label: 'Talk to Akↄfa', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'My Summary',
      assessment: 'Check Myself',
      analysis: 'See Clearly',
      chat: 'Talk to Akↄfa',
      diagnosis: 'Solve Problem'
    }
  },
  team: {
    name: 'My Team',
    description: 'Make my team work better together',
    layers: {
      bioHardware: {
        name: 'Team Strength',
        description: 'The energy and capacity your team get - are people tired or fresh?',
        icon: '⚡'
      },
      internalOS: {
        name: 'Team Spirit',
        description: 'Trust, respect, how people feel safe to talk true',
        icon: '🤝'
      },
      culturalSoftware: {
        name: 'How We Work',
        description: 'The way una dey do things, your processes and habits',
        icon: '📋'
      },
      socialInstance: {
        name: 'Team Vibes',
        description: 'How people relate, settle wahala, work together',
        icon: '👥'
      },
      consciousUser: {
        name: 'Clear Direction',
        description: 'Everyone know where we dey go and why',
        icon: '🧭'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'Team Summary', icon: '🏠' },
      { id: 'assessment', label: 'Check Team', icon: '📊' },
      { id: 'analysis', label: 'Team Insight', icon: '🔍' },
      { id: 'diagnosis', label: 'Fix Problem', icon: '🔧' },
      { id: 'chat', label: 'Talk to Akↄfa', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'Team Summary',
      assessment: 'Check Team',
      analysis: 'Team Insight',
      chat: 'Talk to Akↄfa',
      diagnosis: 'Fix Problem'
    }
  },
  business: {
    name: 'My Business',
    description: 'Grow my business proper',
    layers: {
      bioHardware: {
        name: 'Money & Resources',
        shortName: 'Money',
        description: 'Money, equipment, stock, resources wey you get for business',
        icon: '💰'
      },
      internalOS: {
        name: 'Team & Community',
        shortName: 'Team',
        description: 'Your workers, family support, community backing',
        icon: '👥'
      },
      culturalSoftware: {
        name: 'Systems & Organization',
        shortName: 'Systems',
        description: 'How you organize things, your processes, record keeping',
        icon: '⚙️'
      },
      socialInstance: {
        name: 'Communication & Coordination',
        shortName: 'Communication',
        description: 'How you talk to customers, partners, suppliers',
        icon: '📢'
      },
      consciousUser: {
        name: 'Vision & Planning',
        shortName: 'Vision',
        description: 'Where you wan reach, your goals and plans',
        icon: '🎯'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'Business Summary', icon: '🏠' },
      { id: 'assessment', label: 'Check Business', icon: '📊' },
      { id: 'analysis', label: 'Business Insight', icon: '🔍' },
      { id: 'diagnosis', label: 'Fix Problem', icon: '🔧' },
      { id: 'chat', label: 'Talk to Akↄfa', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'Business Summary',
      assessment: 'Check Business',
      analysis: 'Business Insight',
      chat: 'Talk to Akↄfa',
      diagnosis: 'Fix Problem'
    }
  },
  policy: {
    name: 'Community & Policy',
    description: 'Understand systems and help communities',
    layers: {
      bioHardware: {
        name: 'People Wellbeing',
        description: 'Health, welfare, how people dey generally',
        icon: '🏥'
      },
      internalOS: {
        name: 'Community Beliefs',
        description: 'What the community believe, their customs and ways',
        icon: '🏛️'
      },
      culturalSoftware: {
        name: 'Rules & Laws',
        description: 'The policies, regulations, how things suppose work',
        icon: '📜'
      },
      socialInstance: {
        name: 'Who Runs Things',
        description: 'Government, chiefs, leaders - who make decisions',
        icon: '⚖️'
      },
      consciousUser: {
        name: 'What Data Shows',
        description: 'Research, evidence, what the facts dey tell us',
        icon: '🔬'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'System Summary', icon: '🏠' },
      { id: 'assessment', label: 'Check System', icon: '📊' },
      { id: 'analysis', label: 'System Insight', icon: '🔍' },
      { id: 'diagnosis', label: 'Find Solutions', icon: '🔧' },
      { id: 'chat', label: 'Talk to Akↄfa', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'System Summary',
      assessment: 'Check System',
      analysis: 'System Insight',
      chat: 'Talk to Akↄfa',
      diagnosis: 'Find Solutions'
    }
  }
};

export const getPurposeConfig = (purpose) => {
  return purposeConfig[purpose] || purposeConfig.personal;
};

export const getLayerConfig = (purpose) => {
  const config = getPurposeConfig(purpose);
  return config.layers;
};

export const getNavItems = (purpose) => {
  const config = getPurposeConfig(purpose);
  return config.navItems;
};

export const getHeaderTitle = (purpose, page) => {
  const config = getPurposeConfig(purpose);
  return config.headerTitles[page] || 'Summary';
};
