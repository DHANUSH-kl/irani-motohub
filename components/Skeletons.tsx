import React from "react";

export function CategorySkeleton() {
  return (
    <section className="py-20 bg-brand-bg border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-white border border-brand-border rounded-xl p-6 space-y-4 animate-pulse">
              <div className="h-2/3 bg-gray-100 rounded-lg" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-6 w-2/3 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-24 bg-white border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-72 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-brand-border rounded-lg p-4 space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-lg" />
              <div className="h-3 w-16 bg-red-100 rounded" />
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
              <div className="h-px bg-brand-border" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-3 w-8 bg-amber-100 rounded" />
              </div>
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewArrivalsSkeleton() {
  return (
    <section className="py-24 bg-brand-bg border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-brand-border rounded-lg p-4 space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-lg" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-5 w-2/3 bg-gray-250 rounded" />
              <div className="h-px bg-brand-border" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-14 bg-gray-200 rounded" />
                <div className="h-3 w-10 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
