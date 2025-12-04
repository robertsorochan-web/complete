import React, { useState } from 'react';
import { Leaf, Droplets, Trash2, Zap, Info, CheckCircle } from 'lucide-react';

const carbonFactors = {
  electricity: 0.5,
  fuel: 2.31,
  waste: 0.2,
  water: 0.3
};

const SustainabilityTools = () => {
  const [activeTab, setActiveTab] = useState('carbon');
  const [carbonData, setCarbonData] = useState({
    electricity: '',
    fuel: '',
    waste: '',
    water: ''
  });
  const [waterData, setWaterData] = useState({
    current: '',
    target: ''
  });

  const calculateCarbon = () => {
    const electricity = (parseFloat(carbonData.electricity) || 0) * carbonFactors.electricity;
    const fuel = (parseFloat(carbonData.fuel) || 0) * carbonFactors.fuel;
    const waste = (parseFloat(carbonData.waste) || 0) * carbonFactors.waste;
    const water = (parseFloat(carbonData.water) || 0) * carbonFactors.water;
    return (electricity + fuel + waste + water).toFixed(1);
  };

  const totalCarbon = calculateCarbon();
  const carbonRating = totalCarbon < 50 ? 'Excellent' : totalCarbon < 100 ? 'Good' : totalCarbon < 200 ? 'Average' : 'Needs Work';
  const carbonColor = totalCarbon < 50 ? 'text-green-400' : totalCarbon < 100 ? 'text-blue-400' : totalCarbon < 200 ? 'text-yellow-400' : 'text-red-400';

  const greenTips = [
    { icon: '💡', tip: 'Switch to LED bulbs - save 75% on lighting energy' },
    { icon: '🌊', tip: 'Fix leaking taps - save up to 20 liters per day' },
    { icon: '🔌', tip: 'Unplug devices when not in use - stop phantom power' },
    { icon: '♻️', tip: 'Recycle paper and plastic - reduce waste costs' },
    { icon: '🌞', tip: 'Use natural light - open curtains before switching on lights' },
    { icon: '🚿', tip: 'Collect rainwater for cleaning and gardening' }
  ];

  const certifications = [
    { name: 'EPA Business Registration', description: 'Environmental Protection Agency certification', required: true },
    { name: 'FDA License (for food)', description: 'Food and Drugs Authority for food businesses', required: false },
    { name: 'Fire Safety Certificate', description: 'Ghana National Fire Service approval', required: true },
    { name: 'Waste Management Plan', description: 'Proper waste disposal agreement', required: false }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <Leaf className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Green Business Tools</h3>
          <p className="text-sm text-gray-400">Sustainability for your business</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: 'carbon', label: 'Carbon', icon: Leaf },
          { id: 'water', label: 'Water', icon: Droplets },
          { id: 'tips', label: 'Tips', icon: Zap },
          { id: 'certs', label: 'Certs', icon: CheckCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 ${
              activeTab === tab.id 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'carbon' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Electricity (kWh/month)</label>
              <input
                type="number"
                value={carbonData.electricity}
                onChange={(e) => setCarbonData(prev => ({ ...prev, electricity: e.target.value }))}
                placeholder="0"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Fuel (liters/month)</label>
              <input
                type="number"
                value={carbonData.fuel}
                onChange={(e) => setCarbonData(prev => ({ ...prev, fuel: e.target.value }))}
                placeholder="0"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Waste (kg/month)</label>
              <input
                type="number"
                value={carbonData.waste}
                onChange={(e) => setCarbonData(prev => ({ ...prev, waste: e.target.value }))}
                placeholder="0"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Water (liters/month)</label>
              <input
                type="number"
                value={carbonData.water}
                onChange={(e) => setCarbonData(prev => ({ ...prev, water: e.target.value }))}
                placeholder="0"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-4 border border-green-500/30 text-center">
            <div className="text-sm text-gray-400 mb-1">Your Carbon Footprint</div>
            <div className={`text-3xl font-bold ${carbonColor}`}>{totalCarbon} kg CO₂</div>
            <div className={`text-sm ${carbonColor}`}>per month • {carbonRating}</div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Reduce your footprint: Use energy-efficient equipment, carpool, and recycle waste.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'water' && (
        <div className="space-y-4">
          <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
            <h4 className="font-semibold text-blue-400 mb-3">Water Conservation Planner</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Current Usage (L/day)</label>
                <input
                  type="number"
                  value={waterData.current}
                  onChange={(e) => setWaterData(prev => ({ ...prev, current: e.target.value }))}
                  placeholder="0"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Target Usage (L/day)</label>
                <input
                  type="number"
                  value={waterData.target}
                  onChange={(e) => setWaterData(prev => ({ ...prev, target: e.target.value }))}
                  placeholder="0"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
            </div>
            {waterData.current && waterData.target && (
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-lg font-bold text-blue-400">
                  {((1 - parseFloat(waterData.target) / parseFloat(waterData.current)) * 100).toFixed(0)}% reduction target
                </div>
                <div className="text-sm text-gray-400">
                  Potential savings: {((parseFloat(waterData.current) - parseFloat(waterData.target)) * 30).toFixed(0)} liters/month
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">Water Saving Tips</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• Use bucket instead of running tap for washing</p>
              <p>• Install tap aerators to reduce flow</p>
              <p>• Collect rainwater for non-drinking use</p>
              <p>• Fix all leaks immediately</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-3">
          {greenTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
              <span className="text-xl">{tip.icon}</span>
              <p className="text-sm text-gray-300">{tip.tip}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certs' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">Certifications for Ghana businesses:</p>
          {certifications.map((cert, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              cert.required 
                ? 'bg-red-900/20 border-red-500/30' 
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{cert.name}</span>
                {cert.required && (
                  <span className="text-xs px-2 py-0.5 bg-red-500/30 text-red-300 rounded-full">Required</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{cert.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SustainabilityTools;
