import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-brand-footer text-white pt-16 pb-8 border-t border-[#3a3028]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 mb-12">
          
          {/* Brand & Location Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-headings font-extrabold text-2xl tracking-tighter text-white">
                IRANI <span className="text-brand-red">MOTOHUB</span>
              </span>
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full self-end mb-2" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              India&apos;s premium performance motorcycle parts and riding gear destination. Engineered for riders who demand unmatched reliability and power.
            </p>
            <div className="space-y-2.5 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>MG Road, Bengaluru, Karnataka, 560001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>support@iranimotohub.com</span>
              </p>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="font-headings font-extrabold text-xs tracking-widest text-brand-red uppercase mb-5">
              SHOP PERFORMANCE
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/collections/performance-air-filters" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Performance Air Filters
                </Link>
              </li>
              <li>
                <Link href="/collections/engine-performance" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Engine & Performance
                </Link>
              </li>
              <li>
                <Link href="/collections/helmets" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Helmets
                </Link>
              </li>
              <li>
                <Link href="/collections/riding-gear" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Riding Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company & Policies */}
          <div>
            <h4 className="font-headings font-extrabold text-xs tracking-widest text-brand-red uppercase mb-5">
              SUPPORT & POLICIES
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact-section" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/#shipping" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/#returns" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="text-gray-400 hover:text-white transition-colors duration-200 block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social & Trust */}
          <div className="space-y-6">
            <div>
              <h4 className="font-headings font-extrabold text-xs tracking-widest text-brand-red uppercase mb-4">
                FOLLOW OUR RIDE
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#2d231b] flex items-center justify-center hover:bg-brand-red transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#2d231b] flex items-center justify-center hover:bg-brand-red transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#2d231b] flex items-center justify-center hover:bg-brand-red transition-all duration-200"
                  aria-label="YouTube"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              </div>
            </div>

            <div className="border border-[#3a3028] p-4 rounded bg-[#1e1712] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% SECURE CHECKOUT</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                Direct integration with Shopify checkout ensures bank-grade end-to-end data encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-[#3a3028] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Irani MotoHub. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
