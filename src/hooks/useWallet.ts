// src/hooks/useWallet.ts
import { useState, useCallback, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useContract } from '@starknet-react/core';
import { Connector } from '@starknet-react/core';
import { WalletState } from '../types';

const STRK_ADDRESS = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      { name: 'account', type: 'felt' },
    ],
    outputs: [
      { name: 'balance', type: 'u256' },
    ],
    state_mutability: 'view',
  },
] as const;

export const useWallet = () => {
  const { address, status, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balanceData } = useContract({
    functionName: 'balanceOf',
    args: [address ? address : '0x0'],
    abi: ERC20_ABI,
    address: STRK_ADDRESS,
    watch: true,
    enabled: !!address,
  });

  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    status: 'disconnected',
  });

  useEffect(() => {
    const balance = balanceData
      ? Number(
          (BigInt(balanceData.low) + BigInt(balanceData.high) * (2n ** 128n)) / (10n ** 18n)
        )
      : 0;

    console.log('Wallet status changed:', { status, address, connector: connector?.name, balance });

    setWallet({
      connected: status === 'connected',
      address: address || null,
      balance,
      status,
    });
  }, [address, status, connector, balanceData]);

  const connectWallet = useCallback(
    async (connector: Connector) => {
      try {
        console.log('Attempting to connect with:', connector.name);
        await connect({ connector });
        console.log('Connect call completed');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert(`Failed to connect wallet: ${error.message}. Please ensure the wallet is unlocked and on the correct network (Mainnet or Sepolia).`);
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
      status: 'disconnected',
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