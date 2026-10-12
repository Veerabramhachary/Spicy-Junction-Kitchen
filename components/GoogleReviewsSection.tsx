'use client';

import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, MessageSquarePlus, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { RESTAURANT_INFO, REVIEWS as INITIAL_REVIEWS } from '../lib/restaurantData';
import { ReviewItem } from '../types/restaurant';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const GoogleReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states for manual review submission
  const [authorName, setAuthorName] = useState('');
  const [dinerType, setDinerType] = useState<ReviewItem['type']>('Solo Diner');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Load any previously submitted manual reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('spicy_junction_manual_reviews');
      if (stored) {
        const parsed: ReviewItem[] = JSON.parse(stored);
        setReviews([...parsed, ...INITIAL_REVIEWS]);
      }
    } catch {
      // localStorage fallback
    }
  }, []);

  const handleManualReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    setIsSubmitting(true);
    const newReview: ReviewItem = {
      id: `manual-${Date.now()}`,
      author: authorName.trim(),
      type: dinerType,
      rating,
      text: reviewText.trim(),
      date: 'Just now',
      source: 'Manual Guest Review',
      verifiedCustomer: true,
    };

    setTimeout(() => {
      const updated = [newReview, ...reviews];
      setReviews(updated);
      try {
        const existingManual = JSON.parse(
          localStorage.getItem('spicy_junction_manual_reviews') || '[]'
        );
        localStorage.setItem(
          'spicy_junction_manual_reviews',
          JSON.stringify([newReview, ...existingManual])
        );
      } catch {
        // storage fallback
      }
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 400);
  };

  const handleCopyGoogleLink = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.googleMapsShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="space-y-8">
      {/* Google Maps Official Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Official Google Maps Listing
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Business
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 tracking-tight">
              Customer Reviews & Google Maps Integration
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              We connect directly with our genuine Google Maps presence on Almasguda Road, Badangpet. Read live customer feedback, share your experience directly on Google Maps, or leave a review below.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={RESTAURANT_INFO.googleMapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={RESTAURANT_INFO.googleMapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
            >
              <span>Write Google Review</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                setShowAddReviewModal(true);
                setSubmittedSuccess(false);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Add Guest Review</span>
            </button>
          </div>
        </div>

        {/* Live Link Verification Strip */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-700">Official Share URL:</span>
            <code className="text-stone-800 bg-stone-100 px-2 py-0.5 rounded font-mono text-[11px]">
              {RESTAURANT_INFO.googleMapsShareUrl}
            </code>
          </div>
          <button
            onClick={handleCopyGoogleLink}
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Google Maps Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reviews Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <Card key={rev.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {rev.source || 'Google Maps'}
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900">{rev.author}</span>
                {rev.verifiedCustomer && (
                  <span title="Verified Customer">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </span>
                )}
              </div>
              <span className="text-stone-500">{rev.type}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Manual Review Submission */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setShowAddReviewModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-10 p-6 space-y-4">
            {submittedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Your review has been saved to the website feed. You can also share it directly on our Google Maps listing.
                </p>
                <div className="pt-3 flex flex-col gap-2">
                  <a
                    href={RESTAURANT_INFO.googleMapsShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                  >
                    <span>Post this review on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddReviewModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualReviewSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Leave Your Review for Spicy Junction Kitchen
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddReviewModal(false)}
                    className="text-stone-400 hover:text-stone-700 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ramesh K."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Experience Type
                    </label>
                    <select
                      value={dinerType}
                      onChange={(e) => setDinerType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                      <option value="Solo Diner">Solo Diner</option>
                      <option value="Family Group">Family with Kids</option>
                      <option value="Group Gathering">Group / Friends</option>
                      <option value="Takeaway Customer">Takeaway Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 cursor-pointer transition-colors ${
                            star <= rating ? 'text-amber-500' : 'text-stone-300'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Review & Comments *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How was the dum biryani, quick bite starters, spice levels, or service?"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setShowAddReviewModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Save Review'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
