export const ghanaLocalResources = {
  cooperatives: [
    {
      name: 'Keta Fishermen Fuel Cooperative',
      sector: 'fishing',
      region: 'Volta',
      description: 'Group wey buy fuel together to get better price',
      contact: 'Ask at Keta Landing Beach'
    },
    {
      name: 'Asafo Market Traders Association',
      sector: 'market',
      region: 'Ashanti',
      description: 'Traders wey support each other with credit and bulk buying',
      contact: 'Asafo Market Office'
    },
    {
      name: 'Farmers Cooperative Credit Union',
      sector: 'farming',
      region: 'National',
      description: 'Savings and loans for farmers',
      contact: 'fccu.gh or local branch'
    },
    {
      name: 'GPRTU Savings Scheme',
      sector: 'transport',
      region: 'National',
      description: 'Transport workers savings and support',
      contact: 'Your local station'
    }
  ],
  
  associations: [
    {
      name: 'Ghana National Association of Traders (GNAT)',
      sector: 'market',
      region: 'National',
      description: 'Support and advocacy for traders',
      contact: 'Makola Market HQ'
    },
    {
      name: 'Fishermen Association of Ghana',
      sector: 'fishing',
      region: 'National',
      description: 'Voice of fishermen across Ghana',
      contact: 'Tema, Elmina, Keta chapters'
    },
    {
      name: 'Farmers Association of Ghana',
      sector: 'farming',
      region: 'National',
      description: 'Collective voice for farmers',
      contact: 'District Agriculture Office'
    },
    {
      name: 'Chop Bar Operators Association',
      sector: 'foodService',
      region: 'National',
      description: 'Support for food business owners',
      contact: 'Your local market'
    }
  ],
  
  governmentPrograms: [
    {
      name: 'Planting for Food and Jobs',
      sector: 'farming',
      description: 'Government support for farmers with inputs and training',
      contact: 'MOFA District Office',
      website: 'mofa.gov.gh'
    },
    {
      name: 'National Health Insurance Scheme (NHIS)',
      sector: 'health',
      description: 'Affordable healthcare for all Ghanaians',
      contact: 'Any NHIS office',
      website: 'nhis.gov.gh'
    },
    {
      name: 'Ghana Scholarship Secretariat',
      sector: 'education',
      description: 'Scholarships for Ghanaian students',
      contact: 'scholarship.gov.gh',
      website: 'scholarship.gov.gh'
    },
    {
      name: 'Youth Employment Agency',
      sector: 'employment',
      description: 'Jobs and training for young Ghanaians',
      contact: 'yea.gov.gh',
      website: 'yea.gov.gh'
    },
    {
      name: 'Microfinance and Small Loans Centre (MASLOC)',
      sector: 'business',
      description: 'Small loans for business people',
      contact: 'masloc.gov.gh',
      website: 'masloc.gov.gh'
    }
  ],
  
  microfinance: [
    {
      name: 'Fidelity Bank SME Account',
      sector: 'business',
      description: 'Special accounts for small business',
      contact: 'Any Fidelity Bank branch'
    },
    {
      name: 'GCB SME Loans',
      sector: 'business',
      description: 'Loans for small and medium businesses',
      contact: 'Any GCB branch'
    },
    {
      name: 'Ecobank Express Point',
      sector: 'business',
      description: 'Easy banking for traders',
      contact: 'Ecobank agents nationwide'
    },
    {
      name: 'MTN MoMo Business',
      sector: 'business',
      description: 'Mobile money for business payments',
      contact: '*170#'
    }
  ],
  
  emergencyContacts: [
    { name: 'Police Emergency', number: '191', description: 'For crime and emergencies' },
    { name: 'Fire Service', number: '192', description: 'For fire emergencies' },
    { name: 'Ambulance', number: '193', description: 'For medical emergencies' },
    { name: 'Ghana Meteorological Agency', number: '', description: 'meteo.gov.gh for weather alerts' },
    { name: 'NADMO Disaster Hotline', number: '112', description: 'For natural disasters' }
  ]
};

export const getResourcesBySector = (sector) => {
  const resources = {
    cooperatives: ghanaLocalResources.cooperatives.filter(r => r.sector === sector || r.sector === 'all'),
    associations: ghanaLocalResources.associations.filter(r => r.sector === sector || r.sector === 'all'),
    government: ghanaLocalResources.governmentPrograms.filter(r => r.sector === sector || r.sector === 'all' || r.sector === 'business'),
    finance: ghanaLocalResources.microfinance
  };
  return resources;
};

export const getAllEmergencyContacts = () => {
  return ghanaLocalResources.emergencyContacts;
};
