// src/components/WalletButton.tsx
import React, { useState } from 'react';
import { Wallet, ChevronDown } from 'lucide-react';
import { WalletState } from '../types';

interface WalletButtonProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!wallet.connected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet size={20} />
        {isConnecting ? 'Connecting...' : 'Connect Braavos'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Wallet size={16} />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold">
            {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connected'}
          </div>
          <div className="text-xs text-gray-400">{wallet.balance.toFixed(2)} $STRK</div>
        </div>
        <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Wallet Connected</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{wallet.address}</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-sm text-gray-700 dark:text-gray-300">Balance</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{wallet.balance.toFixed(2)} $STRK</div>
          </div>
          <button
            onClick={() => {
              onDisconnect();
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};