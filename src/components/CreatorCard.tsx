// src/components/CreatorCard.tsx
import React from 'react';
import { Heart, Zap, ExternalLink, Github, Globe, X as XIcon } from 'lucide-react';
import { Creator } from '../types';

interface CreatorCardProps {
  creator: Creator;
  onTip: (creator: Creator) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onTip }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative p-6">
        {creator.verified && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Verified
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {creator.name}
            </h3>
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-3">
              {creator.category}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {creator.bio}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {creator.totalTips}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">$STRK Received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {creator.tipCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tips</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {creator.social.website && (
              <a
                href={creator.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Globe size={18} />
              </a>
            )}
            {creator.social.github && (
              <a
                href={`https://github.com/${creator.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github size={18} />
              </a>
            )}
            {creator.social.twitter && (
              <a
                href={`https://twitter.com/${creator.social.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <XIcon size={18} />
              </a>
            )}
          </div>
        </div>

        <button
          onClick={() => onTip(creator)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
        >
          <Zap size={20} />
          Tip Creator
        </button>
      </div>
    </div>
  );
};