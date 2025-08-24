import React from 'react';

const SimilarityMeter = ({ similarity, size = 'medium' }) => {
  const getColor = (value) => {
    if (value >= 70) return 'text-red-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBackgroundColor = (value) => {
    if (value >= 70) return 'bg-red-600';
    if (value >= 40) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const sizes = {
    small: { container: 'w-16 h-16', text: 'text-xs' },
    medium: { container: 'w-20 h-20', text: 'text-sm' },
    large: { container: 'w-24 h-24', text: 'text-base' }
  };

  const { container, text } = sizes[size];
  const circumference = 251.3;
  const strokeDashoffset = circumference - (similarity / 100) * circumference;

  return (
    <div className={`relative ${container}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200"
        />
        
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ${getBackgroundColor(similarity)}`}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`font-bold ${text} ${getColor(similarity)}`}>
          {similarity.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default SimilarityMeter;