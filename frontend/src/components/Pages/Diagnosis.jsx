import React, { useState } from 'react';
import { Send, Lightbulb, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { getDiagnosis } from '../../services/auth';

const Diagnosis = ({ assessmentData, purpose = 'personal' }) => {
  const [scenario, setScenario] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contextLabels = {
    personal: {
      title: 'Problem Solver',
      description: 'Tell Akↄfa wetin dey worry you. I go find the root cause and give you steps wey go actually work.',
      examples: '"I dey always tired for work and I dey vex on my family", "I dey delay important things", "I feel stuck for my job but I dey fear to change"',
      placeholder: 'Describe your problem or challenge here...',
      analyzing: 'Akↄfa dey analyze your situation...',
      rootCausesTitle: 'Wetin Dey Cause The Problem',
      newButton: 'Solve Another Problem'
    },
    team: {
      title: 'Team Problem Solver',
      description: 'Tell Akↄfa wetin dey worry your team. I go find the root cause and give you steps to fix am.',
      examples: '"Team morale low and people dey leave", "Projects dey always late", "Departments dey fight each other"',
      placeholder: 'Describe the team wahala here...',
      analyzing: 'Akↄfa dey analyze your team issue...',
      rootCausesTitle: 'Wetin Dey Cause The Team Problem',
      newButton: 'Solve Another Team Problem'
    },
    business: {
      title: 'Business Problem Solver',
      description: 'Tell Akↄfa wetin dey worry your business. I go diagnose am and give you strategy to fix am.',
      examples: '"Revenue dey drop even though we dey market well", "We no fit keep good staff", "Our product no dey fit market again"',
      placeholder: 'Describe the business challenge here...',
      analyzing: 'Akↄfa dey analyze your business problem...',
      rootCausesTitle: 'Wetin Dey Cause The Business Problem',
      newButton: 'Solve Another Business Problem'
    },
    policy: {
      title: 'System Problem Solver',
      description: 'Tell Akↄfa about the system issue. I go analyze am and give practical recommendations wey go work.',
      examples: '"Inequality dey rise even with economic growth", "Healthcare access no dey equal", "Environmental policies no dey work"',
      placeholder: 'Describe the systemic issue here...',
      analyzing: 'Akↄfa dey analyze the system issue...',
      rootCausesTitle: 'Wetin Dey Cause The System Problem',
      newButton: 'Analyze Another Issue'
    }
  };

  const labels = contextLabels[purpose] || contextLabels.personal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scenario.trim()) return;

    setLoading(true);
    setSubmitted(true);

    try {
      const data = await getDiagnosis(scenario.trim(), assessmentData, purpose);
      setDiagnosis(data);
    } catch (err) {
      console.error('Diagnosis error:', err);
      setDiagnosis({
        summary: 'Something happen. Try again.',
        rootCauses: [],
        actionSteps: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewScenario = () => {
    setScenario('');
    setDiagnosis(null);
    setSubmitted(false);
  };

  return (
    <div className="diagnosis-page space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold">{labels.title}</h2>
        </div>
        <p className="text-gray-300">{labels.description}</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
            <p className="text-sm text-blue-100 flex items-start gap-2">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-400" />
              <span><span className="font-semibold">For example:</span> {labels.examples}</span>
            </p>
          </div>

          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder={labels.placeholder}
            className="w-full h-40 px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-purple-500 outline-none text-white resize-none"
          />

          <button
            type="submit"
            disabled={loading || !scenario.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Analyzing...' : 'Find Solution'}
          </button>
        </form>
      ) : null}

      {loading && (
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          <p className="text-gray-300">{labels.analyzing}</p>
        </div>
      )}

      {diagnosis && !loading && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-purple-400" />
              Wetin Dey Happen
            </h3>
            <p className="text-gray-100 leading-relaxed">{diagnosis.summary}</p>
          </div>

          {diagnosis.rootCauses && diagnosis.rootCauses.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{labels.rootCausesTitle}</h3>
              <div className="space-y-3">
                {diagnosis.rootCauses.map((cause, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="font-semibold text-purple-400 mb-1">{cause.layer}</div>
                    <p className="text-gray-300 text-sm">{cause.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {diagnosis.actionSteps && diagnosis.actionSteps.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Wetin You Go Do
              </h3>
              <div className="space-y-4">
                {diagnosis.actionSteps.map((step, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 flex-shrink-0 font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{step.action}</div>
                        <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                        <div className="text-xs text-green-400 bg-green-900/30 rounded px-2 py-1 inline-block border border-green-500/30">
                          {step.timeline}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {diagnosis.whyItHelps && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold mb-3">Why This Go Work</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{diagnosis.whyItHelps}</p>
            </div>
          )}

          <button
            onClick={handleNewScenario}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
          >
            {labels.newButton}
          </button>
        </div>
      )}
    </div>
  );
};

export default Diagnosis;
