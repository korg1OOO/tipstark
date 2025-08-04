// src/hooks/useWallet.ts
import { useState, useCallback, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from '@starknet-react/core';
import { Connector } from '@starknet-react/core';
import { WalletState } from '../types';

export const useWallet = () => {
  const { address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address, watch: true });

  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
  });

  useEffect(() => {
    console.log('Wallet status changed:', { status, address, balance: balanceData });
    setWallet({
      connected: status === 'connected',
      address: address || null,
      balance: balanceData ? Number(balanceData.value) / 10 ** 18 : 0,
    });
  }, [address, status, balanceData]);

  const connectWallet = useCallback(
    async (connector: Connector) => {
      try {
        console.log('Attempting to connect with:', connector.name);
        await connect({ connector });
        console.log('Connect call completed');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please ensure the wallet is installed and unlocked.');
      }
    },
    [connect]
  );

  const disconnectWallet = useCallback(() => {
    disconnect();
    setWallet({
      connected: false,
      address: null,
      balance: 0,
    });
  }, [disconnect]);

  const updateBalance = useCallback((newBalance: number) => {
    setWallet((prev) => ({ ...prev, balance: newBalance }));
  }, []);

  return {
    wallet,
    connect: connectWallet,
    disconnect: disconnectWallet,
    updateBalance,
    connectors,
  };
};