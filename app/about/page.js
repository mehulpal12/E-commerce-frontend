"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { Target, Zap, Heart } from "lucide-react";
import Header from "@/components/header";

// 1. Memoize sub-components to prevent unnecessary re-renders
const ValueCard = memo(({ icon, title, desc }) => (
  <div className="space-y-4 p-8 border border-white/10 rounded-3xl hover:bg-white/5 transition group">
    <div className="transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
));
ValueCard.displayName = "ValueCard";

const TeamMember = memo(({ name, role, image }) => (
  <div className="text-center group">
    <div className="relative aspect-square rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-black transition-all">
      <Image 
        src={image} 
        alt={name} 
        fill 
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover grayscale group-hover:grayscale-0 transition duration-500" 
      />
    </div>
    <h4 className="font-bold text-lg">{name}</h4>
    <p className="text-sm text-gray-500">{role}</p>
  </div>
));
TeamMember.displayName = "TeamMember";

export default function AboutPage() {
  
  // 2. useMemo for static data arrays
  // This ensures the array reference is stable and doesn't trigger child re-renders
  const pillars = useMemo(() => [
    {
      icon: <Target className="text-blue-400" size={40} />,
      title: "Our Mission",
      desc: "To provide every individual with the confidence to express themselves through high-quality, accessible fashion."
    },
    {
      icon: <Zap className="text-yellow-400" size={40} />,
      title: "Fast Fashion, Refined",
      desc: "We bridge the gap between runway trends and everyday wear, delivering new drops faster than anyone else."
    },
    {
      icon: <Heart className="text-red-400" size={40} />,
      title: "Ethical Choice",
      desc: "We partner only with manufacturers who treat their workers with dignity and respect."
    }
  ], []);

  const team = useMemo(() => [
    { name: "Sarah Chen", role: "Creative Director", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300" },
    { name: "Marcus Thorne", role: "Head of Design", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300" },
    { name: "Elena Rodriguez", role: "Sourcing Lead", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300" },
    { name: "David Kim", role: "Chief Technologist", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300" }
  ], []);

  return (
    <div className="bg-white text-gray-900 font-sans">
      <Header />
      
      {/* HERO SECTION */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              WE BELIEVE <br /> 
              <span className="text-gray-300 italic">IN STYLE</span> <br /> 
              FOR ALL.
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Founded in 2023, SHOP.CO was born out of a simple realization: 
              high-end fashion should not come with high-end barriers.
            </p>
          </div>
          
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000" 
              alt="Our Workshop" 
              fill 
              priority // LCP Optimization: Loads this image first
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {pillars.map((pillar, index) => (
              <ValueCard key={index} {...pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-6 order-2 lg:order-1">
            <h2 className="text-4xl font-black">FROM A SMALL STUDIO TO A GLOBAL COMMUNITY</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>Our journey started with just three designers and a vision.</p>
              <p>Today, we serve over 30,000 customers worldwide.</p>
            </div>
          </div>
          
          {/* Collage Images with optimized sizes */}
          <div className="flex-1 grid grid-cols-2 gap-4 order-1 lg:order-2">
            <div className="space-y-4 mt-8">
               <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                 <Image src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=500" alt="Design" fill sizes="25vw" className="object-cover" />
               </div>
               <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                 <Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=500" alt="Store" fill sizes="25vw" className="object-cover" />
               </div>
            </div>
            <div className="space-y-4">
               <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                 <Image src="https://images.unsplash.com/photo-1556740734-7f9583451bf2?q=80&w=500" alt="Support" fill sizes="25vw" className="object-cover" />
               </div>
               <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                 <Image src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=500" alt="Logistics" fill sizes="25vw" className="object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black mb-4 uppercase">Meet the Makers</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
}