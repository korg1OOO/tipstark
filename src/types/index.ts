// src/types.ts
export interface Creator {
  id: string;
  address: string;
  name: string;
  avatar: string;
  bio: string;
  category: string;
  totalTips: number;
  tipCount: number;
  verified: boolean;
  social: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface Tip {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  message?: string;
  txHash: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  status: string; // Add this
}