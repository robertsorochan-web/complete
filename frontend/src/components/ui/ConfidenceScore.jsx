import React from 'react';
import { AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';

const ConfidenceScore = ({ score = 75, label = "Recommendation", showDetails = false }) => {
  const getConfidenceLevel = (score) => {
    if (score >= 80) return { level: 'high', color: 'green', icon: CheckCircle, text: 'High Confidence' };
    if (score >= 60) return { level: 'medium', color: 'yellow', icon: Info, text: 'Medium Confidence' };
    if (score >= 40) return { level: 'low', color: 'orange', icon: AlertCircle, text: 'Low Confidence' };
    return { level: 'very-low', color: 'red', icon: HelpCircle, text: 'Very Low Confidence' };
  };

  const confidence = getConfidenceLevel(score);
  const Icon = confidence.icon;

  const colorClasses = {
    green: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      bar: 'bg-green-500'
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      bar: 'bg-yellow-500'
    },
    orange: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      bar: 'bg-orange-500'
    },
    red: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      bar: 'bg-red-500'
    }
  };

  const colors = colorClasses[confidence.color];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colors.text}`} />
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className={`text-sm font-medium ${colors.text}`}>{score}%</span>
      </div>
      
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors.bar} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${colors.text}`}>{confidence.text}</span>
        {showDetails && (
          <button className="text-xs text-gray-500 hover:text-gray-300 transition">
            Learn more
          </button>
        )}
      </div>
    </div>
  );
};

const RecommendationWithConfidence = ({ 
  recommendation, 
  confidence, 
  category,
  onAction 
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl">{getCategoryEmoji(category)}</div>
        <div className="flex-1">
          <p className="text-white">{recommendation}</p>
        </div>
      </div>
      
      <ConfidenceScore score={confidence} label="How sure we dey" />
      
      {onAction && (
        <button
          onClick={onAction}
          className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
        >
          Do This Now
        </button>
      )}
    </div>
  );
};

const getCategoryEmoji = (category) => {
  const emojis = {
    health: '💪',
    money: '💰',
    team: '👥',
    systems: '⚙️',
    communication: '📢',
    vision: '🎯',
    action: '⚡',
    mindset: '🧠'
  };
  return emojis[category] || '📌';
};

export { ConfidenceScore, RecommendationWithConfidence };
export default ConfidenceScore;
