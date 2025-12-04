import React, { useState, useEffect } from 'react';
import { Target, Plus, Check, Clock, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const GoalTracker = ({ purpose = 'business' }) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(`akofa_goals_${purpose}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    milestones: ['', '', '']
  });

  useEffect(() => {
    localStorage.setItem(`akofa_goals_${purpose}`, JSON.stringify(goals));
  }, [goals, purpose]);

  const addGoal = () => {
    if (newGoal.title && newGoal.targetDate) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        milestones: newGoal.milestones.filter(m => m.trim()).map((text, i) => ({
          id: i,
          text,
          completed: false
        })),
        createdAt: new Date().toISOString(),
        completed: false
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({ title: '', description: '', targetDate: '', milestones: ['', '', ''] });
      setShowForm(false);
    }
  };

  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allComplete = updatedMilestones.every(m => m.completed);
        return { ...goal, milestones: updatedMilestones, completed: allComplete };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId) => {
    if (confirm('You sure you want delete this goal?')) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  };

  const getProgress = (goal) => {
    if (!goal.milestones.length) return goal.completed ? 100 : 0;
    const completed = goal.milestones.filter(m => m.completed).length;
    return Math.round((completed / goal.milestones.length) * 100);
  };

  const getDaysLeft = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const purposeLabels = {
    business: 'Business Goals',
    personal: 'Life Goals',
    team: 'Team Goals',
    policy: 'System Goals'
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{purposeLabels[purpose] || 'Goals'}</h3>
            <p className="text-sm text-gray-400">Set goals with milestones</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {showForm && (
        <div className="p-4 bg-slate-700/50 border-b border-slate-700 space-y-3">
          <input
            type="text"
            placeholder="What you want achieve? (e.g., Increase sales by 50%)"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
          />
          <textarea
            placeholder="Describe am small (optional)"
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white h-20 resize-none"
          />
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Milestones (Steps to reach your goal)</label>
            {newGoal.milestones.map((milestone, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Step ${i + 1}: What you go do?`}
                value={milestone}
                onChange={(e) => {
                  const updated = [...newGoal.milestones];
                  updated[i] = e.target.value;
                  setNewGoal({...newGoal, milestones: updated});
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white mb-2"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={addGoal}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              Save Goal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No goals yet. Add your first goal!</p>
          </div>
        ) : (
          goals.map(goal => {
            const progress = getProgress(goal);
            const daysLeft = getDaysLeft(goal.targetDate);
            const isExpanded = expandedGoal === goal.id;
            
            return (
              <div 
                key={goal.id} 
                className={`border rounded-xl overflow-hidden ${
                  goal.completed 
                    ? 'border-green-500/50 bg-green-900/20' 
                    : daysLeft < 0 
                      ? 'border-red-500/50 bg-red-900/20'
                      : 'border-slate-600 bg-slate-700/50'
                }`}
              >
                <button
                  onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {goal.completed && <Check className="w-5 h-5 text-green-400" />}
                        <span className={`font-medium ${goal.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                          {goal.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className={`flex items-center gap-1 ${
                          daysLeft < 0 ? 'text-red-400' : daysLeft < 7 ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          <Clock className="w-4 h-4" />
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">{progress}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        goal.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {goal.description && (
                      <p className="text-sm text-gray-400">{goal.description}</p>
                    )}
                    {goal.milestones.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-300">Milestones:</div>
                        {goal.milestones.map(milestone => (
                          <button
                            key={milestone.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMilestone(goal.id, milestone.id);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
                              milestone.completed 
                                ? 'bg-green-900/30 border border-green-500/30' 
                                : 'bg-slate-600/50 hover:bg-slate-600'
                            }`}
                          >
                            {milestone.completed ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-500 rounded" />
                            )}
                            <span className={milestone.completed ? 'text-green-400 line-through' : 'text-gray-300'}>
                              {milestone.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGoal(goal.id);
                      }}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Goal
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
