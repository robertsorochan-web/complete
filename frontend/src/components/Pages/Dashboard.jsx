import React from 'react';
import MetricCard from '../ui/MetricCard';
import { getLayerConfig } from '../../config/purposeConfig';

const Dashboard = ({ assessmentData, purpose = 'personal' }) => {
  const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData || {};
  
  const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(2);
  const lowestLayer = Math.min(...allLayers);
  const highestLayer = Math.max(...allLayers);
  
  const layers = getLayerConfig(purpose);
  const layerKeys = ['bioHardware', 'internalOS', 'culturalSoftware', 'socialInstance', 'consciousUser'];
  const layerNames = layerKeys.map(key => layers[key].name);
  
  const bottleneck = layerNames[allLayers.indexOf(lowestLayer)];
  const strength = layerNames[allLayers.indexOf(highestLayer)];

  const contextLabels = {
    personal: {
      overview: 'Your Life Overview',
      description: 'Rate yourself across these 5 core areas of life to understand what\'s working and what needs attention.',
      hint: 'Your overall life health and where you\'re strongest and weakest. Use this to identify where to focus your energy.',
      overallTitle: 'Overall Health',
      areasTitle: 'Your 5 Life Areas'
    },
    team: {
      overview: 'Team Health Overview',
      description: 'Assess your team across these 5 dimensions to understand what\'s working and what needs attention.',
      hint: 'Your team\'s overall health and where it\'s strongest and weakest. Use this to identify where to focus team efforts.',
      overallTitle: 'Team Health',
      areasTitle: 'Your 5 Team Dimensions'
    },
    business: {
      overview: 'Business Health Overview',
      description: 'Assess your organization across these 5 dimensions to understand what\'s working and what needs attention.',
      hint: 'Your organization\'s overall health and where it\'s strongest and weakest. Use this to prioritize business improvements.',
      overallTitle: 'Org Health',
      areasTitle: 'Your 5 Business Dimensions'
    },
    policy: {
      overview: 'System Overview',
      description: 'Assess the system across these 5 dimensions to understand what\'s working and what needs intervention.',
      hint: 'The system\'s overall health and where it\'s strongest and weakest. Use this to identify policy priorities.',
      overallTitle: 'System Health',
      areasTitle: 'Your 5 System Dimensions'
    }
  };

  const labels = contextLabels[purpose] || contextLabels.personal;

  return (
    <div className="dashboard-page space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{labels.overview}</h2>
        <p className="text-gray-300 text-sm">{labels.description}</p>
      </div>
      
      <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-100"><span className="font-semibold">What this shows:</span> {labels.hint}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard title={labels.overallTitle} value={avgScore} subtitle="/10" />
        <MetricCard title="Your Strength" value={highestLayer} subtitle={strength} />
        <MetricCard title="Needs Attention" value={lowestLayer} subtitle={bottleneck} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">{labels.areasTitle}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition">
            <div className="text-2xl mb-2">{layers.bioHardware.icon}</div>
            <div className="text-sm text-gray-400">{layers.bioHardware.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{bioHardware}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{layers.bioHardware.description.split('.')[0]}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition">
            <div className="text-2xl mb-2">{layers.internalOS.icon}</div>
            <div className="text-sm text-gray-400">{layers.internalOS.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{internalOS}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{layers.internalOS.description.split('.')[0]}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition">
            <div className="text-2xl mb-2">{layers.culturalSoftware.icon}</div>
            <div className="text-sm text-gray-400">{layers.culturalSoftware.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{culturalSoftware}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{layers.culturalSoftware.description.split('.')[0]}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition">
            <div className="text-2xl mb-2">{layers.socialInstance.icon}</div>
            <div className="text-sm text-gray-400">{layers.socialInstance.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{socialInstance}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{layers.socialInstance.description.split('.')[0]}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition">
            <div className="text-2xl mb-2">{layers.consciousUser.icon}</div>
            <div className="text-sm text-gray-400">{layers.consciousUser.name}</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{consciousUser}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{layers.consciousUser.description.split('.')[0]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
