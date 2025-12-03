export const purposeConfig = {
  personal: {
    name: 'Personal Development',
    description: 'Improve your own life and well-being',
    layers: {
      bioHardware: {
        name: 'Bio Hardware',
        description: 'Your physical body, health, sleep, nutrition, and energy levels',
        icon: '🧬'
      },
      internalOS: {
        name: 'Internal OS',
        description: 'Your mindset, beliefs, emotions, and mental patterns',
        icon: '🧠'
      },
      culturalSoftware: {
        name: 'Cultural Software',
        description: 'Your values, habits, and cultural influences',
        icon: '🌐'
      },
      socialInstance: {
        name: 'Social Instance',
        description: 'Your relationships, social environment, and support network',
        icon: '👥'
      },
      consciousUser: {
        name: 'Conscious User',
        description: 'Your self-awareness, intentional choices, and personal growth',
        icon: '💡'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'assessment', label: 'Self Assessment', icon: '📊' },
      { id: 'analysis', label: 'My Analysis', icon: '🔍' },
      { id: 'diagnosis', label: 'Problem Solver', icon: '🔧' },
      { id: 'chat', label: 'Akↄfa Coach', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'My Dashboard',
      assessment: 'Self Assessment',
      analysis: 'Personal Analysis',
      chat: 'Akↄfa Coach',
      diagnosis: 'Problem Solver'
    }
  },
  team: {
    name: 'Team Performance',
    description: 'Understand and improve team dynamics',
    layers: {
      bioHardware: {
        name: 'Team Capacity',
        description: 'Team resources, workload, energy levels, and burnout risk',
        icon: '⚡'
      },
      internalOS: {
        name: 'Team Culture',
        description: 'Shared beliefs, psychological safety, and team mindset',
        icon: '🎯'
      },
      culturalSoftware: {
        name: 'Shared Practices',
        description: 'Team rituals, processes, communication patterns, and norms',
        icon: '📋'
      },
      socialInstance: {
        name: 'Team Dynamics',
        description: 'Collaboration, conflict resolution, and interpersonal relationships',
        icon: '🤝'
      },
      consciousUser: {
        name: 'Leadership Clarity',
        description: 'Vision alignment, decision-making, and strategic awareness',
        icon: '🧭'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'Team Dashboard', icon: '🏠' },
      { id: 'assessment', label: 'Team Assessment', icon: '📊' },
      { id: 'analysis', label: 'Team Analysis', icon: '🔍' },
      { id: 'diagnosis', label: 'Issue Diagnosis', icon: '🔧' },
      { id: 'chat', label: 'Akↄfa Coach', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'Team Dashboard',
      assessment: 'Team Assessment',
      analysis: 'Team Analysis',
      chat: 'Akↄfa Coach',
      diagnosis: 'Issue Diagnosis'
    }
  },
  business: {
    name: 'Business Growth',
    description: 'Optimize organizational performance',
    layers: {
      bioHardware: {
        name: 'Infrastructure',
        description: 'Physical resources, technology, capital, and operational capacity',
        icon: '🏗️'
      },
      internalOS: {
        name: 'Company Culture',
        description: 'Organizational values, beliefs, and internal narratives',
        icon: '🎭'
      },
      culturalSoftware: {
        name: 'Market Position',
        description: 'Brand identity, competitive advantages, and market perception',
        icon: '📈'
      },
      socialInstance: {
        name: 'Stakeholder Network',
        description: 'Customer relationships, partnerships, and ecosystem connections',
        icon: '🌐'
      },
      consciousUser: {
        name: 'Strategic Vision',
        description: 'Leadership clarity, long-term planning, and adaptive capacity',
        icon: '🔭'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'Business Dashboard', icon: '🏠' },
      { id: 'assessment', label: 'Org Assessment', icon: '📊' },
      { id: 'analysis', label: 'Business Analysis', icon: '🔍' },
      { id: 'diagnosis', label: 'Problem Diagnosis', icon: '🔧' },
      { id: 'chat', label: 'Akↄfa Coach', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'Business Dashboard',
      assessment: 'Organization Assessment',
      analysis: 'Business Analysis',
      chat: 'Akↄfa Coach',
      diagnosis: 'Problem Diagnosis'
    }
  },
  policy: {
    name: 'Policy & Research',
    description: 'Study systems and create solutions',
    layers: {
      bioHardware: {
        name: 'Population Health',
        description: 'Public health metrics, demographics, and physical wellbeing indicators',
        icon: '🏥'
      },
      internalOS: {
        name: 'Institutional Norms',
        description: 'Collective beliefs, social narratives, and cultural attitudes',
        icon: '🏛️'
      },
      culturalSoftware: {
        name: 'Policy Frameworks',
        description: 'Laws, regulations, incentive structures, and governance systems',
        icon: '📜'
      },
      socialInstance: {
        name: 'Governance Systems',
        description: 'Institutions, power structures, and stakeholder relationships',
        icon: '⚖️'
      },
      consciousUser: {
        name: 'Research Insights',
        description: 'Evidence-based understanding, data analysis, and systemic awareness',
        icon: '🔬'
      }
    },
    navItems: [
      { id: 'dashboard', label: 'Research Dashboard', icon: '🏠' },
      { id: 'assessment', label: 'System Assessment', icon: '📊' },
      { id: 'analysis', label: 'Policy Analysis', icon: '🔍' },
      { id: 'diagnosis', label: 'Issue Analysis', icon: '🔧' },
      { id: 'chat', label: 'Akↄfa Coach', icon: '💬' }
    ],
    headerTitles: {
      dashboard: 'Research Dashboard',
      assessment: 'System Assessment',
      analysis: 'Policy Analysis',
      chat: 'Akↄfa Coach',
      diagnosis: 'Issue Analysis'
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
  return config.headerTitles[page] || 'Dashboard';
};
