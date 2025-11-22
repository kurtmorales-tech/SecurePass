import React from 'react';
import NewsletterSignup from './NewsletterSignup';

const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-slate-200 dark:border-brand-outline py-8">
            <div className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <NewsletterSignup />
                <div className="text-center md:text-right text-slate-500 dark:text-brand-text-secondary text-sm">
                    <p>&copy; {new Date().getFullYear()} SecurePass. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;