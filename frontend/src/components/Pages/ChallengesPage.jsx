import React, { useState, useEffect } from 'react';
import { Target, Trophy, Clock, Star, ChevronRight, CheckCircle, Play, Users, Flame, Zap, Heart, Brain, Code, Eye, Filter, TrendingUp, Award, Gift, Calendar, Share2, Lock, Unlock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import useXP from '../../hooks/useXP';
import LevelUpCelebration from '../ui/LevelUpCelebration';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const layerColors = {
  bioHardware: 'from-red-500 to-pink-500',
  internalOS: 'from-blue-500 to-cyan-500',
  culturalSoftware: 'from-purple-500 to-violet-500',
  socialInstance: 'from-green-500 to-emerald-500',
  consciousUser: 'from-yellow-500 to-orange-500'
};

const layerIcons = {
  bioHardware: Heart,
  internalOS: Brain,
  culturalSoftware: Code,
  socialInstance: Users,
  consciousUser: Eye
};

const layerNamesDefault = {
  bioHardware: 'Health & Energy',
  internalOS: 'Mindset & Beliefs',
  culturalSoftware: 'Cultural Influences',
  socialInstance: 'Relationships',
  consciousUser: 'Awareness & Focus'
};

const challengeTemplates = [
  { id: 1, title: '7-Day Sleep Reset', description: 'Fix your sleep schedule in one week', layer: 'bioHardware', duration: 7, difficulty: 'easy', points: 100, tasks: ['Set consistent bedtime', 'No screens 1hr before bed', 'Morning sunlight exposure'] },
  { id: 2, title: '21-Day Belief Rewrite', description: 'Transform limiting beliefs into empowering ones', layer: 'internalOS', duration: 21, difficulty: 'medium', points: 250, tasks: ['Identify limiting belief', 'Write new affirmation', 'Practice daily visualization'] },
  { id: 3, title: '30-Day Connection Sprint', description: 'Strengthen your relationships', layer: 'socialInstance', duration: 30, difficulty: 'medium', points: 350, tasks: ['Reach out to one person daily', 'Practice active listening', 'Express gratitude'] },
  { id: 4, title: '14-Day Mindfulness Journey', description: 'Build awareness and presence', layer: 'consciousUser', duration: 14, difficulty: 'easy', points: 150, tasks: ['5-min morning meditation', 'Mindful eating', 'Evening reflection'] },
  { id: 5, title: '7-Day Culture Audit', description: 'Identify cultural influences on your behavior', layer: 'culturalSoftware', duration: 7, difficulty: 'easy', points: 100, tasks: ['Journal cultural observations', 'Question inherited beliefs', 'Choose conscious responses'] },
  { id: 6, title: '30-Day Energy Boost', description: 'Transform your physical energy levels', layer: 'bioHardware', duration: 30, difficulty: 'hard', points: 500, tasks: ['Exercise routine', 'Nutrition tracking', 'Hydration goals'] },
];

const communityStats = {
  totalChallenges: 156,
  activeChallengers: 2847,
  completedToday: 423,
  topStreak: 89
};

export default function ChallengesPage() {
  const { t, getSection } = useLanguage();
  const challengeText = getSection('challenges');
  const commonText = getSection('common');
  const layersText = getSection('layers');
  const { awardXP, levelUpData, dismissLevelUp } = useXP();
  
  const translatedLayerNames = {
    bioHardware: layersText.bioHardware || 'Health & Energy',
    internalOS: layersText.internalOS || 'Mindset & Beliefs',
    culturalSoftware: layersText.culturalSoftware || 'Cultural Influences',
    socialInstance: layersText.socialInstance || 'Relationships',
    consciousUser: layersText.consciousUser || 'Awareness & Focus'
  };
  
  const [activeTab, setActiveTab] = useState('marketplace');
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userStats, setUserStats] = useState({ completed: 0, active: 0, points: 0, streak: 0 });
  const [hallOfFame, setHallOfFame] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', layerFocus: 'consciousUser', durationDays: 7, difficulty: 'medium' });

  useEffect(() => {
    fetchChallenges();
  }, [activeTab, selectedLayer, selectedDifficulty]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      if (activeTab === 'marketplace') {
        let url = `${API_URL}/api/challenges`;
        const params = new URLSearchParams();
        if (selectedLayer) params.append('layer', selectedLayer);
        if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();
        setChallenges(data.challenges || challengeTemplates);
      } else if (activeTab === 'my') {
        const res = await fetch(`${API_URL}/api/challenges/my-challenges`, { headers: getAuthHeaders() });
        const data = await res.json();
        setMyChallenges(data.challenges || []);
        
        const active = (data.challenges || []).filter(c => c.status === 'active').length;
        const completed = (data.challenges || []).filter(c => c.status === 'completed').length;
        setUserStats({ 
          active, 
          completed, 
          points: data.totalPoints || 0,
          streak: data.challengeStreak || 0
        });
      } else if (activeTab === 'hallOfFame') {
        const res = await fetch(`${API_URL}/api/challenges/hall-of-fame`, { headers: getAuthHeaders() });
        const data = await res.json();
        setHallOfFame(data.hallOfFame || []);
      } else if (activeTab === 'certificates') {
        const res = await fetch(`${API_URL}/api/challenges/certificates`, { headers: getAuthHeaders() });
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      if (activeTab === 'marketplace') {
        setChallenges(challengeTemplates);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const res = await fetch(`${API_URL}/api/challenges/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newChallenge)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateForm(false);
        setNewChallenge({ title: '', description: '', layerFocus: 'consciousUser', durationDays: 7, difficulty: 'medium' });
        setActiveTab('my');
        fetchChallenges();
      }
    } catch (err) {
      console.error('Failed to create challenge:', err);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      const res = await fetch(`${API_URL}/api/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        fetchChallenges();
        setSelectedTemplate(null);
      }
    } catch (err) {
      console.error('Failed to join challenge:', err);
    }
  };

  const handleUpdateProgress = async (challengeId, currentProgress, duration) => {
    const newProgress = Math.min(currentProgress + 1, duration);
    try {
      const res = await fetch(`${API_URL}/api/challenges/${challengeId}/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ progress: newProgress })
      });
      const data = await res.json();
      if (data.success) {
        fetchChallenges();
        if (data.isCompleted) {
          await awardXP('challenge_complete');
          alert(`Challenge completed! You earned ${data.pointsEarned} points!`);
        }
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const renderLayerFilter = () => (
    <div className="flex flex-wrap gap-2">
      {Object.entries(translatedLayerNames).map(([key, name]) => {
        const Icon = layerIcons[key];
        const isSelected = selectedLayer === key;
        return (
          <button
            key={key}
            onClick={() => setSelectedLayer(isSelected ? '' : key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isSelected 
                ? `bg-gradient-to-r ${layerColors[key]} text-white`
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{name}</span>
          </button>
        );
      })}
    </div>
  );

  const renderChallengeCard = (challenge, isMyChallenge = false) => {
    const LayerIcon = layerIcons[challenge.layer || challenge.layerFocus] || Target;
    
    return (
      <div 
        key={challenge.id} 
        className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${layerColors[challenge.layer || challenge.layerFocus] || 'from-gray-500 to-gray-600'}`}>
            <LayerIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">{challenge.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColors[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
            
            {challenge.tasks && !isMyChallenge && (
              <div className="mb-3 p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Daily Tasks:</p>
                <ul className="space-y-1">
                  {challenge.tasks.slice(0, 3).map((task, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {challenge.duration} days
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {challenge.points} pts
              </span>
              {!isMyChallenge && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {challenge.completions || Math.floor(Math.random() * 500) + 100} completed
                </span>
              )}
            </div>

            {isMyChallenge ? (
              <div>
                {challenge.status === 'completed' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed!</span>
                    </div>
                    <button className="flex items-center gap-1 text-purple-400 text-sm hover:text-purple-300">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Progress</span>
                      <span className="text-white font-medium">{challenge.progress}/{challenge.duration} days</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${challenge.percentComplete || (challenge.progress / challenge.duration * 100)}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleUpdateProgress(challenge.id, challenge.progress, challenge.duration)}
                      className="w-full py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Today Complete
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {challenge.isParticipating ? (
                  <span className="text-purple-400 text-sm flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    In Progress
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedTemplate(challenge)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Challenge
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderChallengePreview = () => {
    if (!selectedTemplate) return null;
    const challenge = selectedTemplate;
    const LayerIcon = layerIcons[challenge.layer || challenge.layerFocus] || Target;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className={`p-4 rounded-xl bg-gradient-to-r ${layerColors[challenge.layer || challenge.layerFocus]} mb-4 flex items-center gap-4`}>
            <LayerIcon className="w-10 h-10 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">{challenge.title}</h2>
              <p className="text-white/80 text-sm">{layerNames[challenge.layer || challenge.layerFocus]}</p>
            </div>
          </div>

          <p className="text-gray-300 mb-4">{challenge.description}</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-700 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-bold">{challenge.duration}</p>
              <p className="text-xs text-gray-400">Days</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-3 text-center">
              <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-white font-bold">{challenge.points}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-3 text-center">
              <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-white font-bold capitalize">{challenge.difficulty}</p>
              <p className="text-xs text-gray-400">Level</p>
            </div>
          </div>

          {challenge.tasks && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Daily Tasks:</h4>
              <ul className="space-y-2">
                {challenge.tasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-gray-300">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 mb-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">Completion Rewards</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• {challenge.points} XP points</li>
              <li>• Challenge completion badge</li>
              <li>• Progress toward next level</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
            >
              {commonText.cancel || 'Cancel'}
            </button>
            <button
              onClick={() => handleJoinChallenge(challenge.id)}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Challenge Preview Modal */}
      {renderChallengePreview()}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          {challengeText.title || 'Challenge Marketplace'}
        </h1>
        <p className="text-gray-400">{challengeText.subtitle || 'Take on challenges to boost your StackScore'}</p>
      </div>

      {/* Community Stats Banner */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{communityStats.totalChallenges}</p>
            <p className="text-xs text-gray-400">Challenges</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{communityStats.activeChallengers.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Active Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{communityStats.completedToday}</p>
            <p className="text-xs text-gray-400">Completed Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-400">{communityStats.topStreak}</p>
            <p className="text-xs text-gray-400">Top Streak</p>
          </div>
        </div>
      </div>

      {/* User Stats (when on My Challenges tab) */}
      {activeTab === 'my' && (
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.streak}</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <Play className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.active}</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.completed}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.points}</p>
            <p className="text-xs text-gray-400">XP</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'marketplace' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          {challengeText.available || 'Marketplace'}
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'my' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {challengeText.myChallenges || 'My Challenges'}
        </button>
        <button
          onClick={() => setActiveTab('hallOfFame')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'hallOfFame' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Hall of Fame
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'certificates' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          Certificates
        </button>
      </div>

      {/* Filters */}
      {activeTab === 'marketplace' && (
        <div className="space-y-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          
          {showFilters && (
            <div className="space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div>
                <p className="text-sm text-gray-400 mb-2">Filter by Layer:</p>
                {renderLayerFilter()}
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Filter by Difficulty:</p>
                <div className="flex gap-2">
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        selectedDifficulty === diff
                          ? difficultyColors[diff]
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Challenge Button */}
      {activeTab === 'marketplace' && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Create Your Own Challenge
          </button>
        </div>
      )}

      {/* Create Challenge Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-white mb-4">Create New Challenge</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Challenge Title</label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  className="w-full p-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., 30-Day Gratitude Practice"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  className="w-full p-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  rows={3}
                  placeholder="What is this challenge about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={newChallenge.durationDays}
                    onChange={(e) => setNewChallenge({...newChallenge, durationDays: parseInt(e.target.value) || 7})}
                    className="w-full p-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChallenge}
                  disabled={!newChallenge.title || !newChallenge.description}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  Create & Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {activeTab === 'marketplace' && (
            (challenges.length > 0 ? challenges : challengeTemplates)
              .filter(c => !selectedLayer || c.layer === selectedLayer || c.layerFocus === selectedLayer)
              .filter(c => !selectedDifficulty || c.difficulty === selectedDifficulty)
              .map(c => renderChallengeCard(c))
          )}

          {activeTab === 'my' && (
            myChallenges.length > 0 ? (
              <>
                {myChallenges.filter(c => c.status === 'active').length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      Active Challenges
                    </h3>
                    <div className="grid gap-4">
                      {myChallenges.filter(c => c.status === 'active').map(c => renderChallengeCard(c, true))}
                    </div>
                  </div>
                )}

                {myChallenges.filter(c => c.status === 'completed').length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Completed Challenges
                    </h3>
                    <div className="grid gap-4">
                      {myChallenges.filter(c => c.status === 'completed').map(c => renderChallengeCard(c, true))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Active Challenges</h3>
                <p className="text-gray-400 mb-4">Start a challenge from the marketplace to begin your journey!</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  Browse Challenges
                </button>
              </div>
            )
          )}

          {activeTab === 'hallOfFame' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-white">Challenge Champions</h2>
                <p className="text-gray-400 text-sm">Top challenge completers in our community</p>
              </div>
              {hallOfFame.length > 0 ? (
                hallOfFame.map((user, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    user.isCurrentUser 
                      ? 'bg-purple-900/30 border border-purple-500/50' 
                      : 'bg-slate-800/50 hover:bg-slate-800'
                  }`}>
                    <div className="w-10 text-center">
                      {user.rank <= 3 ? (
                        <span className={`text-2xl ${user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-300' : 'text-amber-600'}`}>
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium">#{user.rank}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="font-bold text-white">{user.displayName?.[0] || 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${user.isCurrentUser ? 'text-purple-400' : 'text-white'}`}>
                        {user.displayName} {user.isCurrentUser && '(You)'}
                      </p>
                      <p className="text-xs text-gray-500">{user.completedCount} challenges completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">{user.totalPoints} pts</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Complete challenges to join the Hall of Fame!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Award className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-white">Your Certificates</h2>
                <p className="text-gray-400 text-sm">Proof of your accomplishments</p>
              </div>
              {certificates.length > 0 ? (
                certificates.map((cert, i) => (
                  <div key={i} className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-yellow-500/20">
                        <Award className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{cert.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{cert.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          <span>Duration: {cert.duration} days</span>
                          <span>Points: {cert.points}</span>
                          <span>Completed: {new Date(cert.completedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Certificate Code:</p>
                          <p className="text-purple-400 font-mono text-sm">{cert.certificateCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Complete challenges to earn certificates!</p>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                  >
                    Browse Challenges
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {levelUpData && (
        <LevelUpCelebration
          newLevel={levelUpData.newLevel}
          unlockedFeatures={levelUpData.unlockedFeatures}
          onClose={dismissLevelUp}
        />
      )}
    </div>
  );
}
