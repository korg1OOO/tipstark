// src/components/Stats.tsx
import React from 'react';
import { TrendingUp, Users, Zap, Award } from 'lucide-react';

interface StatsProps {
  totalTips: number;
  totalCreators: number;
  totalAmount: number;
  topCreator: string;
}

export const Stats: React.FC<StatsProps> = ({
  totalTips,
  totalCreators,
  totalAmount,
  topCreator
}) => {
  const stats = [
    {
      icon: Zap,
      label: 'Total Tips',
      value: totalTips.toLocaleString(),
      color: 'text-blue-500'
    },
    {
      icon: Users,
      label: 'Creators',
      value: totalCreators.toLocaleString(),
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Total Value',
      value: `${totalAmount.toLocaleString()} $STRK`,
      color: 'text-purple-500'
    },
    {
      icon: Award,
      label: 'Top Creator',
      value: topCreator,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <stat.icon className={`${stat.color}`} size={24} />
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {stat.label}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};