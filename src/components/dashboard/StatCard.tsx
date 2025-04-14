
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
  valueClassName
}) => {
  return (
    <div className={cn("gh-stat-card flex flex-col", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={cn("text-2xl font-bold mt-1", valueClassName)}>{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-auto">
          <span className={`text-xs font-medium ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
            {change.positive ? '↑' : '↓'} {change.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
