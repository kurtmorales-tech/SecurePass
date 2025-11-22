import React, { createContext, useState, useEffect, useCallback, ReactNode, useRef, useContext } from 'react';
import { Credential } from '../types';
import * as cryptoService from '../services/cryptoService';

const VAULT_LS_KEY = 'securepass_vault';
const AUTOLOCK_TIMEOUT = 15 * 60 * 1000; // 15 minutes

interface VaultState {
  isInitialized: boolean;
  isLocked: boolean;
  credentials: Credential[];
  error: string | null;
  unlock: (masterPassword: string) => Promise<boolean>;
  setup: (masterPassword: string) => Promise<void>;
  addCredential: (data: Omit<Credential, 'id' | 'createdAt'>) => Promise<void>;
  updateCredential: (credential: Credential) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  lock: () => void;
  exportVault: () => string;
  importVault: (json: string) => Promise<void>;
  resetLockTimer: () => void;
  resetVault: () => void;
}

export const VaultContext = createContext<VaultState | undefined>(undefined);

export const useVault = () => {
    const context = useContext(VaultContext);
    if (context === undefined) {
      throw new Error('useVault must be used within a VaultProvider');
    }
    return context;
};

export const VaultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lockTimer = useRef<number | null>(null);

  useEffect(() => {
    const vaultExists = !!localStorage.getItem(VAULT_LS_KEY);
    setIsInitialized(vaultExists);
  }, []);
  
  const lock = useCallback(() => {
    setEncryptionKey(null);
    setCredentials([]);
    setIsLocked(true);
    setError(null);
    if (lockTimer.current) {
        clearTimeout(lockTimer.current);
        lockTimer.current = null;
    }
  }, []);

  const resetLockTimer = useCallback(() => {
    if (lockTimer.current) {
      clearTimeout(lockTimer.current);
    }
    lockTimer.current = window.setTimeout(lock, AUTOLOCK_TIMEOUT);
  }, [lock]);

  const saveVault = useCallback(async (key: CryptoKey, creds: Credential[]) => {
    const vaultDataString = JSON.stringify(creds);
    const { iv, encryptedData } = await cryptoService.encrypt(vaultDataString, key);
    
    const vaultContainer = JSON.parse(localStorage.getItem(VAULT_LS_KEY) || '{}');
    if (!vaultContainer.salt) {
        throw new Error("Cannot save vault: salt is missing from storage.");
    }
    
    const newVaultContainer = {
        ...vaultContainer,
        iv: cryptoService.bufferToBase64(iv),
        data: cryptoService.bufferToBase64(encryptedData),
    };

    localStorage.setItem(VAULT_LS_KEY, JSON.stringify(newVaultContainer));
    setCredentials(creds);
    resetLockTimer();
  }, [resetLockTimer]);

  const unlock = async (masterPassword: string): Promise<boolean> => {
    setError(null);
    try {
      const vaultContainer = JSON.parse(localStorage.getItem(VAULT_LS_KEY)!);
      if (!vaultContainer || !vaultContainer.salt || !vaultContainer.iv || !vaultContainer.data) {
        throw new Error('Vault is corrupt or missing data.');
      }
      
      const salt = cryptoService.base64ToBuffer(vaultContainer.salt);
      const iv = cryptoService.base64ToBuffer(vaultContainer.iv);
      const data = cryptoService.base64ToBuffer(vaultContainer.data);

      const key = await cryptoService.deriveKey(masterPassword, new Uint8Array(salt));
      const decryptedData = await cryptoService.decrypt(data, key, new Uint8Array(iv));

      setCredentials(JSON.parse(decryptedData));
      setEncryptionKey(key);
      setIsLocked(false);
      resetLockTimer();
      return true;
    } catch (e) {
      console.error('Failed to unlock vault:', e);
      setError('Incorrect master password or corrupted vault.');
      return false;
    }
  };

  const setup = async (masterPassword: string) => {
    setError(null);
    const salt = cryptoService.generateSalt();
    const key = await cryptoService.deriveKey(masterPassword, salt);

    const initialVaultString = JSON.stringify([]);
    const { iv, encryptedData } = await cryptoService.encrypt(initialVaultString, key);

    const vaultContainer = {
      salt: cryptoService.bufferToBase64(salt),
      iv: cryptoService.bufferToBase64(iv),
      data: cryptoService.bufferToBase64(encryptedData),
    };

    localStorage.setItem(VAULT_LS_KEY, JSON.stringify(vaultContainer));
    setEncryptionKey(key);
    setCredentials([]);
    setIsInitialized(true);
    setIsLocked(false);
    resetLockTimer();
  };
  
  const addCredential = async (data: Omit<Credential, 'id' | 'createdAt'>) => {
    if (!encryptionKey || isLocked) throw new Error("Vault is locked");
    const newCredential: Credential = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    const updatedCreds = [...credentials, newCredential];
    await saveVault(encryptionKey, updatedCreds);
  };

  const updateCredential = async (credential: Credential) => {
      if (!encryptionKey || isLocked) throw new Error("Vault is locked");
      const updatedCreds = credentials.map(c => c.id === credential.id ? credential : c);
      await saveVault(encryptionKey, updatedCreds);
  };

  const deleteCredential = async (id: string) => {
      if (!encryptionKey || isLocked) throw new Error("Vault is locked");
      const updatedCreds = credentials.filter(c => c.id !== id);
      await saveVault(encryptionKey, updatedCreds);
  };

  const exportVault = () => {
    if (isLocked) {
        setError("Please unlock the vault to export.");
        return "";
    }
    resetLockTimer();
    return JSON.stringify(credentials, null, 2);
  }

  const importVault = async (json: string) => {
    if (!encryptionKey || isLocked) throw new Error("Vault is locked");
    try {
        const importedCreds: Credential[] = JSON.parse(json);
        const combinedCreds = [...credentials, ...importedCreds.filter(ic => !credentials.some(c => c.id === ic.id))];
        await saveVault(encryptionKey, combinedCreds);
    } catch (e) {
        setError("Invalid JSON file format.");
        console.error("Import error:", e);
    }
  }

  const resetVault = () => {
    if (window.confirm('Are you sure you want to reset your vault? All current data will be deleted. This action cannot be undone.')) {
        localStorage.removeItem(VAULT_LS_KEY);
        window.location.reload();
    }
  };

  return (
    <VaultContext.Provider value={{
      isInitialized,
      isLocked,
      credentials,
      error,
      unlock,
      setup,
      addCredential,
      updateCredential,
      deleteCredential,
      lock,
      exportVault,
      importVault,
      resetLockTimer,
      resetVault,
    }}>
      {children}
    </VaultContext.Provider>
  );
};