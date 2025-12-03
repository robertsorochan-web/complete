import React, { useState } from 'react';
import { Send, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { getDiagnosis } from '../../services/auth';
const Diagnosis = ({ assessmentData, purpose = 'personal' }) => {
  const [scenario, setScenario] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contextLabels = {
    personal: {
      title: 'Problem Solver',
      description: 'Describe a problem, challenge, or scenario you\'re facing. I\'ll diagnose which of your 5 life areas are involved and give you concrete steps to fix it.',
      examples: '"I\'m always exhausted at work and snapping at my family", "I keep procrastinating on important projects", "I feel stuck in my career but scared to change jobs"',
      placeholder: 'Describe your situation, problem, or challenge in detail...',
      analyzing: 'Diagnosing your situation using the framework...',
      rootCausesTitle: 'Root Causes (Which Life Areas Are Involved)',
      newButton: 'Solve Another Problem'
    },
    team: {
      title: 'Team Issue Diagnosis',
      description: 'Describe a team challenge or issue you\'re facing. I\'ll diagnose which of the 5 team dimensions are involved and give you concrete steps to address it.',
      examples: '"Team morale is low and people are quitting", "Projects keep missing deadlines", "There\'s constant conflict between departments"',
      placeholder: 'Describe the team issue, challenge, or situation in detail...',
      analyzing: 'Diagnosing the team issue using the framework...',
      rootCausesTitle: 'Root Causes (Which Team Dimensions Are Involved)',
      newButton: 'Diagnose Another Issue'
    },
    business: {
      title: 'Business Problem Diagnosis',
      description: 'Describe a business challenge or problem you\'re facing. I\'ll diagnose which of the 5 organizational dimensions are involved and give you strategic recommendations.',
      examples: '"Revenue is declining despite increased marketing spend", "We can\'t retain top talent", "Our product-market fit seems off"',
      placeholder: 'Describe the business problem, challenge, or situation in detail...',
      analyzing: 'Diagnosing the business problem using the framework...',
      rootCausesTitle: 'Root Causes (Which Business Dimensions Are Involved)',
      newButton: 'Diagnose Another Problem'
    },
    policy: {
      title: 'System Issue Analysis',
      description: 'Describe a systemic issue or policy challenge. I\'ll analyze which of the 5 system dimensions are involved and provide evidence-based recommendations.',
      examples: '"Rising inequality despite economic growth", "Healthcare access disparities persist", "Environmental regulations aren\'t achieving targets"',
      placeholder: 'Describe the systemic issue, policy challenge, or research question in detail...',
      analyzing: 'Analyzing the systemic issue using the framework...',
      rootCausesTitle: 'Root Causes (Which System Dimensions Are Involved)',
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
        summary: 'Something went wrong. Please try again.',
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
        <h2 className="text-3xl font-bold mb-2">{labels.title}</h2>
        <p className="text-gray-300">{labels.description}</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-800">
            <p className="text-sm text-blue-100 flex items-start gap-2">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span><span className="font-semibold">Examples:</span> {labels.examples}</span>
            </p>
          </div>

          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder={labels.placeholder}
            className="w-full h-40 px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none text-white"
          />

          <button
            type="submit"
            disabled={loading || !scenario.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Analyzing...' : 'Analyze & Get Help'}
          </button>
        </form>
      ) : null}

      {loading && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
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
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-600">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              What's Happening
            </h3>
            <p className="text-gray-100 leading-relaxed">{diagnosis.summary}</p>
          </div>

          {diagnosis.rootCauses && diagnosis.rootCauses.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{labels.rootCausesTitle}</h3>
              <div className="space-y-3">
                {diagnosis.rootCauses.map((cause, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <div className="font-semibold text-purple-400 mb-1">{cause.layer}</div>
                    <p className="text-gray-300 text-sm">{cause.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {diagnosis.actionSteps && diagnosis.actionSteps.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Concrete Action Steps
              </h3>
              <div className="space-y-4">
                {diagnosis.actionSteps.map((step, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold mb-1">{step.action}</div>
                        <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                        <div className="text-xs text-gray-400 bg-slate-600 rounded px-2 py-1 inline-block">
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
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-3">Why This Will Help</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{diagnosis.whyItHelps}</p>
            </div>
          )}

          <button
            onClick={handleNewScenario}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
          >
            {labels.newButton}
          </button>
        </div>
      )}
    </div>
  );
};

export default Diagnosis;
