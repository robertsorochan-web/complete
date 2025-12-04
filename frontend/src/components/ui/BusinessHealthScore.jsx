import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const BusinessHealthScore = ({ scores, purpose = 'business' }) => {
  const allScores = Object.values(scores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const healthScore = Math.round(avgScore);
  
  const getHealthStatus = (score) => {
    if (score >= 8) return { label: 'Strong', emoji: '💪', color: 'green', icon: CheckCircle };
    if (score >= 6) return { label: 'Good', emoji: '👍', color: 'blue', icon: TrendingUp };
    if (score >= 4) return { label: 'Needs Work', emoji: '⚠️', color: 'yellow', icon: AlertTriangle };
    if (score >= 2) return { label: 'Weak', emoji: '😟', color: 'orange', icon: TrendingDown };
    return { label: 'Critical', emoji: '🚨', color: 'red', icon: XCircle };
  };

  const status = getHealthStatus(healthScore);
  const StatusIcon = status.icon;

  const colorClasses = {
    green: 'from-green-600 to-emerald-600 border-green-500/50',
    blue: 'from-blue-600 to-cyan-600 border-blue-500/50',
    yellow: 'from-yellow-600 to-amber-600 border-yellow-500/50',
    orange: 'from-orange-600 to-red-600 border-orange-500/50',
    red: 'from-red-600 to-rose-600 border-red-500/50'
  };

  const purposeLabels = {
    business: 'Business Health',
    personal: 'Life Health',
    team: 'Team Health',
    policy: 'System Health'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[status.color]} rounded-2xl p-6 border-2 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/80 text-sm font-medium mb-1">
            {purposeLabels[purpose] || 'Health Score'}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{healthScore}</span>
            <span className="text-2xl text-white/80">/10</span>
            <span className="text-3xl ml-2">{status.emoji}</span>
          </div>
          <div className="text-white/90 font-medium mt-1">{status.label}</div>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <StatusIcon className="w-10 h-10 text-white" />
        </div>
      </div>
      
      <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white/80 rounded-full transition-all duration-500"
          style={{ width: `${healthScore * 10}%` }}
        />
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-white/70">
        <span>Critical</span>
        <span>Weak</span>
        <span>Okay</span>
        <span>Good</span>
        <span>Strong</span>
      </div>
    </div>
  );
};

export default BusinessHealthScore;
