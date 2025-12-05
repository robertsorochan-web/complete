import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight, Heart, Share2, RefreshCw, Bookmark, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const layerColors = {
  bioHardware: 'from-red-500 to-pink-500',
  internalOS: 'from-blue-500 to-cyan-500',
  culturalSoftware: 'from-purple-500 to-violet-500',
  socialInstance: 'from-green-500 to-emerald-500',
  consciousUser: 'from-yellow-500 to-orange-500'
};

const layerIcons = {
  bioHardware: '💪',
  internalOS: '🧠',
  culturalSoftware: '🎭',
  socialInstance: '👥',
  consciousUser: '👁️'
};

const layerNames = {
  bioHardware: 'Bio Hardware',
  internalOS: 'Internal OS',
  culturalSoftware: 'Cultural Software',
  socialInstance: 'Social Instance',
  consciousUser: 'Conscious User'
};

const TipOfTheDay = ({ compact = false }) => {
  const { t, getSection } = useLanguage();
  const tipsText = getSection('tips');
  const commonText = getSection('common');
  
  const [currentTip, setCurrentTip] = useState(null);
  const [allTips, setAllTips] = useState([]);
  const [savedTips, setSavedTips] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchTodayTip();
    fetchAllTips();
    fetchSavedTips();
  }, []);

  const fetchTodayTip = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tips/today`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.tip) {
        setCurrentTip(data.tip);
      }
    } catch (err) {
      console.error('Failed to fetch today tip:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTips = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tips/all`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setAllTips(data.tips || []);
    } catch (err) {
      console.error('Failed to fetch all tips:', err);
    }
  };

  const fetchSavedTips = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tips/saved`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSavedTips(data.savedTips || []);
    } catch (err) {
      console.error('Failed to fetch saved tips:', err);
    }
  };

  const getFilteredTips = () => {
    if (selectedLayer) {
      return allTips.filter(tip => tip.layer === selectedLayer);
    }
    return allTips;
  };

  const handlePrevious = () => {
    const tips = getFilteredTips();
    if (tips.length === 0) return;
    const newIndex = currentIndex === 0 ? tips.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentTip(tips[newIndex]);
  };

  const handleNext = () => {
    const tips = getFilteredTips();
    if (tips.length === 0) return;
    const newIndex = currentIndex === tips.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setCurrentTip(tips[newIndex]);
  };

  const handleRandom = async () => {
    try {
      const url = selectedLayer 
        ? `${API_URL}/api/tips/random?layer=${selectedLayer}`
        : `${API_URL}/api/tips/random`;
      
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.tip) {
        setCurrentTip(data.tip);
        const tips = getFilteredTips();
        const idx = tips.findIndex(t => t.id === data.tip.id);
        if (idx >= 0) setCurrentIndex(idx);
      }
    } catch (err) {
      console.error('Failed to fetch random tip:', err);
    }
  };

  const handleSaveTip = async () => {
    if (!currentTip || saving) return;
    setSaving(true);
    
    try {
      const isSaved = currentTip.isSaved || savedTips.some(t => t.id === currentTip.id);
      
      if (isSaved) {
        await fetch(`${API_URL}/api/tips/save/${currentTip.id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        setSavedTips(prev => prev.filter(t => t.id !== currentTip.id));
        setCurrentTip(prev => ({ ...prev, isSaved: false }));
      } else {
        await fetch(`${API_URL}/api/tips/save/${currentTip.id}`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        setSavedTips(prev => [...prev, { ...currentTip, isSaved: true }]);
        setCurrentTip(prev => ({ ...prev, isSaved: true }));
      }
    } catch (err) {
      console.error('Failed to save/unsave tip:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!currentTip) return;
    
    const text = `💡 ${currentTip.title}: ${currentTip.content}\n\n✅ Action Step: ${currentTip.actionStep}\n\n- From Akↄfa Fixit`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(text);
          alert(tipsText.copiedToClipboard || 'Tip copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(tipsText.copiedToClipboard || 'Tip copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentTip) {
    return null;
  }

  const isSaved = currentTip.isSaved || savedTips.some(t => t.id === currentTip.id);
  const filteredTips = getFilteredTips();

  if (compact) {
    return (
      <div className={`bg-gradient-to-r ${layerColors[currentTip.layer]} bg-opacity-20 rounded-xl p-4 border border-amber-500/30`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">{layerIcons[currentTip.layer]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">{tipsText.title || 'Tip of the Day'}</span>
            </div>
            <p className="text-white text-sm font-medium mb-1">{currentTip.title}</p>
            <p className="text-gray-300 text-sm">{currentTip.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">{tipsText.title || 'Stack Tip of the Day'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                showSaved ? 'bg-amber-500 text-white' : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              {commonText.saved || 'Saved'} ({savedTips.length})
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-700 bg-slate-900/30">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => {
              setSelectedLayer(null);
              setCurrentIndex(0);
              if (allTips.length > 0) setCurrentTip(allTips[0]);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedLayer === null
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            {tipsText.allLayers || 'All Layers'}
          </button>
          {Object.entries(layerNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLayer(key);
                setCurrentIndex(0);
                const layerTips = allTips.filter(t => t.layer === key);
                if (layerTips.length > 0) setCurrentTip(layerTips[0]);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedLayer === key
                  ? `bg-gradient-to-r ${layerColors[key]} text-white`
                  : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              <span>{layerIcons[key]}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {showSaved ? (
          <div className="space-y-3">
            {savedTips.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">{tipsText.noSavedTips || 'No saved tips yet.'}</p>
                <p className="text-gray-600 text-sm mt-1">{tipsText.clickHeart || 'Click the heart to save tips!'}</p>
              </div>
            ) : (
              savedTips.map(tip => (
                <div 
                  key={tip.id} 
                  className={`bg-gradient-to-r ${layerColors[tip.layer]} bg-opacity-10 rounded-lg p-4 border border-slate-600 cursor-pointer hover:border-slate-500 transition-all`}
                  onClick={() => {
                    setCurrentTip(tip);
                    setShowSaved(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{layerIcons[tip.layer]}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{tip.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs bg-gradient-to-r ${layerColors[tip.layer]} text-white`}>
                          {layerNames[tip.layer]}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{tip.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${layerColors[currentTip.layer]} text-white flex items-center gap-1`}>
                {layerIcons[currentTip.layer]} {layerNames[currentTip.layer]}
              </span>
              <span className="text-gray-500 text-sm">
                {currentIndex + 1} / {filteredTips.length}
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{layerIcons[currentTip.layer]}</div>
              <h4 className="text-xl text-white font-bold mb-3">{currentTip.title}</h4>
              <p className="text-lg text-gray-300 mb-4">{currentTip.content}</p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">{tipsText.tryToday || 'Try this today:'}</p>
                <p className="text-green-400 font-medium">{currentTip.actionStep}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.previousTip || 'Previous tip'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.nextTip || 'Next tip'}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRandom}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.randomTip || 'Random tip'}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveTip}
                  disabled={saving}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-700 hover:bg-slate-600 text-gray-400'
                  }`}
                  title={isSaved ? (tipsText.unsave || 'Unsave') : (tipsText.saveTip || 'Save tip')}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title={tipsText.shareTip || 'Share tip'}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
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
};

export default TipOfTheDay;
