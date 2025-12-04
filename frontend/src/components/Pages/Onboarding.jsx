import React, { useState } from 'react';
import { ChevronRight, Sparkles, Target, Zap, TrendingUp } from 'lucide-react';
import { getLayerConfig } from '../../config/purposeConfig';

const Onboarding = ({ user, onComplete, purpose = 'personal' }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [insight, setInsight] = useState(null);

  const layers = getLayerConfig(purpose);
  const layerKeys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];

  const contextConfig = {
    personal: {
      title: "Let's understand your life",
      subtitle: "Rate these 5 areas to discover what's holding you back"
    },
    team: {
      title: "Let's assess your team",
      subtitle: "Rate these 5 dimensions to identify team dynamics"
    },
    business: {
      title: "Let's assess your business",
      subtitle: "Rate these 5 dimensions to identify growth opportunities"
    },
    policy: {
      title: "Let's assess the system",
      subtitle: "Rate these 5 dimensions to identify intervention points"
    }
  };

  const config = contextConfig[purpose] || contextConfig.personal;

  const questions = layerKeys.map((key, idx) => ({
    key,
    layerName: layers[key]?.name || `Layer ${idx + 1}`,
    description: layers[key]?.description || '',
    icon: layers[key]?.icon || '📊'
  }));

  const currentQuestion = questions[step];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      generateInsight(newAnswers);
    }
  };

  const generateInsight = (finalAnswers) => {
    const scores = layerKeys.map(key => finalAnswers[key] || 5);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const lowestIndex = scores.indexOf(Math.min(...scores));
    const highestIndex = scores.indexOf(Math.max(...scores));
    
    const lowestLayerName = layers[layerKeys[lowestIndex]]?.name || 'This area';
    const highestLayerName = layers[layerKeys[highestIndex]]?.name || 'Your strength';
    const lowestScore = scores[lowestIndex];
    const highestScore = scores[highestIndex];

    const headlines = {
      personal: lowestScore <= 4 
        ? `Your ${lowestLayerName} is holding you back`
        : `You're doing well, but ${lowestLayerName} could unlock more`,
      team: lowestScore <= 4 
        ? `Your team's ${lowestLayerName} needs urgent attention`
        : `Your team has potential in ${lowestLayerName}`,
      business: lowestScore <= 4 
        ? `${lowestLayerName} is your growth blocker`
        : `Unlock growth through ${lowestLayerName}`,
      policy: lowestScore <= 4 
        ? `${lowestLayerName} requires intervention`
        : `${lowestLayerName} presents opportunities`
    };

    setInsight({
      headline: headlines[purpose] || headlines.personal,
      detail: `While your ${highestLayerName} (${highestScore}/10) is strong, your ${lowestLayerName} (${lowestScore}/10) is creating a bottleneck. When one area is low, it drags down the others.`,
      action: `Focus on improving your ${lowestLayerName} first. This will create a ripple effect that lifts everything else.`,
      avgScore: avgScore.toFixed(1),
      lowestLayer: lowestLayerName,
      highestLayer: highestLayerName,
      lowestScore,
      highestScore,
      assessmentData: {
        bioHardware: finalAnswers.bioHardware || 5,
        internalOS: finalAnswers.internalOS || 5,
        culturalSoftware: finalAnswers.culturalSoftware || 5,
        socialInstance: finalAnswers.socialInstance || 5,
        consciousUser: finalAnswers.consciousUser || 5
      }
    });
    setShowResult(true);
  };

  const handleComplete = () => {
    onComplete(insight.assessmentData);
  };

  const ratingOptions = [
    { value: 1, label: 'Very Low', color: 'bg-red-500' },
    { value: 3, label: 'Low', color: 'bg-orange-500' },
    { value: 5, label: 'Average', color: 'bg-yellow-500' },
    { value: 7, label: 'Good', color: 'bg-blue-500' },
    { value: 9, label: 'Excellent', color: 'bg-green-500' }
  ];

  if (showResult && insight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Your Quick Assessment Results
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {insight.headline}
              </h1>
              <p className="text-gray-300">
                {insight.detail}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{insight.avgScore}</div>
                <div className="text-xs text-gray-400">Overall Score</div>
              </div>
              <div className="bg-green-900/30 rounded-xl p-4 text-center border border-green-500/30">
                <div className="text-3xl font-bold text-green-400">{insight.highestScore}</div>
                <div className="text-xs text-gray-400">Strength</div>
              </div>
              <div className="bg-red-900/30 rounded-xl p-4 text-center border border-red-500/30">
                <div className="text-3xl font-bold text-red-400">{insight.lowestScore}</div>
                <div className="text-xs text-gray-400">Needs Work</div>
              </div>
            </div>

            <div className="bg-slate-800/70 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Your First Step</div>
                  <p className="text-gray-300 text-sm">{insight.action}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 mb-6 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <div className="text-sm">
                  <span className="text-yellow-400 font-semibold">Pro tip:</span>
                  <span className="text-gray-300"> Improving your lowest area often creates a domino effect that boosts everything else.</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2"
            >
              <span>Go to My Dashboard</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              You can always refine your assessment later in the Assessment tab
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-slate-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-purple-300 text-sm mb-4">
              <TrendingUp className="w-4 h-4" />
              Quick Assessment
            </div>
            <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
            <p className="text-gray-400">{config.subtitle}</p>
          </div>

          <div className="mb-8">
            <div className="flex gap-1 mb-2">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i < step ? 'bg-purple-500' : i === step ? 'bg-purple-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-400 text-center">
              Question {step + 1} of {questions.length}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                {currentQuestion.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {currentQuestion.layerName}
                </h2>
                <p className="text-sm text-gray-400">{currentQuestion.description}</p>
              </div>
            </div>
            
            <p className="text-center text-gray-300 mb-6">
              How would you rate this area right now?
            </p>

            <div className="grid grid-cols-5 gap-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="flex flex-col items-center p-3 rounded-xl bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-purple-500 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center text-white font-bold text-sm mb-1`}>
                    {option.value}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              1 = Very Low, 9 = Excellent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
