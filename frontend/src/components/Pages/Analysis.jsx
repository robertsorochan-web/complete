import React, { useState, useEffect, useMemo } from 'react';
import { generateInsights } from '../../services/groq';
import { getLayerConfig } from '../../config/purposeConfig';
import { calculateStabilityWithRange, calculateRecommendationConfidence } from '../../utils/frameworkMetrics';
import { 
  CriticalWarningBanner, 
  EthicalGuardrails, 
  LimitationsDisclosure,
  UncertaintyDisplay,
  ConfidenceIndicator 
} from '../ui/FrameworkWarnings';
import {
  CulturalContextSelector,
  FeedbackLoopsMatrix,
  RedTeamMode,
  FrameworkHealthScore
} from '../ui/AdvancedFramework';
import { getProverbForLayer, getActionableTip, ghanaExamples } from '../../utils/ghanaWisdom';

const Analysis = ({ assessmentData, purpose = 'personal' }) => {
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [culturalContext, setCulturalContext] = useState('default');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(() => {
    return localStorage.getItem('akofa_user_agreement') === 'true';
  });

  if (!assessmentData) return <div>Loading analysis...</div>;
  
  if (!hasAgreed) {
    return (
      <div className="analysis-page space-y-6">
        <CriticalWarningBanner />
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Agreement Required</h2>
          <p className="text-gray-300 mb-6">
            Before viewing your analysis, please acknowledge the framework limitations 
            in the Assessment section.
          </p>
          <EthicalGuardrails />
          <div className="mt-6">
            <LimitationsDisclosure expanded={true} />
          </div>
          <button 
            onClick={() => {
              localStorage.setItem('akofa_user_agreement', 'true');
              setHasAgreed(true);
            }}
            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
          >
            I Understand - Show My Analysis
          </button>
        </div>
      </div>
    );
  }

  const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData;
  
  const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(2);
  const stabilityMetrics = calculateStabilityWithRange(allLayers);
  const harmonyScore = stabilityMetrics.score;

  const layers = getLayerConfig(purpose);
  const layerKeys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];
  const layerNames = layerKeys.map(key => layers[key].name);
  
  const bottleneckIndex = allLayers.indexOf(Math.min(...allLayers));
  const bottleneck = layerNames[bottleneckIndex];
  const bottleneckKey = layerKeys[bottleneckIndex];
  const lowestScore = Math.min(...allLayers);
  
  const proverb = useMemo(() => getProverbForLayer(bottleneckKey), [bottleneckKey]);
  const actionTip = useMemo(() => getActionableTip(bottleneckKey, lowestScore), [bottleneckKey, lowestScore]);
  const example = ghanaExamples[purpose] || ghanaExamples.personal;

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
      tip: 'System areas connect in many ways. When you fix one area, it can affect others - so think about the whole picture.'
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
      {showWarning && <CriticalWarningBanner onDismiss={() => setShowWarning(false)} />}
      
      <div>
        <h2 className="text-2xl font-bold mb-2">{labels.title}</h2>
        <p className="text-gray-300 text-sm">{labels.description}</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{labels.stateTitle}</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-purple-400 font-semibold">{labels.overallLabel}:</span>
              <span className="text-xl font-bold ml-2">{avgScore}/10</span>
              <span className="text-gray-400 text-sm ml-2">— {labels.overallDesc}</span>
            </div>
            <ConfidenceIndicator confidence={stabilityMetrics.confidence} />
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <span className="text-purple-400 font-semibold block mb-2">{labels.balanceLabel}:</span>
            <UncertaintyDisplay 
              score={harmonyScore}
              uncertainty={stabilityMetrics.uncertainty}
              min={stabilityMetrics.min}
              max={stabilityMetrics.max}
              confidence={stabilityMetrics.confidence}
            />
            <p className="text-gray-400 text-sm mt-2">{labels.balanceDesc}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-purple-400 font-semibold">{labels.focusLabel}:</span>
              <span className="text-xl font-bold ml-2">{bottleneck}</span>
              <span className="text-gray-400 text-sm ml-2">— {labels.focusDesc}</span>
            </div>
            <ConfidenceIndicator 
              confidence={calculateRecommendationConfidence(
                Math.min(...allLayers), 
                2, 
                allLayers
              )} 
              label="Recommendation" 
            />
          </div>
        </div>
      </div>

      {/* Ghanaian Wisdom */}
      {proverb && (
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🇬🇭</div>
            <div>
              <div className="font-medium text-amber-400 mb-1">Ghanaian Wisdom:</div>
              <p className="text-white italic">"{proverb.english}"</p>
              <p className="text-amber-200/70 text-sm mt-1">{proverb.twi}</p>
              <p className="text-gray-400 text-sm mt-2">{proverb.meaning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Tip */}
      {actionTip && (
        <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <div className="font-semibold text-green-400 mb-1">What You Can Do Today:</div>
              <p className="text-gray-200">{actionTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Real Example */}
      {example && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="font-semibold text-purple-400 mb-2">📖 Real Example:</div>
          <p className="text-gray-300 text-sm mb-2">{example.scenario}</p>
          <p className="text-gray-400 text-sm mb-2"><span className="text-red-400">Problem:</span> {example.problem}</p>
          <p className="text-gray-400 text-sm"><span className="text-green-400">Solution:</span> {example.solution}</p>
        </div>
      )}

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

      <EthicalGuardrails compact={true} />

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-center transition"
      >
        <span className="text-purple-400 font-medium">
          {showAdvanced ? 'Hide Advanced Analysis' : 'Show Advanced Analysis'}
        </span>
      </button>

      {showAdvanced && (
        <div className="space-y-6">
          <CulturalContextSelector 
            selected={culturalContext} 
            onChange={setCulturalContext} 
          />
          
          <FeedbackLoopsMatrix 
            allLayers={allLayers} 
            layerNames={layerNames} 
          />
          
          <RedTeamMode 
            allLayers={allLayers} 
            layerNames={layerNames} 
          />
          
          <FrameworkHealthScore allLayers={allLayers} />
          
          <LimitationsDisclosure expanded={false} />
        </div>
      )}
    </div>
  );
};

export default Analysis;
