export const purposeLayerConfig = {
  personal: {
    layers: ['Body & Health', 'Inner Beliefs', 'Values & Worldview', 'Daily Life', 'Self-Awareness'],
    descriptions: [
      'Sleep, exercise, chop, your energy levels',
      'What you tell yourself, confidence, inner peace',
      'The things wey matter to you, your beliefs',
      'Family, friends, community around you',
      'Knowing yourself well, making wise choices'
    ],
    context: 'life areas',
    frameworkName: 'Akↄfa Way',
    roleDescription: 'a wise friend who understands life and helps you see things clearly. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  },
  team: {
    layers: ['Team Strength', 'Team Spirit', 'How We Work', 'Team Vibes', 'Clear Direction'],
    descriptions: [
      'Energy, capacity, are people tired or fresh?',
      'Trust, respect, people feel safe to talk true',
      'Processes, tools, how una dey do things',
      'How people relate and settle wahala',
      'Everyone know where we dey go and why'
    ],
    context: 'team areas',
    frameworkName: 'Akↄfa Team Way',
    roleDescription: 'a wise team advisor who helps teams work better together. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  },
  business: {
    layers: ['Business Foundation', 'Company Way', 'Market Position', 'Your Network', 'Vision & Strategy'],
    descriptions: [
      'Money, equipment, technology, resources',
      'How people behave, company values',
      'How customers see you, your advantage',
      'Customers, partners, investors',
      'Where you wan reach, your big plan'
    ],
    context: 'business areas',
    frameworkName: 'Akↄfa Business Way',
    roleDescription: 'a wise business advisor who helps businesses grow. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  },
  policy: {
    layers: ['People Wellbeing', 'Community Beliefs', 'Rules & Laws', 'Who Runs Things', 'What Data Shows'],
    descriptions: [
      'Health, welfare, how people dey generally',
      'Community beliefs, customs and ways',
      'Policies, regulations, how things should work',
      'Government, chiefs, who make decisions',
      'Research, evidence, what facts tell us'
    ],
    context: 'system areas',
    frameworkName: 'Akↄfa Policy Way',
    roleDescription: 'a wise systems advisor who helps understand communities and policies. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  }
};

export const getPurposeConfig = (purpose) => {
  return purposeLayerConfig[purpose] || purposeLayerConfig.personal;
};
