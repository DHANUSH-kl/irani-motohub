"use client";

import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  motorcycle: string;
  rating: number;
  title: string;
  quote: string;
}

export default function ReviewsCarousel() {
  const reviews: Testimonial[] = [
    {
      id: "rev-1",
      name: "Arjun Dev",
      location: "Bengaluru",
      motorcycle: "KTM Duke 390 (2024)",
      rating: 5,
      title: "Immediate Throttle Response!",
      quote: "BMC Air Filter + FuelX Pro tuning is absolute magic. Low-end stuttering is completely gone, and switching to Map 9 on the highway is pure power. Exceptional customer service too!"
    },
    {
      id: "rev-2",
      name: "Priyesh G.",
      location: "Mumbai",
      motorcycle: "Royal Enfield Interceptor 650",
      rating: 5,
      title: "Super Smooth Gear Shifts",
      quote: "Bought the Liqui Moly oil and Motul chain care kit. The package arrived in double-boxed premium shockproof wraps. The engine sounds silent, and shifts are butter smooth."
    },
    {
      id: "rev-3",
      name: "Zakir Khan",
      location: "Delhi",
      motorcycle: "Royal Enfield Himalayan 450",
      rating: 5,
      title: "Rock Solid Touring Mount",
      quote: "Tested the BOBO mobile holder on a 1500km ride to Ladakh. Potholes, dirt trails, river crossings—it didn't move a millimeter. QC 3.0 charger is insanely fast."
    },
    {
      id: "rev-4",
      name: "Rohan Sharma",
      location: "Pune",
      motorcycle: "Triumph Speed 400",
      rating: 5,
      title: "Premium Carbon Helmet",
      quote: "The SMK Titan Carbon Helmet is remarkably lightweight. Zero neck fatigue on long weekend runs. Beautiful glossy carbon finish. The fitment team called to verify my size before shipping!"
    },
    {
      id: "rev-5",
      name: "Kabir Malhotra",
      location: "Gurugram",
      motorcycle: "Yamaha YZF-R15 V4",
      rating: 5,
      title: "Instant Cold Starts",
      quote: "NGK Laser Iridium Spark Plugs made cold starts instantaneous. Throttle idle is completely flat now, and mid-range pulling is visibly crisper. Highly recommend for singles!"
    },
    {
      id: "rev-6",
      name: "Neha Deshmukh",
      location: "Kolhapur",
      motorcycle: "KTM Adventure 390",
      rating: 5,
      title: "100% Waterproof Luggage",
      quote: "Viaterra saddlebags stayed bone dry through a heavy 4-hour monsoon downpour. Mount straps are incredibly secure and fit the stock rear frame of my 390 perfectly."
    }
  ];

  // Repeat reviews to construct a seamless infinite marquee scroll
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

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
