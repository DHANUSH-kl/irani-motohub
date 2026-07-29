"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { CustomerOrder } from "@/lib/shopify";
import {
  Package,
  ArrowLeft,
  Loader,
  CheckCircle2,
  AlertTriangle,
  Truck,
  RefreshCw,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface OrderTrackingStep {
  activity: string;
  location: string;
  date: string;
  status: string;
}

function isPrepaidOrder(order: CustomerOrder): boolean {
  return order.financialStatus?.toUpperCase() === "PAID";
}

function getShopifyTrackingSteps(order: CustomerOrder): OrderTrackingStep[] {
  const tracking = order.successfulFulfillments?.[0]?.trackingInfo?.[0];

  if (tracking?.number) {
    return [
      {
        activity: "Order confirmed",
        location: "Irani Motohub",
        date: new Date(order.processedAt).toLocaleString("en-IN"),
        status: "CONFIRMED",
      },
      {
        activity: `Shipped via ${tracking.company || "Courier"}`,
        location: tracking.number,
        date: "Tracking active",
        status: "SHIPPED",
      },
    ];
  }

  if (isPrepaidOrder(order)) {
    return [
      {
        activity: "Payment received",
        location: "Cashfree via Shopify Checkout",
        date: new Date(order.processedAt).toLocaleString("en-IN"),
        status: "PAID",
      },
      {
        activity: "Awaiting dispatch",
        location: "Shree Maruti (manual fulfillment)",
        date: "Merchant will book shipment shortly",
        status: "UNFULFILLED",
      },
    ];
  }

  return [
    {
      activity: "Order confirmed",
      location: "Irani Motohub",
      date: new Date(order.processedAt).toLocaleString("en-IN"),
      status: "CONFIRMED",
    },
    {
      activity: "Preparing Shiprocket shipment",
      location: "Fulfillment queue",
      date: "Tracking will appear once the courier picks up the package",
      status: "PROCESSING",
    },
  ];
}

export default function OrdersHistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [trackingDetails, setTrackingDetails] = useState<OrderTrackingStep[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const loadTracking = async (order: CustomerOrder) => {
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingUrl(null);

    try {
      if (isPrepaidOrder(order)) {
        setTrackingDetails(getShopifyTrackingSteps(order));
        const url = order.successfulFulfillments?.[0]?.trackingInfo?.[0]?.url;
        setTrackingUrl(url || null);
        return;
      }

      const response = await fetch(
        `/api/shiprocket/track?order_id=${encodeURIComponent(order.orderNumber)}`
      );
      const data = await response.json();

      if (response.ok && data.tracking?.tracking_data?.shipment_track_activities?.length) {
        const activities = data.tracking.tracking_data.shipment_track_activities.map(
          (activity: { activity?: string; location?: string; date?: string; status?: string }) => ({
            activity: activity.activity || "Package in transit",
            location: activity.location || "Courier facility",
            date: activity.date || new Date().toLocaleString("en-IN"),
            status: activity.status || "TRANSIT",
          })
        );
        setTrackingDetails(activities);
        return;
      }

      setTrackingDetails(getShopifyTrackingSteps(order));
      if (!response.ok) {
        setTrackingError("Live Shiprocket tracking is not available yet.");
      }
    } catch {
      setTrackingError("Failed to load tracking details.");
      setTrackingDetails(getShopifyTrackingSteps(order));
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleSelectOrder = (order: CustomerOrder) => {
    setSelectedOrder(order);
    void loadTracking(order);
  };

  if (loading) {
    return (
      <div className="flex-grow min-h-screen flex items-center justify-center bg-[#090909] text-white pt-20">
        <div className="text-center space-y-4">
          <Loader className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto text-brand-red" />
          <p className="text-xs text-gray-400 font-headings font-bold uppercase tracking-wider">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="flex-1 bg-[#090909] text-white py-24 min-h-screen px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-headings font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-[9px] font-headings font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Order Tracking
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-5 space-y-6">
            <h1 className="text-xl sm:text-2xl font-headings font-extrabold tracking-tight">
              YOUR ORDERS
            </h1>

            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`w-full text-left bg-[#121212] border rounded-xl p-5 transition-all outline-none flex flex-col gap-3 ${
                      selectedOrder?.id === order.id
                        ? "border-brand-red ring-1 ring-brand-red/20 shadow-lg shadow-brand-red/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-mono font-bold text-white">#{order.orderNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-headings font-bold uppercase tracking-wider ${
                          order.fulfillmentStatus === "FULFILLED" ||
                          order.fulfillmentStatus === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-end w-full text-xs">
                      <div className="space-y-1">
                        <p className="text-gray-400 font-body">
                          Placed: {new Date(order.processedAt).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-gray-300 font-semibold font-body">
                          {isPrepaidOrder(order) ? "Prepaid" : "Cash on Delivery"}
                        </p>
                      </div>
                      <span className="font-headings font-extrabold text-brand-red text-sm">
                        ₹{parseFloat(order.totalPrice.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-[#121212] border border-white/10 border-dashed rounded-xl p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="font-headings font-extrabold text-sm uppercase text-gray-300">
                  No Orders Yet
                </h3>
                <p className="text-xs text-gray-400 font-body max-w-xs mx-auto">
                  Complete a purchase to see your order history here.
                </p>
              </div>
            )}
          </section>

          <section className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Order Details</p>
                    <h2 className="text-lg font-extrabold font-headings text-white">
                      #{selectedOrder.orderNumber}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {isPrepaidOrder(selectedOrder)
                        ? "Prepaid · Shree Maruti manual dispatch"
                        : "COD · Shiprocket automated shipment"}
                    </p>
                  </div>

                  <button
                    onClick={() => void loadTracking(selectedOrder)}
                    className="p-2 border border-white/10 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Refresh tracking"
                  >
                    <RefreshCw className={`w-4 h-4 ${trackingLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">
                    Items Ordered
                  </h3>
                  <div className="divide-y divide-white/5 bg-[#0e0e0e] border border-white/5 rounded-xl px-4 py-2">
                    {selectedOrder.lineItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white truncate max-w-[320px]">{item.title}</p>
                          <p className="text-[10px] text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-gray-300">
                          ₹{parseFloat(item.price.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-brand-red hover:underline"
                  >
                    Open courier tracking <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="space-y-4">
                  <h3 className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">
                    Shipment Progress
                  </h3>

                  {trackingLoading ? (
                    <div className="py-12 text-center text-gray-400 space-y-2">
                      <Loader className="w-6 h-6 animate-spin mx-auto text-brand-red" />
                      <p className="text-xs">Loading tracking updates...</p>
                    </div>
                  ) : trackingError ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <p>{trackingError}</p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                      {trackingDetails.map((milestone, index) => (
                        <div key={index} className="flex gap-4 relative">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border z-10 flex-shrink-0 bg-[#121212] ${
                              index === trackingDetails.length - 1
                                ? "border-brand-red text-brand-red scale-110"
                                : "border-white/20 text-gray-400"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                          </div>

                          <div className="space-y-1">
                            <h4
                              className={`text-xs font-bold ${
                                index === trackingDetails.length - 1 ? "text-brand-red" : "text-white"
                              }`}
                            >
                              {milestone.activity}
                            </h4>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 font-body">
                              <MapPin className="w-3 h-3" /> {milestone.location}
                            </p>
                            <p className="text-[9px] text-gray-500 font-body">{milestone.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-12 text-center space-y-4 h-full flex flex-col justify-center items-center">
                <Truck className="w-16 h-16 text-gray-650 mb-2 stroke-[1.2]" />
                <h3 className="font-headings font-extrabold text-sm uppercase text-gray-300">
                  Select an Order
                </h3>
                <p className="text-xs text-gray-400 font-body max-w-sm mx-auto">
                  Choose an order to view prepaid Shree Maruti dispatch status or live COD Shiprocket
                  tracking.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
