
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage';
import VaultPage from './pages/VaultPage';
import { VaultProvider, useVault } from './contexts/VaultContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';
import ReviewSection from './components/ReviewSection';
import Footer from './components/Footer';
import { TutorialPanel } from './components/TutorialPanel';
import AboutPage from './pages/about';
import ContactPage from './pages/contact';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

type Page = 'password' | 'qrcode' | 'vault' | 'about' | 'contact' | 'admin';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('password');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const vault = useVault();
  const admin = useAdmin();
  const { theme } = useTheme();
  const [pointerPosition, setPointerPosition] = useState({ x: -1000, y: -1000 });

  // URL Hash Navigation for Admin Page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange, false);
    // Check hash on initial load
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      requestAnimationFrame(() => {
        setPointerPosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);


  useEffect(() => {
    if (isTutorialOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTutorialOpen]);

  // Add event listeners to reset the auto-lock timer on user activity
  useEffect(() => {
    if (!vault.isLocked) {
      const handleActivity = () => {
        vault.resetLockTimer();
      };

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('mousedown', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('scroll', handleActivity);
      window.addEventListener('touchstart', handleActivity);

      return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('mousedown', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        window.removeEventListener('scroll', handleActivity);
        window.removeEventListener('touchstart', handleActivity);
      };
    }
  }, [vault.isLocked, vault.resetLockTimer]);

  const spotlightColor = theme === 'dark' 
    ? 'rgba(139, 92, 246, 0.1)'
    : 'rgba(139, 92, 246, 0.05)';

  const handleNavigate = (page: Page) => {
    if (page === 'admin' && window.location.hash !== '#admin') {
        window.location.hash = 'admin';
    } else if (page !== 'admin' && window.location.hash) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    setCurrentPage(page);
  }

  return (
    <div className="min-h-screen font-sans flex flex-col relative isolate">
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={{
          background: `radial-gradient(600px at ${pointerPosition.x}px ${pointerPosition.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="w-full p-4">
        <Header currentPage={currentPage} onNavigate={handleNavigate} onToggleTutorial={() => setIsTutorialOpen(true)} />
      </div>
      <main className="flex-grow flex items-center justify-center w-full px-4 py-8 md:py-12">
        {currentPage === 'password' && <PasswordGeneratorPage />}
        {currentPage === 'qrcode' && <QRCodeGeneratorPage />}
        {currentPage === 'vault' && <VaultPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && (admin.isAdmin ? <AdminDashboard /> : <AdminLoginPage />)}
      </main>
      {currentPage !== 'about' && currentPage !== 'contact' && currentPage !== 'admin' && <ReviewSection />}
      <Footer />
      <TutorialPanel isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <VaultProvider>
        <AdminProvider>
            <AppContent />
        </AdminProvider>
      </VaultProvider>
    </ThemeProvider>
  )
}

export default App;
