
import React, { useState, useEffect, useCallback } from 'react';
import { Credential } from '../types';
import { generatePassword } from '../services/passwordService';

interface CredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (credentialData: Omit<Credential, 'id' | 'createdAt'>) => void;
    credential: Credential | null;
    initialData?: Partial<Omit<Credential, 'id' | 'createdAt'>>;
}

const CredentialModal: React.FC<CredentialModalProps> = ({ isOpen, onClose, onSave, credential, initialData }) => {
    const [label, setLabel] = useState('');
    const [category, setCategory] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsPasswordVisible(false);
            if (credential) {
                setLabel(credential.label);
                setCategory(credential.category);
                setPassword(credential.password);
            } else {
                setLabel(initialData?.label || '');
                setCategory(initialData?.category || 'General');
                setPassword(initialData?.password || '');
            }
        }
    }, [isOpen, credential, initialData]);

    const handleGeneratePassword = useCallback(() => {
        const newPassword = generatePassword({
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true,
        }, 16);
        setPassword(newPassword);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (label && category && password) {
            onSave({ label, category, password });
        } else {
            alert("Please fill all fields.");
        }
    };
    
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40" onClick={onClose} aria-hidden="true" />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="credential-modal-title"
            >
                <div className="w-full max-w-md bg-brand-bg-light dark:bg-brand-bg p-6 rounded-lg shadow-2xl border border-slate-200 dark:border-brand-outline">
                    <header className="flex items-center justify-between mb-6">
                        <h2 id="credential-modal-title" className="text-xl font-bold text-slate-900 dark:text-brand-text-primary">
                            {credential ? 'Edit Credential' : 'Add New Credential'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-slate-500 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1" htmlFor="label">Label</label>
                            <input type="text" id="label" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Google Account" required className="w-full bg-slate-100 dark:bg-brand-surface border border-slate-300 dark:border-brand-outline rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1" htmlFor="category">Category</label>
                            <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Work, Social" required className="w-full bg-slate-100 dark:bg-brand-surface border border-slate-300 dark:border-brand-outline rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1" htmlFor="password">Password</label>
                             <div className="relative">
                                <input type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-100 dark:bg-brand-surface border border-slate-300 dark:border-brand-outline rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all pr-24" />
                                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                                    <button type="button" onClick={() => setIsPasswordVisible(v => !v)} title={isPasswordVisible ? 'Hide' : 'Show'} className="p-1">
                                        {isPasswordVisible
                                            ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        }
                                    </button>
                                     <button type="button" onClick={handleGeneratePassword} className="text-xs bg-slate-200 dark:bg-brand-outline text-slate-700 dark:text-brand-text-primary font-semibold px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-brand-primary">Generate</button>
                                </div>
                             </div>
                        </div>
                        <div className="flex justify-end items-center gap-4 pt-4">
                            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-slate-700 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-colors">Cancel</button>
                            <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:opacity-90 transition-opacity">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CredentialModal;
