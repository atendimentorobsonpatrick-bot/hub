import React from 'react';
import { ModelStatus } from '../types';

interface StatusIndicatorProps {
  status: ModelStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    [ModelStatus.Online]: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-brand-green',
      text: 'Online',
    },
    [ModelStatus.Offline]: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      dotColor: 'bg-brand-gray',
      text: 'Offline',
    },
  };

  const { bgColor, textColor, dotColor, text } = statusConfig[status];

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${bgColor}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
      <span className={`text-sm font-semibold ${textColor}`}>{text}</span>
    </div>
  );
};

export default StatusIndicator;