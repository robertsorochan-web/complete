import { getCurrentLanguage } from './i18n';

const ghanaResourcesData = {
  cooperatives: [
    {
      name: 'Keta Fishermen Fuel Cooperative',
      sector: 'fishing',
      region: 'Volta',
      description: {
        en: 'Group that buys fuel together to get better prices',
        fr: 'Groupe qui achète du carburant ensemble pour obtenir de meilleurs prix',
        pcm: 'Group wey buy fuel together to get better price'
      },
      contact: 'Ask at Keta Landing Beach'
    },
    {
      name: 'Asafo Market Traders Association',
      sector: 'market',
      region: 'Ashanti',
      description: {
        en: 'Traders who support each other with credit and bulk buying',
        fr: 'Commerçants qui s\'entraident avec le crédit et les achats en gros',
        pcm: 'Traders wey support each other with credit and bulk buying'
      },
      contact: 'Asafo Market Office'
    },
    {
      name: 'Farmers Cooperative Credit Union',
      sector: 'farming',
      region: 'National',
      description: {
        en: 'Savings and loans for farmers',
        fr: 'Épargne et prêts pour les agriculteurs',
        pcm: 'Savings and loans for farmers'
      },
      contact: 'fccu.gh or local branch'
    },
    {
      name: 'GPRTU Savings Scheme',
      sector: 'transport',
      region: 'National',
      description: {
        en: 'Transport workers savings and support',
        fr: 'Épargne et soutien des travailleurs du transport',
        pcm: 'Transport workers savings and support'
      },
      contact: 'Your local station'
    }
  ],
  
  associations: [
    {
      name: 'Ghana National Association of Traders (GNAT)',
      sector: 'market',
      region: 'National',
      description: {
        en: 'Support and advocacy for traders',
        fr: 'Soutien et plaidoyer pour les commerçants',
        pcm: 'Support and advocacy for traders'
      },
      contact: 'Makola Market HQ'
    },
    {
      name: 'Fishermen Association of Ghana',
      sector: 'fishing',
      region: 'National',
      description: {
        en: 'Voice of fishermen across Ghana',
        fr: 'Voix des pêcheurs à travers le Ghana',
        pcm: 'Voice of fishermen across Ghana'
      },
      contact: 'Tema, Elmina, Keta chapters'
    },
    {
      name: 'Farmers Association of Ghana',
      sector: 'farming',
      region: 'National',
      description: {
        en: 'Collective voice for farmers',
        fr: 'Voix collective des agriculteurs',
        pcm: 'Collective voice for farmers'
      },
      contact: 'District Agriculture Office'
    },
    {
      name: 'Chop Bar Operators Association',
      sector: 'foodService',
      region: 'National',
      description: {
        en: 'Support for food business owners',
        fr: 'Soutien aux propriétaires d\'entreprises alimentaires',
        pcm: 'Support for food business owners'
      },
      contact: 'Your local market'
    }
  ],
  
  governmentPrograms: [
    {
      name: 'Planting for Food and Jobs',
      sector: 'farming',
      description: {
        en: 'Government support for farmers with inputs and training',
        fr: 'Soutien gouvernemental aux agriculteurs avec intrants et formation',
        pcm: 'Government support for farmers with inputs and training'
      },
      contact: 'MOFA District Office',
      website: 'mofa.gov.gh'
    },
    {
      name: 'National Health Insurance Scheme (NHIS)',
      sector: 'health',
      description: {
        en: 'Affordable healthcare for all Ghanaians',
        fr: 'Soins de santé abordables pour tous les Ghanéens',
        pcm: 'Affordable healthcare for all Ghanaians'
      },
      contact: 'Any NHIS office',
      website: 'nhis.gov.gh'
    },
    {
      name: 'Ghana Scholarship Secretariat',
      sector: 'education',
      description: {
        en: 'Scholarships for Ghanaian students',
        fr: 'Bourses pour les étudiants ghanéens',
        pcm: 'Scholarships for Ghanaian students'
      },
      contact: 'scholarship.gov.gh',
      website: 'scholarship.gov.gh'
    },
    {
      name: 'Youth Employment Agency',
      sector: 'employment',
      description: {
        en: 'Jobs and training for young Ghanaians',
        fr: 'Emplois et formation pour les jeunes Ghanéens',
        pcm: 'Jobs and training for young Ghanaians'
      },
      contact: 'yea.gov.gh',
      website: 'yea.gov.gh'
    },
    {
      name: 'Microfinance and Small Loans Centre (MASLOC)',
      sector: 'business',
      description: {
        en: 'Small loans for business people',
        fr: 'Petits prêts pour les entrepreneurs',
        pcm: 'Small loans for business people'
      },
      contact: 'masloc.gov.gh',
      website: 'masloc.gov.gh'
    }
  ],
  
  microfinance: [
    {
      name: 'Fidelity Bank SME Account',
      sector: 'business',
      description: {
        en: 'Special accounts for small business',
        fr: 'Comptes spéciaux pour petites entreprises',
        pcm: 'Special accounts for small business'
      },
      contact: 'Any Fidelity Bank branch'
    },
    {
      name: 'GCB SME Loans',
      sector: 'business',
      description: {
        en: 'Loans for small and medium businesses',
        fr: 'Prêts pour petites et moyennes entreprises',
        pcm: 'Loans for small and medium businesses'
      },
      contact: 'Any GCB branch'
    },
    {
      name: 'Ecobank Express Point',
      sector: 'business',
      description: {
        en: 'Easy banking for traders',
        fr: 'Banque facile pour les commerçants',
        pcm: 'Easy banking for traders'
      },
      contact: 'Ecobank agents nationwide'
    },
    {
      name: 'MTN MoMo Business',
      sector: 'business',
      description: {
        en: 'Mobile money for business payments',
        fr: 'Argent mobile pour les paiements commerciaux',
        pcm: 'Mobile money for business payments'
      },
      contact: '*170#'
    }
  ],
  
  emergencyContacts: [
    { 
      name: { en: 'Police Emergency', fr: 'Police Urgence', pcm: 'Police Emergency' },
      number: '191', 
      description: { en: 'For crime and emergencies', fr: 'Pour crimes et urgences', pcm: 'For crime and emergencies' }
    },
    { 
      name: { en: 'Fire Service', fr: 'Pompiers', pcm: 'Fire Service' },
      number: '192', 
      description: { en: 'For fire emergencies', fr: 'Pour urgences incendie', pcm: 'For fire emergencies' }
    },
    { 
      name: { en: 'Ambulance', fr: 'Ambulance', pcm: 'Ambulance' },
      number: '193', 
      description: { en: 'For medical emergencies', fr: 'Pour urgences médicales', pcm: 'For medical emergencies' }
    },
    { 
      name: { en: 'Ghana Meteorological Agency', fr: 'Agence Météorologique du Ghana', pcm: 'Ghana Meteorological Agency' },
      number: '', 
      description: { en: 'meteo.gov.gh for weather alerts', fr: 'meteo.gov.gh pour alertes météo', pcm: 'meteo.gov.gh for weather alerts' }
    },
    { 
      name: { en: 'NADMO Disaster Hotline', fr: 'Ligne d\'Urgence Catastrophe NADMO', pcm: 'NADMO Disaster Hotline' },
      number: '112', 
      description: { en: 'For natural disasters', fr: 'Pour catastrophes naturelles', pcm: 'For natural disasters' }
    }
  ]
};

const getLocalizedDescription = (item, lang) => {
  if (typeof item.description === 'object') {
    return item.description[lang] || item.description.en || '';
  }
  return item.description || '';
};

const getLocalizedName = (item, lang) => {
  if (typeof item.name === 'object') {
    return item.name[lang] || item.name.en || '';
  }
  return item.name || '';
};

export const getLocalResources = (lang = null) => {
  const currentLang = lang || getCurrentLanguage();
  
  return {
    cooperatives: ghanaResourcesData.cooperatives.map(item => ({
      ...item,
      description: getLocalizedDescription(item, currentLang)
    })),
    associations: ghanaResourcesData.associations.map(item => ({
      ...item,
      description: getLocalizedDescription(item, currentLang)
    })),
    governmentPrograms: ghanaResourcesData.governmentPrograms.map(item => ({
      ...item,
      description: getLocalizedDescription(item, currentLang)
    })),
    microfinance: ghanaResourcesData.microfinance.map(item => ({
      ...item,
      description: getLocalizedDescription(item, currentLang)
    })),
    emergencyContacts: ghanaResourcesData.emergencyContacts.map(item => ({
      name: getLocalizedName(item, currentLang),
      number: item.number,
      description: getLocalizedDescription(item, currentLang)
    }))
  };
};

export const ghanaLocalResources = getLocalResources();

export const getResourcesBySector = (sector, lang = null) => {
  const resources = getLocalResources(lang);
  return {
    cooperatives: resources.cooperatives.filter(r => r.sector === sector || r.sector === 'all'),
    associations: resources.associations.filter(r => r.sector === sector || r.sector === 'all'),
    government: resources.governmentPrograms.filter(r => r.sector === sector || r.sector === 'all' || r.sector === 'business'),
    finance: resources.microfinance
  };
};

export const getAllEmergencyContacts = (lang = null) => {
  const resources = getLocalResources(lang);
  return resources.emergencyContacts;
};
