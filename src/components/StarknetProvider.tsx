// src/components/StarknetProvider.tsx
import React, { useEffect } from 'react';
import { StarknetConfig, publicProvider, argent, braavos, voyager } from '@starknet-react/core';
import { mainnet } from '@starknet-react/chains';

interface StarknetProviderProps {
  children: React.ReactNode;
}

export const StarknetProvider: React.FC<StarknetProviderProps> = ({ children }) => {
  const connectors = [braavos(), argent()];

  // Debug logging: Check available connectors on mount
  useEffect(() => {
    console.log('Available connectors:', connectors);
    connectors.forEach((connector) => {
      console.log(`Connector ${connector.name} details:`, {
        id: connector.id,
        name: connector.name,
        available: connector.available(),
      });
    });
  }, []);

  return (
    <StarknetConfig
      chains={[mainnet]} // Use only mainnet to avoid chain switching issues with Braavos
      provider={publicProvider()} // Use default public provider or configure custom RPC (e.g., Infura, Alchemy)
      connectors={connectors} // Supported wallet connectors
      explorer={voyager} // Blockchain explorer for transaction links
      autoConnect={true} // Automatically connect to previously connected wallet
    >
      {children}
    </StarknetConfig>
  );
};