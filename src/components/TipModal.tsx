// src/components/TipModal.tsx
import React, { useState } from 'react';
import { X, Zap, AlertCircle, Heart, Star, Gift } from 'lucide-react';
import { Creator } from '../types';

interface TipModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  onTip: (amount: number, message: string) => Promise<void>;
  walletBalance: number;
}

const presetAmounts = [10, 25, 50, 100];

export const TipModal: React.FC<TipModalProps> = ({
  creator,
  isOpen,
  onClose,
  onTip,
  walletBalance
}) => {
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !creator) return null;

  const handleTip = async () => {
    const tipAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (tipAmount <= 0 || tipAmount > walletBalance || isNaN(tipAmount)) return;
    
    setIsProcessing(true);
    try {
      await onTip(tipAmount, message);
      onClose();
      setAmount(25);
      setCustomAmount('');
      setMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const canTip = currentAmount > 0 && currentAmount <= walletBalance && !isNaN(currentAmount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-2 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative overflow-hidden shadow-xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-16 h-16 rounded-xl object-cover border-3 border-white/20"
              />
              {creator.verified && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-0.5">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-0.5">
                Tip {creator.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                  {creator.category}
                </span>
                <span className="text-white/80 text-xs">
                  {creator.tipCount} tips
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Creator bio */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
              {creator.bio}
            </p>
          </div>

          {/* Amount selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Gift className="inline mr-1" size={14} />
              Tip amount ($STRK)
            </label>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount('');
                  }}
                  className={`relative py-3 px-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    amount === preset && !customAmount
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="text-base font-bold">{preset}</div>
                  <div className="text-xs opacity-75">$STRK</div>
                  {amount === preset && !customAmount && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-0.5">
                      <Heart size={10} fill="currentColor" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-base font-semibold"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-medium">
                $STRK
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Heart className="inline mr-1" size={14} />
              Message (optional)
            </label>
            <textarea
              placeholder="Why support this creator?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-sm"
            />
          </div>

          {/* Balance display */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Wallet balance</span>
            </div>
            <span className="font-bold text-base text-gray-900 dark:text-white">{walletBalance} $STRK</span>
          </div>

          {/* Error message */}
          {currentAmount > walletBalance && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-red-600 dark:text-red-400 text-xs">
                  Insufficient balance
                </div>
                <div className="text-red-500 dark:text-red-300 text-xs">
                  Need {currentAmount - walletBalance} more $STRK
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mb-3">
            <button
              onClick={handleTip}
              disabled={!canTip || isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 shadow-md hover:shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Send {currentAmount} $STRK
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <X size={16} />
              Close
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tips are sent directly to the creator's Starknet wallet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};