import React from "react";

export default function CollectionLoading() {
  return (
    <div className="min-h-screen bg-brand-bg pt-20">
      {/* Banner skeleton */}
      <div className="bg-[#121212] text-white py-14 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 max-w-3xl">
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-80 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-lg mb-8">
          <div className="flex items-center gap-4 pb-4">
            <div className="h-10 w-96 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse ml-auto" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-lg overflow-hidden p-4 space-y-4">
              <div className="aspect-square w-full bg-gray-100 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-2.5 w-12 bg-red-150 rounded animate-pulse" />
                <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-105 rounded animate-pulse" />
                <div className="h-px bg-brand-border" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-amber-100 rounded animate-pulse" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse pt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
