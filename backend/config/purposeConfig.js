export const purposeLayerConfig = {
  personal: {
    layers: ['Environment', 'Body & Health', 'Inner Beliefs', 'Values & Worldview', 'Daily Life', 'Self-Awareness', 'Life Purpose'],
    descriptions: [
      'Your physical and digital surroundings - where you live and work',
      'Sleep, exercise, chop, your energy levels',
      'What you tell yourself, confidence, inner peace',
      'The things wey matter to you, your beliefs',
      'Family, friends, community around you',
      'Knowing yourself well, making wise choices',
      'Why you dey here, your bigger purpose for life'
    ],
    layerKeys: ['environmentalMatrix', 'bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser', 'existentialContext'],
    context: 'life areas',
    frameworkName: 'Akↄfa 7-Layer Stack',
    roleDescription: 'a wise friend who understands life and helps you see things clearly. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  },
  team: {
    layers: ['Work Environment', 'Team Strength', 'Team Spirit', 'How We Work', 'Team Vibes', 'Clear Direction', 'Team Purpose'],
    descriptions: [
      'The office, tools, and spaces where the team works',
      'Energy, capacity, are people tired or fresh?',
      'Trust, respect, people feel safe to talk true',
      'Processes, tools, how una dey do things',
      'How people relate and settle wahala',
      'Everyone know where we dey go and why',
      'The bigger mission wey bring everyone together'
    ],
    layerKeys: ['environmentalMatrix', 'bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser', 'existentialContext'],
    context: 'team areas',
    frameworkName: 'Akↄfa Team 7-Layer Stack',
    roleDescription: 'a wise team advisor who helps teams work better together. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  },
  business: {
    layers: ['Market Environment', 'Business Foundation', 'Company Way', 'Market Position', 'Your Network', 'Vision & Strategy', 'Business Mission'],
    descriptions: [
      'The economy, industry, and market conditions around you',
      'Money, equipment, technology, resources',
      'How people behave, company values',
      'How customers see you, your advantage',
      'Customers, partners, investors',
      'Where you wan reach, your big plan',
      'Why this business exist for the world'
    ],
    layerKeys: ['environmentalMatrix', 'bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser', 'existentialContext'],
    context: 'business areas',
    frameworkName: 'Akↄfa Business 7-Layer Stack',
    roleDescription: 'a wise business advisor who helps businesses grow. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  },
  policy: {
    layers: ['Physical Environment', 'People Wellbeing', 'Community Beliefs', 'Rules & Laws', 'Who Runs Things', 'What Data Shows', 'Greater Good'],
    descriptions: [
      'Geography, climate, infrastructure, natural resources',
      'Health, welfare, how people dey generally',
      'Community beliefs, customs and ways',
      'Policies, regulations, how things should work',
      'Government, chiefs, who make decisions',
      'Research, evidence, what facts tell us',
      'The larger purpose for society and future generations'
    ],
    layerKeys: ['environmentalMatrix', 'bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser', 'existentialContext'],
    context: 'system areas',
    frameworkName: 'Akↄfa Policy 7-Layer Stack',
    roleDescription: 'a wise systems advisor who helps understand communities and policies. You speak simply like someone from West Africa would - warm, direct, and practical. Use everyday words, not big grammar.'
  }
};

export const layerInteractions = {
  environmentToBio: 'Pollution → Health issues, Nature access → Wellness',
  bioToInternalOS: 'Sleep deprivation → Anxiety, Good nutrition → Mental clarity',
  internalOSToCultural: 'Beliefs filter cultural messages, Trauma shapes cultural absorption',
  culturalToSocial: 'Cultural norms dictate social behaviors, Values shape relationships',
  socialToConscious: 'Social feedback influences self-awareness, Relationships trigger reflection',
  consciousToExistential: 'Awareness enables meaning-making, Choice aligns with purpose',
  existentialToEnvironment: 'Purpose shapes environmental choices, Meaning transforms spaces'
};

export const geographicCureSafeguards = {
  warning: 'Changing locations solves only 20% of problems long-term',
  privilegeAcknowledgment: 'Recognize: 80% of humans cannot choose their environment',
  adaptationFirst: 'Try micro-changes before major moves',
  carryTest: 'Will this problem follow me? If yes → Not environment issue'
};

export const diagnosticAlgorithm = {
  carryTestLogic: (problemWouldFollow) => {
    if (problemWouldFollow) {
      return {
        action: 'DO NOT change environment',
        reason: 'Problem will follow you',
        actualFocus: 'Internal OS layer debugging'
      };
    }
    return {
      action: 'Environmental change may help',
      reason: 'Problem is genuinely environmental',
      actualFocus: 'Environmental Matrix optimization'
    };
  },
  
  solutionPriority: [
    '1. Conscious User awareness of environmental reactions',
    '2. Internal OS examination of environmental interpretations',
    '3. Cultural Software debugging of environmental values',
    '4. Social Instance adjustment of environmental relationships',
    '5. Bio-Hardware optimization for environmental resilience',
    '6. Environmental meaning assignment (Existential Context)',
    '7. LAST: Actual environmental modifications'
  ]
};

export const getPurposeConfig = (purpose) => {
  return purposeLayerConfig[purpose] || purposeLayerConfig.personal;
};
