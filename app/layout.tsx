import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import InitialLoader from "@/components/InitialLoader";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Irani MotoHub | Premium Motorcycle Accessories & Performance Parts",
  description: "India's destination for high-performance motorcycle upgrades, racing air filters, technical riding gear, and touring accessories.",
  metadataBase: new URL("https://iranimotohub.com"),
  openGraph: {
    title: "Irani MotoHub | Premium Performance Store",
    description: "Shop racing air filters, fuel piggybacks, and technical riding gear from BMC, K&N, Motul, Liqui Moly, and more.",
    url: "https://iranimotohub.com",
    siteName: "Irani MotoHub",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Irani MotoHub Golden Hour Hero",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Irani MotoHub | Premium Motorcycle Performance Parts",
    description: "Unlock better engine performance and ride safety with technical apparel, engine care products, and performance upgrades.",
    images: ["/hero-bg.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import SmoothScroll from "@/components/SmoothScroll";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-primary">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SmoothScroll>
                {/* Scroll progress and scroll-to-top dial */}
                <ScrollIndicator />

                {/* Initial landing loader */}
                <InitialLoader />

                {/* Transparent Sticky navigation */}
                <Header />
                
                {/* Main content renders here */}
                <div className="flex-grow flex flex-col">{children}</div>
                
                {/* Right aligned sliding shopping cart drawer */}
                <CartDrawer />
                
                {/* Dark themed footer */}
                <Footer />
              </SmoothScroll>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
