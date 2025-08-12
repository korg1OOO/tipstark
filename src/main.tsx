// src/index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StarknetConfig, publicProvider, argent, braavos, useInjectedConnectors, voyager } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import App from './App.tsx';
import './index.css';

function Root() {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'onlyIfNoConnectors',
    order: 'random',
  });

  return (
    <StarknetConfig
      chains={[sepolia]} // Use Sepolia for testing
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      <StrictMode>
        <App />
      </StrictMode>
    </StarknetConfig>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
createRoot(rootElement).render(<Root />);