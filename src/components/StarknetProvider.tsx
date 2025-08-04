// src/components/StarknetProvider.tsx
import React from 'react';
import { StarknetConfig, publicProvider, argent, braavos, useInjectedConnectors, voyager } from '@starknet-react/core';
import { mainnet, sepolia } from '@starknet-react/chains';

interface StarknetProviderProps {
  children: React.ReactNode;
}

export const StarknetProvider: React.FC<StarknetProviderProps> = ({ children }) => {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'onlyIfNoConnectors', // Show recommended connectors only if no wallets are installed
    order: 'random', // Randomize connector order
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]} // Support mainnet and sepolia testnet
      provider={publicProvider()} // Use default public provider or configure custom RPC (e.g., Infura, Alchemy)
      connectors={connectors} // Supported wallet connectors
      explorer={voyager} // Blockchain explorer for transaction links
    >
      {children}
    </StarknetConfig>
  );
};