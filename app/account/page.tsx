"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { 
  User, LogOut, Package, Calendar, Tag, ShieldCheck, 
  MapPin, Phone, Mail, ArrowRight, Bike, Wrench, ExternalLink 
} from "lucide-react";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-grow min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#090909] text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400 font-headings font-bold uppercase tracking-wider">Loading Rider Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Let the redirect trigger
  }

  const handleSignOut = () => {
    signOut();
    clearCart();
    router.push("/");
  };

  return (
    <main className="flex-1 bg-[#090909] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-8 relative">
        {/* Header Profile Dashboard banner */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-headings font-extrabold text-2xl shadow-xl shadow-brand-red/25 border border-brand-red/20">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="space-y-1">
              <span className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-[9px] font-headings font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                Verified Rider
              </span>
              <h1 className="text-xl sm:text-2xl font-headings font-extrabold tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-xs text-gray-400 font-body flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-brand-red hover:border-brand-red hover:text-white transition-all text-xs font-headings font-bold uppercase tracking-wider px-5 py-3 rounded-lg w-full md:w-auto justify-center"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Shipment & Order History (8 cols) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h2 className="text-md font-headings font-extrabold uppercase tracking-wider text-gray-300">
                Garage Order Shipments ({user.orders ? user.orders.length : 0})
              </h2>
            </div>

            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-[#121212] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 hover:border-white/20 transition-all"
                  >
                    {/* Order summary info row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-body">Order Number</p>
                        <h3 className="text-sm font-bold font-mono text-white">#{order.orderNumber}</h3>
                      </div>
                      <div className="space-y-1 sm:text-right">
                        <p className="text-xs text-gray-400 font-body">Date Placed</p>
                        <p className="text-xs font-semibold">
                          {new Date(order.processedAt).toLocaleDateString("en-IN", { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="space-y-1 sm:text-right">
                        <p className="text-xs text-gray-400 font-body">Total Amount</p>
                        <p className="text-sm font-bold text-brand-red">
                          ₹{parseFloat(order.totalPrice.amount).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-headings font-bold uppercase tracking-wider ${
                          order.fulfillmentStatus.toUpperCase() === "FULFILLED" || order.fulfillmentStatus.toUpperCase() === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {order.fulfillmentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">
                        SHIPPED ITEMS
                      </h4>
                      <div className="divide-y divide-white/5">
                        {order.lineItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-xs">
                            <div className="space-y-1">
                              <p className="font-bold text-white max-w-[400px] truncate">{item.title}</p>
                              <p className="text-gray-400 font-body">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-semibold text-gray-300">
                              ₹{parseFloat(item.price.amount).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meta tracking details */}
                    <div className="bg-[#181818] p-3.5 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] text-gray-400 font-body">
                      <div>
                        Status: <span className="text-white font-semibold">{order.financialStatus === "PAID" ? "Paid (Prepaid Order)" : "Pending Cash on Delivery"}</span>
                      </div>
                      {order.id.startsWith("ord-mock-") && (
                        <div className="flex items-center gap-1 text-brand-red font-semibold uppercase tracking-wider">
                          <Package className="w-3.5 h-3.5" /> Delhivery Air Tracking: #DLV891{order.id.charCodeAt(order.id.length - 1)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#121212] border border-white/10 border-dashed rounded-xl p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="font-headings font-extrabold text-sm uppercase text-gray-300">No shipments registered</h3>
                <p className="text-xs text-gray-400 font-body max-w-sm mx-auto">
                  You haven&apos;t placed any performance upgrades yet. Head over to our catalog to optimize your machine.
                </p>
                <Link
                  href="/collections/performance-air-filters"
                  className="inline-flex items-center gap-1 bg-brand-red text-white text-xs font-headings font-bold uppercase tracking-wider px-5 py-3 rounded hover:bg-red-700 transition-colors"
                >
                  Explore Upgrades <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </section>

          {/* Right Column: Motorcycle Garage profile (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <h2 className="text-md font-headings font-extrabold uppercase tracking-wider text-gray-300 pb-2 border-b border-white/10">
              Active Rider Garage
            </h2>

            {/* Configured motorcycle profile */}
            <div className="bg-[#121212] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-red">
                  <Bike className="w-5 h-5" />
                </div>
                <Link 
                  href="/garage"
                  className="text-[9px] font-bold text-brand-red uppercase tracking-wider hover:underline flex items-center gap-0.5"
                >
                  Configure <Wrench className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">Garage Designation</h3>
                <p className="text-xs text-gray-400 font-body">
                  The motorcycle profile active in your session. Fits and compatibility recommendations are synced to this vehicle.
                </p>
              </div>

              {/* Display loaded bike info or call-to-action */}
              <GarageBikeStatus />
            </div>

            {/* Quick Links card */}
            <div className="bg-[#121212] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">Rider Quick Links</h3>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-gray-350 font-body">
                <Link 
                  href="/collections/performance-air-filters"
                  className="flex justify-between items-center p-3 rounded-lg bg-[#181818] border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                >
                  <span>BMC Racing Filters</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-red transition-colors" />
                </Link>
                <Link 
                  href="/collections/engine-performance"
                  className="flex justify-between items-center p-3 rounded-lg bg-[#181818] border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                >
                  <span>Engine & Fuel Tuning</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-red transition-colors" />
                </Link>
                <Link 
                  href="/collections/touring-accessories"
                  className="flex justify-between items-center p-3 rounded-lg bg-[#181818] border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                >
                  <span>Touring Accessories</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-red transition-colors" />
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}

// Inner helper component to read localStorage for the active garage motorcycle client side
function GarageBikeStatus() {
  const [bike, setBike] = React.useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rider_garage");
    if (saved) {
      try {
        setBike(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  if (bike && bike.maker && bike.model) {
    return (
      <div className="bg-[#181818] border border-emerald-500/10 p-3.5 rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[9.5px]">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Active Motorcycle Profile
        </div>
        <div className="text-sm font-bold text-white font-headings uppercase">
          {bike.maker} {bike.model}
          {bike.year && <span className="text-xs text-gray-400 ml-1 font-body">({bike.year})</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] border border-amber-500/15 p-3.5 rounded-lg text-xs space-y-2">
      <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider text-[9.5px]">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
        No Profile Active
      </div>
      <p className="text-[11px] text-gray-450 font-body">
        Select your vehicle model to display compatible engine modifications and upgrades.
      </p>
      <Link
        href="/garage"
        className="inline-flex items-center gap-1 text-[10px] text-brand-red font-bold uppercase tracking-wider hover:underline"
      >
        Set Up Bike Profile <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
