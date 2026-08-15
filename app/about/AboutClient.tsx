"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Sparkles, Heart, ShoppingBag } from "lucide-react";

export default function AboutClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="flex-1 w-full bg-[#121212] text-white pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Grid Blueprints */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Cinematic Glowing Background spots */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24 max-w-4xl mx-auto"
        >
          
          {/* ================= HERO INTRO SECTION ================= */}
          <section className="space-y-8 pt-8 lg:pt-16">
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-brand-red" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-red font-headings">
                About Us
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-headings font-extrabold tracking-tight uppercase leading-[0.95]">
              Welcome to Irani Motohub — <br />
              <span className="text-brand-red">Your One-Stop Destination for Motorcycle Accessories & Upgrades.</span>
            </motion.h1>

            <motion.div variants={itemVariants} className="space-y-6 text-gray-300 font-body text-sm sm:text-base leading-relaxed">
              <p>
                Born out of a genuine passion for motorcycles, Irani Motohub is an e-commerce store dedicated to motorcycle accessories, performance upgrades, styling products, and essential bike components.
              </p>
              <p>
                We understand that for a rider, a motorcycle is more than just a machine. It is a reflection of your personality, your riding style, and the way you choose to experience the road. That’s why we aim to bring together products that help you upgrade, personalise, protect, and enhance your motorcycle.
              </p>
              <p>
                From performance-oriented upgrades and functional accessories to styling components and everyday essentials, we continuously work towards offering a carefully selected range of products for motorcycle enthusiasts across India.
              </p>
            </motion.div>

            {/* Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div className="space-y-1">
                <span className="font-headings font-extrabold text-2xl text-white">100%</span>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Verified Genuineness</p>
              </div>
              <div className="space-y-1">
                <span className="font-headings font-extrabold text-2xl text-white">24/7</span>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Customer Support</p>
              </div>
              <div className="space-y-1">
                <span className="font-headings font-extrabold text-2xl text-white">PAN INDIA</span>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Shipping & Delivery</p>
              </div>
            </motion.div>
          </section>

          {/* ================= WHAT WE STAND FOR & OUR PROMISE ================= */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What We Stand For */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#181818] border border-white/10 p-8 rounded-xl space-y-4 hover:border-brand-red/30 transition-all duration-300 shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-headings font-extrabold text-lg text-white uppercase tracking-wider">
                What We Stand For
              </h3>
              <div className="space-y-3 text-gray-400 text-xs sm:text-sm leading-relaxed font-body">
                <p>
                  At Irani Motohub, we believe that every product you put on your motorcycle should serve a purpose — whether it’s improving functionality, enhancing aesthetics, adding protection, or simply making your bike feel more like your own.
                </p>
                <p>
                  We focus on products that offer a balance of quality, design, reliability, and value. Our range includes both carefully selected aftermarket products and well-known motorcycle brands, giving riders more options when building their ideal motorcycle.
                </p>
              </div>
            </motion.div>

            {/* Our Promise */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#181818] border border-white/10 p-8 rounded-xl space-y-4 hover:border-brand-red/30 transition-all duration-300 shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-headings font-extrabold text-lg text-white uppercase tracking-wider">
                Our Promise
              </h3>
              <div className="space-y-3 text-gray-400 text-xs sm:text-sm leading-relaxed font-body">
                <p>
                  We aim to provide a smooth and reliable online shopping experience — from discovering the right product to getting it delivered to your doorstep.
                </p>
                <p>
                  We are constantly expanding our collection to bring riders more products, more choices, and better ways to customise their motorcycles.
                </p>
              </div>
            </motion.div>
          </section>

          {/* ================= BUILT FOR RIDERS ================= */}
          <section className="bg-[#181818] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl pointer-events-none" />
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-red" />
                <span className="font-headings font-extrabold text-xs uppercase tracking-wider text-brand-red">
                  Built For Riders
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-headings font-extrabold text-white uppercase tracking-tight leading-none">
                We Aren&apos;t Just Here To Sell Parts
              </h2>
              <div className="space-y-4 text-gray-300 font-body text-xs sm:text-sm leading-relaxed">
                <p>
                  We understand the excitement behind finding the perfect accessory, the satisfaction of completing a build, and the difference a small upgrade can make to your bike.
                </p>
                <p>
                  Whether you’re modifying your motorcycle for better performance, upgrading its appearance, adding practical accessories, or simply looking for something that makes your bike stand out, Irani Motohub is here to make the process easier.
                </p>
              </div>
            </motion.div>
          </section>

          {/* ================= SIGN-OFF CALLOUT SECTION ================= */}
          <section className="border border-white/10 rounded-2xl p-8 sm:p-12 relative overflow-hidden bg-cover bg-center text-center shadow-2xl flex flex-col items-center justify-center space-y-6"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(18,18,18,0.95), rgba(18,18,18,0.98)), url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop')"
            }}
          >
            <motion.div variants={itemVariants} className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/35 flex items-center justify-center text-brand-red mb-2">
              <ShoppingBag className="w-6 h-6" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 max-w-xl">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-red font-headings">
                From a Rider To Another.
              </span>
              <h2 className="text-xl sm:text-3xl font-headings font-extrabold uppercase text-white tracking-tight leading-tight">
                Your motorcycle is unique.<br />Your build should be too.
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm font-body leading-relaxed">
                Irani Motohub is an e-commerce store, serving motorcycle enthusiasts across India with carefully selected motorcycle accessories and upgrades.
              </p>
              <div className="pt-2 text-brand-red font-headings font-extrabold text-sm sm:text-base tracking-widest uppercase">
                Irani Motohub — You Name It, We Got It.
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 relative z-10">
              <Link
                href="/products"
                className="bg-brand-red hover:bg-white hover:text-[#121212] text-white px-8 py-3.5 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center gap-2 group rounded-sm"
              >
                Explore Accessories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </section>

        </motion.div>
      </div>
    </main>
  );
}
