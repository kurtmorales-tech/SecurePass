
import React, { useState } from 'react';
import { submitContactForm, ContactFormState } from '../services/actions';

const initialState: ContactFormState = {
    message: '',
    success: false,
};

const ContactPage: React.FC = () => {
    const [state, setState] = useState<ContactFormState>(initialState);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData(event.currentTarget);
        const result = await submitContactForm(initialState, formData);
        setState(result);
        setIsPending(false);
        if (result.success) {
            event.currentTarget.reset();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <header className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-brand-text-primary">Contact Us</h2>
                <p className="text-md text-slate-500 dark:text-brand-text-secondary mt-2">
                    Have questions or feedback? We'd love to hear from you.
                </p>
            </header>

            <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-brand-outline">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1">Full Name</label>
                        <input type="text" id="name" name="name" required className="w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1">Email Address</label>
                        <input type="email" id="email" name="email" required className="w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-500 dark:text-brand-text-secondary mb-1">Message</label>
                        <textarea id="message" name="message" rows={5} required className="w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all" />
                    </div>
                    
                    {state.message && (
                        <p className={`text-sm ${state.success ? 'text-green-500' : 'text-red-400'}`} role="alert">{state.message}</p>
                    )}

                    <button type="submit" disabled={isPending} className="w-full flex justify-center items-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-brand-outline disabled:cursor-not-allowed">
                        {isPending ? 'Submitting...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
