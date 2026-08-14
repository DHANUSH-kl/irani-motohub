import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-brand-bg pt-36 md:pt-40 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Image gallery skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full bg-white border border-brand-border rounded-xl overflow-hidden animate-pulse">
              <div className="w-full h-full bg-gray-100" />
            </div>
            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-100 border border-brand-border rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Details column skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl space-y-5 shadow-sm">
              <div className="h-3 w-16 bg-red-100 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
              
              <div className="h-px bg-brand-border" />
              
              {/* Compatibility section mock */}
              <div className="h-20 w-full bg-gray-50 rounded-lg animate-pulse" />
              
              <div className="h-px bg-brand-border" />
              
              <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
              
              <div className="flex gap-3">
                <div className="h-12 flex-grow bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-14 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
