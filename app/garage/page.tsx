import React from "react";
import { Metadata } from "next";
import GarageClient from "./GarageClient";

export const metadata: Metadata = {
  title: "Rider Garage & Project Build Planner | Irani MotoHub",
  description: "Virtual garage mapping. Configure your Royal Enfield or KTM project bike, check part compatibility, and analyze estimated horsepower boosts and weight metrics dynamically.",
  openGraph: {
    title: "Rider Garage & Project Build Planner | Irani MotoHub",
    description: "Virtual garage mapping. Configure your Royal Enfield or KTM project bike, check part compatibility, and analyze estimated horsepower boosts and weight metrics dynamically.",
    url: "https://iranimotohub.com/garage",
    siteName: "Irani MotoHub",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Irani MotoHub Rider Garage Profile"
      }
    ],
    type: "website"
  }
};

export default function GaragePage() {
  return <GarageClient />;
}
