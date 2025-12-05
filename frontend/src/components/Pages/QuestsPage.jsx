import React, { useState, useEffect } from 'react';
import { Target, Star, Flame, Clock, CheckCircle, Trophy, Zap, Gift, Calendar, ChevronRight, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export default function QuestsPage() {
  const { getSection } = useLanguage();
  const commonText = getSection('common');
  
  const [quests, setQuests] = useState({ daily: [], weekly: [], monthly: [] });
  const [stats, setStats] = useState({ totalQuestsCompleted: 0, totalXPFromQuests: 0, activeDaysThisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    fetchQuests();
    fetchStats();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/quests`, { headers: getAuthHeaders() });
      const data = await res.json();
      setQuests(data);
    } catch (err) {
      console.error('Failed to fetch quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/quests/stats`, { headers: getAuthHeaders() });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch quest stats:', err);
    }
  };

  const handleClaimQuest = async (questId) => {
    try {
      const res = await fetch(`${API_URL}/api/quests/${questId}/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ increment: 1 })
      });
      const data = await res.json();
      if (data.success) {
        fetchQuests();
        fetchStats();
        if (data.xpAwarded > 0) {
          alert(`Quest completed! You earned ${data.xpAwarded} XP!`);
        }
      }
    } catch (err) {
      console.error('Failed to update quest:', err);
    }
  };

  const renderQuest = (quest) => {
    const isCompleted = quest.status === 'completed';
    const progressPercent = Math.min(100, quest.percentComplete);

    return (
      <div
        key={quest.id}
        className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${
          isCompleted 
            ? 'border-green-500/30 bg-green-900/10' 
            : 'border-slate-700 hover:border-purple-500/30'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Target className="w-6 h-6 text-purple-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`font-bold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                {quest.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColors[quest.difficulty]}`}>
                {quest.difficulty}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-3">{quest.description}</p>
            
            {!isCompleted && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{quest.progress}/{quest.targetCount}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-4 h-4" />
                <span className="font-bold">{quest.xpReward} XP</span>
              </div>
              
              {isCompleted ? (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </span>
              ) : (
                quest.progress >= quest.targetCount - 1 && (
                  <button
                    onClick={() => handleClaimQuest(quest.id)}
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Claim Reward
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'daily', label: 'Daily', icon: Clock, count: quests.daily?.length || 0 },
    { id: 'weekly', label: 'Weekly', icon: Calendar, count: quests.weekly?.length || 0 },
    { id: 'monthly', label: 'Monthly', icon: Trophy, count: quests.monthly?.length || 0 }
  ];

  const activeQuests = quests[activeTab] || [];
  const completedCount = activeQuests.filter(q => q.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-purple-500" />
          Daily Quests
        </h1>
        <p className="text-gray-400">Complete quests to earn XP and level up</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalQuestsCompleted}</p>
          <p className="text-xs text-gray-400">Quests Completed</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
          <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalXPFromQuests}</p>
          <p className="text-xs text-gray-400">XP Earned</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.activeDaysThisMonth}</p>
          <p className="text-xs text-gray-400">Active Days</p>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
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
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Progress
            </span>
          </div>
          <span className="text-purple-400">
            {completedCount}/{activeQuests.length} completed
          </span>
        </div>
        <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
            style={{ width: `${activeQuests.length > 0 ? (completedCount / activeQuests.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {activeQuests.length > 0 ? (
          activeQuests.map(quest => renderQuest(quest))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No {activeTab} quests available</p>
          </div>
        )}
      </div>
    </div>
  );
}
