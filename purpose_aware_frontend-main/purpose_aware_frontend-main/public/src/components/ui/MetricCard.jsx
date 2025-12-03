import React from 'react';

const MetricCard = ({ title, value }) => (
  <div className="metric-card bg-slate-800 rounded-lg p-4 border border-white/10">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

export default MetricCard;
