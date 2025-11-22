
import React, { useState, useEffect } from 'react';
import { useVault } from '../hooks/useVault';
import { useTheme } from '../hooks/useTheme';
import { useAdmin } from '../hooks/useAdmin';

type Page = 'password' | 'qrcode' | 'vault' | 'about' | 'contact' | 'admin';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onToggleTutorial: () => void;
}

const ThemeToggleButton: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 015 5v0a5 5 0 01-5 5v0a5 5 0 01-5-5v0a5 5 0 015-5z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onToggleTutorial }) => {
  const { isLocked } = useVault();
  const { isAdmin, logout } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTutorialHint, setShowTutorialHint] = useState(false);

  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer";
  const activeClasses = "bg-brand-primary text-white";
  const inactiveClasses = "text-slate-600 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface hover:text-slate-800 dark:hover:text-brand-text-primary";
  
  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenTutorial');
    if (!hasSeen) {
        setShowTutorialHint(true);
    }
  }, []);

  const handleMobileNavigate = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };
  
  const handleAdminLogout = () => {
    logout();
    onNavigate('password');
    setIsMenuOpen(false);
  }

  const handleOpenTutorial = () => {
      if (showTutorialHint) {
          setShowTutorialHint(false);
          localStorage.setItem('hasSeenTutorial', 'true');
      }
      onToggleTutorial();
  };

  const navLinks = (
      <nav className="flex flex-col md:flex-row items-stretch md:items-center gap-2 p-1 md:bg-slate-100 md:dark:bg-brand-bg md:border md:border-slate-200 md:dark:border-brand-outline rounded-lg">
        <button
          onClick={() => handleMobileNavigate('password')}
          className={`${navItemClasses} ${currentPage === 'password' ? activeClasses : inactiveClasses}`}
          aria-current={currentPage === 'password'}
        >
          Password
        </button>
        <button
          onClick={() => handleMobileNavigate('qrcode')}
          className={`${navItemClasses} ${currentPage === 'qrcode' ? activeClasses : inactiveClasses}`}
          aria-current={currentPage === 'qrcode'}
        >
          QR Code
        </button>
        <button
          onClick={() => handleMobileNavigate('vault')}
          className={`${navItemClasses} ${currentPage === 'vault' ? activeClasses : inactiveClasses} relative`}
          aria-current={currentPage === 'vault'}
        >
          Vault
          {isLocked && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
        </button>
        <button
          onClick={() => handleMobileNavigate('about')}
          className={`${navItemClasses} ${currentPage === 'about' ? activeClasses : inactiveClasses}`}
          aria-current={currentPage === 'about'}
        >
          About
        </button>
         <button
          onClick={() => handleMobileNavigate('contact')}
          className={`${navItemClasses} ${currentPage === 'contact' ? activeClasses : inactiveClasses}`}
          aria-current={currentPage === 'contact'}
        >
          Contact
        </button>
        {isAdmin && (
          <button
              onClick={() => handleMobileNavigate('admin')}
              className={`${navItemClasses} ${currentPage === 'admin' ? 'bg-brand-secondary text-white' : 'bg-brand-secondary/20 text-brand-secondary'}`}
              aria-current={currentPage === 'admin'}
          >
              Admin
          </button>
        )}
      </nav>
  );

  const actionButtons = (
      <>
        {isAdmin && (
            <button onClick={handleAdminLogout} className="p-2 rounded-full text-red-500 hover:bg-red-500/10" title="Admin Logout">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
        )}
        <ThemeToggleButton />
        <button
            onClick={handleOpenTutorial}
            className="p-2 rounded-full text-slate-500 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-colors relative"
            aria-label="Open tutorial"
            title="Open Tutorial"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showTutorialHint && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-secondary"></span>
                </span>
            )}
        </button>
      </>
  );

  return (
    <header className="w-full max-w-5xl mx-auto text-center">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-brand-text-primary">
          RavFia Secure<span className="text-brand-primary">Pass</span>
        </h1>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
            {navLinks}
            {actionButtons}
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-slate-500 dark:text-brand-text-secondary hover:bg-slate-200 dark:hover:bg-brand-surface transition-colors" aria-label="Toggle menu">
                {isMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
            </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-slate-100 dark:bg-brand-surface rounded-lg p-4 space-y-4 shadow-lg border border-slate-200 dark:border-brand-outline">
            {navLinks}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200 dark:border-brand-outline">
                {actionButtons}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;
