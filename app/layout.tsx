import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
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
  description: "Premium Motorcycle accessories and performance upgrades",
  metadataBase: new URL("https://iranimotohub.in"),
  icons: {
    icon: "/imhlogo.png",
    shortcut: "/imhlogo.png",
    apple: "/imhlogo.png",
  },
  openGraph: {
    title: "Irani MotoHub | Premium Performance Store",
    description: "Premium Motorcycle accessories and performance upgrades",
    url: "https://iranimotohub.in",
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
    description: "Premium Motorcycle accessories and performance upgrades",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://iranimotohub.in/#organization",
                  "name": "Irani MotoHub",
                  "url": "https://iranimotohub.in",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://iranimotohub.in/imhlogo.png",
                    "caption": "Irani MotoHub"
                  },
                  "sameAs": [
                    "https://instagram.com",
                    "https://facebook.com"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://iranimotohub.in/#website",
                  "url": "https://iranimotohub.in",
                  "name": "Irani MotoHub",
                  "description": "Premium Motorcycle Accessories & Performance Store",
                  "publisher": {
                    "@id": "https://iranimotohub.in/#organization"
                  },
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://iranimotohub.in/products?search={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                }
              ]
            })
          }}
        />
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

        {/* Global Analytics Scripts loaded asynchronously */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"}');
          `}
        </Script>

        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || "1234567890"}');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}
