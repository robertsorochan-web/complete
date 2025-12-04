export const successStories = [
  {
    id: 1,
    name: 'Auntie Ama',
    location: 'Accra',
    business: 'Chop Bar',
    image: '👩‍🍳',
    problem: 'Sales dey drop every month. She try new menu, social media - nothing work.',
    discovery: 'Akↄfa show her say Money & Systems score low (3/10). She no dey track expenses proper.',
    action: 'She start write down everything she buy and sell. Found out some dishes dey waste money.',
    result: 'After 2 months, profit increase by 40%. Now she know exactly which dishes make money.',
    quote: '"I no know say simple record keeping fit change everything. Now I dey control my business, e no dey control me."',
    category: 'business'
  },
  {
    id: 2,
    name: 'Kofi',
    location: 'Tema',
    business: 'Fishing',
    image: '🎣',
    problem: 'Catch dey reduce, fuel cost high. Other fishermen seem do better.',
    discovery: 'Akↄfa show Communication score low (4/10). He no dey talk to other fishermen about where fish dey.',
    action: 'He join fishermen WhatsApp group, start share information about fish location.',
    result: 'Catch improve by 30%. Fuel cost drop because he know where to go.',
    quote: '"Before I think say competition mean keep secrets. Now I see say sharing help everybody."',
    category: 'business'
  },
  {
    id: 3,
    name: 'Adwoa',
    location: 'Kumasi',
    business: 'Market Trading',
    image: '🏪',
    problem: 'Stress too much. Business good but she no dey happy. Health dey suffer.',
    discovery: 'Akↄfa show Team score very low (2/10). She dey do everything alone.',
    action: 'She train one niece to help, join traders association for support.',
    result: 'Now she get time for herself. Health improve, business still grow.',
    quote: '"I learn say success no mean doing everything yourself. Now I get help and I dey happier."',
    category: 'personal'
  },
  {
    id: 4,
    name: 'Samuel',
    location: 'Tamale',
    business: 'Farming',
    image: '🌾',
    problem: 'Harvest dey fail every other season. Same land, same effort, different results.',
    discovery: 'Akↄfa show Systems score low (3/10). He no dey plan planting with weather.',
    action: 'He start track weather, plant at right time, join farmer group for advice.',
    result: 'Last 3 harvests all successful. Income stable now.',
    quote: '"Small planning make big difference. Now I work with nature, not against am."',
    category: 'business'
  },
  {
    id: 5,
    name: 'Grace',
    location: 'Cape Coast',
    business: 'Education',
    image: '📚',
    problem: 'Studies hard, grades no dey improve. She dey think say she no smart enough.',
    discovery: 'Akↄfa show Communication low (4/10). She no dey ask questions when she no understand.',
    action: 'She form study group, start ask teachers questions, use YouTube for extra learning.',
    result: 'Grades improve from C to B+. Confidence come back.',
    quote: '"The problem no be my brain - e be how I dey study. Now I know say asking for help be strength, not weakness."',
    category: 'personal'
  },
  {
    id: 6,
    name: 'Ernest',
    location: 'Takoradi',
    business: 'Transport (Trotro)',
    image: '🚌',
    problem: 'Vehicle dey break down plenty. Money dey go to repairs instead of pocket.',
    discovery: 'Akↄfa show Money & Equipment score low (3/10). No maintenance schedule.',
    action: 'He start regular servicing, save for repairs, track fuel and maintenance costs.',
    result: 'Breakdowns reduce by 70%. More days on the road, more money.',
    quote: '"Prevention better than cure. Small maintenance money save me plenty repair money."',
    category: 'business'
  },
  {
    id: 7,
    name: 'Mercy & Kwame',
    location: 'Accra',
    business: 'Marriage',
    image: '💑',
    problem: 'Arguments plenty, no dey understand each other. Marriage dey struggle.',
    discovery: 'Akↄfa show Communication score very low (2/10) for both of them.',
    action: 'They start weekly "talk time" - no phones, just talking and listening.',
    result: 'Arguments reduce, understanding improve. Marriage dey stronger now.',
    quote: '"We dey live together but we no dey talk. Now we understand say communication be the foundation."',
    category: 'personal'
  },
  {
    id: 8,
    name: 'Yaw',
    location: 'Ho',
    business: 'Personal Health',
    image: '💪',
    problem: 'Always tired, no energy for work. Doctor say nothing wrong.',
    discovery: 'Akↄfa show Body & Health score low (4/10). Sleep patterns bad, no exercise.',
    action: 'He start sleep same time every day, walk 30 minutes morning.',
    result: 'Energy level improve after 3 weeks. Work productivity double.',
    quote: '"I no think say simple habits fit change how I feel. Now I understand why dem dey say health be wealth."',
    category: 'personal'
  }
];

export const getStoriesByCategory = (category) => {
  if (category === 'all') return successStories;
  return successStories.filter(story => story.category === category);
};

export const getRandomStories = (count = 3) => {
  const shuffled = [...successStories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getStoryById = (id) => {
  return successStories.find(story => story.id === id);
};
