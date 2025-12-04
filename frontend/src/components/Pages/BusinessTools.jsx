import React, { useState } from 'react';
import { Calculator, ClipboardCheck, Smartphone, Package, Users, FileText, Calendar, Target, Leaf, Share2, ChevronRight, Briefcase } from 'lucide-react';
import TaxCalculator from '../ui/TaxCalculator';
import LoanChecklist from '../ui/LoanChecklist';
import MoMoTracker from '../ui/MoMoTracker';
import InventoryTracker from '../ui/InventoryTracker';
import CustomerCRM from '../ui/CustomerCRM';
import ReceiptGenerator from '../ui/ReceiptGenerator';
import SeasonalTips from '../ui/SeasonalTips';
import CompetitorAnalysis from '../ui/CompetitorAnalysis';
import SustainabilityTools from '../ui/SustainabilityTools';
import SocialMediaTemplates from '../ui/SocialMediaTemplates';
import MentorshipMatcher from '../ui/MentorshipMatcher';

const toolCategories = [
  {
    id: 'financial',
    name: 'Money Tools',
    icon: Calculator,
    color: 'from-green-500 to-emerald-500',
    tools: [
      { id: 'tax', name: 'Tax Calculator', icon: Calculator, component: TaxCalculator },
      { id: 'loan', name: 'Loan Checklist', icon: ClipboardCheck, component: LoanChecklist },
      { id: 'momo', name: 'MoMo Tracker', icon: Smartphone, component: MoMoTracker }
    ]
  },
  {
    id: 'operations',
    name: 'Daily Operations',
    icon: Package,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      { id: 'inventory', name: 'Inventory', icon: Package, component: InventoryTracker },
      { id: 'customers', name: 'Customers', icon: Users, component: CustomerCRM },
      { id: 'receipts', name: 'Receipts', icon: FileText, component: ReceiptGenerator }
    ]
  },
  {
    id: 'planning',
    name: 'Planning & Growth',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    tools: [
      { id: 'seasonal', name: 'Seasonal Tips', icon: Calendar, component: SeasonalTips },
      { id: 'competitors', name: 'Competitors', icon: Target, component: CompetitorAnalysis },
      { id: 'social', name: 'Social Media', icon: Share2, component: SocialMediaTemplates }
    ]
  },
  {
    id: 'community',
    name: 'Community & Support',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    tools: [
      { id: 'mentors', name: 'Find Mentor', icon: Users, component: MentorshipMatcher },
      { id: 'sustainability', name: 'Green Business', icon: Leaf, component: SustainabilityTools }
    ]
  }
];

const BusinessTools = ({ purpose = 'business' }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const handleBack = () => {
    if (selectedTool) {
      setSelectedTool(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  if (selectedTool) {
    const ToolComponent = selectedTool.component;
    return (
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Tools
        </button>
        <ToolComponent purpose={purpose} />
      </div>
    );
  }

  if (selectedCategory) {
    const category = toolCategories.find(c => c.id === selectedCategory);
    return (
      <div className="space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          All Categories
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
            <category.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{category.name}</h2>
            <p className="text-gray-400">Select a tool to get started</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool)}
              className="p-6 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-purple-500 transition text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition">
                    {tool.name}
                  </h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Business Tools</h2>
          <p className="text-gray-400">Free tools to help your business grow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toolCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="p-6 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-purple-500 transition text-left group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center flex-shrink-0`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition mb-1">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {category.tools.map(tool => (
                    <span key={tool.id} className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-gray-400">
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-bold text-white mb-2">Pro Tips for Business Success</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Track your money every day - small leaks sink big ships</li>
              <li>• Know your customers - their needs be your opportunity</li>
              <li>• Study your competitors - learn from both their wins and mistakes</li>
              <li>• Plan with seasons - different times bring different opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTools;
