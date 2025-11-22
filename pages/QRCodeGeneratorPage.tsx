import React, { useState } from 'react';

const QRCodeGeneratorPage: React.FC = () => {
    const [text, setText] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setQrCodeUrl(null);

        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to generate QR code. The server responded with an error.');
            }
            const blob = await response.blob();
            // Use URL.createObjectURL to handle the image data safely and allow for downloading
            const objectUrl = URL.createObjectURL(blob);
            setQrCodeUrl(objectUrl);

        } catch (e) {
            console.error(e);
            setError('An error occurred while generating the QR code. Please check your network connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerate();
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <header className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-brand-text-primary">QR Code Generator</h2>
                <p className="text-md text-slate-500 dark:text-brand-text-secondary mt-2">Enter any text or URL to create a QR code instantly.</p>
            </header>

            <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-brand-outline space-y-4">
                <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
                     <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text or URL..."
                        className="flex-grow bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        disabled={isLoading}
                        aria-label="Text or URL to encode"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !text.trim()}
                        className="flex justify-center items-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-brand-outline disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                             <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : 'Generate QR Code'}
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-2" role="alert">{error}</p>}
            </div>

            {(qrCodeUrl || isLoading) && (
                <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-brand-outline flex flex-col items-center justify-center gap-4 transition-opacity duration-500">
                    {isLoading && (
                        <div className="w-[250px] h-[250px] flex items-center justify-center bg-slate-100 dark:bg-brand-bg rounded-lg" aria-busy="true">
                            <p className="text-slate-500 dark:text-brand-text-secondary">Loading QR Code...</p>
                        </div>
                    )}
                    {qrCodeUrl && !isLoading && (
                        <>
                            <div className="bg-white p-2 rounded-lg shadow-lg">
                                <img src={qrCodeUrl} alt="Generated QR Code" width="250" height="250" className="rounded-md" />
                            </div>
                            <a
                                href={qrCodeUrl}
                                download="qrcode.png"
                                className="inline-flex items-center gap-2 bg-brand-secondary text-white dark:text-brand-bg font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default QRCodeGeneratorPage;