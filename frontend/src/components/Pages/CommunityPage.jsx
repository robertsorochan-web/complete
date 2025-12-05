import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, ThumbsUp, Send, UserPlus, Trophy, Sparkles, Code, Brain, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const groupIcons = {
  'heart-pulse': Heart,
  'brain': Brain,
  'code': Code,
  'users': Users,
  'cpu': Brain
};

const layerColors = {
  bioHardware: 'from-red-500 to-pink-500',
  internalOS: 'from-blue-500 to-cyan-500',
  culturalSoftware: 'from-purple-500 to-violet-500',
  socialInstance: 'from-green-500 to-emerald-500',
  consciousUser: 'from-yellow-500 to-orange-500'
};

export default function CommunityPage() {
  const { t, getSection } = useLanguage();
  const communityText = getSection('community');
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState([]);
  const [insights, setInsights] = useState([]);
  const [stories, setStories] = useState([]);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newInsight, setNewInsight] = useState({ text: '', layer: 'bioHardware', improvement: 10 });
  const [showNewInsight, setShowNewInsight] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'groups') {
        const res = await fetch(`${API_URL}/api/community/groups`, { headers: getAuthHeaders() });
        const data = await res.json();
        setGroups(data.groups || []);
      } else if (activeTab === 'insights') {
        const res = await fetch(`${API_URL}/api/community/insights`, { headers: getAuthHeaders() });
        const data = await res.json();
        setInsights(data.insights || []);
      } else if (activeTab === 'stories') {
        const res = await fetch(`${API_URL}/api/community/stories`, { headers: getAuthHeaders() });
        const data = await res.json();
        setStories(data.stories || []);
      } else if (activeTab === 'partner') {
        const res = await fetch(`${API_URL}/api/community/partners/my-partner`, { headers: getAuthHeaders() });
        const data = await res.json();
        setPartner(data);
      }
    } catch (err) {
      console.error('Failed to fetch community data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await fetch(`${API_URL}/api/community/groups/${groupId}/join`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      fetchData();
    } catch (err) {
      console.error('Failed to join group:', err);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await fetch(`${API_URL}/api/community/groups/${groupId}/leave`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      fetchData();
    } catch (err) {
      console.error('Failed to leave group:', err);
    }
  };

  const handleLikeInsight = async (insightId) => {
    try {
      await fetch(`${API_URL}/api/community/insights/${insightId}/like`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      setInsights(prev => prev.map(i => 
        i.id === insightId ? { ...i, likes: i.likes + 1 } : i
      ));
    } catch (err) {
      console.error('Failed to like insight:', err);
    }
  };

  const handleShareInsight = async () => {
    if (!newInsight.text.trim()) return;
    
    try {
      await fetch(`${API_URL}/api/community/insights`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          insightText: newInsight.text,
          layer: newInsight.layer,
          improvementValue: newInsight.improvement
        })
      });
      setNewInsight({ text: '', layer: 'bioHardware', improvement: 10 });
      setShowNewInsight(false);
      fetchData();
    } catch (err) {
      console.error('Failed to share insight:', err);
    }
  };

  const handleRequestPartner = async () => {
    try {
      const res = await fetch(`${API_URL}/api/community/partners/request`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      alert(data.message);
      fetchData();
    } catch (err) {
      console.error('Failed to request partner:', err);
    }
  };

  const tabs = [
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'stories', label: 'Success Stories', icon: Trophy },
    { id: 'partner', label: 'Accountability', icon: UserPlus }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Stack Community</h1>
        <p className="text-gray-400">Connect, share, and grow together</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="grid md:grid-cols-2 gap-4">
              {groups.map(group => {
                const IconComponent = groupIcons[group.icon] || Users;
                return (
                  <div key={group.id} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${layerColors[group.theme] || 'from-gray-500 to-gray-600'}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{group.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{group.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            <Users className="w-4 h-4 inline mr-1" />
                            {group.memberCount} members
                          </span>
                          {group.isMember ? (
                            <button
                              onClick={() => handleLeaveGroup(group.id)}
                              className="px-4 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
                            >
                              Leave
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinGroup(group.id)}
                              className="px-4 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                            >
                              Join
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowNewInsight(!showNewInsight)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Share Your Insight
              </button>

              {showNewInsight && (
                <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/30">
                  <textarea
                    value={newInsight.text}
                    onChange={(e) => setNewInsight(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Share what you've learned (e.g., 'My Bio score improved 20% after fixing my sleep schedule!')"
                    className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none mb-4"
                    rows={3}
                  />
                  <div className="flex flex-wrap gap-4 items-center">
                    <select
                      value={newInsight.layer}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, layer: e.target.value }))}
                      className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    >
                      <option value="bioHardware">Bio Hardware</option>
                      <option value="internalOS">Internal OS</option>
                      <option value="culturalSoftware">Cultural Software</option>
                      <option value="socialInstance">Social Instance</option>
                      <option value="consciousUser">Conscious User</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Improvement:</span>
                      <input
                        type="number"
                        value={newInsight.improvement}
                        onChange={(e) => setNewInsight(prev => ({ ...prev, improvement: parseInt(e.target.value) }))}
                        className="w-16 bg-slate-700 text-white rounded-lg px-2 py-1 border border-slate-600"
                        min="1"
                        max="100"
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                    <button
                      onClick={handleShareInsight}
                      className="ml-auto px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {insights.map(insight => (
                  <div key={insight.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${layerColors[insight.layer] || 'from-gray-500 to-gray-600'}`}>
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{insight.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-green-400">+{insight.improvement}% improvement</span>
                          <button
                            onClick={() => handleLikeInsight(insight.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{insight.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {insights.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No insights shared yet. Be the first to share!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Stories Tab */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              {stories.map(story => (
                <div key={story.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{story.author}</p>
                      <p className="text-gray-400 text-sm">{story.improvementType} • +{story.improvementPercentage}%</p>
                    </div>
                  </div>
                  {story.title && <h3 className="text-lg font-bold text-white mb-2">{story.title}</h3>}
                  <p className="text-gray-300">{story.story}</p>
                </div>
              ))}

              {stories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No success stories yet. Keep working on your stack!
                </div>
              )}
            </div>
          )}

          {/* Accountability Partner Tab */}
          {activeTab === 'partner' && (
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
              {partner?.hasPartner ? (
                <div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Accountability Partner</h3>
                  <p className="text-2xl text-purple-400 font-medium mb-2">{partner.partner.name}</p>
                  <p className="text-gray-400 mb-4">{partner.partner.streak} day streak</p>
                  <p className="text-sm text-gray-500">
                    Matched since {new Date(partner.partner.matchedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Find an Accountability Partner</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Get matched with someone on a similar journey. Support each other, share progress, and stay accountable.
                  </p>
                  <button
                    onClick={handleRequestPartner}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Find My Partner
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
