import React, { useState } from 'react';
import { AlertTriangle, Info, Shield, CheckCircle, X } from 'lucide-react';
import { getFrameworkLimitations, getEthicalWarnings } from '../../utils/frameworkMetrics';

export const CriticalWarningBanner = ({ onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 border border-amber-500/50 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-100 mb-1">Heuristic Tool, Not Truth</h4>
          <p className="text-sm text-amber-200/90">
            This framework models reality but is not reality. All outputs contain significant uncertainty. 
            Never use for high-stakes decisions without multiple validation methods.
          </p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-amber-400 hover:text-amber-200 transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const EthicalGuardrails = ({ compact = false }) => {
  const warnings = getEthicalWarnings();
  
  if (compact) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
          <Shield className="w-4 h-4" />
          <span>This framework must NOT be used for:</span>
        </div>
        <div className="text-red-300/80 ml-6">
          {warnings.slice(0, 3).join(' | ')}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h4 className="font-semibold text-red-100">Ethical Usage Guidelines</h4>
          <p className="text-xs text-red-300/70">This framework must NOT be used for:</p>
        </div>
      </div>
      <ul className="space-y-2 ml-2">
        {warnings.map((warning, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-red-200/90">
            <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const LimitationsDisclosure = ({ expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const limitations = getFrameworkLimitations();
  
  return (
    <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-5">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white">Framework Limitations</h4>
            <p className="text-xs text-gray-400">Understanding what this tool can and cannot do</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{isExpanded ? 'Hide' : 'Show'}</span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <ul className="space-y-2">
            {limitations.map((limitation, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const UserAgreementCheckbox = ({ checked, onChange, required = true }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-800/60 rounded-xl border border-slate-600/50 hover:border-purple-500/50 transition">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        required={required}
        className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-slate-900"
      />
      <div className="text-sm text-gray-300">
        <span className="font-medium text-white">I understand that this tool:</span>
        <ol className="mt-2 space-y-1 text-gray-400">
          <li>1. Shows possible interpretations, not objective facts</li>
          <li>2. Has cultural and cognitive biases</li>
          <li>3. Should inform but not determine important decisions</li>
          <li>4. Is not a substitute for professional advice</li>
        </ol>
      </div>
    </label>
  );
};

export const UncertaintyDisplay = ({ score, uncertainty, min, max, confidence }) => {
  const getConfidenceColor = (conf) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-purple-400">{score}</span>
        <span className="text-lg text-gray-400">+/-</span>
        <span className="text-lg text-gray-300">{uncertainty}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Range:</span>
        <span className="text-gray-300">{min} - {max}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-500">Confidence:</span>
        <span className={getConfidenceColor(confidence)}>{confidence}%</span>
      </div>
    </div>
  );
};

export const ConfidenceIndicator = ({ confidence, label = "Confidence" }) => {
  const getColor = (conf) => {
    if (conf >= 80) return { bg: 'bg-green-500', text: 'text-green-400' };
    if (conf >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-400' };
    return { bg: 'bg-orange-500', text: 'text-orange-400' };
  };
  
  const colors = getColor(confidence);
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">{label}:</span>
      <div className="flex items-center gap-1">
        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colors.bg} rounded-full transition-all`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className={`text-xs ${colors.text}`}>{confidence}%</span>
      </div>
    </div>
  );
};

export default {
  CriticalWarningBanner,
  EthicalGuardrails,
  LimitationsDisclosure,
  UserAgreementCheckbox,
  UncertaintyDisplay,
  ConfidenceIndicator
};
