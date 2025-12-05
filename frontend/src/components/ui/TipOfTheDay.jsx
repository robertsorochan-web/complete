import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight, Heart, Share2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const tips = [
  {
    id: 1,
    layer: 'bioHardware',
    category: 'Sleep',
    tip: 'Get 7-8 hours of sleep. Your body repairs itself while you sleep.',
    actionable: 'Tonight, go to bed 30 minutes earlier than usual.',
    icon: '😴'
  },
  {
    id: 2,
    layer: 'bioHardware',
    category: 'Exercise',
    tip: 'Movement is medicine. Even 10 minutes of walking can boost your mood.',
    actionable: 'Take a 10-minute walk after your next meal.',
    icon: '🏃'
  },
  {
    id: 3,
    layer: 'bioHardware',
    category: 'Nutrition',
    tip: 'Drink water first thing in the morning. Your body is dehydrated after sleep.',
    actionable: 'Keep a glass of water by your bed tonight.',
    icon: '💧'
  },
  {
    id: 4,
    layer: 'internalOS',
    category: 'Mindset',
    tip: 'Your thoughts create your reality. What you focus on grows.',
    actionable: 'Write down 3 things you are grateful for today.',
    icon: '🧠'
  },
  {
    id: 5,
    layer: 'internalOS',
    category: 'Beliefs',
    tip: 'Challenge negative self-talk. Would you say this to a friend?',
    actionable: 'When you notice negative thoughts, ask "Is this really true?"',
    icon: '💭'
  },
  {
    id: 6,
    layer: 'internalOS',
    category: 'Learning',
    tip: 'Failure is feedback, not final. Every setback teaches you something.',
    actionable: 'Think of a recent failure - what one lesson did you learn?',
    icon: '📚'
  },
  {
    id: 7,
    layer: 'culturalSoftware',
    category: 'Values',
    tip: 'Know your core values. They guide your decisions when things get tough.',
    actionable: 'Write down your top 3 values and why they matter to you.',
    icon: '⭐'
  },
  {
    id: 8,
    layer: 'culturalSoftware',
    category: 'Habits',
    tip: 'Small habits compound over time. 1% better daily = 37x better in a year.',
    actionable: 'Pick one tiny habit to start today (2 minutes or less).',
    icon: '🔄'
  },
  {
    id: 9,
    layer: 'socialInstance',
    category: 'Relationships',
    tip: 'You are the average of the 5 people you spend the most time with.',
    actionable: 'Reach out to one person who inspires you today.',
    icon: '👥'
  },
  {
    id: 10,
    layer: 'socialInstance',
    category: 'Communication',
    tip: 'Listen more than you speak. Everyone has something to teach you.',
    actionable: 'In your next conversation, ask 2 questions before sharing your opinion.',
    icon: '👂'
  },
  {
    id: 11,
    layer: 'socialInstance',
    category: 'Support',
    tip: 'Asking for help is a sign of strength, not weakness.',
    actionable: 'Identify one thing you are struggling with and ask someone for help.',
    icon: '🤝'
  },
  {
    id: 12,
    layer: 'consciousUser',
    category: 'Awareness',
    tip: 'Pause before reacting. The space between stimulus and response is your power.',
    actionable: 'Take 3 deep breaths before responding to something stressful.',
    icon: '🧘'
  },
  {
    id: 13,
    layer: 'consciousUser',
    category: 'Presence',
    tip: 'Be where your feet are. The present moment is all you ever have.',
    actionable: 'Put your phone away for 30 minutes and be fully present.',
    icon: '🌟'
  },
  {
    id: 14,
    layer: 'consciousUser',
    category: 'Purpose',
    tip: 'Know your "why". Purpose gives meaning to everything you do.',
    actionable: 'Complete this sentence: "I want to be remembered for..."',
    icon: '🎯'
  },
  {
    id: 15,
    layer: 'bioHardware',
    category: 'Energy',
    tip: 'Energy is your most valuable resource. Protect it wisely.',
    actionable: 'Identify one energy drainer and limit it today.',
    icon: '⚡'
  }
];

const layerColors = {
  bioHardware: 'from-red-500 to-pink-500',
  internalOS: 'from-blue-500 to-cyan-500',
  culturalSoftware: 'from-purple-500 to-violet-500',
  socialInstance: 'from-green-500 to-emerald-500',
  consciousUser: 'from-yellow-500 to-orange-500'
};

const TipOfTheDay = ({ compact = false }) => {
  const { t, getSection } = useLanguage();
  const tipsText = getSection('tips');
  const commonText = getSection('common');
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [savedTips, setSavedTips] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedIndex = localStorage.getItem('akofa_tip_date');
    const savedTipsData = localStorage.getItem('akofa_saved_tips');
    
    if (savedTipsData) {
      setSavedTips(JSON.parse(savedTipsData));
    }
    
    if (savedIndex !== today) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setCurrentTipIndex(randomIndex);
      localStorage.setItem('akofa_tip_date', today);
      localStorage.setItem('akofa_tip_index', randomIndex.toString());
    } else {
      const storedIndex = localStorage.getItem('akofa_tip_index');
      if (storedIndex) {
        setCurrentTipIndex(parseInt(storedIndex));
      }
    }
  }, []);

  const currentTip = tips[currentTipIndex];

  const handlePrevious = () => {
    setCurrentTipIndex(prev => (prev === 0 ? tips.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTipIndex(prev => (prev === tips.length - 1 ? 0 : prev + 1));
  };

  const handleRandom = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * tips.length);
    } while (newIndex === currentTipIndex && tips.length > 1);
    setCurrentTipIndex(newIndex);
  };

  const handleSaveTip = () => {
    const tipId = currentTip.id;
    let newSavedTips;
    
    if (savedTips.includes(tipId)) {
      newSavedTips = savedTips.filter(id => id !== tipId);
    } else {
      newSavedTips = [...savedTips, tipId];
    }
    
    setSavedTips(newSavedTips);
    localStorage.setItem('akofa_saved_tips', JSON.stringify(newSavedTips));
  };

  const handleShare = () => {
    const text = `${tipsText.title || "Tip of the Day"}: ${currentTip.tip}\n\nAction: ${currentTip.actionable}\n\n- Akofa Fixit`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Tip copied to clipboard!');
    }
  };

  const isSaved = savedTips.includes(currentTip.id);

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{currentTip.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">{tipsText.title || 'Tip of the Day'}</span>
            </div>
            <p className="text-white text-sm">{currentTip.tip}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">{tipsText.title || 'Tip of the Day'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                showSaved ? 'bg-amber-500 text-white' : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              {commonText.saved || 'Saved'} ({savedTips.length})
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showSaved ? (
          <div className="space-y-3">
            {savedTips.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No saved tips yet. Click the heart to save tips!</p>
            ) : (
              tips
                .filter(tip => savedTips.includes(tip.id))
                .map(tip => (
                  <div key={tip.id} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{tip.icon}</span>
                      <div>
                        <p className="text-white text-sm">{tip.tip}</p>
                        <p className="text-gray-400 text-xs mt-1">{tip.category}</p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${layerColors[currentTip.layer]} text-white`}>
                {currentTip.category}
              </span>
              <span className="text-gray-500 text-sm">{currentTipIndex + 1} / {tips.length}</span>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{currentTip.icon}</div>
              <p className="text-xl text-white font-medium mb-4">{currentTip.tip}</p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Try this today:</p>
                <p className="text-green-400">{currentTip.actionable}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.previousTip || 'Previous tip'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.nextTip || 'Next tip'}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRandom}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title="Random tip"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveTip}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-700 hover:bg-slate-600 text-gray-400'
                  }`}
                  title={isSaved ? 'Unsave' : (tipsText.saveTip || 'Save tip')}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.shareTip || 'Share tip'}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TipOfTheDay;
