export const useCaseTemplates = {
  fishing: {
    id: 'fishing',
    name: 'Fishing Business',
    icon: '🐟',
    description: 'For fishermen, fish traders, and fishing cooperatives',
    category: 'business',
    examples: ['Catch dey low', 'Fuel cost too much', 'Market price wahala', 'Boat maintenance'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Equipment', desc: 'Boat, nets, fuel, capital wey you get', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, crew, family wey dey help you', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you plan, track, and run things', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk to buyers, suppliers, and crew', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    localResources: [
      { name: 'Keta Fishermen Fuel Group', type: 'Cooperative', contact: 'Ask at Keta Landing Beach' },
      { name: 'Ghana Fisheries Commission', type: 'Government', contact: 'fishcom.gov.gh' },
      { name: 'Fishermen Association of Ghana', type: 'Association', contact: 'Local chapter at your beach' }
    ],
    tips: [
      'Track your daily catch and expenses for one week',
      'Join or form cooperative to buy fuel together',
      'Plan your fishing based on weather and fish seasons',
      'Save small small for boat repairs'
    ]
  },
  market: {
    id: 'market',
    name: 'Market Business',
    icon: '🏪',
    description: 'For traders, market women, shop owners',
    category: 'business',
    examples: ['Customers no dey come', 'Stock wahala', 'Competition plenty', 'Rent too high'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Stock', desc: 'Your capital, inventory, and shop space', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, apprentices, family wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you buy, price, and sell goods', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk to customers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    localResources: [
      { name: 'Ghana National Association of Traders', type: 'Association', contact: 'GNAT office at Makola' },
      { name: 'Market Women Association', type: 'Association', contact: 'Your market queen mother' },
      { name: 'Microfinance Institutions', type: 'Finance', contact: 'Ask at your local bank' }
    ],
    tips: [
      'Keep record of what you buy and sell every day',
      'Know your best-selling items and stock more',
      'Treat customers well - they go bring their friends',
      'Join susu group to save for bulk buying'
    ]
  },
  farming: {
    id: 'farming',
    name: 'Farming Business',
    icon: '🌾',
    description: 'For farmers, agribusiness, and agricultural workers',
    category: 'business',
    examples: ['Harvest no dey good', 'Rain wahala', 'Price too low', 'Laborers scarce'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Land', desc: 'Your capital, land, tools, and inputs', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, family, laborers wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you plant, maintain, and harvest', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you connect with buyers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the farm', icon: '🎯' }
    },
    localResources: [
      { name: 'Farmers Association of Ghana', type: 'Association', contact: 'District Agriculture Office' },
      { name: 'Planting for Food and Jobs', type: 'Government', contact: 'MOFA district office' },
      { name: 'Agricultural Extension Officers', type: 'Government', contact: 'Your local agric office' }
    ],
    tips: [
      'Plan your planting with the weather seasons',
      'Join farmer group to buy inputs cheaper',
      'Record what you plant and harvest each season',
      'Try new crops small small - dont bet everything'
    ]
  },
  education: {
    id: 'education',
    name: 'Education & Learning',
    icon: '📚',
    description: 'For students, teachers, schools, and training centers',
    category: 'personal',
    examples: ['Studies hard', 'School fees wahala', 'Time management', 'Motivation low'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Resources', desc: 'School fees, books, and learning materials', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Teachers, classmates, study group', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you study, practice, and revise', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you ask questions and get help', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'What you wan become after school', icon: '🎯' }
    },
    localResources: [
      { name: 'Ghana Scholarship Secretariat', type: 'Government', contact: 'scholarship.gov.gh' },
      { name: 'Student Loan Trust Fund', type: 'Government', contact: 'sltf.gov.gh' },
      { name: 'Youth Employment Agency', type: 'Government', contact: 'yea.gov.gh' }
    ],
    tips: [
      'Study same time every day - consistency matters',
      'Form study group with serious classmates',
      'Ask questions when you no understand',
      'Connect what you learn to real life'
    ]
  },
  transport: {
    id: 'transport',
    name: 'Transport Business',
    icon: '🚌',
    description: 'For trotro drivers, taxi owners, and transport operators',
    category: 'business',
    examples: ['Fuel cost high', 'Vehicle breakdown', 'Passengers scarce', 'Competition plenty'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Vehicle', desc: 'Your capital, vehicle, and spare parts', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Drivers, mates, mechanics wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you manage routes and maintenance', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you handle passengers and station', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    localResources: [
      { name: 'GPRTU (Ghana Private Road Transport Union)', type: 'Union', contact: 'Local station chairman' },
      { name: 'Driver Vehicle Licensing Authority', type: 'Government', contact: 'dvla.gov.gh' },
      { name: 'Transport Cooperative Credit Union', type: 'Finance', contact: 'Ask at your station' }
    ],
    tips: [
      'Service vehicle regularly - prevention better than cure',
      'Track your daily income and fuel costs',
      'Join transport union for protection',
      'Save for vehicle replacement or second car'
    ]
  },
  foodService: {
    id: 'foodService',
    name: 'Chop Bar / Food Business',
    icon: '🍲',
    description: 'For chop bars, restaurants, food vendors, and caterers',
    category: 'business',
    examples: ['Customers reduce', 'Food cost high', 'Workers wahala', 'Location problem'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Kitchen', desc: 'Your capital, equipment, and ingredients', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Cooks, servers, and helpers', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you cook, serve, and manage stock', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you treat customers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    localResources: [
      { name: 'Ghana Tourism Authority', type: 'Government', contact: 'For food hygiene certification' },
      { name: 'Chop Bar Operators Association', type: 'Association', contact: 'Ask at your market' },
      { name: 'Food & Drugs Authority', type: 'Government', contact: 'fdaghana.gov.gh' }
    ],
    tips: [
      'Keep your kitchen clean - customers dey watch',
      'Know your best-selling dishes and prepare them well',
      'Buy ingredients early morning for fresh prices',
      'Treat regular customers special - they bring others'
    ]
  },
  health: {
    id: 'health',
    name: 'Health & Wellness',
    icon: '❤️',
    description: 'For personal health improvement and wellness',
    category: 'personal',
    examples: ['Sleep wahala', 'Stress too much', 'Body weak', 'Weight concerns'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Resources', desc: 'Healthcare costs, gym, healthy food', icon: '💰' },
      internalOS: { name: 'Your Support', desc: 'Family, friends, health workers wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Habits', desc: 'How you eat, sleep, and exercise', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk about health with others', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'The healthy life you wan live', icon: '🎯' }
    },
    localResources: [
      { name: 'National Health Insurance Authority', type: 'Government', contact: 'nhis.gov.gh' },
      { name: 'Ghana Health Service', type: 'Government', contact: 'Your local health center' },
      { name: 'Mental Health Authority', type: 'Government', contact: 'mentalhealthghana.org' }
    ],
    tips: [
      'Sleep 7-8 hours - your body need am',
      'Walk for 30 minutes every day',
      'Eat more vegetables and fruits',
      'Drink plenty water throughout the day'
    ]
  },
  relationships: {
    id: 'relationships',
    name: 'Relationships & Family',
    icon: '👨‍👩‍👧‍👦',
    description: 'For marriage, family, and relationship improvement',
    category: 'personal',
    examples: ['Communication wahala', 'Trust issues', 'In-law problems', 'Parenting stress'],
    defaultScores: {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    },
    layerLabels: {
      bioHardware: { name: 'Money & Home', desc: 'Family finances, home, and basic needs', icon: '💰' },
      internalOS: { name: 'Family Team', desc: 'How family members work together', icon: '👥' },
      culturalSoftware: { name: 'Family Rules', desc: 'How you handle decisions and conflicts', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How family members talk to each other', icon: '📱' },
      consciousUser: { name: 'Family Vision', desc: 'Where you wan see your family go', icon: '🎯' }
    },
    localResources: [
      { name: 'Department of Social Welfare', type: 'Government', contact: 'Your district office' },
      { name: 'FIDA Ghana (Federation of Women Lawyers)', type: 'NGO', contact: 'fidaghana.org' },
      { name: 'Marriage counselors', type: 'Service', contact: 'Ask at your church/mosque' }
    ],
    tips: [
      'Talk to your partner every day - even if e short',
      'Listen more than you talk when there be wahala',
      'Plan family time together every week',
      'Respect each other even when you disagree'
    ]
  }
};

export const getUseCaseTemplate = (templateId) => {
  return useCaseTemplates[templateId] || null;
};

export const getUseCasesByCategory = (category) => {
  return Object.values(useCaseTemplates).filter(t => t.category === category);
};

export const getAllUseCases = () => {
  return Object.values(useCaseTemplates);
};

export const getScoreEmoji = (score) => {
  if (score <= 2) return '😰';
  if (score <= 4) return '😕';
  if (score <= 6) return '😐';
  if (score <= 8) return '🙂';
  return '😊';
};

export const getScoreLabel = (score) => {
  if (score <= 2) return 'Critical';
  if (score <= 4) return 'Needs Work';
  if (score <= 6) return 'Okay';
  if (score <= 8) return 'Good';
  return 'Excellent';
};
