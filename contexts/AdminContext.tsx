
import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';

const ADMIN_SESSION_KEY = 'securepass_admin_session';
const ADMIN_PASSWORD = 'admin'; // For demonstration purposes only.

interface AdminState {
  isAdmin: boolean;
  error: string | null;
  login: (password: string) => boolean;
  logout: () => void;
}

export const AdminContext = createContext<AdminState | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const sessionState = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (sessionState === 'true') {
            setIsAdmin(true);
        }
    }, []);

    const login = (password: string): boolean => {
        setError(null);
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
            return true;
        } else {
            setError('Invalid admin password.');
            return false;
        }
    };

    const logout = useCallback(() => {
        setIsAdmin(false);
        setError(null);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, error, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
      throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
