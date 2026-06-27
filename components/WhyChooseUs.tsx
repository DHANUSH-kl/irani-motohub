"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Wrench, Check, Bike, ArrowRight } from "lucide-react";

const MOTORCYCLES = [
  { maker: "KTM", models: ["Duke 390", "RC 390"] },
  { maker: "Royal Enfield", models: ["Himalayan 450", "Interceptor 650", "Continental GT 650"] },
  { maker: "Yamaha", models: ["R15 V4"] },
  { maker: "Triumph", models: ["Speed 400"] }
];

export default function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Local storage garage sync
  const [garageBike, setGarageBike] = useState<{ maker: string; model: string } | null>(null);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    const checkGarage = () => {
      const saved = localStorage.getItem("rider_garage");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.maker && parsed.model) {
            setGarageBike(parsed);
            setSelectedMaker(parsed.maker);
            setSelectedModel(parsed.model);
          }
        } catch (e) {
          setGarageBike(null);
        }
      } else {
        setGarageBike(null);
        setSelectedMaker("");
        setSelectedModel("");
      }
    };
    checkGarage();

    window.addEventListener("garage-updated", checkGarage);
    return () => {
      window.removeEventListener("garage-updated", checkGarage);
    };
  }, []);

  const handleSaveGarage = () => {
    if (selectedMaker && selectedModel) {
      const bike = { maker: selectedMaker, model: selectedModel };
      setGarageBike(bike);
      localStorage.setItem("rider_garage", JSON.stringify(bike));
      window.dispatchEvent(new Event("garage-updated"));
    }
  };

  const handleClearGarage = () => {
    setGarageBike(null);
    setSelectedMaker("");
    setSelectedModel("");
    localStorage.removeItem("rider_garage");
    window.dispatchEvent(new Event("garage-updated"));
  };

  const features = [
    {
      id: 0,
      title: "Certified Performance Parts",
      icon: <ShieldCheck className="w-5 h-5 text-brand-red" />,
      description: "Direct imports from manufacturers like BMC and K&N. Certified racing specifications with zero duplicates."
    },
    {
      id: 1,
      title: "Engineer-Backed Fitment Guidance",
      icon: <Wrench className="w-5 h-5 text-brand-red" />,
      description: "Trained mechanical engineers are available online to consult on compatibility and install guides."
    },
    {
      id: 2,
      title: "Secure Transit Across India",
      icon: <Truck className="w-5 h-5 text-brand-red" />,
      description: "Shipping with complete transit insurance and anti-shock foam cradle packing."
    },
    {
      id: 3,
      title: "10-Day Risk-Free Return Guarantee",
      icon: <RotateCcw className="w-5 h-5 text-brand-red" />,
      description: "Hassle-free money-back returns if any component fails to meet your performance standards."
    }
  ];

  // Dynamic Telemetry Mapping for the Cluster
  const telemetryData = [
    { rpm: 9800, speed: 192, gear: "6", status: "INTAKE: MAXIMUM", angle: 70 },   // Genuine parts (power peak)
    { rpm: 6200, speed: 124, gear: "4", status: "ECU: OPTIMAL", angle: 5 },       // Support (street cruisey)
    { rpm: 3500, speed: 58,  gear: "2", status: "DRIVE: SECURED", angle: -50 },    // Shipping (safe delivery)
    { rpm: 0,    speed: 0,   gear: "N", status: "SYS: READY", angle: -110 }      // Returns (neutral stop)
  ];

  const currentTele = telemetryData[activeIndex] || telemetryData[3];

  return (
    <section className="py-24 bg-[#121212] text-white relative overflow-hidden border-t border-b border-white/10">
      
      {/* Blueprint Grid background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simplified Header */}
        <div className="mb-16 space-y-2.5">
          <span className="text-[10px] font-headings font-extrabold uppercase tracking-[0.25em] text-brand-red block">
            Engineered For Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight text-white uppercase leading-none">
            WHY IRANI MOTOHUB
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-lg font-body">
            Verify fitment and source certified performance parts backed by expert engineers.
          </p>
        </div>

        {/* 2-Column interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: High-fidelity sportbike Instrument Cluster HUD */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl p-8 relative h-[340px] lg:h-[390px] shadow-2xl overflow-hidden group">
            
            {/* Tachometer SVG */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              
              <svg className="w-full h-full text-white/10 fill-none" viewBox="0 0 100 100">
                {/* Dial outer boundary */}
                <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />
                
                {/* RPM Arc tick layout */}
                {/* 0 to 12k rpm tick lines */}
                {Array.from({ length: 13 }).map((_, i) => {
                  const tickAngle = -210 + i * 20; // from -210deg to 30deg
                  const rad = (tickAngle * Math.PI) / 180;
                  const x1 = 50 + 34 * Math.cos(rad);
                  const y1 = 50 + 34 * Math.sin(rad);
                  const x2 = 50 + 38 * Math.cos(rad);
                  const y2 = 50 + 38 * Math.sin(rad);
                  const isRedline = i >= 9; // Redline starts at 9k RPM

                  return (
                    <line 
                      key={i} 
                      x1={x1} y1={y1} x2={x2} y2={y2} 
                      stroke={isRedline ? "#B91C1C" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={i % 3 === 0 ? "1" : "0.5"} 
                    />
                  );
                })}

                {/* Redline Arc */}
                <path 
                  d="M 76.2 65 A 38 38 0 0 0 82.9 31" 
                  stroke="#B91C1C" 
                  strokeWidth="2" 
                  strokeDasharray="2 1.5"
                  opacity="0.6"
                />

                {/* Dial central cap */}
                <circle cx="50" cy="50" r="6" fill="#121212" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                {/* Dynamic Tachometer Needle */}
                <line 
                  x1="50" y1="50" 
                  x2="50" y2="15" 
                  stroke="#B91C1C" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  style={{ 
                    transform: `rotate(${currentTele.angle}deg)`, 
                    transformOrigin: "50px 50px" 
                  }}
                  className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-[50px_50px] shadow-lg"
                />
              </svg>

              {/* Digital Speedometer overlay (in center of dial) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                {/* Speed digits */}
                <span className="font-headings font-extrabold text-3xl tracking-tighter text-white leading-none">
                  {currentTele.speed}
                </span>
                <span className="text-[7px] font-headings font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  KM/H
                </span>
              </div>

              {/* Gear position indicator (top right) */}
              <div className="absolute top-4 right-4 bg-[#1e1e1e] border border-white/10 w-9 h-9 rounded flex flex-col items-center justify-center shadow-inner">
                <span className="text-[6px] font-headings font-bold text-gray-500 uppercase tracking-wider">GEAR</span>
                <span className={`font-headings font-extrabold text-xs ${currentTele.gear === "N" ? "text-emerald-500" : "text-brand-red"}`}>
                  {currentTele.gear}
                </span>
              </div>
            </div>

            {/* Bottom HUD readout display */}
            <div className="w-full bg-[#181818] border border-white/5 p-3.5 rounded-lg flex items-center justify-between font-mono text-[9px] text-gray-400 mt-4.5">
              <div className="flex flex-col">
                <span className="text-gray-600 text-[8px] uppercase">Telemetry readout</span>
                <span className="text-white font-bold">{currentTele.status}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-600 text-[8px] uppercase">Engine speed</span>
                <span className="text-brand-red font-bold">{currentTele.rpm.toLocaleString()} RPM</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean list + Quick conversion selector */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Features layout */}
            <div className="space-y-6">
              {features.map((feat) => {
                const isActive = activeIndex === feat.id;
                return (
                  <div
                    key={feat.id}
                    onMouseEnter={() => setActiveIndex(feat.id)}
                    className="flex gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-white/[0.02] cursor-pointer"
                  >
                    <div className={`p-2.5 rounded border flex-shrink-0 transition-colors duration-300 ${
                      isActive ? "bg-brand-red/10 border-brand-red/40 text-white" : "bg-white/5 border-white/5 text-gray-500"
                    }`}>
                      {feat.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headings font-extrabold text-sm uppercase tracking-wide text-white">
                        {feat.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed max-w-xl font-body">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick conversion Garage select card */}
            <div className="border border-white/10 rounded-xl p-5 bg-[#181818] shadow-xl max-w-xl">
              <AnimatePresence mode="wait">
                {garageBike ? (
                  // Success/Active State (Conversion complete)
                  <motion.div
                    key="active-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-red/10 border border-brand-red/40 flex items-center justify-center text-brand-red">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-headings font-extrabold uppercase text-white tracking-wide">
                          Compatibility Filter Active
                        </h4>
                        <p className="text-[10.5px] text-gray-400 font-body mt-0.5">
                          Catalog checked for your <strong className="text-white">{garageBike.maker} {garageBike.model}</strong>.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearGarage}
                      className="text-[9px] font-headings font-bold uppercase tracking-widest text-gray-400 hover:text-brand-red border border-white/10 hover:border-brand-red/40 px-3 py-1.5 rounded transition-all"
                    >
                      Reset Garage
                    </button>
                  </motion.div>
                ) : (
                  // Empty State (Drives setup conversion)
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bike className="w-4 h-4 text-brand-red" />
                      <h4 className="text-xs font-headings font-extrabold uppercase text-white tracking-wide">
                        Check Compatibility Instantly
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={selectedMaker}
                        onChange={(e) => {
                          setSelectedMaker(e.target.value);
                          setSelectedModel("");
                        }}
                        className="bg-[#121212] border border-white/10 rounded p-2 text-xs font-semibold text-white focus:outline-none focus:border-brand-red"
                      >
                        <option value="">Select Manufacturer</option>
                        {MOTORCYCLES.map((m) => (
                          <option key={m.maker} value={m.maker}>{m.maker}</option>
                        ))}
                      </select>

                      <select
                        value={selectedModel}
                        disabled={!selectedMaker}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-[#121212] border border-white/10 rounded p-2 text-xs font-semibold text-white focus:outline-none focus:border-brand-red disabled:opacity-40"
                      >
                        <option value="">Select Model</option>
                        {MOTORCYCLES.find((m) => m.maker === selectedMaker)?.models.map((mod) => (
                          <option key={mod} value={mod}>{mod}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSaveGarage}
                      disabled={!selectedMaker || !selectedModel}
                      className="w-full bg-brand-red hover:bg-red-700 disabled:opacity-40 text-white py-3 rounded text-[10px] font-headings font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow"
                    >
                      Activate Fitment Filters <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
