import React, { useState, useEffect } from 'react';
import { Star, Zap, Trophy, Gift, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LevelUpCelebration({ newLevel, unlockedFeatures = [], onClose }) {
  const { getSection } = useLanguage();
  const levelsText = getSection('levelsPage');
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < phases.length) {
        setAnimationPhase(currentPhase);
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level) => {
    if (level >= 75) return 'from-yellow-400 via-orange-500 to-red-500';
    if (level >= 50) return 'from-purple-500 via-pink-500 to-red-500';
    if (level >= 25) return 'from-blue-500 via-cyan-500 to-green-500';
    if (level >= 10) return 'from-green-500 via-emerald-500 to-teal-500';
    return 'from-indigo-500 via-purple-500 to-pink-500';
  };

  const getLevelTitle = (level) => {
    if (level >= 100) return levelsText.titleLegend || 'Legend';
    if (level >= 75) return levelsText.titleMaster || 'Master';
    if (level >= 50) return levelsText.titleExpert || 'Expert';
    if (level >= 25) return levelsText.titleAdvanced || 'Advanced';
    if (level >= 10) return levelsText.titleIntermediate || 'Intermediate';
    return levelsText.titleBeginner || 'Beginner';
  };

  const formatFeatureName = (feature) => {
    return feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md mx-4 border border-slate-600 shadow-2xl transform transition-all duration-500 ${animationPhase >= 0 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-yellow-400 rounded-full transition-all duration-700 ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-80px)`,
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
          
          <div className={`relative z-10 flex flex-col items-center transition-all duration-500 ${animationPhase >= 1 ? 'translate-y-0' : 'translate-y-8'}`}>
            <div className="relative mb-4">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getLevelColor(newLevel)} p-1 shadow-lg shadow-purple-500/50 animate-pulse`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {newLevel}
                  </span>
                </div>
              </div>
              
              <div className={`absolute -top-2 -right-2 transition-all duration-500 ${animationPhase >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className={`text-center transition-all duration-500 ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-3xl font-bold text-white mb-1">
                {levelsText.levelUp || 'Level Up!'}
              </h2>
              <p className="text-xl text-purple-400 font-medium">
                {getLevelTitle(newLevel)}
              </p>
            </div>
          </div>
        </div>

        {unlockedFeatures.length > 0 && (
          <div className={`mt-8 transition-all duration-500 ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Gift className="w-5 h-5 text-green-400" />
              <span className="text-lg font-medium text-white">
                {levelsText.newUnlocks || 'New Unlocks!'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {unlockedFeatures.map((feature, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  {formatFeatureName(feature)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={`mt-8 transition-all duration-500 ${animationPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
          >
            {levelsText.continueJourney || 'Continue Your Journey'}
          </button>
        </div>

        <div className="absolute -z-10 inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
