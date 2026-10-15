'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { logger } from '../lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error cleanly
    // `logger.error` always emits - a boundary hit is never routine.
    logger.error('Application runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200/90 p-8 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-stone-900">
            Something went wrong
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We encountered an unexpected issue while loading this page. You can try refreshing or return to the main menu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => reset()}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full">
            <Button variant="outline" size="md" fullWidth>
              <Home className="w-4 h-4 mr-1.5" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
