import { useContext } from 'react';
import { VaultContext } from '../contexts/VaultContext';

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};