// src/App.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Zap, Heart, Sparkles } from 'lucide-react';
import { WalletButton } from './components/WalletButton';
import { CreatorCard } from './components/CreatorCard';
import { TipModal } from './components/TipModal';
import { SearchBar } from './components/SearchBar';
import { TipHistory } from './components/TipHistory';
import { Stats } from './components/Stats';
import { useWallet } from './hooks/useWallet';
import { mockCreators, mockTips } from './data/mockData';
import { Creator, Tip } from './types';
import { CallData, Provider } from 'starknet';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = '0xYOUR_CONTRACT_ADDRESS_HERE'; // Update after deployment
const RPC_URL = 'https://starknet-mainnet.public.blastapi.io'; // Public RPC for Mainnet

const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'tip',
    inputs: [
      { name: 'recipient', type: 'felt252' },
      { name: 'amount', type: 'u256' },
    ],
    outputs: [],
    state_mutability: 'external',
  },
  {
    type: 'function',
    name: 'get_tips',
    inputs: [{ name: 'recipient', type: 'felt252' }],
    outputs: [{ type: 'u256' }],
    state_mutability: 'view',
  },
];

function App() {
  const { wallet, connect, disconnect, updateBalance } = useWallet();
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tips, setTips] = useState<Tip[]>(mockTips);

  // Filtered creators
  const filteredCreators = useMemo(() => {
    return mockCreators.filter((creator) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Handle tipping
  const handleTip = async (amount: number, message: string) => {
    if (!selectedCreator || !wallet.connected || !wallet.account) {
      alert('Please connect your wallet and select a creator.');
      return;
    }

    try {
      const amountInWei = BigInt(Math.floor(amount * 10 ** 18));
      const call = {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: 'tip',
        calldata: CallData.compile({
          recipient: selectedCreator.address,
          amount: { low: amountInWei, high: 0 },
        }),
      };

      const result = await wallet.account.execute([call]);
      const newTip: Tip = {
        id: Date.now().toString(),
        sender: wallet.address!,
        recipient: selectedCreator.address,
        amount,
        timestamp: Date.now(),
        message,
        txHash: result.transaction_hash || 'pending',
        status: 'pending', // Add status
      };

      setTips((prev) => [newTip, ...prev]);
      updateBalance(wallet.balance - amount);
    } catch (error) {
      console.error('Failed to send tip:', error);
      alert('Failed to send tip. Please try again.');
    }
  };

  // Poll for transaction status
  useEffect(() => {
    const pollTransactions = async () => {
      const provider = new Provider({ rpc: RPC_URL });
      const updatedTips = [...tips];
      let needsUpdate = false;

      for (let i = 0; i < updatedTips.length; i++) {
        const tip = updatedTips[i];
        if (tip.status === 'pending' && tip.txHash !== 'pending') {
          try {
            const receipt = await provider.getTransactionReceipt(tip.txHash);
            if (receipt.status === 'ACCEPTED_ON_L2' || receipt.status === 'ACCEPTED_ON_L1') {
              updatedTips[i] = { ...tip, status: 'confirmed' };
              needsUpdate = true;
            } else if (receipt.status === 'REJECTED') {
              updatedTips[i] = { ...tip, status: 'failed' };
              needsUpdate = true;
            }
          } catch (error) {
            console.error('Failed to fetch receipt for tx:', tip.txHash, error);
          }
        }
      }

      if (needsUpdate) {
        setTips(updatedTips);
      }
    };

    if (tips.some((tip) => tip.status === 'pending')) {
      pollTransactions();
      const interval = setInterval(pollTransactions, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [tips]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    const totalTips = tips.length;
    const totalCreators = mockCreators.length;
    const totalAmount = mockCreators.reduce((sum, creator) => sum + creator.totalTips, 0);
    const topCreator = mockCreators.reduce((top, creator) =>
      creator.totalTips > top.totalTips ? creator : top
    ).name;

    return { totalTips, totalCreators, totalAmount, topCreator };
  }, [tips]);

  // Render loading or error state if applicable
  if (!wallet) {
    return (
      <div className="p-4 text-center text-red-600">
        {'Loading... Please connect your wallet.'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/image.png"
                alt="TipStark Logo"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TipStark</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Starknet</p>
              </div>
            </div>
            <WalletButton
              wallet={wallet}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-blue-500" size={32} />
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tip Your Favorite Creators
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Support the builders, designers, and creators shaping the future of Web3 with instant STRK tips on Starknet
          </p>
        </div>

        <Stats {...totalStats} />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.length > 0 ? (
                filteredCreators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    onTip={() => setSelectedCreator(creator)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No creators found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <TipHistory tips={tips} />
          </div>
        </div>
      </main>

      <TipModal
        creator={selectedCreator}
        isOpen={!!selectedCreator}
        onClose={() => setSelectedCreator(null)}
        onTip={handleTip}
        walletBalance={wallet.balance}
      />

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/image.png" alt="TipStark" className="w-6 h-6 rounded object-cover" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">TipStark</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Empowering creators through decentralized tipping on Starknet
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Built with Cairo • Powered by Starknet
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;