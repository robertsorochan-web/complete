import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, ThumbsUp, Send, UserPlus, Trophy, Sparkles, Code, Brain, Eye, Hash, Filter, TrendingUp, Star, Flame, Clock, Search, Award, Bookmark, Share2, MoreHorizontal, Flag, ChevronDown } from 'lucide-react';
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

const layerNames = {
  bioHardware: 'Bio Hardware',
  internalOS: 'Internal OS',
  culturalSoftware: 'Cultural Software',
  socialInstance: 'Social Instance',
  consciousUser: 'Conscious User'
};

const trendingHashtags = [
  { tag: 'SleepReset', count: 234 },
  { tag: 'MindsetShift', count: 189 },
  { tag: 'StreakGoals', count: 167 },
  { tag: '30DayChallenge', count: 145 },
  { tag: 'MorningRoutine', count: 132 },
  { tag: 'GratitudeJournal', count: 98 },
  { tag: 'StackWin', count: 87 },
  { tag: 'BiohackingTips', count: 76 }
];

const featuredPosts = [
  {
    id: 'featured-1',
    author: 'Sarah K.',
    avatar: '🌟',
    text: "After 30 days of focusing on my Bio Hardware layer, my energy levels are through the roof! The key was consistent sleep and morning sunlight. #SleepReset #BiohackingTips",
    layer: 'bioHardware',
    improvement: 45,
    likes: 89,
    comments: 12,
    isFeatured: true,
    timestamp: '2 days ago'
  },
  {
    id: 'featured-2',
    author: 'David O.',
    avatar: '🧠',
    text: "Biggest mindset shift: I stopped saying 'I have to' and started saying 'I get to'. Small change, huge impact on my Internal OS! #MindsetShift #StackWin",
    layer: 'internalOS',
    improvement: 35,
    likes: 156,
    comments: 28,
    isFeatured: true,
    timestamp: '1 week ago'
  }
];

const defaultPosts = [
  {
    id: 'post-1',
    author: 'Kofi A.',
    avatar: '💪',
    text: "Just hit my 21-day streak! The daily check-ins really keep me accountable. #StreakGoals #30DayChallenge",
    layer: 'consciousUser',
    improvement: 28,
    likes: 45,
    comments: 8,
    timestamp: '3 hours ago'
  },
  {
    id: 'post-2',
    author: 'Ama B.',
    avatar: '🌅',
    text: "Morning routine game changer: 10 min meditation + gratitude journal before phone. My Internal OS score jumped from 4 to 7! #MorningRoutine #GratitudeJournal",
    layer: 'internalOS',
    improvement: 30,
    likes: 67,
    comments: 15,
    timestamp: '5 hours ago'
  },
  {
    id: 'post-3',
    author: 'Emeka N.',
    avatar: '🤝',
    text: "Found my accountability partner through this app. We check in every morning. Social Instance score: 9/10! #StackWin",
    layer: 'socialInstance',
    improvement: 40,
    likes: 34,
    comments: 6,
    timestamp: '1 day ago'
  }
];

export default function CommunityPage() {
  const { t, getSection } = useLanguage();
  const communityText = getSection('community');
  const commonText = getSection('common');
  const [activeTab, setActiveTab] = useState('feed');
  const [groups, setGroups] = useState([]);
  const [insights, setInsights] = useState([]);
  const [stories, setStories] = useState([]);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newInsight, setNewInsight] = useState({ text: '', layer: 'bioHardware', improvement: 10 });
  const [showNewInsight, setShowNewInsight] = useState(false);
  const [feedFilter, setFeedFilter] = useState('recent');
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);
  const [showPostMenu, setShowPostMenu] = useState(null);

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
      } else if (activeTab === 'feed' || activeTab === 'insights') {
        const res = await fetch(`${API_URL}/api/community/insights`, { headers: getAuthHeaders() });
        const data = await res.json();
        setInsights(data.insights || defaultPosts);
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
      if (activeTab === 'feed' || activeTab === 'insights') {
        setInsights(defaultPosts);
      }
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

  const handleSavePost = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(prev => prev.filter(id => id !== postId));
    } else {
      setSavedPosts(prev => [...prev, postId]);
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

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches || [];
  };

  const highlightHashtags = (text) => {
    return text.replace(/#(\w+)/g, '<span class="text-purple-400 cursor-pointer hover:underline">#$1</span>');
  };

  const filterPosts = (posts) => {
    let filtered = [...posts];
    
    if (selectedHashtag) {
      filtered = filtered.filter(post => 
        post.text.toLowerCase().includes(`#${selectedHashtag.toLowerCase()}`)
      );
    }
    
    if (selectedLayer) {
      filtered = filtered.filter(post => post.layer === selectedLayer);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (feedFilter === 'top') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (feedFilter === 'featured') {
      filtered = filtered.filter(post => post.isFeatured);
    }
    
    return filtered;
  };

  const tabs = [
    { id: 'feed', label: communityText.feed || 'Feed', icon: Sparkles },
    { id: 'groups', label: communityText.groups || 'Groups', icon: Users },
    { id: 'stories', label: communityText.stories || 'Success Stories', icon: Trophy },
    { id: 'partner', label: communityText.partner || 'Accountability', icon: UserPlus }
  ];

  const renderPost = (post) => (
    <div 
      key={post.id} 
      className={`bg-slate-800/50 rounded-xl p-5 border transition-all ${
        post.isFeatured 
          ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20' 
          : 'border-slate-700 hover:border-purple-500/30'
      }`}
    >
      {post.isFeatured && (
        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-3">
          <Star className="w-4 h-4" />
          <span className="font-medium">{communityText.featuredPost || 'Featured Post'}</span>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${layerColors[post.layer] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-xl`}>
          {post.avatar || '🌟'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-white">{post.author}</span>
              <span className="text-gray-500 text-sm ml-2">{post.timestamp}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showPostMenu === post.id && (
                <div className="absolute right-0 top-8 bg-slate-700 rounded-lg shadow-lg z-10 py-1 min-w-[150px]">
                  <button
                    onClick={() => { handleSavePost(post.id); setShowPostMenu(null); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-600 flex items-center gap-2"
                  >
                    <Bookmark className={`w-4 h-4 ${savedPosts.includes(post.id) ? 'fill-purple-400 text-purple-400' : ''}`} />
                    {savedPosts.includes(post.id) ? (communityText.saved || 'Saved') : (communityText.save || 'Save')}
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-600 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {communityText.shareAction || 'Share'}
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-600 flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    {communityText.report || 'Report'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p 
            className="text-gray-300 mb-3"
            dangerouslySetInnerHTML={{ __html: highlightHashtags(post.text) }}
            onClick={(e) => {
              if (e.target.tagName === 'SPAN' && e.target.textContent.startsWith('#')) {
                setSelectedHashtag(e.target.textContent.slice(1));
              }
            }}
          />
          
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${layerColors[post.layer]} text-white`}>
              {layerNames[post.layer]}
            </span>
            {post.improvement && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{post.improvement}%
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLikeInsight(post.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <button
              onClick={() => handleSavePost(post.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Bookmark className={`w-5 h-5 ${savedPosts.includes(post.id) ? 'fill-purple-400 text-purple-400' : ''}`} />
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors ml-auto">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-purple-500" />
          {communityText.title || 'Stack Community'}
        </h1>
        <p className="text-gray-400">{communityText.subtitle || 'Connect, share, and grow together'}</p>
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
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={communityText.searchPosts || 'Search posts...'}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-lg text-white placeholder-gray-500 border border-slate-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-gray-400 hover:text-white transition border border-slate-700"
                >
                  <Filter className="w-4 h-4" />
                  {communityText.filters || 'Filters'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{communityText.sortBy || 'Sort by:'}</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'recent', label: communityText.sortRecent || 'Recent', icon: Clock },
                        { id: 'top', label: communityText.sortTop || 'Top', icon: TrendingUp },
                        { id: 'featured', label: communityText.sortFeatured || 'Featured', icon: Star }
                      ].map(filter => {
                        const Icon = filter.icon;
                        return (
                          <button
                            key={filter.id}
                            onClick={() => setFeedFilter(filter.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                              feedFilter === filter.id 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {filter.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{communityText.filterByLayer || 'Filter by layer:'}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedLayer('')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition ${
                          !selectedLayer ? 'bg-purple-500 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                        }`}
                      >
                        {communityText.allLayers || 'All'}
                      </button>
                      {Object.entries(layerNames).map(([key, name]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedLayer(key)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition ${
                            selectedLayer === key 
                              ? `bg-gradient-to-r ${layerColors[key]} text-white` 
                              : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Trending Hashtags */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">{communityText.trendingTopics || 'Trending Topics'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.map(hashtag => (
                    <button
                      key={hashtag.tag}
                      onClick={() => setSelectedHashtag(selectedHashtag === hashtag.tag ? null : hashtag.tag)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${
                        selectedHashtag === hashtag.tag
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600 hover:text-white'
                      }`}
                    >
                      <span>#{hashtag.tag}</span>
                      <span className="text-xs text-gray-500">{hashtag.count}</span>
                    </button>
                  ))}
                </div>
                {selectedHashtag && (
                  <button
                    onClick={() => setSelectedHashtag(null)}
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                  >
                    {communityText.clearFilter || 'Clear filter'}
                  </button>
                )}
              </div>

              {/* New Post Button */}
              <button
                onClick={() => setShowNewInsight(!showNewInsight)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {communityText.share || 'Share Your Win'}
              </button>

              {/* New Post Form */}
              {showNewInsight && (
                <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/30">
                  <textarea
                    value={newInsight.text}
                    onChange={(e) => setNewInsight(prev => ({ ...prev, text: e.target.value }))}
                    placeholder={communityText.sharePlaceholder || 'Share your progress, tip, or win! Use #hashtags to join the conversation...'}
                    className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none mb-4"
                    rows={4}
                  />
                  <div className="flex flex-wrap gap-4 items-center">
                    <select
                      value={newInsight.layer}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, layer: e.target.value }))}
                      className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                    >
                      {Object.entries(layerNames).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{communityText.improvement || 'Improvement:'}</span>
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
                      {communityText.post || 'Post'}
                    </button>
                  </div>
                </div>
              )}

              {/* Featured Posts */}
              {feedFilter !== 'featured' && filterPosts(featuredPosts).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    {communityText.featuredLabel || 'Featured'}
                  </h3>
                  {filterPosts(featuredPosts).slice(0, 2).map(post => renderPost(post))}
                </div>
              )}

              {/* All Posts */}
              <div className="space-y-3">
                {feedFilter !== 'featured' && (
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {feedFilter === 'recent' && <Clock className="w-5 h-5 text-blue-400" />}
                    {feedFilter === 'top' && <TrendingUp className="w-5 h-5 text-green-400" />}
                    {feedFilter === 'recent' ? (communityText.recentPostsLabel || 'Recent Posts') : (communityText.topPostsLabel || 'Top Posts')}
                  </h3>
                )}
                {filterPosts([...insights, ...(feedFilter === 'featured' ? featuredPosts : [])]).map(post => renderPost(post))}
                
                {filterPosts([...insights]).length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    {selectedHashtag 
                      ? (communityText.noPostsWithHashtag || `No posts found with #${selectedHashtag}`)
                      : (communityText.noPostsYet || 'No posts found. Be the first to share!')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="grid md:grid-cols-2 gap-4">
              {groups.length > 0 ? groups.map(group => {
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
                            {group.memberCount} {communityText.members || 'members'}
                          </span>
                          {group.isMember ? (
                            <button
                              onClick={() => handleLeaveGroup(group.id)}
                              className="px-4 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
                            >
                              {communityText.leave || 'Leave'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinGroup(group.id)}
                              className="px-4 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                            >
                              {communityText.join || 'Join'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  {communityText.noGroupsYet || 'No groups available yet. Check back soon!'}
                </div>
              )}
            </div>
          )}

          {/* Success Stories Tab */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              {stories.length > 0 ? stories.map(story => (
                <div key={story.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{story.author}</p>
                      <p className="text-gray-400 text-sm">{story.improvementType} • +{story.improvementPercentage}%</p>
                    </div>
                  </div>
                  {story.title && <h3 className="text-lg font-bold text-white mb-2">{story.title}</h3>}
                  <p className="text-gray-300">{story.story}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{story.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors ml-auto">
                      <Share2 className="w-5 h-5" />
                      {communityText.shareAction || 'Share'}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{communityText.noStoriesYet || 'No Success Stories Yet'}</h3>
                  <p>{communityText.keepWorkingOnStack || 'Keep working on your stack and share your journey!'}</p>
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
                  <h3 className="text-xl font-bold text-white mb-2">{communityText.yourPartner || 'Your Accountability Partner'}</h3>
                  <p className="text-2xl text-purple-400 font-medium mb-2">{partner.partner.name}</p>
                  <p className="text-gray-400 mb-4 flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    {partner.partner.streak} {communityText.dayStreak || 'day streak'}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    {communityText.matchedSince || 'Matched since'} {new Date(partner.partner.matchedAt).toLocaleDateString()}
                  </p>
                  <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 mx-auto">
                    <MessageCircle className="w-5 h-5" />
                    {communityText.sendMessage || 'Send Message'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{communityText.findPartner || 'Find an Accountability Partner'}</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {communityText.findPartnerDesc || 'Get matched with someone on a similar journey. Support each other, share progress, and stay accountable.'}
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <Users className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-white font-bold">2x</p>
                      <p className="text-xs text-gray-400">{communityText.moreLikelySucceed || 'More likely to succeed'}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                      <p className="text-white font-bold">65%</p>
                      <p className="text-xs text-gray-400">{communityText.higherCompletion || 'Higher completion'}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                      <p className="text-white font-bold">3x</p>
                      <p className="text-xs text-gray-400">{communityText.fasterProgress || 'Faster progress'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRequestPartner}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    {communityText.findMyPartner || 'Find My Partner'}
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
