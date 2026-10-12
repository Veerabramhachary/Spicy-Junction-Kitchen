import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="h-10 bg-stone-200/80 rounded-xl w-1/3 mx-auto" />
      <div className="h-4 bg-stone-200/60 rounded-md w-1/2 mx-auto" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-48 bg-stone-200/70 rounded-xl" />
            <div className="h-5 bg-stone-200/80 rounded w-2/3" />
            <div className="h-3 bg-stone-200/60 rounded w-full" />
            <div className="h-3 bg-stone-200/60 rounded w-4/5" />
            <div className="h-10 bg-stone-200/70 rounded-lg pt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
