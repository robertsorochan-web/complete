import { translations, getCurrentLanguage } from './i18n';

const useCaseIcons = {
  fishing: '🐟',
  market: '🏪',
  farming: '🌾',
  education: '📚',
  transport: '🚌',
  foodService: '🍲',
  health: '❤️',
  relationships: '👨‍👩‍👧‍👦'
};

const useCaseCategories = {
  fishing: 'business',
  market: 'business',
  farming: 'business',
  education: 'personal',
  transport: 'business',
  foodService: 'business',
  health: 'personal',
  relationships: 'personal'
};

const defaultScores = {
  bioHardware: 5,
  internalOS: 5,
  culturalSoftware: 5,
  socialInstance: 5,
  consciousUser: 5
};

const layerLabelsData = {
  en: {
    fishing: {
      bioHardware: { name: 'Money & Equipment', desc: 'Boat, nets, fuel, capital you have', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, crew, family who help you', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you plan, track, and run things', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk to buyers, suppliers, and crew', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you want to take the business', icon: '🎯' }
    },
    market: {
      bioHardware: { name: 'Money & Stock', desc: 'Your capital, inventory, and shop space', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, apprentices, family who help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you buy, price, and sell goods', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk to customers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you want to take the business', icon: '🎯' }
    },
    farming: {
      bioHardware: { name: 'Money & Land', desc: 'Your capital, land, tools, and inputs', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, family, laborers who help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you plant, maintain, and harvest', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you connect with buyers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you want to take the farm', icon: '🎯' }
    },
    education: {
      bioHardware: { name: 'Money & Resources', desc: 'School fees, books, and learning materials', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Teachers, classmates, study group', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you study, practice, and revise', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you ask questions and get help', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'What you want to become after school', icon: '🎯' }
    },
    transport: {
      bioHardware: { name: 'Money & Vehicle', desc: 'Your capital, vehicle, and spare parts', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Drivers, helpers, mechanics who help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you manage routes and maintenance', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you handle passengers and station', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you want to take the business', icon: '🎯' }
    },
    foodService: {
      bioHardware: { name: 'Money & Kitchen', desc: 'Your capital, equipment, and ingredients', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Cooks, servers, and helpers', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you cook, serve, and manage stock', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you treat customers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you want to take the business', icon: '🎯' }
    },
    health: {
      bioHardware: { name: 'Money & Resources', desc: 'Healthcare costs, gym, healthy food', icon: '💰' },
      internalOS: { name: 'Your Support', desc: 'Family, friends, health workers who help', icon: '👥' },
      culturalSoftware: { name: 'Your Habits', desc: 'How you eat, sleep, and exercise', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk about health with others', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'The healthy life you want to live', icon: '🎯' }
    },
    relationships: {
      bioHardware: { name: 'Money & Home', desc: 'Family finances, home, and basic needs', icon: '💰' },
      internalOS: { name: 'Family Team', desc: 'How family members work together', icon: '👥' },
      culturalSoftware: { name: 'Family Rules', desc: 'How you handle decisions and conflicts', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How family members talk to each other', icon: '📱' },
      consciousUser: { name: 'Family Vision', desc: 'Where you want to see your family go', icon: '🎯' }
    }
  },
  fr: {
    fishing: {
      bioHardware: { name: 'Argent & Équipement', desc: 'Bateau, filets, carburant, capital disponible', icon: '💰' },
      internalOS: { name: 'Votre Équipe', desc: 'Travailleurs, équipage, famille qui vous aide', icon: '👥' },
      culturalSoftware: { name: 'Vos Systèmes', desc: 'Comment vous planifiez, suivez et gérez', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous parlez aux acheteurs, fournisseurs et équipage', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'Où vous voulez emmener l\'entreprise', icon: '🎯' }
    },
    market: {
      bioHardware: { name: 'Argent & Stock', desc: 'Votre capital, inventaire et espace boutique', icon: '💰' },
      internalOS: { name: 'Votre Équipe', desc: 'Travailleurs, apprentis, famille qui aide', icon: '👥' },
      culturalSoftware: { name: 'Vos Systèmes', desc: 'Comment vous achetez, fixez les prix et vendez', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous parlez aux clients et fournisseurs', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'Où vous voulez emmener l\'entreprise', icon: '🎯' }
    },
    farming: {
      bioHardware: { name: 'Argent & Terre', desc: 'Votre capital, terre, outils et intrants', icon: '💰' },
      internalOS: { name: 'Votre Équipe', desc: 'Travailleurs, famille, ouvriers qui aident', icon: '👥' },
      culturalSoftware: { name: 'Vos Systèmes', desc: 'Comment vous plantez, entretenez et récoltez', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous connectez avec acheteurs et fournisseurs', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'Où vous voulez emmener la ferme', icon: '🎯' }
    },
    education: {
      bioHardware: { name: 'Argent & Ressources', desc: 'Frais scolaires, livres et matériel d\'apprentissage', icon: '💰' },
      internalOS: { name: 'Votre Équipe', desc: 'Enseignants, camarades, groupe d\'étude', icon: '👥' },
      culturalSoftware: { name: 'Vos Systèmes', desc: 'Comment vous étudiez, pratiquez et révisez', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous posez des questions et obtenez de l\'aide', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'Ce que vous voulez devenir après l\'école', icon: '🎯' }
    },
    transport: {
      bioHardware: { name: 'Argent & Véhicule', desc: 'Votre capital, véhicule et pièces de rechange', icon: '💰' },
      internalOS: { name: 'Votre Équipe', desc: 'Chauffeurs, aides, mécaniciens qui aident', icon: '👥' },
      culturalSoftware: { name: 'Vos Systèmes', desc: 'Comment vous gérez les routes et l\'entretien', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous gérez passagers et station', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'Où vous voulez emmener l\'entreprise', icon: '🎯' }
    },
    foodService: {
      bioHardware: { name: 'Argent & Cuisine', desc: 'Votre capital, équipement et ingrédients', icon: '💰' },
      internalOS: { name: 'Votre Équipe', desc: 'Cuisiniers, serveurs et aides', icon: '👥' },
      culturalSoftware: { name: 'Vos Systèmes', desc: 'Comment vous cuisinez, servez et gérez le stock', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous traitez clients et fournisseurs', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'Où vous voulez emmener l\'entreprise', icon: '🎯' }
    },
    health: {
      bioHardware: { name: 'Argent & Ressources', desc: 'Coûts de santé, gym, nourriture saine', icon: '💰' },
      internalOS: { name: 'Votre Soutien', desc: 'Famille, amis, professionnels de santé qui aident', icon: '👥' },
      culturalSoftware: { name: 'Vos Habitudes', desc: 'Comment vous mangez, dormez et faites de l\'exercice', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment vous parlez de santé avec les autres', icon: '📱' },
      consciousUser: { name: 'Votre Vision', desc: 'La vie saine que vous voulez vivre', icon: '🎯' }
    },
    relationships: {
      bioHardware: { name: 'Argent & Maison', desc: 'Finances familiales, maison et besoins de base', icon: '💰' },
      internalOS: { name: 'Équipe Familiale', desc: 'Comment les membres de la famille travaillent ensemble', icon: '👥' },
      culturalSoftware: { name: 'Règles Familiales', desc: 'Comment vous gérez décisions et conflits', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'Comment les membres de la famille se parlent', icon: '📱' },
      consciousUser: { name: 'Vision Familiale', desc: 'Où vous voulez voir votre famille aller', icon: '🎯' }
    }
  },
  pcm: {
    fishing: {
      bioHardware: { name: 'Money & Equipment', desc: 'Boat, nets, fuel, capital wey you get', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, crew, family wey dey help you', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you plan, track, and run things', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk to buyers, suppliers, and crew', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    market: {
      bioHardware: { name: 'Money & Stock', desc: 'Your capital, inventory, and shop space', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, apprentices, family wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you buy, price, and sell goods', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk to customers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    farming: {
      bioHardware: { name: 'Money & Land', desc: 'Your capital, land, tools, and inputs', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Workers, family, laborers wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you plant, maintain, and harvest', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you connect with buyers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the farm', icon: '🎯' }
    },
    education: {
      bioHardware: { name: 'Money & Resources', desc: 'School fees, books, and learning materials', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Teachers, classmates, study group', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you study, practice, and revise', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you ask questions and get help', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Wetin you wan become after school', icon: '🎯' }
    },
    transport: {
      bioHardware: { name: 'Money & Vehicle', desc: 'Your capital, vehicle, and spare parts', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Drivers, mates, mechanics wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you manage routes and maintenance', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you handle passengers and station', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    foodService: {
      bioHardware: { name: 'Money & Kitchen', desc: 'Your capital, equipment, and ingredients', icon: '💰' },
      internalOS: { name: 'Your Team', desc: 'Cooks, servers, and helpers', icon: '👥' },
      culturalSoftware: { name: 'Your Systems', desc: 'How you cook, serve, and manage stock', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you treat customers and suppliers', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'Where you wan reach with the business', icon: '🎯' }
    },
    health: {
      bioHardware: { name: 'Money & Resources', desc: 'Healthcare costs, gym, healthy food', icon: '💰' },
      internalOS: { name: 'Your Support', desc: 'Family, friends, health workers wey dey help', icon: '👥' },
      culturalSoftware: { name: 'Your Habits', desc: 'How you chop, sleep, and exercise', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How you talk about health with others', icon: '📱' },
      consciousUser: { name: 'Your Vision', desc: 'The healthy life you wan live', icon: '🎯' }
    },
    relationships: {
      bioHardware: { name: 'Money & Home', desc: 'Family finances, home, and basic needs', icon: '💰' },
      internalOS: { name: 'Family Team', desc: 'How family members work together', icon: '👥' },
      culturalSoftware: { name: 'Family Rules', desc: 'How you handle decisions and wahala', icon: '⚙️' },
      socialInstance: { name: 'Communication', desc: 'How family members talk to each other', icon: '📱' },
      consciousUser: { name: 'Family Vision', desc: 'Where you wan see your family go', icon: '🎯' }
    }
  }
};

const localResourcesData = {
  fishing: [
    { name: 'Keta Fishermen Fuel Group', type: 'Cooperative', contact: 'Ask at Keta Landing Beach' },
    { name: 'Ghana Fisheries Commission', type: 'Government', contact: 'fishcom.gov.gh' },
    { name: 'Fishermen Association of Ghana', type: 'Association', contact: 'Local chapter at your beach' }
  ],
  market: [
    { name: 'Ghana National Association of Traders', type: 'Association', contact: 'GNAT office at Makola' },
    { name: 'Market Women Association', type: 'Association', contact: 'Your market queen mother' },
    { name: 'Microfinance Institutions', type: 'Finance', contact: 'Ask at your local bank' }
  ],
  farming: [
    { name: 'Farmers Association of Ghana', type: 'Association', contact: 'District Agriculture Office' },
    { name: 'Planting for Food and Jobs', type: 'Government', contact: 'MOFA district office' },
    { name: 'Agricultural Extension Officers', type: 'Government', contact: 'Your local agric office' }
  ],
  education: [
    { name: 'Ghana Scholarship Secretariat', type: 'Government', contact: 'scholarship.gov.gh' },
    { name: 'Student Loan Trust Fund', type: 'Government', contact: 'sltf.gov.gh' },
    { name: 'Youth Employment Agency', type: 'Government', contact: 'yea.gov.gh' }
  ],
  transport: [
    { name: 'GPRTU (Ghana Private Road Transport Union)', type: 'Union', contact: 'Local station chairman' },
    { name: 'Driver Vehicle Licensing Authority', type: 'Government', contact: 'dvla.gov.gh' },
    { name: 'Transport Cooperative Credit Union', type: 'Finance', contact: 'Ask at your station' }
  ],
  foodService: [
    { name: 'Ghana Tourism Authority', type: 'Government', contact: 'For food hygiene certification' },
    { name: 'Chop Bar Operators Association', type: 'Association', contact: 'Ask at your market' },
    { name: 'Food & Drugs Authority', type: 'Government', contact: 'fdaghana.gov.gh' }
  ],
  health: [
    { name: 'National Health Insurance Authority', type: 'Government', contact: 'nhis.gov.gh' },
    { name: 'Ghana Health Service', type: 'Government', contact: 'Your local health center' },
    { name: 'Mental Health Authority', type: 'Government', contact: 'mentalhealthghana.org' }
  ],
  relationships: [
    { name: 'Department of Social Welfare', type: 'Government', contact: 'Your district office' },
    { name: 'FIDA Ghana (Federation of Women Lawyers)', type: 'NGO', contact: 'fidaghana.org' },
    { name: 'Marriage counselors', type: 'Service', contact: 'Ask at your church/mosque' }
  ]
};

export const getUseCaseTemplates = (lang = null) => {
  const currentLang = lang || getCurrentLanguage();
  const t = translations[currentLang] || translations.en;
  const templates = t.useCaseTemplates || translations.en.useCaseTemplates;
  const labels = layerLabelsData[currentLang] || layerLabelsData.en;
  
  const result = {};
  Object.keys(templates).forEach(key => {
    const template = templates[key];
    const templateLabels = labels[key] || layerLabelsData.en[key] || {};
    
    result[key] = {
      id: key,
      name: template.name,
      icon: useCaseIcons[key] || '📋',
      description: template.description,
      category: useCaseCategories[key] || 'business',
      examples: template.examples || [],
      defaultScores: { ...defaultScores },
      layerLabels: templateLabels,
      localResources: localResourcesData[key] || [],
      tips: template.tips || []
    };
  });
  
  return result;
};

export const useCaseTemplates = getUseCaseTemplates();

export const getUseCaseTemplate = (templateId, lang = null) => {
  const templates = getUseCaseTemplates(lang);
  return templates[templateId] || null;
};

export const getUseCasesByCategory = (category, lang = null) => {
  const templates = getUseCaseTemplates(lang);
  return Object.values(templates).filter(t => t.category === category);
};

export const getAllUseCases = (lang = null) => {
  const templates = getUseCaseTemplates(lang);
  return Object.values(templates);
};

export const getScoreEmoji = (score) => {
  if (score <= 2) return '😰';
  if (score <= 4) return '😕';
  if (score <= 6) return '😐';
  if (score <= 8) return '🙂';
  return '😊';
};

export const getScoreLabel = (score, lang = null) => {
  const currentLang = lang || getCurrentLanguage();
  const t = translations[currentLang] || translations.en;
  const labels = t.scoreLabels || translations.en.scoreLabels;
  
  if (score <= 2) return labels.critical || 'Critical';
  if (score <= 4) return labels.needsWork || 'Needs Work';
  if (score <= 6) return labels.okay || 'Okay';
  if (score <= 8) return labels.good || 'Good';
  return labels.excellent || 'Excellent';
};
