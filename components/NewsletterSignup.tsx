import React, { useState } from 'react';

const NewsletterSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            setError('Email address is required.');
            return;
        }
        // Basic email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Simulate subscription
        console.log(`Subscribing ${email} to newsletter.`);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center sm:text-left">
                <h4 className="font-semibold text-slate-800 dark:text-brand-text-primary">Thank you!</h4>
                <p className="text-sm text-slate-500 dark:text-brand-text-secondary">You've been added to our newsletter.</p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="font-semibold text-slate-800 dark:text-brand-text-primary">Join our Newsletter</h4>
            <p className="text-sm text-slate-500 dark:text-brand-text-secondary mt-1">Get updates on new features and security tips.</p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email for newsletter"
                    className="flex-grow w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                />
                <button
                    type="submit"
                    className="bg-brand-secondary text-white dark:text-brand-bg text-sm font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                >
                    Subscribe
                </button>
            </form>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default NewsletterSignup;
