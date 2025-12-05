import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const RARITY_STYLES = {
  common: 'bg-gray-100 border-gray-300 text-gray-600',
  uncommon: 'bg-green-50 border-green-300 text-green-700',
  rare: 'bg-blue-50 border-blue-300 text-blue-700',
  epic: 'bg-purple-50 border-purple-300 text-purple-700',
  legendary: 'bg-amber-50 border-amber-400 text-amber-700',
  mythic: 'bg-red-50 border-red-400 text-red-700'
};

const RARITY_GLOW = {
  common: '',
  uncommon: 'shadow-sm',
  rare: 'shadow-md shadow-blue-200',
  epic: 'shadow-md shadow-purple-200',
  legendary: 'shadow-lg shadow-amber-300 animate-pulse-slow',
  mythic: 'shadow-xl shadow-red-300 animate-pulse'
};

const CATEGORY_ICONS = {
  streak: '🔥',
  checkins: '✅',
  levels: '⭐',
  challenges: '🏔️',
  social: '👥',
  layers: '📊',
  stackscore: '📈',
  special: '✨'
};

export default function AchievementsPage() {
  const { t, getSection } = useLanguage();
  const achievementsText = getSection('achievementsPage') || {};
  const commonText = getSection('common') || {};
  
  const CATEGORY_NAMES = {
    streak: achievementsText.categoryStreak || 'Streak',
    checkins: achievementsText.categoryCheckins || 'Check-ins',
    levels: achievementsText.categoryLevels || 'Levels',
    challenges: achievementsText.categoryChallenges || 'Challenges',
    social: achievementsText.categorySocial || 'Social',
    layers: achievementsText.categoryLayers || 'Layers',
    stackscore: achievementsText.categoryStackscore || 'StackScore',
    special: achievementsText.categorySpecial || 'Special'
  };
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);
  const [recentUnlocks, setRecentUnlocks] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchAchievements();
    checkForNewAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/achievements`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setAchievements(data.achievements || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/achievements/check`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.newlyUnlocked?.length > 0) {
        setRecentUnlocks(data.newlyUnlocked);
        fetchAchievements();
      }
    } catch (err) {
      console.error('Failed to check achievements:', err);
    }
  };

  const filteredAchievements = achievements.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (showEarnedOnly && !a.earned) return false;
    return true;
  });

  const categories = ['all', 'streak', 'checkins', 'levels', 'challenges', 'social', 'layers', 'stackscore', 'special'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {recentUnlocks.length > 0 && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-white animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎉</span>
            <h3 className="font-bold text-lg">
              {achievementsText.newAchievements || 'New Achievements Unlocked!'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentUnlocks.map(unlock => (
              <div key={unlock.id} className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                {unlock.name}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setRecentUnlocks([])}
            className="mt-2 text-sm opacity-80 hover:opacity-100"
          >
            {achievementsText.dismiss || 'Dismiss'}
          </button>
        </div>
      )}

      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {achievementsText.achievementProgress || 'Achievement Progress'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalEarned}</div>
              <div className="text-sm text-gray-500">{achievementsText.earned || 'Earned'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{stats.totalAvailable}</div>
              <div className="text-sm text-gray-500">{achievementsText.totalLabel || 'Total'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.percentComplete}%</div>
              <div className="text-sm text-gray-500">{achievementsText.complete || 'Complete'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{achievementsText.xpEarned || 'XP Earned'}</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.percentComplete}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(stats.byRarity).map(([rarity, count]) => count > 0 && (
              <div key={rarity} className={`px-3 py-1 rounded-full text-xs font-medium border ${RARITY_STYLES[rarity]}`}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}: {count}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? (achievementsText.allCategories || 'All') : (
              <span>{CATEGORY_ICONS[cat]} {CATEGORY_NAMES[cat]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedCategory === 'all' ? (achievementsText.allAchievements || 'All Achievements') : CATEGORY_NAMES[selectedCategory]}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredAchievements.filter(a => a.earned).length}/{filteredAchievements.length})
          </span>
        </h3>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showEarnedOnly}
            onChange={(e) => setShowEarnedOnly(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          {achievementsText.showEarnedOnly || 'Show earned only'}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`relative rounded-xl border-2 p-4 transition-all ${
              achievement.earned 
                ? `${RARITY_STYLES[achievement.rarity]} ${RARITY_GLOW[achievement.rarity]}` 
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
          >
            {achievement.earned && achievement.rarity === 'legendary' && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-yellow-200/20 rounded-xl animate-shimmer"></div>
            )}
            {achievement.earned && achievement.rarity === 'mythic' && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-200/20 to-pink-200/20 rounded-xl animate-shimmer"></div>
            )}
            
            <div className="relative flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                achievement.earned 
                  ? 'bg-white shadow-inner' 
                  : 'bg-gray-100'
              }`}>
                {achievement.earned ? (
                  <span>{CATEGORY_ICONS[achievement.category]}</span>
                ) : (
                  <span className="text-gray-300">🔒</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold truncate ${achievement.earned ? '' : 'text-gray-500'}`}>
                    {achievement.name}
                  </h4>
                  <span 
                    className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${RARITY_STYLES[achievement.rarity]}`}
                  >
                    {achievement.rarity}
                  </span>
                </div>
                
                <p className={`text-sm mt-1 ${achievement.earned ? 'opacity-80' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                
                <div className="flex items-center gap-3 mt-2 text-xs">
                  {achievement.xpReward > 0 && (
                    <span className={`font-medium ${achievement.earned ? 'text-amber-600' : 'text-gray-400'}`}>
                      +{achievement.xpReward} XP
                    </span>
                  )}
                  {achievement.earnedAt && (
                    <span className="text-gray-400">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">🏆</span>
          <p>{achievementsText.noAchievementsInCategory || 'No achievements in this category yet'}</p>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
