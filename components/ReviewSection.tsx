import React, { useState } from 'react';

const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-brand-outline'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="none"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
};


const ReviewSection: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please provide a star rating.");
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSubmitted(true);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="w-full max-w-2xl mx-auto my-12 text-center p-8 bg-white dark:bg-brand-surface rounded-lg border border-slate-200 dark:border-brand-outline shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold mt-4 text-slate-900 dark:text-brand-text-primary">Thank you!</h3>
                <p className="text-slate-500 dark:text-brand-text-secondary mt-2">Your feedback has been received. We appreciate you taking the time to help us improve.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto my-12 px-4">
            <div className="bg-white dark:bg-brand-surface p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-brand-outline shadow-lg space-y-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-brand-text-primary">Tell us what you think!</h3>
                    <p className="text-slate-500 dark:text-brand-text-secondary mt-1">Help us improve SecurePass by leaving a review.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-2">
                         <label className="font-medium text-slate-700 dark:text-brand-text-secondary">Your Rating</label>
                         <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div>
                        <label htmlFor="review-comment" className="font-medium text-slate-700 dark:text-brand-text-secondary">Your Comments (Optional)</label>
                        <textarea
                            id="review-comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike? How can we improve?"
                            className="mt-2 w-full bg-slate-100 dark:bg-brand-bg border border-slate-300 dark:border-brand-outline rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || rating === 0}
                        className="w-full flex justify-center items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-brand-outline disabled:cursor-not-allowed"
                    >
                         {isLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReviewSection;
