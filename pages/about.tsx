import React from 'react';

const AboutPage: React.FC = () => {
    const developer = {
        name: 'Kurt Morales',
        role: 'Lead Developer & Security Architect',
        bio: 'The developer behind SecurePass, specializing in cryptography and secure application design.'
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <header className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-brand-text-primary">About SecurePass</h2>
                <p className="text-lg text-slate-500 dark:text-brand-text-secondary mt-2">
                    Your advanced toolkit for digital security and utility, built with modern technology.
                </p>
            </header>

            <div className="bg-white dark:bg-brand-surface p-8 rounded-lg border border-slate-200 dark:border-brand-outline space-y-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-brand-text-primary">Our Mission</h3>
                <p className="text-slate-600 dark:text-brand-text-secondary">
                    Our mission is to provide users with simple, powerful, and secure tools that run entirely on their own devices. We believe that privacy is paramount. That's why SecurePass processes all sensitive data, like passwords and vault contents, locally in your browser. Nothing is ever sent to a server, ensuring you are the sole controller of your data.
                </p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-brand-text-primary">The Technology</h3>
                 <p className="text-slate-600 dark:text-brand-text-secondary">
                    SecurePass leverages the <code className="bg-slate-200 dark:bg-brand-bg text-brand-secondary px-1 rounded">Web Crypto API</code> for state-of-the-art, browser-native encryption. Your vault is secured with AES-GCM, and your master password is run through PBKDF2 with a high iteration count to derive a strong encryption key. This means your data is protected by industry-standard cryptographic principles right inside your browser.
                </p>
            </div>
            
            <div className="bg-white dark:bg-brand-surface p-8 rounded-lg border border-slate-200 dark:border-brand-outline">
                <h3 className="text-center text-xl font-bold text-slate-800 dark:text-brand-text-primary mb-6">Meet the Developer</h3>
                <div className="flex justify-center">
                    <div className="flex flex-col items-center text-center max-w-sm">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-4">
                            <span className="text-4xl text-white font-bold">{developer.name.charAt(0)}</span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-brand-text-primary">{developer.name}</h4>
                        <p className="font-medium text-brand-primary">{developer.role}</p>
                        <p className="text-sm text-slate-500 dark:text-brand-text-secondary mt-2">{developer.bio}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AboutPage;