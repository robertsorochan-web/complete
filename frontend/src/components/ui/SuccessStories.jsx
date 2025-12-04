import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { successStories, getStoriesByCategory } from '../../config/successStories';

const SuccessStoryCard = ({ story, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{story.image}</div>
          <div>
            <h4 className="font-semibold text-white">{story.name}</h4>
            <p className="text-sm text-gray-400">{story.location} • {story.business}</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-3 italic">"{story.quote}"</p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-purple-400 text-sm hover:text-purple-300 transition"
        >
          {expanded ? 'Show less' : 'Read full story →'}
        </button>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-700 space-y-3 text-sm">
            <div>
              <span className="text-red-400 font-medium">Problem:</span>
              <p className="text-gray-400 mt-1">{story.problem}</p>
            </div>
            <div>
              <span className="text-yellow-400 font-medium">Discovery:</span>
              <p className="text-gray-400 mt-1">{story.discovery}</p>
            </div>
            <div>
              <span className="text-blue-400 font-medium">Action:</span>
              <p className="text-gray-400 mt-1">{story.action}</p>
            </div>
            <div>
              <span className="text-green-400 font-medium">Result:</span>
              <p className="text-gray-400 mt-1">{story.result}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
      <div className="flex items-start gap-4 mb-6">
        <div className="text-6xl">{story.image}</div>
        <div>
          <h3 className="text-2xl font-bold text-white">{story.name}</h3>
          <p className="text-gray-400">{story.location} • {story.business}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
          <h4 className="font-semibold text-red-400 mb-2">The Problem</h4>
          <p className="text-gray-300">{story.problem}</p>
        </div>

        <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
          <h4 className="font-semibold text-yellow-400 mb-2">What Akↄfa Found</h4>
          <p className="text-gray-300">{story.discovery}</p>
        </div>

        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
          <h4 className="font-semibold text-blue-400 mb-2">Action Taken</h4>
          <p className="text-gray-300">{story.action}</p>
        </div>

        <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
          <h4 className="font-semibold text-green-400 mb-2">The Result</h4>
          <p className="text-gray-300">{story.result}</p>
        </div>
      </div>

      <div className="mt-6 bg-purple-900/30 rounded-xl p-6 border border-purple-500/30">
        <Quote className="w-8 h-8 text-purple-400 mb-3" />
        <p className="text-white text-lg italic">{story.quote}</p>
        <p className="text-purple-400 mt-3">— {story.name}</p>
      </div>
    </div>
  );
};

const SuccessStoriesCarousel = ({ category = 'all' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = getStoriesByCategory(category);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <div className="relative">
      <SuccessStoryCard story={stories[currentIndex]} />
      
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevStory}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === currentIndex ? 'bg-purple-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextStory}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const SuccessStoriesGrid = ({ category = 'all', limit = 6 }) => {
  const stories = getStoriesByCategory(category).slice(0, limit);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map(story => (
        <SuccessStoryCard key={story.id} story={story} compact />
      ))}
    </div>
  );
};

export { SuccessStoryCard, SuccessStoriesCarousel, SuccessStoriesGrid };
export default SuccessStoriesCarousel;
