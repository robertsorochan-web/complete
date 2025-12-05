import React, { useState, useEffect, useRef } from 'react';
import { Wrench, Wind, BookOpen, HelpCircle, Timer, Brain, Target, RefreshCw, Play, Pause, RotateCcw, ChevronRight, Check, Lightbulb, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const journalPrompts = [
  { category: 'selfReflection', prompts: [
    "What pattern did you notice in your thoughts today?",
    "What cultural belief influenced a decision you made recently?",
    "What assumption about yourself did you challenge today?",
    "What would you tell your younger self about what you learned today?",
    "What are you holding onto that no longer serves you?"
  ]},
  { category: 'gratitude', prompts: [
    "What are three things you're grateful for right now?",
    "Who made a positive difference in your life recently?",
    "What challenge taught you something valuable?",
    "What small moment brought you joy today?",
    "What ability or skill are you thankful to have?"
  ]},
  { category: 'growth', prompts: [
    "What is one thing you could improve tomorrow?",
    "What fear is holding you back from your potential?",
    "What new perspective did you gain recently?",
    "How have you grown in the last month?",
    "What habit would transform your life if you started it?"
  ]},
  { category: 'relationships', prompts: [
    "How did your interactions with others affect you today?",
    "What relationship needs more attention?",
    "Who inspires you and why?",
    "What boundary do you need to set or maintain?",
    "How can you show more appreciation to someone important?"
  ]},
  { category: 'purpose', prompts: [
    "What gives your life meaning?",
    "What legacy do you want to leave?",
    "What would you do if you knew you couldn't fail?",
    "What values guide your decisions?",
    "What is one goal that excites you?"
  ]}
];

const decisionMatrix = {
  steps: [
    { step: 1, titleKey: "defineDecision", questionKey: "whatDeciding" },
    { step: 2, titleKey: "listOptions", questionKey: "whatOptions" },
    { step: 3, titleKey: "considerConsequences", questionKey: "whatHappens" },
    { step: 4, titleKey: "checkValues", questionKey: "whichAligns" },
    { step: 5, titleKey: "trustGut", questionKey: "howFeels" }
  ]
};

export default function ToolsPage() {
  const { t, getSection } = useLanguage();
  const toolsText = getSection('toolsPage');
  const [activeTool, setActiveTool] = useState('breathing');
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Wrench className="w-8 h-8 text-cyan-500" />
          {toolsText.title || 'Stack Tools'}
        </h1>
        <p className="text-gray-400">{toolsText.subtitle || 'Practical tools to help you grow and thrive'}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveTool('breathing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTool === 'breathing' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Wind className="w-4 h-4" />
          {toolsText.breathing || 'Breathing'}
        </button>
        <button
          onClick={() => setActiveTool('journal')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTool === 'journal' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {toolsText.journalPrompts || 'Journal Prompts'}
        </button>
        <button
          onClick={() => setActiveTool('decision')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTool === 'decision' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          {toolsText.decisionHelper || 'Decision Helper'}
        </button>
        <button
          onClick={() => setActiveTool('focus')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTool === 'focus' 
              ? 'bg-purple-500 text-white' 
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Timer className="w-4 h-4" />
          {toolsText.focusTimer || 'Focus Timer'}
        </button>
      </div>

      <div className="mt-6">
        {activeTool === 'breathing' && <BreathingTimer />}
        {activeTool === 'journal' && <JournalPrompts />}
        {activeTool === 'decision' && <DecisionHelper />}
        {activeTool === 'focus' && <FocusTimer />}
      </div>
    </div>
  );
}

function BreathingTimer() {
  const { getSection } = useLanguage();
  const toolsText = getSection('toolsPage');
  const commonText = getSection('common');
  
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState('relaxed');

  const patterns = {
    relaxed: { inhale: 4, hold: 4, exhale: 4, name: toolsText.relaxed || 'Relaxed (4-4-4)' },
    calm: { inhale: 4, hold: 7, exhale: 8, name: toolsText.calming || 'Calming (4-7-8)' },
    energize: { inhale: 6, hold: 2, exhale: 4, name: toolsText.energizing || 'Energizing (6-2-4)' },
    box: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, name: toolsText.boxBreathing || 'Box Breathing (4-4-4-4)' }
  };

  const currentPattern = patterns[selectedPattern];

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            if (phase === 'inhale') {
              setPhase('hold');
              return currentPattern.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return currentPattern.exhale;
            } else if (phase === 'exhale') {
              if (currentPattern.holdEmpty) {
                setPhase('holdEmpty');
                return currentPattern.holdEmpty;
              }
              setPhase('inhale');
              setCycles(c => c + 1);
              return currentPattern.inhale;
            } else if (phase === 'holdEmpty') {
              setPhase('inhale');
              setCycles(c => c + 1);
              return currentPattern.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase, currentPattern]);

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSeconds(currentPattern.inhale);
    setCycles(0);
  };

  const getPhaseInstruction = () => {
    switch(phase) {
      case 'inhale': return toolsText.breatheIn || 'Breathe In';
      case 'hold': return toolsText.hold || 'Hold';
      case 'exhale': return toolsText.breatheOut || 'Breathe Out';
      case 'holdEmpty': return toolsText.holdEmpty || 'Hold Empty';
      default: return toolsText.breatheIn || 'Breathe In';
    }
  };

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-110';
    if (phase === 'exhale') return 'scale-90';
    return 'scale-100';
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <Wind className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">{toolsText.breathingExercise || 'Breathing Exercise'}</h2>
        <p className="text-gray-400 text-sm">{toolsText.calmYourMind || 'Calm your mind with guided breathing'}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {Object.entries(patterns).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedPattern(key);
              reset();
            }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              selectedPattern === key 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className={`w-48 h-48 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center mb-6 transition-transform duration-1000 ease-in-out ${getCircleSize()}`}>
          <div className="w-36 h-36 rounded-full bg-gradient-to-r from-cyan-500/50 to-purple-500/50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{seconds}</p>
              <p className="text-cyan-400 text-sm font-medium">{getPhaseInstruction()}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-400 mb-4">{toolsText.cyclesCompleted || 'Cycles completed'}: {cycles}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
              isActive 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? (commonText.pause || 'Pause') : (commonText.start || 'Start')}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {toolsText.reset || 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
}

function JournalPrompts() {
  const { getSection } = useLanguage();
  const toolsText = getSection('toolsPage');
  const commonText = getSection('common');
  
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);

  const getCategoryName = (categoryKey) => {
    return toolsText[categoryKey] || categoryKey;
  };

  const shufflePrompt = () => {
    const prompts = journalPrompts[selectedCategory].prompts;
    setCurrentPrompt(Math.floor(Math.random() * prompts.length));
  };

  const saveEntry = () => {
    if (journalEntry.trim()) {
      setSavedEntries([
        { 
          prompt: journalPrompts[selectedCategory].prompts[currentPrompt],
          entry: journalEntry,
          date: new Date().toLocaleString()
        },
        ...savedEntries
      ]);
      setJournalEntry('');
      shufflePrompt();
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">{toolsText.journalPrompts || 'Journal Prompts'}</h2>
        <p className="text-gray-400 text-sm">{toolsText.reflectAndGrow || 'Reflect and grow with guided journaling'}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {journalPrompts.map((cat, i) => (
          <button
            key={i}
            onClick={() => { setSelectedCategory(i); setCurrentPrompt(0); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              selectedCategory === i 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            {getCategoryName(cat.category)}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <button
            onClick={shufflePrompt}
            className="text-gray-400 hover:text-white transition flex items-center gap-1 text-sm"
          >
            <Shuffle className="w-4 h-4" />
            {toolsText.newPrompt || 'New Prompt'}
          </button>
        </div>
        <p className="text-white text-lg font-medium">
          {journalPrompts[selectedCategory].prompts[currentPrompt]}
        </p>
      </div>

      <textarea
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
        placeholder={toolsText.writeThoughts || "Write your thoughts here..."}
        className="w-full p-4 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none min-h-[150px] mb-4"
      />

      <button
        onClick={saveEntry}
        disabled={!journalEntry.trim()}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Check className="w-5 h-5" />
        {toolsText.saveEntry || 'Save Entry'}
      </button>

      {savedEntries.length > 0 && (
        <div className="mt-6">
          <h3 className="text-white font-medium mb-3">{toolsText.recentEntries || 'Recent Entries'}</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {savedEntries.map((entry, i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-purple-400 mb-1">"{entry.prompt}"</p>
                <p className="text-gray-300 text-sm">{entry.entry}</p>
                <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionHelper() {
  const { getSection } = useLanguage();
  const toolsText = getSection('toolsPage');
  const commonText = getSection('common');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  const isComplete = currentStep >= decisionMatrix.steps.length;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">{toolsText.decisionHelper || 'Decision Helper'}</h2>
        <p className="text-gray-400 text-sm">{toolsText.breakDownDecisions || 'Break down complex decisions into manageable parts'}</p>
      </div>

      <div className="flex justify-center mb-6">
        {decisionMatrix.steps.map((_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i < currentStep ? 'bg-green-500 text-white' :
              i === currentStep ? 'bg-purple-500 text-white' :
              'bg-slate-700 text-gray-500'
            }`}>
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < decisionMatrix.steps.length - 1 && (
              <div className={`w-8 h-1 ${i < currentStep ? 'bg-green-500' : 'bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      {!isComplete ? (
        <div className="bg-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">
            {commonText.step || 'Step'} {currentStep + 1}: {toolsText[decisionMatrix.steps[currentStep].titleKey] || decisionMatrix.steps[currentStep].titleKey}
          </h3>
          <p className="text-gray-400 mb-4">{toolsText[decisionMatrix.steps[currentStep].questionKey] || decisionMatrix.steps[currentStep].questionKey}</p>

          {currentStep === 1 ? (
            <div className="space-y-3 mb-4">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`${commonText.option || 'Option'} ${i + 1}`}
                    className="flex-1 p-3 bg-slate-700 rounded-lg text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              ))}
              <button
                onClick={handleAddOption}
                className="text-purple-400 text-sm hover:text-purple-300"
              >
                {toolsText.addOption || '+ Add another option'}
              </button>
            </div>
          ) : (
            <textarea
              value={answers[currentStep] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={toolsText.typeAnswer || "Type your answer..."}
              className="w-full p-4 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none min-h-[120px] mb-4"
            />
          )}

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                {commonText.back || 'Back'}
              </button>
            )}
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {currentStep < decisionMatrix.steps.length - 1 ? (toolsText.nextStep || 'Next Step') : (toolsText.complete || 'Complete')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-xl p-6 border border-green-500/30 text-center">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{toolsText.frameworkComplete || 'Decision Framework Complete!'}</h3>
          <p className="text-gray-400 mb-4">{toolsText.reflectDiscovered || "You've worked through all the steps. Take a moment to reflect on what you've discovered."}</p>
          <button
            onClick={() => { setCurrentStep(0); setAnswers({}); setOptions(['', '']); }}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            {toolsText.startNewDecision || 'Start New Decision'}
          </button>
        </div>
      )}
    </div>
  );
}

function FocusTimer() {
  const { getSection } = useLanguage();
  const toolsText = getSection('toolsPage');
  const commonText = getSection('common');
  
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');
  const [sessions, setSessions] = useState(0);

  const presets = {
    focus: { minutes: 25, label: toolsText.focus25 || 'Focus (25 min)' },
    short: { minutes: 5, label: toolsText.shortBreak || 'Short Break (5 min)' },
    long: { minutes: 15, label: toolsText.longBreak || 'Long Break (15 min)' }
  };

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (mode === 'focus') {
              setSessions(s => s + 1);
              setMode('short');
              setMinutes(presets.short.minutes);
            } else {
              setMode('focus');
              setMinutes(presets.focus.minutes);
            }
            return;
          }
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const setPreset = (preset) => {
    setMode(preset);
    setMinutes(presets[preset].minutes);
    setSeconds(0);
    setIsActive(false);
  };

  const reset = () => {
    setMinutes(presets[mode].minutes);
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (m, s) => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <Timer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-white">{toolsText.focusTimerTitle || 'Focus Timer'}</h2>
        <p className="text-gray-400 text-sm">{toolsText.boostProductivity || 'Boost productivity with timed focus sessions'}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => setPreset(key)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              mode === key 
                ? 'bg-orange-500 text-white' 
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center mb-6 ${
          mode === 'focus' 
            ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30' 
            : 'bg-gradient-to-r from-green-500/30 to-cyan-500/30'
        }`}>
          <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
            mode === 'focus' 
              ? 'bg-gradient-to-r from-orange-500/50 to-red-500/50' 
              : 'bg-gradient-to-r from-green-500/50 to-cyan-500/50'
          }`}>
            <div className="text-center">
              <p className="text-4xl font-bold text-white font-mono">{formatTime(minutes, seconds)}</p>
              <p className={`text-sm font-medium ${mode === 'focus' ? 'text-orange-400' : 'text-green-400'}`}>
                {mode === 'focus' ? (toolsText.focusTime || 'Focus Time') : (toolsText.breakTime || 'Break Time')}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-400 mb-4">{toolsText.sessionsCompleted || 'Sessions completed'}: {sessions}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? (commonText.pause || 'Pause') : (commonText.start || 'Start')}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {toolsText.reset || 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
}
