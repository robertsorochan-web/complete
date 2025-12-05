import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, TrendingUp, Quote, Filter, Share2 } from 'lucide-react';
import { successStories } from '../../config/successStories';
import { useLanguage } from '../../context/LanguageContext';

const SuccessStoriesPage = ({ onBack }) => {
  const { t, getSection } = useLanguage();
  const storiesText = getSection('successStoriesPage') || {};
  const commonText = getSection('common') || {};
  
  const [filter, setFilter] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);

  const sectors = [
    { id: 'all', label: storiesText.allStories || 'All Stories', icon: '📚' },
    { id: 'fishing', label: storiesText.fishing || 'Fishing', icon: '🐟' },
    { id: 'market', label: storiesText.market || 'Market', icon: '🏪' },
    { id: 'farming', label: storiesText.farming || 'Farming', icon: '🌾' },
    { id: 'food', label: storiesText.foodService || 'Food Service', icon: '🍲' },
    { id: 'transport', label: storiesText.transport || 'Transport', icon: '🚗' },
    { id: 'education', label: storiesText.education || 'Education', icon: '📚' }
  ];

  const filteredStories = filter === 'all' 
    ? successStories 
    : successStories.filter(s => s.sector === filter);

  const shareStory = (story) => {
    const text = `📖 ${storiesText.successStoryLabel || 'Success Story'}: ${story.name}\n\n${story.problem}\n\n✅ ${storiesText.solution || 'Solution'}: ${story.action}\n\n📈 ${storiesText.result || 'Result'}: ${story.result}\n\n${storiesText.learnMore || 'Learn more at'} Akↄfa Fixit!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
        <button
          onClick={() => setSelectedStory(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          {storiesText.backToStories || 'Back to Stories'}
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl">
                  {selectedStory.emoji || '👤'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{selectedStory.name}</h1>
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedStory.location}</span>
                    <span className="text-gray-600">•</span>
                    <span className="capitalize">{selectedStory.sector}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                <div className="text-red-400 font-medium mb-2">😟 {storiesText.theProblem || 'The Problem'}</div>
                <p className="text-gray-300">{selectedStory.problem}</p>
              </div>

              <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-yellow-400 font-medium mb-2">💡 {storiesText.whatRevealed || 'What Akↄfa Revealed'}</div>
                <p className="text-gray-300">{selectedStory.discovery}</p>
                <div className="mt-3 text-sm text-yellow-400/70">
                  {storiesText.weakArea || 'Weak Area'}: {selectedStory.weakArea}
                </div>
              </div>

              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                <div className="text-blue-400 font-medium mb-2">⚡ {storiesText.actionTaken || 'Action Taken'}</div>
                <p className="text-gray-300">{selectedStory.action}</p>
              </div>

              <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                <div className="text-green-400 font-medium mb-2">📈 {storiesText.theResult || 'The Result'}</div>
                <p className="text-gray-300 text-lg font-medium">{selectedStory.result}</p>
              </div>

              {selectedStory.quote && (
                <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                  <Quote className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-200 italic text-lg">"{selectedStory.quote}"</p>
                  <p className="text-purple-400 mt-2">- {selectedStory.name}</p>
                </div>
              )}

              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{storiesText.keyTakeaway || 'Key Takeaway'}</span>
                </div>
                <p className="text-gray-300">{selectedStory.lesson || (storiesText.defaultLesson || 'Small changes in the right area can create big results.')}</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700">
              <button
                onClick={() => shareStory(selectedStory)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-5 h-5" />
                {storiesText.shareOnWhatsApp || 'Share This Story on WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          {commonText.back || 'Back'}
        </button>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🇬🇭 {storiesText.title || 'Ghana Success Stories'}</h1>
          <p className="text-gray-400">{storiesText.subtitle || 'Real people, real problems, real solutions'}</p>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {sectors.map(sector => (
            <button
              key={sector.id}
              onClick={() => setFilter(sector.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filter === sector.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              {sector.icon} {sector.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStories.map((story, index) => (
            <button
              key={index}
              onClick={() => setSelectedStory(story)}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {story.emoji || '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white group-hover:text-purple-400 transition">
                    {story.name}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {story.location}
                  </div>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{story.problem}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">{story.resultShort || story.result}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>{storiesText.noStoriesFound || 'No stories found for this category yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStoriesPage;
