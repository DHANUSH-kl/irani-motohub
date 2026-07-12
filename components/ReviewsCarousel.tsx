"use client";

import React, { useEffect, useState } from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { getReviews, Review } from "@/lib/shopify";

interface ReviewsCarouselProps {
  reviews?: Review[];
}

export default function ReviewsCarousel({ reviews: initialReviews }: ReviewsCarouselProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);

  useEffect(() => {
    if (initialReviews) return;

    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (e) {
        console.error("Failed to load reviews:", e);
      }
    };

    fetchReviews();
  }, [initialReviews]);

  // Repeat reviews to construct a seamless infinite marquee scroll
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#F8F5F0] overflow-hidden border-b border-brand-border">
      
      {/* Self-contained high-performance marquee styles */}
      <style>{`
        @keyframes marquee-reviews {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-reviews {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation: marquee-reviews 50s linear infinite;
        }
        .animate-marquee-reviews:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block">
            Community Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight text-brand-primary">
            WHAT RIDERS ARE SAYING
          </h2>
          <p className="text-brand-muted text-sm font-body">
            Real performance telemetry feedback directly from verified motorcycle builders and riders across India.
          </p>
        </div>
      </div>

      {/* Infinite Testimonial Scroller Track */}
      <div className="relative w-full overflow-hidden px-4 md:px-8">
        
        {/* Soft edge blur transitions */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8F5F0] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8F5F0] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-reviews py-4">
          {duplicatedReviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white border border-brand-border p-6 md:p-8 rounded-xl shadow-sm hover:border-brand-red hover:shadow-lg transition-all duration-300 w-[340px] md:w-[400px] flex-shrink-0 flex flex-col justify-between h-[280px] relative overflow-hidden group cursor-pointer"
            >
              {/* Corner quote watermark */}
              <Quote className="absolute right-6 top-6 w-16 h-16 text-brand-bg stroke-[0.2] group-hover:scale-105 transition-transform" />

              {/* Card top: Rating & Title */}
              <div className="space-y-3 relative z-10">
                <div className="flex gap-1 text-brand-red">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                
                <h3 className="font-headings font-extrabold text-sm md:text-base text-brand-primary uppercase tracking-tight line-clamp-1">
                  &quot;{rev.title}&quot;
                </h3>
                
                <p className="text-brand-muted text-xs leading-relaxed font-body italic line-clamp-4">
                  {rev.quote}
                </p>
              </div>

              {/* Card bottom: Reviewer Profile info */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between mt-auto relative z-10">
                <div>
                  <h4 className="font-headings font-extrabold text-xs text-brand-primary">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] text-brand-muted font-body">
                    {rev.location}, India
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-[#F8F5F0] border border-brand-border px-2.5 py-1 rounded-full text-[9px] font-bold text-brand-primary uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                  <span className="truncate max-w-[110px]">{rev.motorcycle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
