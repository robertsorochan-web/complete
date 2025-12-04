import React, { useState } from 'react';
import { Globe, Clock, RefreshCw, AlertCircle, BarChart3, Brain } from 'lucide-react';
import { 
  culturalContexts, 
  getInteractionMatrix, 
  getAlternativeInterpretations,
  calculateFrameworkHealth 
} from '../../utils/frameworkMetrics';

export const CulturalContextSelector = ({ selected, onChange }) => {
  return (
    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-600/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">Cultural Context</h4>
          <p className="text-xs text-gray-400">Adjust interpretation based on cultural background</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(culturalContexts).map(([key, context]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`p-3 rounded-lg text-left border transition ${
              selected === key 
                ? 'bg-purple-600/30 border-purple-500' 
                : 'bg-slate-700/50 border-slate-600 hover:border-purple-500/50'
            }`}
          >
            <div className="font-medium text-white text-sm">{context.name}</div>
            <div className="text-xs text-gray-400 mt-1">{context.description}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
        <p className="text-xs text-amber-200/80">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Cultural adjustments are approximations. Individual variation within cultures is significant.
        </p>
      </div>
    </div>
  );
};

export const TemporalDimensions = ({ currentScore, previousScore = null, daysSinceLastAssessment = null }) => {
  const trend = previousScore ? (currentScore - previousScore).toFixed(1) : null;
  const trendPerDay = trend && daysSinceLastAssessment ? (trend / daysSinceLastAssessment).toFixed(2) : null;
  
  const getInertia = () => {
    if (!trend) return { level: 'Unknown', color: 'text-gray-400' };
    const absTrend = Math.abs(parseFloat(trend));
    if (absTrend < 0.5) return { level: 'High', color: 'text-blue-400', desc: 'System resists change' };
    if (absTrend < 1.5) return { level: 'Medium', color: 'text-yellow-400', desc: 'Normal adaptability' };
    return { level: 'Low', color: 'text-green-400', desc: 'System changing rapidly' };
  };
  
  const inertia = getInertia();
  
  return (
    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-600/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">Temporal Dynamics</h4>
          <p className="text-xs text-gray-400">How your scores are changing over time</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Trend</div>
          {trend ? (
            <div className={`text-lg font-bold ${parseFloat(trend) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(trend) >= 0 ? '+' : ''}{trend}
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-500">--</div>
          )}
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Rate/Day</div>
          {trendPerDay ? (
            <div className={`text-lg font-bold ${parseFloat(trendPerDay) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(trendPerDay) >= 0 ? '+' : ''}{trendPerDay}
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-500">--</div>
          )}
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Inertia</div>
          <div className={`text-lg font-bold ${inertia.color}`}>{inertia.level}</div>
        </div>
      </div>
      
      {!previousScore && (
        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Complete more assessments over time to track trends and recovery patterns
          </p>
        </div>
      )}
    </div>
  );
};

export const FeedbackLoopsMatrix = ({ allLayers, layerNames }) => {
  const interactions = getInteractionMatrix(allLayers, layerNames);
  
  return (
    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-600/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">Feedback Loops</h4>
          <p className="text-xs text-gray-400">How changes in one area affect others</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {interactions.map((interaction, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
            <span className="text-xs text-purple-400 font-medium w-24 truncate">{interaction.from}</span>
            <span className="text-green-400 font-mono text-sm">{interaction.impact}</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-blue-400 font-medium w-24 truncate">{interaction.to}</span>
            <span className="text-xs text-gray-500 flex-1 truncate hidden sm:block">{interaction.description}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
        <p className="text-xs text-amber-200/80">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          These interaction strengths are theoretical estimates. Actual effects vary by individual.
        </p>
      </div>
    </div>
  );
};

export const RedTeamMode = ({ allLayers, layerNames }) => {
  const [isOpen, setIsOpen] = useState(false);
  const alternatives = getAlternativeInterpretations(allLayers, layerNames);
  
  return (
    <div className="bg-slate-800/80 rounded-xl p-5 border border-orange-500/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white">Challenge This Analysis</h4>
            <p className="text-xs text-gray-400">Alternative interpretations to consider</p>
          </div>
        </div>
        <span className="text-orange-400 text-sm font-medium">{isOpen ? 'Hide' : 'Explore'}</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
          {alternatives.map((alt, idx) => (
            <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
              <h5 className="text-sm font-medium text-orange-300 mb-1">{alt.title}</h5>
              <p className="text-xs text-gray-400">{alt.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FrameworkHealthScore = ({ allLayers, userExperience = 'novice' }) => {
  const health = calculateFrameworkHealth(allLayers, userExperience);
  
  const getHealthColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getBarColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-600/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">Framework Health</h4>
          <p className="text-xs text-gray-400">How appropriately is this tool being applied?</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`text-4xl font-bold ${getHealthColor(health.overall)}`}>
          {health.overall}%
        </div>
        <div className="flex-1">
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getBarColor(health.overall)} rounded-full transition-all`}
              style={{ width: `${health.overall}%` }}
            />
          </div>
          <p className={`text-xs mt-2 ${getHealthColor(health.overall)}`}>
            {health.recommendation}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Data Quality</div>
          <div className={`text-lg font-bold ${getHealthColor(health.dataQuality)}`}>
            {health.dataQuality}%
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Context Fit</div>
          <div className={`text-lg font-bold ${getHealthColor(health.contextFit)}`}>
            {health.contextFit}%
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">User Skill</div>
          <div className={`text-lg font-bold ${getHealthColor(health.userExpertise)}`}>
            {health.userExpertise}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  CulturalContextSelector,
  TemporalDimensions,
  FeedbackLoopsMatrix,
  RedTeamMode,
  FrameworkHealthScore
};
