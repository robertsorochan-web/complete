import React, { useState } from 'react';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info, AlertTriangle } from 'lucide-react';
import { getLayerConfig, getPurposeConfig } from '../../config/purposeConfig';
import { UserAgreementCheckbox, LimitationsDisclosure } from '../ui/FrameworkWarnings';

const getLayerTips = (purpose, layerKey) => {
  const tipsByPurpose = {
    personal: {
      bioHardware: ['Get 7-9 hours of sleep', 'Exercise 3-4 times per week', 'Eat mostly whole foods', 'Stay hydrated'],
      internalOS: ['Notice negative self-talk', 'Practice self-compassion', 'Consider therapy if needed', 'Journal regularly'],
      culturalSoftware: ['Write down your core values', 'Notice where you compromise them', 'Read diverse perspectives', 'Reflect on your principles'],
      socialInstance: ['Audit your environment', 'Evaluate your relationships', 'Review your job satisfaction', 'Check your financial health'],
      consciousUser: ['Practice meditation', 'Notice your reactions before responding', 'Make intentional choices', 'Reflect on your patterns']
    },
    team: {
      bioHardware: ['Monitor team workload', 'Encourage breaks and time off', 'Address burnout early', 'Ensure adequate resources'],
      internalOS: ['Build psychological safety', 'Encourage open feedback', 'Address toxic behaviors', 'Celebrate team wins'],
      culturalSoftware: ['Document team rituals', 'Review meeting effectiveness', 'Standardize communication', 'Share knowledge openly'],
      socialInstance: ['Facilitate team bonding', 'Resolve conflicts early', 'Balance collaboration styles', 'Build trust through transparency'],
      consciousUser: ['Align on team vision', 'Make decisions transparently', 'Review progress regularly', 'Adapt strategy as needed']
    },
    business: {
      bioHardware: ['Audit infrastructure capacity', 'Review technology stack', 'Assess financial runway', 'Evaluate operational efficiency'],
      internalOS: ['Define core values clearly', 'Align leadership messaging', 'Address cultural debt', 'Build inclusive practices'],
      culturalSoftware: ['Strengthen brand positioning', 'Monitor competitive landscape', 'Gather customer feedback', 'Invest in differentiation'],
      socialInstance: ['Nurture customer relationships', 'Build strategic partnerships', 'Engage industry networks', 'Manage supplier relationships'],
      consciousUser: ['Clarify long-term vision', 'Review strategic priorities', 'Build adaptive capacity', 'Monitor market signals']
    },
    policy: {
      bioHardware: ['Analyze health data trends', 'Assess infrastructure needs', 'Review resource allocation', 'Study demographic changes'],
      internalOS: ['Research cultural attitudes', 'Study social narratives', 'Identify belief barriers', 'Map opinion dynamics'],
      culturalSoftware: ['Review existing policies', 'Analyze regulatory gaps', 'Study incentive structures', 'Benchmark best practices'],
      socialInstance: ['Map stakeholder interests', 'Analyze power structures', 'Study institutional dynamics', 'Review governance models'],
      consciousUser: ['Synthesize research findings', 'Build evidence base', 'Develop metrics frameworks', 'Create feedback loops']
    }
  };
  return tipsByPurpose[purpose]?.[layerKey] || tipsByPurpose.personal[layerKey];
};

const LayerPopup = ({ layer, purpose, layers, onClose }) => {
  if (!layer) return null;
  const info = layers[layer];
  const tips = getLayerTips(purpose, layer);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl max-w-md p-8 border border-purple-500">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>{info.icon}</span> {info.name}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">×</button>
        </div>
        <p className="text-gray-300 mb-6">{info.description}</p>
        <div>
          <h3 className="font-semibold mb-3">Ways to Improve:</h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

const ModernAssessment = ({ assessmentData, setAssessmentData, purpose = 'personal', onAgreementChange }) => {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [hasAgreed, setHasAgreed] = useState(() => {
    return localStorage.getItem('akofa_user_agreement') === 'true';
  });
  const { bioHardware = 5, internalOS = 5, culturalSoftware = 5, socialInstance = 5, consciousUser = 5 } = assessmentData || {};
  
  const handleAgreementChange = (e) => {
    const agreed = e.target.checked;
    setHasAgreed(agreed);
    localStorage.setItem('akofa_user_agreement', agreed.toString());
    if (onAgreementChange) {
      onAgreementChange(agreed);
    }
  };
  
  const layers = getLayerConfig(purpose);
  const purposeConfig = getPurposeConfig(purpose);

  const updateValue = (key, value) => {
    setAssessmentData({ ...assessmentData, [key]: parseFloat(value) });
  };

  const chartData = [
    { name: layers.bioHardware.name, value: bioHardware },
    { name: layers.internalOS.name, value: internalOS },
    { name: layers.culturalSoftware.name, value: culturalSoftware },
    { name: layers.socialInstance.name, value: socialInstance },
    { name: layers.consciousUser.name, value: consciousUser }
  ];

  const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const layerItems = [
    { key: 'bioHardware', ...layers.bioHardware },
    { key: 'internalOS', ...layers.internalOS },
    { key: 'culturalSoftware', ...layers.culturalSoftware },
    { key: 'socialInstance', ...layers.socialInstance },
    { key: 'consciousUser', ...layers.consciousUser }
  ];

  const contextLabels = {
    personal: { title: 'Rate Your 5 Life Areas', description: 'Drag the sliders or click the circles to rate each area. Click on any area to learn more.' },
    team: { title: 'Rate Your Team\'s 5 Dimensions', description: 'Assess your team across each dimension. Click on any area to learn more.' },
    business: { title: 'Rate Your Organization\'s 5 Dimensions', description: 'Assess your organization across each dimension. Click on any area to learn more.' },
    policy: { title: 'Rate The System\'s 5 Dimensions', description: 'Assess the system across each dimension. Click on any area to learn more.' }
  };

  const labels = contextLabels[purpose] || contextLabels.personal;

  return (
    <div className="space-y-8">
      <LayerPopup layer={selectedLayer} purpose={purpose} layers={layers} onClose={() => setSelectedLayer(null)} />

      <div>
        <h2 className="text-3xl font-bold mb-2">{labels.title}</h2>
        <p className="text-gray-300">{labels.description}</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 flex items-center justify-center h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#9ca3af' }} />
            <Radar name="Your Score" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        {layerItems.map(layer => (
          <div key={layer.key} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{layer.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{layer.name}</h3>
                  <p className="text-xs text-gray-400">{layer.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLayer(layer.key)}
                className="text-gray-400 hover:text-purple-400 transition"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={assessmentData[layer.key]}
                onChange={(e) => updateValue(layer.key, e.target.value)}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex items-center gap-3">
                <div 
                  className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center text-2xl font-bold cursor-pointer hover:bg-purple-500 hover:bg-opacity-20 transition"
                  onClick={() => setSelectedLayer(layer.key)}
                >
                  {assessmentData[layer.key]}
                </div>
                <span className="text-gray-400">/10</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Your Current State</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <YAxis tick={{ fill: '#9ca3af' }} domain={[0, 10]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-100 text-sm">Before You Continue</h4>
            <p className="text-xs text-amber-200/70 mt-1">
              Self-assessment scores are subjective and may not capture your full situation. 
              Consider having someone you trust review your ratings for blind spots.
            </p>
          </div>
        </div>
      </div>

      <UserAgreementCheckbox 
        checked={hasAgreed} 
        onChange={handleAgreementChange} 
        required={false}
      />
      
      {!hasAgreed && (
        <div className="bg-amber-900/30 border border-amber-500/50 rounded-xl p-4 text-center">
          <p className="text-amber-200 text-sm">
            Please check the agreement above to unlock full analysis features
          </p>
        </div>
      )}

      <LimitationsDisclosure expanded={false} />
    </div>
  );
};

export default ModernAssessment;
