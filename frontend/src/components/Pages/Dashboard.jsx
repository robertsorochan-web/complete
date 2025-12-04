import React from 'react';
import MetricCard from '../ui/MetricCard';
import { getLayerConfig } from '../../config/purposeConfig';
import { TrendingUp, TrendingDown, Target, Zap, Calendar } from 'lucide-react';

const Dashboard = ({ assessmentData, purpose = 'personal' }) => {
  const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData || {};
  
  const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(1);
  const lowestLayer = Math.min(...allLayers);
  const highestLayer = Math.max(...allLayers);
  
  const layers = getLayerConfig(purpose);
  const layerKeys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];
  const layerNames = layerKeys.map(key => layers[key].name);
  
  const bottleneckIndex = allLayers.indexOf(lowestLayer);
  const strengthIndex = allLayers.indexOf(highestLayer);
  const bottleneck = layerNames[bottleneckIndex];
  const strength = layerNames[strengthIndex];

  const contextLabels = {
    personal: {
      overview: 'How Your Life Dey',
      description: 'See how each part of your life dey do. The area wey weak dey pull everything down.',
      hint: 'Focus on the area with lowest score first - when e improve, other areas go follow.',
      overallTitle: 'Overall',
      areasTitle: 'Your 5 Life Areas',
      actionPrompt: 'What you fit do today:'
    },
    team: {
      overview: 'How Your Team Dey',
      description: 'See how each part of your team dey perform. Weak areas dey affect the whole team.',
      hint: 'Fix the weakest area first - e go make the whole team better.',
      overallTitle: 'Team Score',
      areasTitle: 'Your 5 Team Areas',
      actionPrompt: 'What the team fit do:'
    },
    business: {
      overview: 'How Your Business Dey',
      description: 'See how each part of your business dey perform. One weak area fit hold everything back.',
      hint: 'Strengthen the weakest area first - e go unlock growth for the whole business.',
      overallTitle: 'Business Score',
      areasTitle: 'Your 5 Business Areas',
      actionPrompt: 'What you fit do today:'
    },
    policy: {
      overview: 'How The System Dey',
      description: 'See how each part of the system dey perform. Weak areas dey cause problems.',
      hint: 'Address the weakest area first - e go improve the whole system.',
      overallTitle: 'System Score',
      areasTitle: 'Your 5 System Areas',
      actionPrompt: 'What to address:'
    }
  };

  const labels = contextLabels[purpose] || contextLabels.personal;

  const getScoreColor = (score) => {
    if (score <= 3) return 'text-red-400';
    if (score <= 5) return 'text-yellow-400';
    if (score <= 7) return 'text-blue-400';
    return 'text-green-400';
  };

  const getScoreBg = (score) => {
    if (score <= 3) return 'bg-red-900/30 border-red-500/30';
    if (score <= 5) return 'bg-yellow-900/30 border-yellow-500/30';
    if (score <= 7) return 'bg-blue-900/30 border-blue-500/30';
    return 'bg-green-900/30 border-green-500/30';
  };

  return (
    <div className="dashboard-page space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{labels.overview}</h2>
        <p className="text-gray-300 text-sm">{labels.description}</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
          <div className={`text-3xl font-bold ${getScoreColor(parseFloat(avgScore))}`}>{avgScore}</div>
          <div className="text-sm text-gray-400">{labels.overallTitle}</div>
          <div className="text-xs text-gray-500 mt-1">out of 10</div>
        </div>
        <div className="bg-green-900/20 rounded-xl p-4 text-center border border-green-500/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-3xl font-bold text-green-400">{highestLayer}</span>
          </div>
          <div className="text-sm text-gray-400">Your Strength</div>
          <div className="text-xs text-green-400/70 mt-1">{strength}</div>
        </div>
        <div className="bg-red-900/20 rounded-xl p-4 text-center border border-red-500/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-3xl font-bold text-red-400">{lowestLayer}</span>
          </div>
          <div className="text-sm text-gray-400">Needs Work</div>
          <div className="text-xs text-red-400/70 mt-1">{bottleneck}</div>
        </div>
      </div>

      {/* Quick Insight */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="font-semibold text-white mb-1">What Akↄfa See</div>
            <p className="text-gray-300 text-sm">
              Your <span className="text-green-400 font-medium">{strength}</span> dey strong ({highestLayer}/10), 
              but your <span className="text-red-400 font-medium">{bottleneck}</span> ({lowestLayer}/10) dey hold everything back. 
              When you fix <span className="text-red-400">{bottleneck}</span>, other areas go improve too.
            </p>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
        <p className="text-sm text-blue-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span><span className="font-semibold">Quick tip:</span> {labels.hint}</span>
        </p>
      </div>

      {/* All Areas */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{labels.areasTitle}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 text-center border ${getScoreBg(bioHardware)} hover:scale-105 transition`}>
            <div className="text-2xl mb-2">{layers.bioHardware.icon}</div>
            <div className="text-sm text-gray-300 font-medium">{layers.bioHardware.name}</div>
            <div className={`text-2xl font-bold mt-2 ${getScoreColor(bioHardware)}`}>{bioHardware}</div>
          </div>
          <div className={`rounded-xl p-4 text-center border ${getScoreBg(internalOS)} hover:scale-105 transition`}>
            <div className="text-2xl mb-2">{layers.internalOS.icon}</div>
            <div className="text-sm text-gray-300 font-medium">{layers.internalOS.name}</div>
            <div className={`text-2xl font-bold mt-2 ${getScoreColor(internalOS)}`}>{internalOS}</div>
          </div>
          <div className={`rounded-xl p-4 text-center border ${getScoreBg(culturalSoftware)} hover:scale-105 transition`}>
            <div className="text-2xl mb-2">{layers.culturalSoftware.icon}</div>
            <div className="text-sm text-gray-300 font-medium">{layers.culturalSoftware.name}</div>
            <div className={`text-2xl font-bold mt-2 ${getScoreColor(culturalSoftware)}`}>{culturalSoftware}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className={`rounded-xl p-4 text-center border ${getScoreBg(socialInstance)} hover:scale-105 transition`}>
            <div className="text-2xl mb-2">{layers.socialInstance.icon}</div>
            <div className="text-sm text-gray-300 font-medium">{layers.socialInstance.name}</div>
            <div className={`text-2xl font-bold mt-2 ${getScoreColor(socialInstance)}`}>{socialInstance}</div>
          </div>
          <div className={`rounded-xl p-4 text-center border ${getScoreBg(consciousUser)} hover:scale-105 transition`}>
            <div className="text-2xl mb-2">{layers.consciousUser.icon}</div>
            <div className="text-sm text-gray-300 font-medium">{layers.consciousUser.name}</div>
            <div className={`text-2xl font-bold mt-2 ${getScoreColor(consciousUser)}`}>{consciousUser}</div>
          </div>
        </div>
      </div>

      {/* Daily Reminder */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-white">Check yourself every day</div>
            <p className="text-sm text-gray-400">Small small changes dey add up. Update your scores as you progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
