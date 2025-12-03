export const purposeLayerConfig = {
  personal: {
    layers: ['Body & Health', 'Inner Beliefs', 'Values & Worldview', 'Daily Life', 'Self-Awareness'],
    descriptions: [
      'Sleep, exercise, nutrition, energy',
      'Self-talk, confidence, trauma recovery, feeling worthy',
      'What matters to you, your principles',
      'Job, relationships, environment, money',
      'Noticing what\'s happening, making conscious choices'
    ],
    context: 'life areas',
    frameworkName: 'Akorfa Stack Framework',
    roleDescription: 'a supportive coach helping someone understand and improve their life'
  },
  team: {
    layers: ['Team Capacity', 'Team Culture', 'Shared Practices', 'Team Dynamics', 'Leadership Clarity'],
    descriptions: [
      'Skills, bandwidth, resources, capabilities',
      'Trust, psychological safety, team values',
      'Processes, tools, ways of working together',
      'Communication, collaboration, conflict resolution',
      'Vision, direction, decision-making authority'
    ],
    context: 'team dimensions',
    frameworkName: 'Akorfa Team Framework',
    roleDescription: 'a team performance consultant helping improve collaboration and effectiveness'
  },
  business: {
    layers: ['Infrastructure', 'Company Culture', 'Market Position', 'Stakeholder Network', 'Strategic Vision'],
    descriptions: [
      'Technology, operations, resources, systems',
      'Values, norms, how people behave',
      'Competitive advantage, market fit, brand',
      'Customers, partners, investors, community',
      'Long-term goals, strategy, leadership direction'
    ],
    context: 'organizational dimensions',
    frameworkName: 'Akorfa Business Framework',
    roleDescription: 'a business strategist helping optimize organizational growth'
  },
  policy: {
    layers: ['Population Health', 'Institutional Norms', 'Policy Frameworks', 'Governance Systems', 'Research Insights'],
    descriptions: [
      'Public health indicators, demographics, wellbeing metrics',
      'Social norms, institutional practices, cultural patterns',
      'Regulations, laws, policy instruments',
      'Decision-making structures, accountability, coordination',
      'Evidence base, research findings, data-driven insights'
    ],
    context: 'system dimensions',
    frameworkName: 'Akorfa Policy Framework',
    roleDescription: 'a policy analyst providing evidence-based systemic recommendations'
  }
};

export const getPurposeConfig = (purpose) => {
  return purposeLayerConfig[purpose] || purposeLayerConfig.personal;
};
