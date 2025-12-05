import React, { useState, useRef, useEffect } from 'react';
import { Share2, Download, Copy, Check, Palette, Image, X, TrendingUp, Trophy, Star, Zap, Target } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CARD_TEMPLATES = [
  {
    id: 'gradient',
    name: 'Gradient',
    bgClass: 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500',
    textClass: 'text-white',
    accentClass: 'bg-white/20',
    iconColor: 'text-yellow-300'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    bgClass: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    textClass: 'text-white',
    accentClass: 'bg-slate-700/50',
    iconColor: 'text-purple-400'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    bgClass: 'bg-gradient-to-br from-green-400 via-cyan-500 to-blue-600',
    textClass: 'text-white',
    accentClass: 'bg-white/20',
    iconColor: 'text-yellow-200'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bgClass: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    textClass: 'text-white',
    accentClass: 'bg-white/20',
    iconColor: 'text-yellow-200'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bgClass: 'bg-gradient-to-br from-blue-800 via-blue-600 to-teal-500',
    textClass: 'text-white',
    accentClass: 'bg-white/15',
    iconColor: 'text-cyan-300'
  },
  {
    id: 'gold',
    name: 'Gold',
    bgClass: 'bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-500',
    textClass: 'text-white',
    accentClass: 'bg-black/15',
    iconColor: 'text-yellow-200'
  }
];

const tierColors = {
  'Novice': '#808080',
  'Practitioner': '#4A90A4',
  'Adept': '#CD7F32',
  'Master': '#C0C0C0',
  'Guru': '#FFD700'
};

const tierEmojis = {
  'Novice': '🌱',
  'Practitioner': '📚',
  'Adept': '🔥',
  'Master': '💎',
  'Guru': '👑'
};

export default function StackShareCard({ isOpen, onClose }) {
  const { getSection } = useLanguage();
  const shareText = getSection('share') || {};
  const cardRef = useRef(null);
  
  const [scoreData, setScoreData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0]);
  const [showUsername, setShowUsername] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchData = async () => {
    try {
      const [scoreRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/stackscore`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/profile`, { headers: getAuthHeaders() })
      ]);

      const score = await scoreRes.json();
      const profile = await profileRes.json();

      setScoreData(score);
      setUserData(profile);
    } catch (err) {
      console.error('Failed to fetch share card data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!cardRef.current) return null;
    
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      return canvas;
    } catch (err) {
      console.error('Failed to generate image:', err);
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const canvas = await generateImage();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `akofa-stackscore-${scoreData?.score || 0}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleShare = async () => {
    const canvas = await generateImage();
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'akofa-stackscore.png', { type: 'image/png' });
        const shareData = {
          title: shareText.shareTitle || 'My Akↄfa StackScore',
          text: `My StackScore is ${scoreData?.score || 0}! I'm a ${scoreData?.tier || 'Novice'} on my wellness journey. #AkofaFixit`,
          files: [file]
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else if (navigator.share) {
          await navigator.share({
            title: shareData.title,
            text: shareData.text
          });
        } else {
          handleCopyText();
        }
      }, 'image/png');
    } catch (err) {
      if (err.name !== 'AbortError') {
        handleCopyText();
      }
    }
  };

  const handleCopyText = () => {
    const text = `My StackScore is ${scoreData?.score || 0}! I'm a ${scoreData?.tier || 'Novice'} on my wellness journey with Akↄfa Fixit 🌟\n\nBreakdown:\n• Consistency: ${scoreData?.breakdown?.consistency}%\n• Progress: ${scoreData?.breakdown?.progress}%\n• Balance: ${scoreData?.breakdown?.balance}%\n\n#AkofaFixit #WellnessJourney`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const template = selectedTemplate;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            {shareText.createCard || 'Create Share Card'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div 
                ref={cardRef}
                className={`${template.bgClass} rounded-2xl p-6 relative overflow-hidden aspect-[4/5] max-w-sm mx-auto`}
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className={`w-6 h-6 ${template.iconColor}`} />
                      <span className={`text-lg font-bold ${template.textClass}`}>Akↄfa Fixit</span>
                    </div>
                    {showUsername && userData?.name && (
                      <p className={`text-sm ${template.textClass} opacity-80`}>@{userData.name}</p>
                    )}
                  </div>

                  <div className="text-center py-8">
                    <div className={`w-32 h-32 mx-auto rounded-full ${template.accentClass} backdrop-blur-sm flex flex-col items-center justify-center mb-4 border border-white/20`}>
                      <span className={`text-4xl font-bold ${template.textClass}`}>{scoreData?.score || 300}</span>
                      <span className={`text-sm ${template.textClass} opacity-70`}>/ 850</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-2xl">{tierEmojis[scoreData?.tier] || '🌱'}</span>
                      <span 
                        className="text-xl font-bold px-3 py-1 rounded-full"
                        style={{ 
                          backgroundColor: tierColors[scoreData?.tier] || '#808080',
                          color: scoreData?.tier === 'Guru' || scoreData?.tier === 'Master' ? '#000' : '#fff'
                        }}
                      >
                        {scoreData?.tier || 'Novice'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className={`flex items-center justify-between ${template.accentClass} rounded-lg px-3 py-2`}>
                        <span className={`text-sm ${template.textClass} opacity-80 flex items-center gap-2`}>
                          <Target className="w-4 h-4" /> Consistency
                        </span>
                        <span className={`font-bold ${template.textClass}`}>{scoreData?.breakdown?.consistency || 0}%</span>
                      </div>
                      <div className={`flex items-center justify-between ${template.accentClass} rounded-lg px-3 py-2`}>
                        <span className={`text-sm ${template.textClass} opacity-80 flex items-center gap-2`}>
                          <TrendingUp className="w-4 h-4" /> Progress
                        </span>
                        <span className={`font-bold ${template.textClass}`}>{scoreData?.breakdown?.progress || 0}%</span>
                      </div>
                      <div className={`flex items-center justify-between ${template.accentClass} rounded-lg px-3 py-2`}>
                        <span className={`text-sm ${template.textClass} opacity-80 flex items-center gap-2`}>
                          <Star className="w-4 h-4" /> Balance
                        </span>
                        <span className={`font-bold ${template.textClass}`}>{scoreData?.breakdown?.balance || 0}%</span>
                      </div>
                      {scoreData?.breakdown?.aiBonus > 0 && (
                        <div className={`flex items-center justify-center gap-1 ${template.textClass} text-sm mt-2`}>
                          <Zap className="w-4 h-4" />
                          <span>+{scoreData.breakdown.aiBonus} AI Bonus</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className={`text-xs ${template.textClass} opacity-60`}>Track your wellness journey at</p>
                    <p className={`text-sm font-medium ${template.textClass}`}>akofa-fixit.replit.app</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {shareText.chooseTemplate || 'Choose Template'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CARD_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`${t.bgClass} h-12 rounded-lg transition-all ${
                        selectedTemplate.id === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      title={t.name}
                    >
                      <span className="sr-only">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUsername}
                    onChange={(e) => setShowUsername(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">{shareText.showUsername || 'Show username'}</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {generating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {shareText.download || 'Download'}
                </button>

                <button
                  onClick={handleShare}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  {shareText.share || 'Share'}
                </button>

                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  title={shareText.copyText || 'Copy text'}
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
