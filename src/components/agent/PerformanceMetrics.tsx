
import React from 'react';
import { BadgeCheck, Award, Briefcase, Target } from 'lucide-react';

export const PerformanceMetrics = () => {
  const metrics = [
    {
      title: 'Deals Closed',
      value: '32',
      target: '45',
      progress: 71,
      icon: <Briefcase className="h-5 w-5 text-app-blue" />,
    },
    {
      title: 'Avg Deal Size',
      value: '$24,800',
      target: '$20,000',
      progress: 124,
      icon: <Award className="h-5 w-5 text-app-purple" />,
      exceeding: true,
    },
    {
      title: 'Win Rate',
      value: '42%',
      target: '50%',
      progress: 84,
      icon: <BadgeCheck className="h-5 w-5 text-app-green" />,
    },
    {
      title: 'New Accounts',
      value: '18',
      target: '25',
      progress: 72,
      icon: <Target className="h-5 w-5 text-app-orange" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="flex">
          <div className="mr-4 mt-1">{metric.icon}</div>
          <div>
            <h3 className="text-app-gray-900 font-medium mb-1">{metric.title}</h3>
            <div className="flex items-end mb-2">
              <span className="text-2xl font-bold mr-2">{metric.value}</span>
              <span className="text-app-gray-500 text-sm">of {metric.target} target</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-app-gray-100 rounded-full h-2 mr-3">
                <div 
                  className={`h-2 rounded-full ${metric.exceeding ? 'bg-app-green' : 'bg-app-blue'}`} 
                  style={{ width: `${Math.min(metric.progress, 100)}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${metric.exceeding ? 'text-app-green' : 'text-app-gray-600'}`}>
                {metric.progress}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
