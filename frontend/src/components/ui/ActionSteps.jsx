import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Zap, ArrowRight } from 'lucide-react';

const actionStepsByArea = {
  bioHardware: {
    personal: [
      { id: 1, text: "Sleep 7-8 hours tonight - set alarm for same time tomorrow", priority: "high" },
      { id: 2, text: "Drink 6 glasses of water today", priority: "medium" },
      { id: 3, text: "Walk for 15 minutes after lunch or dinner", priority: "medium" }
    ],
    business: [
      { id: 1, text: "Count your cash and write down how much you get", priority: "high" },
      { id: 2, text: "List all your stock and equipment with their values", priority: "high" },
      { id: 3, text: "Check which resources you need most urgently", priority: "medium" }
    ],
    team: [
      { id: 1, text: "Check if team members get enough rest and breaks", priority: "high" },
      { id: 2, text: "Assess if you get enough people for the work", priority: "medium" },
      { id: 3, text: "Review if equipment and tools dey work properly", priority: "medium" }
    ]
  },
  internalOS: {
    personal: [
      { id: 1, text: "Write 3 things wey you dey grateful for today", priority: "high" },
      { id: 2, text: "Speak one positive thing about yourself out loud", priority: "medium" },
      { id: 3, text: "Take 5 deep breaths when you feel stressed", priority: "low" }
    ],
    business: [
      { id: 1, text: "Talk to your best worker about how dem dey feel", priority: "high" },
      { id: 2, text: "Thank your team for their hard work this week", priority: "medium" },
      { id: 3, text: "Ask one trusted person for honest feedback", priority: "medium" }
    ],
    team: [
      { id: 1, text: "Hold short team meeting to check how everyone dey", priority: "high" },
      { id: 2, text: "Recognize one team member for good work", priority: "medium" },
      { id: 3, text: "Create safe space for people to share concerns", priority: "medium" }
    ]
  },
  culturalSoftware: {
    personal: [
      { id: 1, text: "Spend 30 minutes doing something wey you value", priority: "high" },
      { id: 2, text: "Connect with family or community today", priority: "medium" },
      { id: 3, text: "Think about what really matters to you", priority: "low" }
    ],
    business: [
      { id: 1, text: "Write down your opening and closing process step by step", priority: "high" },
      { id: 2, text: "Create simple record book for daily sales", priority: "high" },
      { id: 3, text: "Set up a system for tracking what you owe and who owes you", priority: "medium" }
    ],
    team: [
      { id: 1, text: "Document how your team suppose do common tasks", priority: "high" },
      { id: 2, text: "Create checklist for important processes", priority: "medium" },
      { id: 3, text: "Review and simplify any confusing procedures", priority: "medium" }
    ]
  },
  socialInstance: {
    personal: [
      { id: 1, text: "Call one friend or family member you no talk to in a while", priority: "high" },
      { id: 2, text: "Help one person today without expecting anything", priority: "medium" },
      { id: 3, text: "Join or attend one community activity this week", priority: "low" }
    ],
    business: [
      { id: 1, text: "Ask 3 customers what dem like and no like about your business", priority: "high" },
      { id: 2, text: "Follow up with one customer who never come back", priority: "medium" },
      { id: 3, text: "Tell your suppliers about any problems early", priority: "medium" }
    ],
    team: [
      { id: 1, text: "Create simple way for team to share updates daily", priority: "high" },
      { id: 2, text: "Fix one communication problem team complain about", priority: "medium" },
      { id: 3, text: "Schedule regular check-in with key partners", priority: "medium" }
    ]
  },
  consciousUser: {
    personal: [
      { id: 1, text: "Write down one goal you want achieve this month", priority: "high" },
      { id: 2, text: "Reflect on one decision you made recently - what you learn?", priority: "medium" },
      { id: 3, text: "Plan your tomorrow before you sleep tonight", priority: "medium" }
    ],
    business: [
      { id: 1, text: "Write down where you want your business to be in 6 months", priority: "high" },
      { id: 2, text: "Identify 3 things stopping your business from growing", priority: "high" },
      { id: 3, text: "Make simple plan with dates for your next big step", priority: "medium" }
    ],
    team: [
      { id: 1, text: "Share team goals with everyone so dem understand", priority: "high" },
      { id: 2, text: "Break big goals into small steps with deadlines", priority: "medium" },
      { id: 3, text: "Review progress on goals with the team weekly", priority: "medium" }
    ]
  }
};

const ActionSteps = ({ weakestArea, purpose = 'personal', onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem(`akofa_action_steps_${purpose}`);
    return saved ? JSON.parse(saved) : [];
  });

  const steps = actionStepsByArea[weakestArea]?.[purpose] || actionStepsByArea[weakestArea]?.personal || [];

  useEffect(() => {
    localStorage.setItem(`akofa_action_steps_${purpose}`, JSON.stringify(completedSteps));
  }, [completedSteps, purpose]);

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      }
      return [...prev, stepId];
    });
  };

  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  const priorityColors = {
    high: 'border-red-500/50 bg-red-900/20',
    medium: 'border-yellow-500/50 bg-yellow-900/20',
    low: 'border-green-500/50 bg-green-900/20'
  };

  const priorityLabels = {
    high: 'Do First',
    medium: 'Do Soon',
    low: 'Do Later'
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Your 3 Action Steps</h3>
            <p className="text-sm text-gray-400">Do these first to see results</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">{completedSteps.length}/{steps.length}</div>
          <div className="text-xs text-gray-500">Done</div>
        </div>
      </div>

      <div className="h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isCompleted 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : priorityColors[step.priority]
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                    Step {index + 1}: {step.text}
                  </div>
                  {!isCompleted && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        step.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                        step.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-green-500/30 text-green-300'
                      }`}>
                        {priorityLabels[step.priority]}
                      </span>
                    </div>
                  )}
                </div>
                {!isCompleted && (
                  <ArrowRight className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {progress === 100 && (
        <div className="mt-4 p-4 bg-green-900/30 rounded-xl border border-green-500/30 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-green-400">You Don Complete All Steps!</div>
          <p className="text-sm text-gray-400 mt-1">Great job! Come back tomorrow for new steps.</p>
        </div>
      )}
    </div>
  );
};

export default ActionSteps;
