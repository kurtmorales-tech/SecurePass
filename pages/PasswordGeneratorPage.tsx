import React, { useState, useEffect, useCallback } from 'react';
import { PasswordOptions, Credential } from '../types';
import { generatePassword } from '../services/passwordService';
import PasswordDisplay from '../components/PasswordDisplay';
import PasswordOptionsComponent from '../components/PasswordOptions';
import StrengthIndicator from '../components/StrengthIndicator';
import { useVault } from '../hooks/useVault';
import CredentialModal from '../components/CredentialModal';

const PasswordGeneratorPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [isReused, setIsReused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vault = useVault();

  const checkReuse = useCallback((newPassword: string) => {
    if (vault.credentials.some(c => c.password === newPassword)) {
        setIsReused(true);
    } else {
        setIsReused(false);
    }
  }, [vault.credentials]);

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword(options, length);
    setPassword(newPassword);
    checkReuse(newPassword);
  }, [options, length, checkReuse]);

  useEffect(() => {
    handleGeneratePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  const handleOptionChange = <K extends keyof PasswordOptions>(
    option: K,
    value: PasswordOptions[K]
  ) => {
    // Prevent unchecking all options
    const otherOptions = Object.keys(options).filter(key => key !== option);
    const areOthersUnchecked = otherOptions.every(key => !options[key as keyof PasswordOptions]);
    if (areOthersUnchecked && !value) {
        return; // do nothing
    }

    setOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleLengthChange = (newLength: number) => {
    setLength(newLength);
  };
  
  const handleSaveToVault = () => {
    if (vault.isLocked || !password) return;
    setIsModalOpen(true);
  };

  const handleModalSave = async (credentialData: Omit<Credential, 'id' | 'createdAt'>) => {
    try {
        await vault.addCredential(credentialData);
        setIsModalOpen(false);
        alert(`Password for "${credentialData.label}" saved to vault!`);
        checkReuse(credentialData.password);
    } catch(e) {
        console.error(e);
        alert("Failed to save password to vault.");
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8">
          <header className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-brand-text-primary">
                  Advanced Password Generator
              </h2>
              <p className="text-md text-slate-500 dark:text-brand-text-secondary">
                  Customize and create strong, secure passwords.
              </p>
          </header>

          <div className="space-y-4">
              <div className="bg-white dark:bg-brand-surface rounded-lg border border-slate-200 dark:border-brand-outline shadow-lg overflow-hidden">
                <PasswordDisplay
                  password={password}
                  onGenerate={handleGeneratePassword}
                  onSave={handleSaveToVault}
                  isSaveDisabled={vault.isLocked}
                />
                <div className="p-6 space-y-6">
                    <PasswordOptionsComponent
                        options={options}
                        length={length}
                        onOptionChange={handleOptionChange}
                        onLengthChange={handleLengthChange}
                    />
                </div>
                <StrengthIndicator length={length} options={options} />
              </div>

              {isReused && (
                  <p className="text-center text-yellow-400 text-sm -mt-2">
                      Warning: This password already exists in your vault.
                  </p>
              )}
               {!vault.isLocked && !vault.isInitialized && (
                  <p className="text-center text-slate-500 dark:text-brand-text-secondary text-sm -mt-2">
                      Go to the 'Vault' tab to create a master password and start saving.
                  </p>
               )}
                {vault.isLocked && vault.isInitialized && (
                  <p className="text-center text-slate-500 dark:text-brand-text-secondary text-sm -mt-2">
                      Unlock your vault to save passwords.
                  </p>
               )}
          </div>
      </div>
      <CredentialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        credential={null}
        initialData={{ password: password }}
      />
    </>
  );
};

export default PasswordGeneratorPage;