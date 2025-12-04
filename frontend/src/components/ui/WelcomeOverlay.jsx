import React, { useState } from 'react';
import { Briefcase, Fish, GraduationCap, Users, Heart, Building2, Sprout, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const useCaseOptions = [
  {
    id: 'business',
    title: 'My Small Business',
    description: 'Chop bar, shop, trading, services',
    icon: ShoppingBag,
    color: 'from-orange-500 to-red-500',
    examples: ['Chop bar', 'Market stall', 'Hair salon', 'Taxi driver']
  },
  {
    id: 'farming',
    title: 'My Farm / Fishing',
    description: 'Farming, fishing, livestock',
    icon: Fish,
    color: 'from-blue-500 to-cyan-500',
    examples: ['Fishing', 'Crop farming', 'Poultry', 'Livestock']
  },
  {
    id: 'education',
    title: 'My Education',
    description: 'Student, teacher, learning',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-500',
    examples: ['Student', 'Teacher', 'Skills training', 'Apprentice']
  },
  {
    id: 'community',
    title: 'My Community',
    description: 'Church, association, village',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    examples: ['Church group', 'Youth group', 'Village council', 'Association']
  },
  {
    id: 'personal',
    title: 'My Personal Life',
    description: 'Health, family, relationships',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    examples: ['Health', 'Marriage', 'Family', 'Personal growth']
  },
  {
    id: 'team',
    title: 'My Team / Workplace',
    description: 'Office, organization, company',
    icon: Building2,
    color: 'from-indigo-500 to-blue-500',
    examples: ['Office team', 'NGO', 'Company', 'Department']
  }
];

const WelcomeOverlay = ({ onSelectUseCase, onSkip }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [step, setStep] = useState(1);

  const handleSelect = (useCase) => {
    setSelectedCase(useCase);
  };

  const handleContinue = () => {
    if (selectedCase) {
      const purposeMap = {
        'business': 'business',
        'farming': 'business',
        'education': 'personal',
        'community': 'policy',
        'personal': 'personal',
        'team': 'team'
      };
      onSelectUseCase(purposeMap[selectedCase.id], selectedCase);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Wetin you wan improve?
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Select your situation so Akↄfa fit give you advice wey fit your case
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {useCaseOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedCase?.id === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500/20 scale-[1.02]' 
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-700/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                
                <h3 className="font-bold text-white text-base md:text-lg mb-1">
                  {option.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mb-2">
                  {option.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {option.examples.slice(0, 2).map((ex, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-gray-300"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedCase}
            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              selectedCase 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-400 hover:text-white transition text-sm"
          >
            Skip for now
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          You fit change this later anytime
        </p>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
