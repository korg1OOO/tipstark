// src/components/TipHistory.tsx
import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { Tip } from '../types';

interface TipHistoryProps {
  tips: Tip[];
}

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const TipHistory: React.FC<TipHistoryProps> = ({ tips }) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Less than an hour ago';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (tips.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
        <Clock className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tips yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Recent tips will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Tips</h3>
      
      <div className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {tip.amount} $STRK
                </span>
                <span className="text-gray-500 dark:text-gray-400">→</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  {shortenAddress(tip.recipient)}
                </span>
              </div>
              
              {tip.message && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  "{tip.message}"
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                {formatTime(tip.timestamp)}
              </div>
              {tip.status && (
                <span className={`text-xs font-semibold ${tip.status === 'pending' ? 'text-yellow-500' : tip.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>
                  {tip.status.charAt(0).toUpperCase() + tip.status.slice(1)}
                </span>
              )}
            </div>
            
            <a
              href={`https://voyager.online/tx/${tip.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};