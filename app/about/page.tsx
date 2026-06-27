"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bike, Wrench, ShieldCheck, Activity, Flame, Zap, 
  ChevronRight, Calendar, Award, TrendingUp, Gauge, 
  Wind, Thermometer, Volume2, ArrowRight, UserCheck 
} from "lucide-react";

// Team profiles with individual custom statistics
const TEAM_MEMBERS = [
  {
    name: "Vikram Singh",
    role: "Lead Tuner & Co-Founder",
    bio: "Ex-race mechanic with 12 years of dyno tuning expertise. Specializes in multi-map ECU calibration and engine fluid dynamics.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    ride: "KTM Duke 390 (Race Prep)",
    skills: [
      { label: "ECU Calibration", value: 98 },
      { label: "Engine Blueprinting", value: 92 },
      { label: "Track Dynamics", value: 85 }
    ],
    favoriteUpgrade: "FuelX Pro Piggyback Tuner"
  },
  {
    name: "Rehan Irani",
    role: "Chief Engineer & Co-Founder",
    bio: "Mechanical Engineer from IIT. Focused on fluidics, optimizing volumetric intake efficiency, and mechanical stress modeling.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    ride: "RE Interceptor 650 (Stage 3)",
    skills: [
      { label: "Fluid Dynamics", value: 96 },
      { label: "Stress Analysis", value: 88 },
      { label: "Component Sourcing", value: 94 }
    ],
    favoriteUpgrade: "BMC Italian High-Flow Filter"
  }
];

// Milestones data
const MILESTONES = [ 
  {
    year: "2018",
    title: "The Single-Cylinder Garage",
    description: "Started in a 120 sq ft garage in Mumbai. Rebuilding single-cylinder race motors and hand-carving airbox mods for track-bound KTMs.",
    badge: "Origin Story"
  },
  {
    year: "2020",
    title: "Chassis Dyno Installation",
    description: "Imported our first industrial eddy-current chassis dynamometer. Validated real-world horsepower and torque curves to strip out cheap clones.",
    badge: "Dyno Validation"
  },
  {
    year: "2022",
    title: "Italian Import Alliance",
    description: "Partnered directly with BMC Air Filters Italy. Began importing Formula 1 filtration engineering for Indian performance engines.",
    badge: "Global Partnerships"
  },
  {
    year: "2024",
    title: "Algorithmic Rider Garage",
    description: "Built our proprietary digital compatibility engine. Made it simple for riders to save their specific model and filter out non-fitting components.",
    badge: "Platform Launch"
  },
  {
    year: "2026",
    title: "India's Performance Hub",
    description: "Currently shipping racing air filters, ECU tuners, and ECE 22.06 certified helmets to over 80,000 riders across the country.",
    badge: "Present Day"
  }
];

// Crew Card component with 3D hover effect
function CrewCard({ member }: { member: typeof TEAM_MEMBERS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 15; // Max 15 degree rotation
    const rY = (mouseX / width) * 15;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#181818] border border-white/10 rounded-xl p-6 transition-all duration-300 shadow-2xl select-none"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Glossy card overlay shine effect */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
        style={{ transform: "translateZ(20px)" }}
      />

      <div className="flex flex-col md:flex-row gap-6 items-center" style={{ transform: "translateZ(30px)" }}>
        {/* Profile Image */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-brand-red flex-shrink-0 shadow-lg">
          <Image 
            src={member.image} 
            alt={member.name} 
            fill 
            className="object-cover"
          />
        </div>

        {/* Member Details */}
        <div className="flex-1 w-full text-center md:text-left space-y-2.5">
          <div>
            <span className="text-[10px] font-headings font-bold text-brand-red uppercase tracking-widest bg-brand-red/10 border border-brand-red/25 px-2.5 py-0.5 rounded-full inline-block">
              {member.role}
            </span>
            <h3 className="text-xl font-headings font-extrabold text-white mt-1 uppercase">
              {member.name}
            </h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed font-body">
            {member.bio}
          </p>
          <div className="text-[11px] font-body text-gray-300 bg-white/[0.03] border border-white/5 p-2 rounded flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Active Ride:</span>
            <span className="font-bold text-white uppercase">{member.ride}</span>
          </div>
        </div>
      </div>

      {/* Engineer Stats Section */}
      <div className="mt-6 pt-6 border-t border-white/5 space-y-4" style={{ transform: "translateZ(40px)" }}>
        <h4 className="text-[10px] font-headings font-bold text-gray-500 uppercase tracking-widest text-center md:text-left">
          Telemetry Profile
        </h4>
        <div className="space-y-3">
          {member.skills.map((skill) => (
            <div key={skill.label} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">{skill.label}</span>
                <span className="text-brand-red font-mono">{skill.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#121212] border border-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="h-full bg-brand-red"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-red/5 border border-brand-red/20 p-3 rounded flex items-center justify-between text-xs mt-3.5">
          <span className="text-gray-400 font-semibold">Signature Spec:</span>
          <span className="text-brand-red font-bold font-headings uppercase text-[10px] tracking-wide">
            {member.favoriteUpgrade}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [rpm, setRpm] = useState(1500); // Idle RPM
  const [timelineIndex, setTimelineIndex] = useState(MILESTONES.length - 1);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic values calculated from the throttle (RPM)
  const isRedline = rpm >= 9000;
  const speed = Math.round(20 + (rpm - 1500) * (180 / 9500)); // speed up to 200 km/h
  const fuelRate = (0.2 + (rpm - 1500) * (3.8 / 9500)).toFixed(2); // fuel flow in mL/s
  const boostPressure = (101.3 + (rpm - 1500) * (14.5 / 9500)).toFixed(1); // manifold kPa
  const cylTemp = Math.round(90 + (rpm - 1500) * (190 / 9500)); // cylinder Celsius

  // Flow comparison
  // OEM paper filters choke early, BMC flows linearly and keeps engine breathing
  const oemFlow = Math.round(30 + (rpm - 1500) * (180 / 9500) * (rpm > 6500 ? 0.45 : 0.85));
  const bmcFlow = Math.round(32 + (rpm - 1500) * (260 / 9500) * (rpm > 8500 ? 0.95 : 1.0));
  const performanceIncrease = Math.max(0, Math.round(((bmcFlow - oemFlow) / oemFlow) * 100));

  // Audio simulation beep on redline (using synthetic web audio api to avoid loading asset issues)
  useEffect(() => {
    if (isRedline && typeof window !== "undefined") {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(320, audioContext.currentTime); // low pitch engine buzz
      gainNode.gain.setValueAtTime(0.015, audioContext.currentTime); // soft background volume
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      
      const timeout = setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 120);

      return () => clearTimeout(timeout);
    }
  }, [rpm, isRedline]);

  return (
    <main className="flex-1 w-full bg-[#121212] text-white pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Grid Blueprints */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Cinematic Glowing Background spots */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-28">
        
        {/* ================= HERO INTRO SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 lg:pt-16 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-brand-red" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-red font-headings">
                Under the Hood
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-headings font-extrabold tracking-tight uppercase leading-[0.95]">
              BORN IN THE GARAGE.<br />
              <span className="text-brand-red">TUNED FOR THE STREET.</span>
            </h1>

            <p className="text-gray-300 font-body text-sm sm:text-base leading-relaxed max-w-xl">
              At Irani MotoHub, we don&apos;t simply retail parts. We re-engineer the riding experience. 
              Founded by mechanical engineers and dyno-tuners, we specialize in high-performance intake upgrades, 
              precision ECU tuning, and certified riding safety gear. Every manufacturer on our digital shelf undergoes 
              rigorous simulation and dyno validation, guaranteeing absolute fitment and uncompromising power output.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <span className="font-headings font-extrabold text-2xl text-white">100%</span>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Dyno-Verified Geniuneness</p>
              </div>
              <div className="space-y-1">
                <span className="font-headings font-extrabold text-2xl text-white">80K+</span>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Performance Shipments</p>
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="font-headings font-extrabold text-2xl text-white">24/7</span>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Engineer Support</p>
              </div>
            </div>
          </div>

          {/* Hero Visual: Technical Blueprint Grid */}
          <div className="lg:col-span-5 relative bg-[#181818]/60 border border-white/10 rounded-xl p-8 h-[360px] flex items-center justify-center overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />
            
            {/* Spinning Mechanical Badge */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full text-brand-red/10 animate-[spin_50s_linear_infinite]" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
                <path d="M 50 2 A 48 48 0 0 1 98 50" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              
              <div className="absolute flex flex-col items-center text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red">
                  <Wrench className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-headings font-extrabold text-sm uppercase text-white tracking-wide">
                    FITMENT ASSURED
                  </h3>
                  <p className="text-[10px] font-body text-gray-500 leading-normal mt-1">
                    All components are certified via physical rider garage testing profiles before checkout matches.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ================= THE THROTTLE SIMULATOR (CRAZY UX) ================= */}
        <section className="bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#121212] px-2.5 py-1 border border-white/5 rounded text-[8px] font-mono text-gray-500 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-brand-red animate-pulse" /> Telemetry Active
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Box: Controls & Text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-headings font-bold text-brand-red uppercase tracking-widest">
                  Live Intake Bench Test
                </span>
                <h2 className="text-2xl sm:text-3xl font-headings font-extrabold text-white uppercase tracking-tight leading-none">
                  REV THE ENGINE.<br />FEEL THE AIRFLOW.
                </h2>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-body">
                We benchmark filter permeability using mass airflow sensors. Drag the throttle handle below to rev the engine: watch how a standard OEM paper filter chokes at higher RPMs, while a BMC Italian high-flow cotton filter maintains a linear breathing pattern.
              </p>

              {/* Linear Throttle Slider */}
              <div className="bg-[#121212] border border-white/5 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center text-xs font-headings font-extrabold uppercase">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Volume2 className={`w-3.5 h-3.5 ${isRedline ? "text-brand-red animate-bounce" : "text-gray-500"}`} /> 
                    Throttle Position
                  </span>
                  <span className={`${isRedline ? "text-brand-red animate-pulse" : "text-white"} font-mono`}>
                    {Math.round(((rpm - 1500) / 9500) * 100)}%
                  </span>
                </div>

                {/* Slider Input */}
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="1500"
                    max="11000"
                    step="50"
                    value={rpm}
                    onChange={(e) => setRpm(Number(e.target.value))}
                    className="w-full h-2 bg-[#181818] border border-white/10 rounded-lg appearance-none cursor-pointer accent-brand-red focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-gray-600 mt-2">
                    <span>1,500 RPM (IDLE)</span>
                    <span className="text-brand-red/50">9,000 REDLINE</span>
                    <span>11,000 RPM (LIMIT)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Benefits Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={performanceIncrease}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-brand-red/25 bg-brand-red/5 p-4 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-headings font-bold uppercase text-white tracking-wide">
                      BMC Flow Performance
                    </h4>
                    <p className="text-[10px] text-gray-400 font-body">
                      {rpm < 4000 ? "Quiet cruise, optimal intake charge density." : 
                       rpm < 8000 ? "Volumetric efficiency rises. High-speed fluid transition." :
                       "Maximum peak power curve stabilization. OEM filter is choking."}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl font-headings font-extrabold text-brand-red block leading-none">
                      +{performanceIncrease}%
                    </span>
                    <span className="text-[7.5px] font-mono text-gray-500 uppercase font-bold tracking-wider">
                      CFM Airflow Gain
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Box: The HUD Cockpit Dash (UX WOW factor) */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-inner">
              
              {/* Telemetry LED Grid Background */}
              <div 
                ref={particleContainerRef}
                className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#B91C1C_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: 0.04 + (rpm - 1500) * (0.16 / 9500)
                }}
              />

              {/* Digital Dash Cluster */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {/* RPM Cluster */}
                <div className="bg-[#181818] border border-white/5 p-3.5 rounded-lg flex flex-col justify-center">
                  <span className="text-[7.5px] font-headings font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-brand-red" /> Tachometer
                  </span>
                  <span className={`text-xl font-mono font-bold mt-1.5 leading-none ${isRedline ? "text-brand-red animate-pulse" : "text-white"}`}>
                    {rpm.toLocaleString()}
                  </span>
                  <span className="text-[7px] text-gray-600 font-mono mt-0.5">RPM</span>
                </div>

                {/* Speed Cluster */}
                <div className="bg-[#181818] border border-white/5 p-3.5 rounded-lg flex flex-col justify-center">
                  <span className="text-[7.5px] font-headings font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-brand-red" /> Est. Velocity
                  </span>
                  <span className="text-xl font-mono font-bold mt-1.5 leading-none text-white">
                    {speed}
                  </span>
                  <span className="text-[7px] text-gray-600 font-mono mt-0.5">KM/H</span>
                </div>

                {/* Intake Volume Air Velocity */}
                <div className="bg-[#181818] border border-white/5 p-3.5 rounded-lg flex flex-col justify-center">
                  <span className="text-[7.5px] font-headings font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Wind className="w-3 h-3 text-brand-red" /> Mass Flow
                  </span>
                  <span className="text-xl font-mono font-bold mt-1.5 leading-none text-white">
                    {bmcFlow}
                  </span>
                  <span className="text-[7px] text-gray-600 font-mono mt-0.5">CFM (BMC)</span>
                </div>

                {/* Cylinder Temp */}
                <div className="bg-[#181818] border border-white/5 p-3.5 rounded-lg flex flex-col justify-center">
                  <span className="text-[7.5px] font-headings font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-brand-red" /> Cylinder Temp
                  </span>
                  <span className={`text-xl font-mono font-bold mt-1.5 leading-none text-white ${cylTemp > 240 ? "text-amber-500" : "text-white"}`}>
                    {cylTemp}°C
                  </span>
                  <span className="text-[7px] text-gray-600 font-mono mt-0.5">Engine Core</span>
                </div>
              </div>

              {/* Dynamic Live Graph Bars */}
              <div className="mt-8 space-y-4 relative z-10">
                <h4 className="text-[9px] font-headings font-bold text-gray-400 uppercase tracking-widest">
                  Real-time Airflow Comparison Bench
                </h4>
                
                <div className="space-y-3 bg-[#181818]/80 border border-white/5 p-4 rounded-lg">
                  {/* BMC Filter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold">
                      <span className="text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-red inline-block" />
                        BMC Italian Cotton Filter
                      </span>
                      <span className="font-mono text-brand-red">{bmcFlow} CFM</span>
                    </div>
                    <div className="h-2 w-full bg-[#121212] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-red transition-all duration-150 ease-out"
                        style={{ width: `${Math.min(100, (bmcFlow / 320) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* OEM Paper Filter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />
                        OEM Stock Paper Filter
                      </span>
                      <span className="font-mono text-gray-400">{oemFlow} CFM</span>
                    </div>
                    <div className="h-2 w-full bg-[#121212] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-500 transition-all duration-150 ease-out"
                        style={{ width: `${Math.min(100, (oemFlow / 320) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Diagnostic Console Log */}
              <div className="mt-6 bg-[#0c0c0c] border border-white/5 rounded p-3 font-mono text-[9px] text-gray-400 relative z-10 flex flex-col md:flex-row md:justify-between gap-2">
                <div>
                  <span className="text-brand-red font-bold animate-pulse">●</span> STATUS: {isRedline ? "WARNING: LIMIT LIMITER ACTIVE" : "STABLE COMPRESSION RATE"}
                </div>
                <div className="flex gap-4">
                  <span>FUEL FEED: <strong className="text-white">{fuelRate} mL/s</strong></span>
                  <span>ABS PRESSURE: <strong className="text-white">{boostPressure} kPa</strong></span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= MILITARY BRAND STANDARDS (WHAT WE RIDE) ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-2.5">
            <span className="text-[10px] font-headings font-bold text-brand-red uppercase tracking-[0.25em]">
              The Core Checklist
            </span>
            <h2 className="text-3xl sm:text-4xl font-headings font-extrabold uppercase text-white tracking-tight">
              OUR CURATION PHILOSOPHY
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto font-body">
              We do not catalog generic spares. We check engineering compliance values against four performance parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#181818] border border-white/10 p-6 rounded-xl hover:border-brand-red/50 transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-headings font-extrabold text-sm text-white uppercase mt-4.5 tracking-wide">
                Intake Permeability
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mt-2 font-body">
                We select cotton mesh matrices with a minimum efficiency index filtering to 7 microns. Cotton fiber holds oil charges that intercept microscopic particles without closing the airway.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#181818] border border-white/10 p-6 rounded-xl hover:border-brand-red/50 transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-headings font-extrabold text-sm text-white uppercase mt-4.5 tracking-wide">
                Calibrated Remapping
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mt-2 font-body">
                ECU sub-computers like FuelX modules must carry adaptive altitude calibration. We ensure every tuner maps stoichiometry continuously to prevent lean overheating.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#181818] border border-white/10 p-6 rounded-xl hover:border-brand-red/50 transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-headings font-extrabold text-sm text-white uppercase mt-4.5 tracking-wide">
                Structural Shielding
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mt-2 font-body">
                All riding gear and helmets cataloged must meet ECE 22.06 or CE Level 2 credentials. Impact absorption values are mathematically checked to deliver premium brain and joint security.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#181818] border border-white/10 p-6 rounded-xl hover:border-brand-red/50 transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-headings font-extrabold text-sm text-white uppercase mt-4.5 tracking-wide">
                Shear-Stable Lubrication
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mt-2 font-body">
                We supply ester-core synthetic lubricants with extreme viscosity indexes. This preserves engine film strength even under 14,000 RPM track shear pressure at 160°C engine block heat.
              </p>
            </div>

          </div>
        </section>

        {/* ================= CHRONICLES OF SPEED (TIMELINE) ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Timeline Description */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-brand-red" />
              <span className="text-[10px] font-headings font-bold text-brand-red uppercase tracking-[0.2em]">
                Our Milestones
              </span>
            </div>
            <h2 className="text-3xl font-headings font-extrabold text-white uppercase leading-none tracking-tight">
              THE CHRONICLES<br />OF SPEED
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-body leading-relaxed">
              Explore how a two-man performance workshop evolved into India&apos;s leading digital motorcycle tuner. Click on any milestone year to review our progress parameters.
            </p>

            {/* Quick selector buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {MILESTONES.map((item, idx) => (
                <button
                  key={item.year}
                  onClick={() => setTimelineIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-headings font-extrabold border rounded transition-all duration-200 ${
                    timelineIndex === idx 
                      ? "bg-brand-red border-brand-red text-white" 
                      : "bg-[#181818] border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
          </div>

          {/* Active Timeline Panel Display */}
          <div className="lg:col-span-8 bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 relative min-h-[260px] flex flex-col justify-between shadow-2xl overflow-hidden">
            
            {/* Corner Year Stamp Background */}
            <div className="absolute right-0 bottom-0 text-[120px] sm:text-[180px] font-headings font-extrabold text-white/[0.015] leading-none select-none pointer-events-none translate-y-12 translate-x-6">
              {MILESTONES[timelineIndex].year}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={timelineIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest bg-brand-red/10 border border-brand-red/20 px-2.5 py-0.5 rounded-full font-bold">
                    {MILESTONES[timelineIndex].badge}
                  </span>
                  <span className="text-xs text-gray-500 font-bold font-headings">{MILESTONES[timelineIndex].year} MILESTONE</span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-2xl font-headings font-extrabold text-white uppercase tracking-tight">
                    {MILESTONES[timelineIndex].title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-2xl font-body">
                    {MILESTONES[timelineIndex].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls at bottom */}
            <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-8 relative z-10">
              <button
                disabled={timelineIndex === 0}
                onClick={() => setTimelineIndex(prev => Math.max(0, prev - 1))}
                className="text-xs font-headings font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-gray-500"
              >
                ← Back
              </button>
              
              <span className="text-[10px] font-mono text-gray-500 font-bold">
                {timelineIndex + 1} OF {MILESTONES.length}
              </span>

              <button
                disabled={timelineIndex === MILESTONES.length - 1}
                onClick={() => setTimelineIndex(prev => Math.min(MILESTONES.length - 1, prev + 1))}
                className="text-xs font-headings font-bold uppercase tracking-wider text-brand-red hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-brand-red flex items-center gap-1"
              >
                Next Step →
              </button>
            </div>

          </div>

        </section>

        {/* ================= THE PIT CREW (TEAM 3D CARDS) ================= */}
        <section className="space-y-12">
          
          <div className="text-center space-y-2.5">
            <span className="text-[10px] font-headings font-bold text-brand-red uppercase tracking-[0.25em]">
              The Engineers
            </span>
            <h2 className="text-3xl sm:text-4xl font-headings font-extrabold uppercase text-white tracking-tight">
              MEET THE PIT CREW
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto font-body">
              Every upgrade on our store is backed by mechanical engineers. Here are the minds checking fitment tolerances.
            </p>
          </div>

          {/* 3D Cards container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TEAM_MEMBERS.map((member) => (
              <CrewCard key={member.name} member={member} />
            ))}
          </div>

        </section>

        {/* ================= ELEVATED CTA SECTION ================= */}
        <section className="border border-white/10 rounded-2xl p-8 sm:p-12 relative overflow-hidden bg-cover bg-center text-center shadow-2xl flex flex-col items-center justify-center space-y-6"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(18,18,18,0.95), rgba(18,18,18,0.98)), url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop')"
          }}
        >
          <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/35 flex items-center justify-center text-brand-red mb-2 animate-pulse">
            <Bike className="w-6 h-6" />
          </div>

          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-headings font-extrabold uppercase text-white tracking-tight leading-none">
              READY TO RE-ENGINEER<br />YOUR BIKE?
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-body leading-relaxed">
              Verify compatibility using our digital Rider Garage configuration engine or browse our curated collections of imported race parts and helmets.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10">
            <Link
              href="/collections/performance-air-filters"
              className="bg-brand-red hover:bg-white hover:text-[#121212] text-white px-8 py-3.5 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center gap-2 group rounded-sm"
            >
              Configure Parts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/"
              className="border border-white/20 hover:border-white hover:bg-white/5 text-white px-8 py-3.5 font-headings text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm"
            >
              Back to Home
            </Link>
          </div>

        </section>

      </div>
    </main>
  );
}
