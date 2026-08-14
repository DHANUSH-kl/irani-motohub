import React from "react";
import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Our Tuning & Performance Lab | Irani MotoHub",
  description: "Founded by mechanical engineers and dyno-tuners, Irani MotoHub delivers high-performance motorcycle air filters, ECU tuners, and premium riding gear certified via real-world diagnostics.",
  openGraph: {
    title: "About Our Tuning & Performance Lab | Irani MotoHub",
    description: "Founded by mechanical engineers and dyno-tuners, Irani MotoHub delivers high-performance motorcycle air filters, ECU tuners, and premium riding gear certified via real-world diagnostics.",
    url: "https://iranimotohub.in/about",
    siteName: "Irani MotoHub",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Irani MotoHub Tuning Lab"
      }
    ],
    type: "website"
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
