
import React from 'react';

interface TutorialPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const TutorialStep: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-brand-surface p-4 rounded-lg border border-slate-200 dark:border-brand-outline transition-all duration-300 hover:shadow-lg hover:border-brand-primary/30">
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-lg mt-1">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-brand-text-primary">{title}</h4>
                <div className="mt-1 text-slate-600 dark:text-brand-text-secondary space-y-2">{children}</div>
            </div>
        </div>
    </div>
);


export const TutorialPanel: React.FC<TutorialPanelProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 dark:bg-black/80 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-bg-light dark:bg-brand-bg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tutorial-title"
            >
                <div className="h-full flex flex-col">
                    <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-brand-outline flex-shrink-0">
                        <h2 id="tutorial-title" className="text-xl font-bold text-slate-900 dark:text-brand-text-primary">
                           How to use SecurePass
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-slate-500 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-transform hover:scale-110"
                            aria-label="Close tutorial"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    <div className="flex-grow p-6 overflow-y-auto space-y-6">
                        <TutorialStep
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743L11 5h2m4 2a2 2 0 00-2-2m0 0V3m0 2s-1 0-1 1s1 1 1 1s-1 1-1 1" /></svg>
                            }
                            title="1. Password Generator"
                        >
                           <p>Create strong passwords effortlessly. Use the manual controls to generate a password:</p>
                           <ul className="list-disc list-inside space-y-1 pl-2">
                               <li>Use the slider to set the password length.</li>
                               <li>Check the boxes to include uppercase, lowercase, numbers, or symbols.</li>
                           </ul>
                           <p>The password updates automatically. Once generated, you can copy the password or save it directly to your vault (if unlocked).</p>
                        </TutorialStep>
                        
                        <TutorialStep
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h-1m-1-6h1M9 4v1M4 12H3m15-1h1M4 16h1m11 0h1m-6-5h1v1h-1v-1zm-1 0h-1v1h1v-1zm-2 0H8v1h1v-1zm-1 1v-1H6v1h1zm-2 0H4v1h1v-1zm1 2h1v1H8v-1zm-1-1H6v1h1v-1zm4 2h1v1h-1v-1zm-1-1h-1v1h1v-1zm2 1h1v1h-1v-1zm1-2h1v1h-1v-1zm-7 3h1v1H8v-1zm1 1h1v1H9v-1zm2 0h1v1h-1v-1zm1 1h1v1h-1v-1zm2-2h1v1h-1v-1z" /></svg>
                            }
                            title="2. QR Code Generator"
                        >
                           <p>Switch to the <strong>QR Code</strong> tab. Enter any text or URL into the input field and click "Generate".</p>
                           <p>A QR code image will appear, which you can then download as a PNG file to your device.</p>
                        </TutorialStep>

                        <TutorialStep
                           icon={
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            }
                           title="3. Secure Vault"
                        >
                            <p>The <strong>Vault</strong> is your personal, encrypted credential manager.</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>First-time Setup:</strong> Create a strong, unique Master Password. <strong>This password cannot be recovered</strong>, so store it safely!</li>
                                <li><strong>Unlocking:</strong> Use your Master Password to decrypt and access your saved credentials.</li>
                                <li><strong>Management:</strong> Add, edit, delete, and search for your passwords. All data is encrypted and stored locally in your browser.</li>
                                <li><strong>Import/Export:</strong> You can export your vault to a JSON file as a backup or for migration, and import a previously exported file.</li>
                            </ul>
                            <p>For security, the vault locks automatically when you close the tab.</p>
                        </TutorialStep>
                    </div>
                </div>
            </aside>
        </>
    );
};