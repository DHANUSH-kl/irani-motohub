import React, { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import CategorySectionSection from "@/components/CategorySectionSection";
import BestsellersSection from "@/components/BestsellersSection";
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

export const revalidate = 86400; // 24-hour fallback ISR cache window, refreshed on-demand via Shopify webhooks

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
