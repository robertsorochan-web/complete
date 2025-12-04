import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Trophy, Calendar, Bell, ChevronDown, ChevronUp } from 'lucide-react';

const ProgressTracker = ({ assessmentData, purpose, userId }) => {
  const [actionItems, setActionItems] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);

  const storageKey = `akofa_progress_${userId || 'guest'}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setActionItems(data.actionItems || getDefaultActions());
      setStreak(data.streak || 0);
      setLastCheckIn(data.lastCheckIn || null);
    } else {
      setActionItems(getDefaultActions());
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({
      actionItems,
      streak,
      lastCheckIn
    }));
  }, [actionItems, streak, lastCheckIn, storageKey]);

  const getDefaultActions = () => {
    const defaultActions = {
      personal: [
        { id: 1, text: "Wake up same time every day", completed: false, category: 'health' },
        { id: 2, text: "Drink water before phone", completed: false, category: 'health' },
        { id: 3, text: "Walk for 15 minutes", completed: false, category: 'health' },
        { id: 4, text: "Write 3 things wey you grateful for", completed: false, category: 'mindset' },
        { id: 5, text: "Call or visit one friend", completed: false, category: 'social' }
      ],
      business: [
        { id: 1, text: "Write down all expenses today", completed: false, category: 'money' },
        { id: 2, text: "Check what products sell most", completed: false, category: 'money' },
        { id: 3, text: "Talk to one customer about needs", completed: false, category: 'customer' },
        { id: 4, text: "Set price for tomorrow goods", completed: false, category: 'planning' },
        { id: 5, text: "Count your stock", completed: false, category: 'inventory' }
      ],
      team: [
        { id: 1, text: "Check in with each team member", completed: false, category: 'team' },
        { id: 2, text: "Hold 10-minute team standup", completed: false, category: 'communication' },
        { id: 3, text: "Review progress on main goal", completed: false, category: 'planning' },
        { id: 4, text: "Give one person specific praise", completed: false, category: 'culture' },
        { id: 5, text: "Clear one blocker for the team", completed: false, category: 'action' }
      ],
      policy: [
        { id: 1, text: "Talk to one community member", completed: false, category: 'engagement' },
        { id: 2, text: "Review current project status", completed: false, category: 'monitoring' },
        { id: 3, text: "Document one lesson learned", completed: false, category: 'learning' },
        { id: 4, text: "Share update with stakeholders", completed: false, category: 'communication' },
        { id: 5, text: "Identify one improvement area", completed: false, category: 'planning' }
      ]
    };
    return defaultActions[purpose] || defaultActions.personal;
  };

  const toggleItem = (id) => {
    const newItems = actionItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setActionItems(newItems);

    const now = new Date().toDateString();
    if (lastCheckIn !== now) {
      setStreak(prev => prev + 1);
      setLastCheckIn(now);
    }
  };

  const completedCount = actionItems.filter(i => i.completed).length;
  const progress = Math.round((completedCount / actionItems.length) * 100);

  const resetTasks = () => {
    setActionItems(actionItems.map(item => ({ ...item, completed: false })));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      health: '💪',
      mindset: '🧠',
      social: '👥',
      money: '💰',
      customer: '🗣️',
      planning: '📋',
      inventory: '📦',
      team: '👨‍👩‍👧‍👦',
      communication: '📢',
      culture: '❤️',
      action: '⚡',
      engagement: '🤝',
      monitoring: '📊',
      learning: '📚'
    };
    return icons[category] || '📌';
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between border-b border-slate-700 hover:bg-slate-700/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Today's Action Steps</h3>
            <p className="text-sm text-gray-400">{completedCount}/{actionItems.length} completed</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">{streak} day streak!</span>
            </div>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-medium text-green-400">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {actionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                  item.completed 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-slate-500'
                }`}>
                  {item.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-lg">{getCategoryIcon(item.category)}</span>
                <span className={`flex-1 text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>

          {completedCount === actionItems.length && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 text-center">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="font-semibold text-white">Well done! You finish all tasks! 🎉</p>
              <p className="text-sm text-gray-400 mt-1">Come back tomorrow for more</p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={resetTasks}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 transition"
            >
              Reset Tasks
            </button>
            <button
              onClick={() => {
                if ('Notification' in window && Notification.permission === 'default') {
                  Notification.requestPermission();
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
            >
              <Bell className="w-4 h-4" />
              Remind Me
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
