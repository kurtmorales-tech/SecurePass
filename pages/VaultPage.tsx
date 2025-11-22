import React, { useState, useMemo } from 'react';
import { useVault } from '../hooks/useVault';
import { Credential } from '../types';
import CredentialModal from '../components/CredentialModal';
import MasterPasswordStrengthIndicator from '../components/MasterPasswordStrengthIndicator';

// Standalone component for the Unlock/Setup form
const VaultAuthForm: React.FC<{
  isInitialized: boolean;
  onSubmit: (password: string) => void;
  error: string | null;
  isLoading: boolean;
}> = ({ isInitialized, onSubmit, error, isLoading }) => {
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const { resetVault } = useVault();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized && masterPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSubmit(masterPassword);
  };
  
  const title = isInitialized ? "Unlock Vault" : "Create Master Password";
  const description = isInitialized ? "Enter your master password to access your credentials." : "This password will encrypt your vault. Choose something strong and memorable.";
  const buttonText = isInitialized ? "Unlock" : "Create Vault";

  return (
    <>
     <div className="w-full max-w-md mx-auto bg-white dark:bg-brand-surface p-8 rounded-lg border border-slate-200 dark:border-brand-outline">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-brand-text-primary mb-2">{title}</h2>
        <p className="text-center text-slate-500 dark:text-brand-text-secondary mb-6">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1" htmlFor="master-password">Master Password</label>
                <input
                    type="password"
                    id="master-password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                    required
                />
            </div>
            {!isInitialized && (
                 <>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                            required
                        />
                    </div>
                    <MasterPasswordStrengthIndicator password={masterPassword} />
                 </>
            )}
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-brand-outline disabled:cursor-not-allowed">
                {isLoading ? 'Processing...' : buttonText}
            </button>
        </form>
        {isInitialized && (
            <div className="text-center mt-4">
                <button onClick={() => setShowResetModal(true)} className="text-sm text-brand-primary hover:underline">
                    Forgot Master Password?
                </button>
            </div>
        )}
      </div>

      {showResetModal && (
          <>
              <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowResetModal(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-brand-bg-light dark:bg-brand-bg p-6 rounded-lg shadow-2xl border border-slate-200 dark:border-brand-outline">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-brand-text-primary">Password Recovery</h3>
                      <p className="text-sm text-slate-600 dark:text-brand-text-secondary mt-2">
                          Master passwords cannot be recovered. The only way to regain access is to reset the vault and restore from a backup file.
                      </p>
                      <p className="text-sm text-slate-600 dark:text-brand-text-secondary mt-2">
                          <strong className="text-red-500">Warning:</strong> Resetting will permanently delete all data in your current vault.
                      </p>
                      <div className="flex justify-end gap-4 mt-6">
                          <button onClick={() => setShowResetModal(false)} className="py-2 px-4 rounded-md text-slate-700 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-colors">Cancel</button>
                          <button onClick={resetVault} className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors">Reset Vault</button>
                      </div>
                  </div>
              </div>
          </>
      )}
    </>
  );
};


const VaultPage: React.FC = () => {
    const vault = useVault();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [credentialToEdit, setCredentialToEdit] = useState<Credential | null>(null);
    const [showPostSetupModal, setShowPostSetupModal] = useState(false);

    const handleAuthSubmit = async (password: string) => {
        setIsLoading(true);
        if (vault.isInitialized) {
            await vault.unlock(password);
        } else {
            await vault.setup(password);
            setShowPostSetupModal(true);
        }
        setIsLoading(false);
    };
    
    const handleExport = () => {
        const json = vault.exportVault();
        if(json) {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'securepass-vault-export.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const text = await file.text();
                await vault.importVault(text);
            }
        };
        input.click();
    };

    const handleOpenAddModal = () => {
      setCredentialToEdit(null);
      setIsModalOpen(true);
    };

    const handleOpenEditModal = (credential: Credential) => {
      setCredentialToEdit(credential);
      setIsModalOpen(true);
    };

    const handleSaveCredential = async (credentialData: Omit<Credential, 'id' | 'createdAt'>) => {
        if (credentialToEdit) {
            await vault.updateCredential({ ...credentialToEdit, ...credentialData });
        } else {
            await vault.addCredential(credentialData);
        }
        setIsModalOpen(false);
    };


    const filteredCredentials = useMemo(() => {
        return vault.credentials.filter(c => 
            c.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vault.credentials, searchTerm]);

    if (vault.isLocked) {
        return <VaultAuthForm isInitialized={vault.isInitialized} onSubmit={handleAuthSubmit} error={vault.error} isLoading={isLoading} />;
    }

    return (
        <>
            <CredentialModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCredential}
                credential={credentialToEdit}
            />
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-brand-text-primary">Password Vault</h2>
                        <p className="text-md text-slate-500 dark:text-brand-text-secondary">Your encrypted credentials. Stored locally.</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button onClick={handleImport} className="bg-slate-200 dark:bg-brand-outline text-slate-800 dark:text-brand-text-primary font-medium py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-brand-primary transition-colors">Restore from Backup</button>
                    <button onClick={handleExport} className="bg-slate-200 dark:bg-brand-outline text-slate-800 dark:text-brand-text-primary font-medium py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-brand-primary transition-colors">Backup Vault</button>
                    <button onClick={vault.lock} className="bg-red-500/20 text-red-400 font-medium py-2 px-4 rounded-md hover:bg-red-500/40 transition-colors">Lock Vault</button>
                    </div>
                </header>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="search"
                        placeholder="Search vault..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow bg-white dark:bg-brand-surface border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                    />
                    <button onClick={handleOpenAddModal} className="bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-all duration-200">Add New</button>
                </div>

                <div className="bg-white dark:bg-brand-surface p-4 rounded-lg border border-slate-200 dark:border-brand-outline">
                    {filteredCredentials.length > 0 ? (
                        <div className="space-y-2">
                            {filteredCredentials.map(c => <CredentialItem key={c.id} credential={c} onEdit={handleOpenEditModal} />)}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-brand-text-secondary py-8">
                            {searchTerm ? 'No credentials match your search.' : 'Your vault is empty. Click "Add New" to save a password.'}
                        </p>
                    )}
                </div>
            </div>
            {showPostSetupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60" onClick={() => setShowPostSetupModal(false)} />
                    <div className="relative w-full max-w-md bg-brand-bg-light dark:bg-brand-bg p-6 rounded-lg shadow-2xl border border-slate-200 dark:border-brand-outline text-slate-900 dark:text-brand-text-primary">
                        <h3 className="text-lg font-bold text-green-500">Vault Created Successfully!</h3>
                        <p className="font-bold text-red-500 mt-4">IMPORTANT: Your Master Password cannot be recovered if you forget it.</p>
                        <p className="text-sm text-slate-600 dark:text-brand-text-secondary mt-2">
                            We strongly recommend creating a backup of your (currently empty) vault now. This allows you to restore your data if you forget your password or move to a new device.
                        </p>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowPostSetupModal(false)} className="py-2 px-4 rounded-md text-slate-700 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-colors">Remind me Later</button>
                            <button onClick={() => { handleExport(); setShowPostSetupModal(false); }} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-colors">Backup Vault Now</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const CredentialItem: React.FC<{credential: Credential, onEdit: (c: Credential) => void}> = ({ credential, onEdit }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { deleteCredential } = useVault();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(credential.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    
    const handleDelete = () => {
        if(window.confirm(`Are you sure you want to delete "${credential.label}"?`)) {
            deleteCredential(credential.id);
        }
    }
    
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 dark:bg-brand-bg rounded-md border border-transparent hover:border-brand-primary/50 dark:hover:border-brand-primary transition-colors">
            <div className="flex-grow">
                <p className="font-bold text-slate-800 dark:text-brand-text-primary">{credential.label}</p>
                <p className="text-sm text-slate-500 dark:text-brand-text-secondary">{credential.category}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="font-mono text-lg text-slate-700 dark:text-slate-300 self-start sm:self-center sm:w-48 truncate">
                    {isPasswordVisible ? credential.password : '••••••••••••'}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <button onClick={() => setIsPasswordVisible(v => !v)} title={isPasswordVisible ? 'Hide' : 'Show'}>
                       {isPasswordVisible 
                         ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-brand-text-secondary hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                         : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-brand-text-secondary hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                       }
                    </button>
                    <button onClick={handleCopy} title={copied ? "Copied!" : "Copy"}>
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-brand-text-secondary hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        )}
                    </button>
                    <button onClick={() => onEdit(credential)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-brand-text-secondary hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                    <button onClick={handleDelete} title="Delete"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
            </div>
        </div>
    );
}

export default VaultPage;