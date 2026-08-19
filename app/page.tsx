import React, { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import CategorySectionSection from "@/components/CategorySectionSection";
import BestsellersSection from "@/components/BestsellersSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import PerformanceBanner from "@/components/PerformanceBanner";
import FeaturedBrands from "@/components/FeaturedBrands";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Newsletter from "@/components/Newsletter";
import { 
  CategorySkeleton, 
  FeaturedProductsSkeleton, 
  NewArrivalsSkeleton 
} from "@/components/Skeletons";

export const revalidate = 60; // Edge/CDN ISR revalidation window of 60 seconds

export default function Home() {
  return (
    <main className="flex-1 w-full bg-brand-bg">
      {/* Cinematic Hero Section - Streams above the fold instantly, targeted product fetch */}
      <HeroSection />

      {/* Grid of collections - Streams independently */}
      <Suspense fallback={<CategorySkeleton />}>
        <CategorySectionSection />
      </Suspense>

      {/* Dedicated Bestsellers Section */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <BestsellersSection />
      </Suspense>

      {/* Curated list of items with quick-add - Streams independently */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Carousel of newest products - Streams independently */}
      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivalsSection />
      </Suspense>

      {/* Dynamic performance spotlight banner */}
      <PerformanceBanner />

      {/* Brand grids */}
      <FeaturedBrands />

      {/* sliding reviews testimonials */}
      <ReviewsCarousel />

      {/* minimal join channel */}
      <Newsletter />
    </main>
  );
}
