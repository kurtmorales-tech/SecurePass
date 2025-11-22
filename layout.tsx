
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

type Page = 'password' | 'qrcode' | 'vault' | 'about' | 'contact';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onToggleTutorial: () => void;
}

// This component demonstrates a layout shell, similar to what you'd find in a Next.js app.
// It can contain shared UI and even fetch server-side data to pass down to pages.
const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onToggleTutorial }) => {
  // Demo data that could be fetched on the server in a real application
  const demoUser = {
    name: 'Demo User',
    email: 'demo@example.com',
  };

  return (
    <div className="min-h-screen font-sans flex flex-col">
       <div className="w-full p-4">
            <Header currentPage={currentPage} onNavigate={onNavigate} onToggleTutorial={onToggleTutorial} />
       </div>
       <main className="flex-grow flex items-center justify-center w-full px-4">
            {/* In a real app, this is where the page content would be rendered */}
            {children}
       </main>
       <Footer />
    </div>
  );
};

export default Layout;
