import { translations, getCurrentLanguage } from './i18n';

const storyIcons = {
  story1: '👩‍🍳',
  story2: '🎣',
  story3: '🏪'
};

const storyCategories = {
  story1: 'business',
  story2: 'business',
  story3: 'personal'
};

export const getSuccessStories = (lang = null) => {
  const currentLang = lang || getCurrentLanguage();
  const t = translations[currentLang] || translations.en;
  const stories = t.successStories || translations.en.successStories;
  
  return Object.keys(stories).map((storyKey, index) => {
    const story = stories[storyKey];
    return {
      id: index + 1,
      name: story.name,
      location: story.location,
      business: story.business,
      image: storyIcons[storyKey] || '👤',
      problem: story.problem,
      discovery: story.discovery,
      action: story.action,
      result: story.result,
      quote: story.quote,
      category: storyCategories[storyKey] || 'personal'
    };
  });
};

export const successStories = getSuccessStories();

export const getStoriesByCategory = (category, lang = null) => {
  const stories = getSuccessStories(lang);
  if (category === 'all') return stories;
  return stories.filter(story => story.category === category);
};

export const getRandomStories = (count = 3, lang = null) => {
  const stories = getSuccessStories(lang);
  const shuffled = [...stories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getStoryById = (id, lang = null) => {
  const stories = getSuccessStories(lang);
  return stories.find(story => story.id === id);
};
