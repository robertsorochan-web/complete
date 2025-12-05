import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, TrendingUp, Crown, Medal, Award, Users, Target, Heart, Brain, Code, Eye, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const layerConfig = {
  bio_hardware: { name: 'Health & Energy', icon: Heart, color: 'from-red-500 to-pink-500' },
  internal_os: { name: 'Mindset', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  cultural_software: { name: 'Culture', icon: Code, color: 'from-purple-500 to-violet-500' },
  social_instance: { name: 'Relationships', icon: Users, color: 'from-green-500 to-emerald-500' },
  conscious_user: { name: 'Awareness', icon: Eye, color: 'from-yellow-500 to-orange-500' }
};

export default function LeaderboardPage() {
  const { getSection } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('streaks');
  const [selectedLayer, setSelectedLayer] = useState('bio_hardware');
  const [data, setData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, selectedLayer]);

  useEffect(() => {
    fetchComparison();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/leaderboard/${activeTab}`;
      if (activeTab === 'layers') {
        url = `${API_URL}/api/leaderboard/layer/${selectedLayer}`;
      }
      
      const res = await fetch(url, { headers: getAuthHeaders() });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparison = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard/compare`, { headers: getAuthHeaders() });
      const result = await res.json();
      setComparison(result);
    } catch (err) {
      console.error('Failed to fetch comparison:', err);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-medium">#{rank}</span>;
  };

  const renderUserRow = (user, index) => {
    const isCurrentUser = user.isCurrentUser;
    
    return (
      <div
        key={index}
        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
          isCurrentUser 
            ? 'bg-purple-900/30 border border-purple-500/50' 
            : 'bg-slate-800/30 hover:bg-slate-800/50'
        }`}
      >
        <div className="w-10 flex justify-center">
          {getRankIcon(user.rank)}
        </div>
        
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="font-bold text-white">{user.displayName?.[0] || 'U'}</span>
        </div>
        
        <div className="flex-1">
          <p className={`font-medium ${isCurrentUser ? 'text-purple-400' : 'text-white'}`}>
            {user.displayName}
            {isCurrentUser && <span className="text-xs ml-2">(You)</span>}
          </p>
          {user.level && (
            <p className="text-xs text-gray-500">Level {user.level}</p>
          )}
        </div>
        
        <div className="text-right">
          {activeTab === 'streaks' && (
            <div className="flex items-center gap-2 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="font-bold">{user.currentStreak} days</span>
            </div>
          )}
          {activeTab === 'weekly' && (
            <div className="flex items-center gap-2 text-blue-400">
              <Target className="w-4 h-4" />
              <span className="font-bold">{user.weeklyCheckins} check-ins</span>
            </div>
          )}
          {activeTab === 'challenges' && (
            <div className="flex items-center gap-2 text-green-400">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{user.totalPoints} pts</span>
            </div>
          )}
          {activeTab === 'layers' && (
            <div className="flex items-center gap-2 text-purple-400">
              <Star className="w-4 h-4" />
              <span className="font-bold">{user.avgScore}/10</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'streaks', label: 'Streaks', icon: Flame },
    { id: 'weekly', label: 'This Week', icon: Target },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'layers', label: 'By Layer', icon: Star }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboards
        </h1>
        <p className="text-gray-400">See how you compare with the community</p>
      </div>

      {comparison && (
        <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl p-6 border border-purple-500/30">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            You vs Community Average
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Streak</p>
              <p className="text-2xl font-bold text-white">{comparison.you?.currentStreak || 0}</p>
              <p className={`text-sm ${parseFloat(comparison.comparison?.streakVsAvg) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(comparison.comparison?.streakVsAvg) >= 0 ? '+' : ''}{comparison.comparison?.streakVsAvg} vs avg
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Check-ins</p>
              <p className="text-2xl font-bold text-white">{comparison.you?.totalCheckins || 0}</p>
              <p className={`text-sm ${parseFloat(comparison.comparison?.checkinsVsAvg) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(comparison.comparison?.checkinsVsAvg) >= 0 ? '+' : ''}{comparison.comparison?.checkinsVsAvg} vs avg
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">XP</p>
              <p className="text-2xl font-bold text-white">{comparison.you?.xp || 0}</p>
              <p className={`text-sm ${parseFloat(comparison.comparison?.xpVsAvg) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(comparison.comparison?.xpVsAvg) >= 0 ? '+' : ''}{comparison.comparison?.xpVsAvg} vs avg
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'layers' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(layerConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedLayer(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedLayer === key 
                    ? `bg-gradient-to-r ${config.color} text-white` 
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.name}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.leaderboard && data.leaderboard.length > 0 ? (
            <>
              {data.yourStats && !data.leaderboard.some(u => u.isCurrentUser) && (
                <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/50 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400">Your Rank: #{data.yourStats.rank || data.yourRank}</div>
                    <div className="flex-1" />
                    <div className="text-orange-400 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      {data.yourStats.currentStreak} days
                    </div>
                  </div>
                </div>
              )}
              
              {data.communityAverage !== undefined && (
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Community Average</span>
                    <span className="text-white font-bold">{data.communityAverage}</span>
                  </div>
                </div>
              )}
              
              {data.leaderboard.map((user, i) => renderUserRow(user, i))}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No data available yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
