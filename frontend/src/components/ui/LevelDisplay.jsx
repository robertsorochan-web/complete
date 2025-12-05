import React, { useState, useEffect } from 'react';
import { Star, Zap, Trophy, ChevronUp, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LevelDisplay({ compact = false, showXPBar = true }) {
  const { t, getSection } = useLanguage();
  const levelsText = getSection('levelsPage');
  const commonText = getSection('common');
  
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUnlocks, setShowUnlocks] = useState(false);

  useEffect(() => {
    fetchLevelStatus();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchLevelStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leveling/status`, { headers: getAuthHeaders() });
      const data = await res.json();
      setLevelData(data);
    } catch (err) {
      console.error('Failed to fetch level status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !levelData) {
    return null;
  }

  const getLevelColor = (level) => {
    if (level >= 75) return 'from-yellow-400 to-orange-500';
    if (level >= 50) return 'from-purple-500 to-pink-500';
    if (level >= 25) return 'from-blue-500 to-cyan-500';
    if (level >= 10) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getLevelColor(levelData.currentLevel)} flex items-center justify-center`}>
          <span className="text-xs font-bold text-white">{levelData.currentLevel}</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-gray-400">{levelsText.level || 'Level'} {levelData.currentLevel}</p>
          <p className="text-xs text-purple-400">{levelData.totalXP} XP</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getLevelColor(levelData.currentLevel)} flex items-center justify-center shadow-lg`}>
            <span className="text-xl font-bold text-white">{levelData.currentLevel}</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{levelsText.level || 'Level'} {levelData.currentLevel}</h3>
            <div className="flex items-center gap-1 text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm">{levelData.totalXP} XP</span>
            </div>
          </div>
        </div>
        
        {levelData.nextUnlock && (
          <button
            onClick={() => setShowUnlocks(!showUnlocks)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
          >
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">{levelsText.unlocks || 'Unlocks'}</span>
          </button>
        )}
      </div>

      {showXPBar && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{(levelsText.progressToLevel || 'Progress to Level {level}').replace('{level}', levelData.currentLevel + 1)}</span>
            <span className="text-purple-400">{levelData.progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getLevelColor(levelData.currentLevel)} rounded-full transition-all`}
              style={{ width: `${levelData.progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {(levelsText.xpToNextLevel || '{xp} XP to next level').replace('{xp}', levelData.xpToNextLevel)}
          </p>
        </div>
      )}

      {showUnlocks && levelData.nextUnlock && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">
              {(levelsText.nextUnlockAt || 'Next unlock at Level {level}').replace('{level}', levelData.nextUnlock.level)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {levelData.nextUnlock.features.map((feature, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs"
              >
                {feature.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {levelData.unlockedFeatures && levelData.unlockedFeatures.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {levelData.unlockedFeatures.slice(0, 4).map((feature, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs"
            >
              {feature.replace(/_/g, ' ')}
            </span>
          ))}
          {levelData.unlockedFeatures.length > 4 && (
            <span className="px-2 py-0.5 bg-slate-700 text-gray-400 rounded text-xs">
              +{levelData.unlockedFeatures.length - 4} {levelsText.more || 'more'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
