import React, { useState } from 'react';
import { AlertTriangle, MapPin, RefreshCw, CheckCircle, X } from 'lucide-react';
import { geographicCureWarnings, adaptationFirstPrinciples } from '../../config/purposeConfig';

const GeographicCureWarning = ({ 
  environmentalScore = 0, 
  onCarryTestComplete,
  showByDefault = false 
}) => {
  const [showWarning, setShowWarning] = useState(showByDefault);
  const [carryTestResponse, setCarryTestResponse] = useState(null);
  const [showAdaptationTips, setShowAdaptationTips] = useState(false);
  
  const shouldTriggerWarning = environmentalScore <= 4 && environmentalScore > 0;
  
  if (!shouldTriggerWarning && !showByDefault) {
    return null;
  }

  const handleCarryTestResponse = (response) => {
    setCarryTestResponse(response);
    if (onCarryTestComplete) {
      onCarryTestComplete(response);
    }
  };

  const getInterpretationStyle = (response) => {
    if (response === 'Mostly disappear') {
      return 'bg-green-900/30 border-green-500/30 text-green-400';
    } else if (response === 'Come with me') {
      return 'bg-amber-900/30 border-amber-500/30 text-amber-400';
    }
    return 'bg-blue-900/30 border-blue-500/30 text-blue-400';
  };

  if (!showWarning) {
    return (
      <button
        onClick={() => setShowWarning(true)}
        className="w-full bg-amber-900/20 hover:bg-amber-900/30 border border-amber-500/30 rounded-xl p-4 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="font-semibold text-amber-400">Thinking About Moving?</div>
            <p className="text-sm text-gray-400">
              Your environment score is low. Before planning a move, take the "Carry Test"
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-amber-500/30 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Geographic Cure Warning</h3>
              <p className="text-sm text-amber-200/70">Before blaming your location...</p>
            </div>
          </div>
          <button 
            onClick={() => setShowWarning(false)}
            className="p-1 hover:bg-slate-700 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-3">
            Research shows that <span className="text-amber-400 font-semibold">80% of problems follow geographical moves</span>. 
            The "geographic cure" rarely works because internal issues travel with you.
          </p>
          <div className="space-y-2">
            {geographicCureWarnings.responses.map((response, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <RefreshCw className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{response}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/20">
          <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            The Carry Test
          </h4>
          <p className="text-white mb-4">{geographicCureWarnings.carryTestQuestion}</p>
          
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(geographicCureWarnings.carryTestInterpretation).map((option) => (
              <button
                key={option}
                onClick={() => handleCarryTestResponse(option)}
                className={`p-3 rounded-lg border transition text-left ${
                  carryTestResponse === option 
                    ? 'bg-purple-600/30 border-purple-500' 
                    : 'bg-slate-700/50 border-slate-600 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {carryTestResponse === option && (
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  )}
                  <span className="text-gray-200">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {carryTestResponse && (
          <div className={`rounded-lg p-4 border ${getInterpretationStyle(carryTestResponse)}`}>
            <div className="font-semibold mb-1">Your Result:</div>
            <p className="text-gray-200">
              {geographicCureWarnings.carryTestInterpretation[carryTestResponse]}
            </p>
            {carryTestResponse === 'Mostly disappear' && (
              <p className="text-sm text-gray-400 mt-2">
                Your environment may genuinely be a factor. Consider targeted environmental changes rather than complete relocation.
              </p>
            )}
            {carryTestResponse === 'Come with me' && (
              <p className="text-sm text-gray-400 mt-2">
                Focus on internal layers (Mindset, Beliefs, Relationships) first. Moving won't solve these issues.
              </p>
            )}
            {carryTestResponse === 'Mixed' && (
              <p className="text-sm text-gray-400 mt-2">
                Address internal issues while making micro-environmental improvements. Major relocation should be last resort.
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => setShowAdaptationTips(!showAdaptationTips)}
          className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-purple-400 transition"
        >
          {showAdaptationTips ? 'Hide' : 'Show'} Adaptation-First Strategies
        </button>

        {showAdaptationTips && (
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-3">Adaptation-First Principles</h4>
            <div className="space-y-2">
              {adaptationFirstPrinciples.map((principle, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{principle}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-green-500/20">
              <h5 className="font-medium text-green-400 mb-2">Try These First:</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Redesign your immediate space (room, desk, routines)</li>
                <li>• Find micro-environments that energize you</li>
                <li>• Build a "third place" outside home and work</li>
                <li>• Create environmental rituals that ground you</li>
                <li>• Address the relationships in your current environment</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeographicCureWarning;
