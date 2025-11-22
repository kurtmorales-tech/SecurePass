
import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';

const AdminLoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const { login, error } = useAdmin();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const success = login(password);
        if (!success) {
          setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-white dark:bg-brand-surface p-8 rounded-lg border border-slate-200 dark:border-brand-outline shadow-xl">
                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-brand-text-primary mb-2">Admin Access</h2>
                <p className="text-center text-slate-500 dark:text-brand-text-secondary mb-6">Enter the administrative password.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1" htmlFor="admin-password">Password</label>
                        <input
                            type="password"
                            id="admin-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-brand-secondary text-white dark:text-brand-bg font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-brand-outline disabled:cursor-not-allowed">
                        {isLoading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
