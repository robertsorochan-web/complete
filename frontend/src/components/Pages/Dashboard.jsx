import React, { useState, useMemo } from 'react';
import MetricCard from '../ui/MetricCard';
import { getLayerConfig } from '../../config/purposeConfig';
import { TrendingUp, TrendingDown, Target, Zap, Calendar, AlertTriangle, Lightbulb, Share2, Users, Printer, Volume2, Calculator, ClipboardList } from 'lucide-react';
import { calculateStabilityWithRange } from '../../utils/frameworkMetrics';
import { CriticalWarningBanner, ConfidenceIndicator, EthicalGuardrails, LimitationsDisclosure, FooterDisclaimer } from '../ui/FrameworkWarnings';
import { TemporalDimensions } from '../ui/AdvancedFramework';
import { getProverbForLayer, getActionableTip, ghanaExamples } from '../../utils/ghanaWisdom';
import { getScoreEmoji, getScoreLabel } from '../../config/useCaseTemplates';
import ShareableResults from '../ui/ShareableResults';
import LocalResourcesPanel from '../ui/LocalResourcesPanel';
import GroupAnalysis from '../ui/GroupAnalysis';
import PrintableReport from '../ui/PrintableReport';
import { SpeakButton } from '../ui/VoiceNavigation';
import ProgressTracker from '../ui/ProgressTracker';
import EmergencyAlerts from '../ui/EmergencyAlerts';
import LocalPartnerships from '../ui/LocalPartnerships';
import SMSTipsSubscription from '../ui/SMSTipsSubscription';
import BusinessHealthScore from '../ui/BusinessHealthScore';
import ActionSteps from '../ui/ActionSteps';
import GoalTracker from '../ui/GoalTracker';
import ProfitLossCalculator from '../ui/ProfitLossCalculator';
import BusinessChecklists from '../ui/BusinessChecklists';
import TipOfTheDay from '../ui/TipOfTheDay';

const Dashboard = ({ assessmentData, purpose = 'personal' }) => {
  const [showWarning, setShowWarning] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(() => {
    return localStorage.getItem('akofa_user_agreement') === 'true';
  });
  const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData || {};
  
  if (!hasAgreed) {
    return (
      <div className="dashboard-page space-y-6">
        <CriticalWarningBanner />
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Agreement Required</h2>
          <p className="text-gray-300 mb-6">
            Before viewing your results, please acknowledge the framework limitations.
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
            I Understand - Show My Results
          </button>
        </div>
      </div>
    );
  }
  
  const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(1);
  const lowestLayer = Math.min(...allLayers);
  const highestLayer = Math.max(...allLayers);
  const stabilityMetrics = calculateStabilityWithRange(allLayers);
  
  const layers = getLayerConfig(purpose);
  const layerKeys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];
  const layerNames = layerKeys.map(key => layers[key].name);
  
  const bottleneckIndex = allLayers.indexOf(lowestLayer);
  const strengthIndex = allLayers.indexOf(highestLayer);
  const bottleneck = layerNames[bottleneckIndex];
  const strength = layerNames[strengthIndex];
  
  const bottleneckKey = layerKeys[bottleneckIndex];
  const proverb = useMemo(() => getProverbForLayer(bottleneckKey), [bottleneckKey]);
  const actionTip = useMemo(() => getActionableTip(bottleneckKey, lowestLayer), [bottleneckKey, lowestLayer]);
  const example = ghanaExamples[purpose] || ghanaExamples.personal;

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
      {showWarning && <CriticalWarningBanner onDismiss={() => setShowWarning(false)} />}
      
      <div>
        <h2 className="text-2xl font-bold mb-2">{labels.overview}</h2>
        <p className="text-gray-300 text-sm">{labels.description}</p>
      </div>

      {/* Emergency Alerts */}
      <EmergencyAlerts region="Greater Accra" sector={purpose} />

      {/* Main Stats with Emojis - Health Score Format */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
          <div className="text-5xl mb-3">{getScoreEmoji(parseFloat(avgScore))}</div>
          <div className={`text-4xl font-bold ${getScoreColor(parseFloat(avgScore))}`}>
            {Math.round(parseFloat(avgScore))}/10
          </div>
          <div className="text-lg text-gray-300 mt-1">{getScoreLabel(parseFloat(avgScore))}</div>
          <div className="text-sm text-gray-500 mt-2">{labels.overallTitle}</div>
        </div>
        <div className="bg-green-900/20 rounded-xl p-6 text-center border border-green-500/30">
          <div className="text-5xl mb-3">{getScoreEmoji(highestLayer)}</div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-4xl font-bold text-green-400">{highestLayer}/10</span>
          </div>
          <div className="text-lg text-gray-300">Your Strength</div>
          <div className="text-sm text-green-400/70 mt-2">{strength}</div>
        </div>
        <div className="bg-red-900/20 rounded-xl p-6 text-center border border-red-500/30">
          <div className="text-5xl mb-3">{getScoreEmoji(lowestLayer)}</div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <span className="text-4xl font-bold text-red-400">{lowestLayer}/10</span>
          </div>
          <div className="text-lg text-gray-300">Needs Work</div>
          <div className="text-sm text-red-400/70 mt-2">{bottleneck}</div>
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
              <Lightbulb className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-green-400 mb-1">Wetin You Fit Do Today:</div>
              <p className="text-gray-200">{actionTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3 Action Steps */}
      <ActionSteps weakestArea={bottleneckKey} purpose={purpose} />

      {/* Tip of the Day */}
      <TipOfTheDay compact={true} />

      {/* Real Example */}
      {example && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="font-semibold text-purple-400 mb-2">📖 Real Example:</div>
          <p className="text-gray-300 text-sm mb-2">{example.scenario}</p>
          <p className="text-gray-400 text-sm mb-2"><span className="text-red-400">Problem:</span> {example.problem}</p>
          <p className="text-gray-400 text-sm"><span className="text-green-400">Solution:</span> {example.solution}</p>
        </div>
      )}

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

      {/* Temporal Dynamics */}
      <TemporalDimensions currentScore={parseFloat(avgScore)} />

      {/* Confidence Notice */}
      <div className="flex items-center justify-between bg-slate-800/60 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-gray-400">Results are estimates, not facts</span>
        </div>
        <ConfidenceIndicator confidence={stabilityMetrics.confidence} label="Data" />
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

      {/* Progress Tracker */}
      <ProgressTracker assessmentData={assessmentData} purpose={purpose} />

      {/* Share & Print Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShareableResults 
          assessmentData={assessmentData}
          purpose={purpose}
          bottleneck={bottleneck}
          strength={strength}
          avgScore={avgScore}
        />
        <PrintableReport
          assessmentData={assessmentData}
          purpose={purpose}
          bottleneck={bottleneck}
          strength={strength}
          actionTips={[actionTip]}
        />
      </div>

      {/* Local Partnerships */}
      <LocalPartnerships sector={purpose} />

      {/* Local Resources */}
      <LocalResourcesPanel sector={purpose} />

      {/* SMS Tips for Feature Phones */}
      <SMSTipsSubscription purpose={purpose} />

      {/* Group Analysis */}
      <GroupAnalysis assessmentData={assessmentData} purpose={purpose} />

      {/* Business Tools Section - Only for business purpose */}
      {(purpose === 'business' || purpose === 'team') && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Business Tools</h3>
              <p className="text-sm text-gray-400">Free tools to help your business grow</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GoalTracker purpose={purpose} />
            <ProfitLossCalculator />
          </div>
          
          <BusinessChecklists />
        </div>
      )}

      {/* Goal Tracker for Personal */}
      {purpose === 'personal' && (
        <GoalTracker purpose={purpose} />
      )}

      {/* Footer Disclaimer */}
      <FooterDisclaimer />
    </div>
  );
};

export default Dashboard;
