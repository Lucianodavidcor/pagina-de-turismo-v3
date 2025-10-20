import React from 'react';
import type { Activity } from '../types';

interface Props {
  activity: Activity;
  accentColor?: 'orange' | 'cyan' | 'green';
}

const ActivityCard: React.FC<Props> = ({ activity, accentColor = 'orange' }) => {
  const colorClass = accentColor === 'orange' ? 'text-orange-500' : accentColor === 'cyan' ? 'text-cyan-500' : 'text-green-500';
  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center ${colorClass} text-2xl`}>
          {React.cloneElement(activity.icon, { className: `${activity.icon.props?.className ?? ''} text-2xl ${colorClass}` })}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{activity.title}</h4>
          <p className="text-sm text-gray-600">{activity.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
