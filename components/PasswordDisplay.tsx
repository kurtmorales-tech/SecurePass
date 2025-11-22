import React, { useState, useCallback } from 'react';

interface PasswordDisplayProps {
  password: string;
  onGenerate: () => void;
  onSave?: () => void;
  isSaveDisabled?: boolean;
}

const PasswordDisplay: React.FC<PasswordDisplayProps> = ({ password, onGenerate, onSave, isSaveDisabled = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  return (
    <div className="bg-slate-900/20 dark:bg-brand-bg p-4 flex items-center gap-2 sm:gap-4">
      <p className="font-mono text-xl md:text-2xl text-slate-800 dark:text-brand-text-primary flex-grow break-all">
        {password || 'P@$$w0rd!'}
      </p>
      {onSave && (
         <button
          onClick={onSave}
          className="p-2 rounded-md bg-slate-200 dark:bg-brand-outline hover:bg-brand-primary text-slate-500 dark:text-brand-text-secondary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Save password to vault"
          title="Save to Vault"
          disabled={isSaveDisabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>
      )}
      <button
        onClick={handleCopy}
        className={`p-2 rounded-md transition-all duration-200 ${
          copied 
            ? 'bg-brand-secondary text-white dark:text-brand-bg' 
            : 'bg-slate-200 dark:bg-brand-outline hover:bg-brand-primary text-slate-500 dark:text-brand-text-secondary hover:text-white'
        }`}
        aria-label="Copy password"
        title={copied ? "Copied!" : "Copy to Clipboard"}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <button
        onClick={onGenerate}
        className="p-2 rounded-md bg-slate-200 dark:bg-brand-outline hover:bg-brand-primary text-slate-500 dark:text-brand-text-secondary hover:text-white transition-all duration-200"
        aria-label="Generate new password"
        title="Generate New"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18.259 15.904L18 17.25l-.259-1.346a3.375 3.375 0 00-2.455-2.456L14.25 12l1.036-.259a3.375 3.375 0 002.455-2.456L18 8.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 12l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      </button>
    </div>
  );
};

export default PasswordDisplay;