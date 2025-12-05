import React, { useState, useEffect } from 'react';
import { Target, Trophy, Clock, Star, ChevronRight, CheckCircle, Play, Users, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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

export default function ChallengesPage() {
  const { t, getSection } = useLanguage();
  const challengeText = getSection('challenges');
  const [activeTab, setActiveTab] = useState('available');
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

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
      if (activeTab === 'available') {
        let url = `${API_URL}/api/challenges`;
        const params = new URLSearchParams();
        if (selectedLayer) params.append('layer', selectedLayer);
        if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();
        setChallenges(data.challenges || []);
      } else {
        const res = await fetch(`${API_URL}/api/challenges/my-challenges`, { headers: getAuthHeaders() });
        const data = await res.json();
        setMyChallenges(data.challenges || []);
      }
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
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
          alert(`Challenge completed! You earned ${data.pointsEarned} points!`);
        }
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const renderChallengeCard = (challenge, isMyChallenge = false) => (
    <div 
      key={challenge.id} 
      className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${layerColors[challenge.layerFocus] || 'from-gray-500 to-gray-600'}`}>
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
          
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
                {challenge.completions} completed
              </span>
            )}
          </div>

          {isMyChallenge ? (
            <div>
              {challenge.status === 'completed' ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed!</span>
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
                      style={{ width: `${challenge.percentComplete}%` }}
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
                  onClick={() => handleJoinChallenge(challenge.id)}
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Challenge Marketplace
        </h1>
        <p className="text-gray-400">Take on challenges to boost your StackScore</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'available' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          Available Challenges
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'my' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          My Challenges
        </button>
      </div>

      {/* Filters (only for available tab) */}
      {activeTab === 'available' && (
        <div className="flex flex-wrap gap-3 justify-center">
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
          >
            <option value="">All Layers</option>
            <option value="bioHardware">Bio Hardware</option>
            <option value="internalOS">Internal OS</option>
            <option value="culturalSoftware">Cultural Software</option>
            <option value="socialInstance">Social Instance</option>
            <option value="consciousUser">Conscious User</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {activeTab === 'available' ? (
            challenges.length > 0 ? (
              challenges.map(c => renderChallengeCard(c))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No challenges found. Try adjusting your filters.
              </div>
            )
          ) : (
            myChallenges.length > 0 ? (
              <>
                {/* Active Challenges */}
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

                {/* Completed Challenges */}
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
              <div className="text-center py-12 text-gray-500">
                You haven't joined any challenges yet. Check out the available challenges!
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
