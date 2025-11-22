
import React from 'react';
import { useVault } from '../hooks/useVault';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-brand-outline flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-brand-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-brand-text-primary">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { credentials, isInitialized } = useVault();

    // In a real app, this data would come from a backend API.
    const totalUsers = isInitialized ? 1 : 0; // Simulating a single user
    const totalCredentials = credentials.length;
    const appHealth = 'Healthy';
    const appVersion = '1.3.0'; // Example version

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <header>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-brand-text-primary">Admin Dashboard</h2>
                <p className="text-lg text-slate-500 dark:text-brand-text-secondary mt-1">Application overview and statistics.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={totalUsers}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
                <StatCard
                    title="Credentials Stored"
                    value={isInitialized ? totalCredentials : 'N/A'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                />
                <StatCard
                    title="App Health"
                    value={appHealth}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                />
                 <StatCard
                    title="App Version"
                    value={appVersion}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-brand-outline">
                <h3 className="text-xl font-bold text-slate-800 dark:text-brand-text-primary mb-4">System Log</h3>
                <div className="h-64 bg-slate-100 dark:bg-brand-bg p-4 rounded-md font-mono text-xs text-slate-500 dark:text-brand-text-secondary overflow-y-auto">
                    <p><span className="text-green-500">[INFO]</span> Application initialized successfully.</p>
                    <p><span className="text-green-500">[INFO]</span> Theme context loaded: dark mode.</p>
                    <p><span className="text-green-500">[INFO]</span> Vault context loaded. Vault is {isInitialized ? 'initialized' : 'not initialized'}.</p>
                    <p><span className="text-yellow-400">[WARN]</span> Admin dashboard accessed at {new Date().toLocaleTimeString()}.</p>
                     {isInitialized && <p><span className="text-green-500">[INFO]</span> Vault contains {totalCredentials} credentials.</p>}
                     {!isInitialized && <p><span className="text-yellow-400">[WARN]</span> No vault found. Waiting for user setup.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
