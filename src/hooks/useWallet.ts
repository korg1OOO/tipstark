// src/hooks/useWallet.ts
import { useState, useCallback, useEffect } from 'react';
import { Provider, CallData } from 'starknet';
import { WalletState } from '../types';

const STRK_ADDRESS = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d'; // STRK on Sepolia testnet
const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/v2/g6_4a2lN6ALWLkMqjcG8b'; // Sepolia testnet RPC

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    account: null, // Initialize account
  });

  const connect = useCallback(async () => {
    try {
      if (!window.starknet_braavos) {
        alert('Braavos wallet not detected. Please install the Braavos extension.');
        return;
      }

      await window.starknet_braavos.enable({ starknetVersion: 'v5' }); // Try v5, fallback to v4 if needed

      const address = window.starknet_braavos.account.address.toLowerCase();
      setWallet({
        connected: true,
        address,
        balance: 0,
        account: window.starknet_braavos.account,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please make sure Braavos is unlocked and try again.');
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: null,
      balance: 0,
      account: null,
    });
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setWallet((prev) => ({ ...prev, balance: newBalance }));
  }, []);

  // Fetch balance when connected
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      const fetchBalance = async () => {
        try {
          const provider = new Provider({ rpc: RPC_URL });
          const call = {
            contractAddress: STRK_ADDRESS,
            entrypoint: 'balanceOf',
            calldata: CallData.compile([wallet.address]),
          };
          const response = await provider.callContract(call);
          if (response.length !== 2) throw new Error('Invalid balance response');
          const low = BigInt(response[0]);
          const high = BigInt(response[1]);
          const balanceBN = high * (2n ** 128n) + low;
          const balance = Number(balanceBN / 10n ** 18n);
          setWallet((prev) => ({ ...prev, balance }));
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      };
      fetchBalance();
      const interval = setInterval(fetchBalance, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [wallet.connected, wallet.address]);

  return {
    wallet,
    connect,
    disconnect,
    updateBalance,
  };
};