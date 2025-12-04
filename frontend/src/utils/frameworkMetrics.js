export const calculateUncertainty = (allLayers) => {
  const avg = allLayers.reduce((a, b) => a + b, 0) / allLayers.length;
  const variance = Math.sqrt(allLayers.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / allLayers.length);
  const range = Math.max(...allLayers) - Math.min(...allLayers);
  const dataQuality = allLayers.every(v => v >= 0 && v <= 10) ? 1 : 0.5;
  const uncertainty = (range * 0.15 + variance * 0.3 + (10 - avg) * 0.05) * dataQuality;
  return Math.min(uncertainty, 3).toFixed(1);
};

export const calculateStabilityWithRange = (allLayers) => {
  const avg = allLayers.reduce((a, b) => a + b, 0) / allLayers.length;
  const variance = Math.sqrt(allLayers.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / allLayers.length);
  const harmonyScore = Math.max(0, 10 - variance);
  const uncertainty = parseFloat(calculateUncertainty(allLayers));
  
  return {
    score: harmonyScore.toFixed(1),
    uncertainty: uncertainty,
    min: Math.max(0, harmonyScore - uncertainty).toFixed(1),
    max: Math.min(10, harmonyScore + uncertainty).toFixed(1),
    confidence: calculateConfidence(allLayers)
  };
};

export const calculateConfidence = (allLayers) => {
  const range = Math.max(...allLayers) - Math.min(...allLayers);
  const avg = allLayers.reduce((a, b) => a + b, 0) / allLayers.length;
  const extremeCount = allLayers.filter(v => v <= 2 || v >= 9).length;
  let confidence = 85;
  confidence -= range * 2;
  confidence -= extremeCount * 5;
  if (avg < 3 || avg > 8) confidence -= 10;
  return Math.max(40, Math.min(95, Math.round(confidence)));
};

export const calculateRecommendationConfidence = (currentValue, targetChange, allLayers) => {
  const avg = allLayers.reduce((a, b) => a + b, 0) / allLayers.length;
  let confidence = 75;
  if (currentValue === Math.min(...allLayers)) confidence += 15;
  if (Math.abs(targetChange) > 3) confidence -= 15;
  if (avg < 4 || avg > 7) confidence -= 10;
  return Math.max(40, Math.min(95, Math.round(confidence)));
};

export const getInteractionMatrix = (allLayers, layerNames) => {
  return [
    { from: layerNames[0], to: layerNames[1], impact: '+0.3', description: 'Physical health improves mental state' },
    { from: layerNames[1], to: layerNames[2], impact: '+0.4', description: 'Inner beliefs shape values' },
    { from: layerNames[2], to: layerNames[3], impact: '+0.3', description: 'Values guide social choices' },
    { from: layerNames[3], to: layerNames[4], impact: '+0.2', description: 'Social context shapes awareness' },
    { from: layerNames[4], to: layerNames[0], impact: '+0.2', description: 'Self-awareness improves health choices' }
  ];
};

export const getFrameworkLimitations = () => [
  'Cannot diagnose clinical mental health conditions',
  'Cannot predict outcomes with reliability above 60%',
  'Should not replace professional medical or psychological advice',
  'Not validated for all cultural contexts without adaptation',
  'Oversimplifies complex adaptive systems',
  'May pathologize necessary periods of instability',
  'Contains cognitive biases from Western frameworks',
  'Should be one tool among many, not the only source'
];

export const getEthicalWarnings = () => [
  'Ranking or comparing human worth',
  'Justifying coercion or manipulation',
  'Making irreversible life decisions',
  'Replacing professional counseling',
  'Diagnosing medical conditions'
];

export const culturalContexts = {
  default: { 
    name: 'Default', 
    description: 'Standard balanced model',
    adjustments: { individual: 1, collective: 1, implicit: 1 }
  },
  collectivist: { 
    name: 'Collectivist', 
    description: 'Community-oriented cultures (adjusts social layer weight)',
    adjustments: { individual: 0.8, collective: 1.3, implicit: 1.1 }
  },
  individualist: { 
    name: 'Individualist', 
    description: 'Individual-focused cultures (adjusts personal layer weight)',
    adjustments: { individual: 1.3, collective: 0.8, implicit: 0.9 }
  },
  highContext: { 
    name: 'High-Context', 
    description: 'Cultures with implicit communication (adjusts cultural layer)',
    adjustments: { individual: 0.9, collective: 1.1, implicit: 1.3 }
  }
};

export const getAlternativeInterpretations = (allLayers, layerNames) => {
  const min = Math.min(...allLayers);
  const max = Math.max(...allLayers);
  const minIdx = allLayers.indexOf(min);
  const maxIdx = allLayers.indexOf(max);
  
  return [
    {
      title: `What if ${layerNames[minIdx]} is not the real problem?`,
      explanation: `Low score in ${layerNames[minIdx]} might be a symptom, not a cause. Consider investigating upstream factors.`
    },
    {
      title: `What if high ${layerNames[maxIdx]} is masking issues?`,
      explanation: `Strong performance in ${layerNames[maxIdx]} might be compensating for weaknesses elsewhere.`
    },
    {
      title: 'Could current instability be necessary?',
      explanation: 'Periods of imbalance often precede growth. Not all instability is pathological.'
    },
    {
      title: 'Are we measuring what matters?',
      explanation: 'Self-reported scores may not capture the full complexity of your situation.'
    }
  ];
};

export const calculateFrameworkHealth = (allLayers, userExperience = 'novice') => {
  let dataQuality = 80;
  const range = Math.max(...allLayers) - Math.min(...allLayers);
  if (allLayers.some(v => v === 5)) dataQuality -= 10;
  if (range < 2) dataQuality -= 15;
  if (allLayers.every(v => v === allLayers[0])) dataQuality -= 30;
  
  const contextFit = 70;
  
  const userSkill = {
    novice: 50,
    intermediate: 70,
    experienced: 85
  }[userExperience] || 50;
  
  const overallHealth = Math.round((dataQuality + contextFit + userSkill) / 3);
  
  return {
    overall: Math.max(20, Math.min(100, overallHealth)),
    dataQuality: Math.max(20, Math.min(100, dataQuality)),
    contextFit,
    userExpertise: userSkill,
    recommendation: overallHealth > 70 
      ? 'Framework is appropriately applied' 
      : overallHealth > 50 
        ? 'Use results with caution - consider additional validation'
        : 'Results may be unreliable - seek professional guidance'
  };
};
