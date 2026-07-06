import React from "react";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import PerformanceBanner from "@/components/PerformanceBanner";
import FeaturedBrands from "@/components/FeaturedBrands";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="flex-1 w-full bg-brand-bg">
      {/* Cinematic Hero section */}
      <Hero />

      {/* Grid of collections */}
      <CategorySection />

      {/* Curated list of items with quick-add */}
      <FeaturedProducts />

      {/* Carousel of newest products */}
      <NewArrivals />

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
