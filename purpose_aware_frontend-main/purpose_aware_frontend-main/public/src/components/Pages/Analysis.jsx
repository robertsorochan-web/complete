import React, { useState, useEffect } from 'react';
import { generateInsights } from '../../services/groq';
import { getLayerConfig } from '../../config/purposeConfig';

const Analysis = ({ assessmentData, purpose = 'personal' }) => {
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  if (!assessmentData) return <div>Loading analysis...</div>;

  const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData;
  
  const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(2);
  const variance = (Math.sqrt(allLayers.reduce((sum, val) => sum + Math.pow(val - avgScore, 2), 0) / allLayers.length)).toFixed(2);
  const harmonyScore = Math.max(0, (10 - variance)).toFixed(2);

  const layers = getLayerConfig(purpose);
  const layerKeys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];
  const layerNames = layerKeys.map(key => layers[key].name);
  
  const bottleneckIndex = allLayers.indexOf(Math.min(...allLayers));
  const bottleneck = layerNames[bottleneckIndex];

  const contextLabels = {
    personal: {
      title: 'What Your Assessment Shows',
      description: 'Here\'s what\'s working and where you could grow.',
      stateTitle: 'Your Current State',
      overallLabel: 'Overall Life Health',
      overallDesc: 'How well different areas of your life are balanced',
      balanceLabel: 'Life Balance Score',
      balanceDesc: 'How evenly balanced your 5 areas are (higher = more balanced)',
      focusLabel: 'Where to Focus First',
      focusDesc: 'Your weakest area right now',
      detailedTitle: 'Your 5 Life Areas (Detailed)',
      tip: 'The different areas of your life are connected. Improving one often helps the others. Start with your lowest area.'
    },
    team: {
      title: 'What Your Team Assessment Shows',
      description: 'Here\'s what\'s working and where the team could improve.',
      stateTitle: 'Team Current State',
      overallLabel: 'Overall Team Health',
      overallDesc: 'How well different team dimensions are performing',
      balanceLabel: 'Team Balance Score',
      balanceDesc: 'How evenly balanced your team\'s 5 dimensions are',
      focusLabel: 'Where to Focus First',
      focusDesc: 'The team\'s weakest dimension right now',
      detailedTitle: 'Team\'s 5 Dimensions (Detailed)',
      tip: 'Team dimensions are interconnected. Improving one often strengthens others. Address the weakest dimension first.'
    },
    business: {
      title: 'What Your Business Assessment Shows',
      description: 'Here\'s what\'s working and where the organization could improve.',
      stateTitle: 'Organization Current State',
      overallLabel: 'Overall Org Health',
      overallDesc: 'How well different business dimensions are performing',
      balanceLabel: 'Business Balance Score',
      balanceDesc: 'How evenly balanced your organization\'s 5 dimensions are',
      focusLabel: 'Where to Focus First',
      focusDesc: 'The organization\'s weakest dimension right now',
      detailedTitle: 'Organization\'s 5 Dimensions (Detailed)',
      tip: 'Business dimensions are interconnected. Strategic improvements in one area often create positive ripple effects.'
    },
    policy: {
      title: 'What Your System Assessment Shows',
      description: 'Here\'s what\'s working and where intervention may be needed.',
      stateTitle: 'System Current State',
      overallLabel: 'Overall System Health',
      overallDesc: 'How well different system dimensions are functioning',
      balanceLabel: 'System Balance Score',
      balanceDesc: 'How evenly balanced the system\'s 5 dimensions are',
      focusLabel: 'Priority Intervention Area',
      focusDesc: 'The system\'s weakest dimension right now',
      detailedTitle: 'System\'s 5 Dimensions (Detailed)',
      tip: 'System dimensions interact in complex ways. Evidence-based interventions should consider spillover effects.'
    }
  };

  const labels = contextLabels[purpose] || contextLabels.personal;

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const result = await generateInsights(assessmentData, purpose);
      setInsights(result);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [assessmentData, purpose]);

  return (
    <div className="analysis-page space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{labels.title}</h2>
        <p className="text-gray-300 text-sm">{labels.description}</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{labels.stateTitle}</h3>
        <div className="space-y-3">
          <p><span className="text-purple-400 font-semibold">{labels.overallLabel}:</span> <span className="text-xl font-bold">{avgScore}/10</span> — {labels.overallDesc}</p>
          <p><span className="text-purple-400 font-semibold">{labels.balanceLabel}:</span> <span className="text-xl font-bold">{harmonyScore}/10</span> — {labels.balanceDesc}</p>
          <p><span className="text-purple-400 font-semibold">{labels.focusLabel}:</span> <span className="text-xl font-bold">{bottleneck}</span> — {labels.focusDesc}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{labels.detailedTitle}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded p-3">
            <div className="text-sm text-gray-300">{layers.bioHardware.icon} {layers.bioHardware.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{bioHardware}</div>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-sm text-gray-300">{layers.internalOS.icon} {layers.internalOS.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{internalOS}</div>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-sm text-gray-300">{layers.culturalSoftware.icon} {layers.culturalSoftware.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{culturalSoftware}</div>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-sm text-gray-300">{layers.socialInstance.icon} {layers.socialInstance.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{socialInstance}</div>
          </div>
          <div className="bg-slate-700 rounded p-3 col-span-2">
            <div className="text-sm text-gray-300">{layers.consciousUser.icon} {layers.consciousUser.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{consciousUser}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          💬 Personalized Suggestions
        </h3>
        {loadingInsights ? (
          <p className="text-gray-300 italic">Getting personalized advice for you...</p>
        ) : insights ? (
          <div className="text-white space-y-3 whitespace-pre-wrap text-sm leading-relaxed font-normal">
            {insights}
          </div>
        ) : (
          <p className="text-gray-400">Could not generate suggestions at this time. Try again later.</p>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-4 text-xs text-gray-400">
        <p><span className="font-semibold">Tip:</span> {labels.tip}</p>
      </div>
    </div>
  );
};

export default Analysis;
