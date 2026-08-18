import React from "react";
import { notFound } from "next/navigation";
import { getShopPolicy } from "@/lib/shopify";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600; // Cache pages for 1 hour

interface PolicyPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { handle: "privacy-policy" },
    { handle: "refund-policy" },
    { handle: "shipping-policy" },
    { handle: "terms-of-service" },
  ];
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { handle } = await params;
  const policy = await getShopPolicy(handle);

  if (!policy) {
    notFound();
  }

  return (
    <main className="flex-1 w-full bg-brand-bg py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-headings font-bold uppercase tracking-wider text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Policy Content Container */}
        <div className="bg-[#1C1917] border border-[#2d231b] rounded-2xl p-6 md:p-12 shadow-xl">
          <h1 className="font-headings font-extrabold text-2xl sm:text-4xl text-white mb-6 border-b border-[#2d231b] pb-6 uppercase tracking-tight">
            {policy.title}
          </h1>
          
          <div 
            className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed font-body"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        </div>

      </div>
    </main>
  );
}
