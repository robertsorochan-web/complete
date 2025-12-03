import React from 'react';

const SliderGroup = ({ label, value, onChange }) => (
  <div className="slider-group my-4">
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <input
      type="range"
      min="0"
      max="10"
      step="0.1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
    <div className="text-sm text-gray-400">Value: {value}</div>
  </div>
);

export default SliderGroup;
