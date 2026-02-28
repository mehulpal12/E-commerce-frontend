"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { Search, ExternalLink, ArrowUpRight } from "lucide-react";
import Header from "@/components/header";

// 1. Move Static Data outside the component to prevent recreation
const BRAND_DATA = [
  { id: 1, name: "Adidas", logo: "https://images.unsplash.com/photo-1511746310427-edad785e417a?q=80&w=200", count: 142, category: "Sportswear" },
  { id: 2, name: "Calvin Klein", logo: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=200", count: 85, category: "Luxury" },
  { id: 3, name: "Diesel", logo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200", count: 64, category: "Denim" },
  { id: 4, name: "Gucci", logo: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=200", count: 31, category: "Premium" },
  { id: 5, name: "Nike", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200", count: 210, category: "Sportswear" },
  { id: 6, name: "Prada", logo: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200", count: 42, category: "Luxury" },
  { id: 7, name: "Zara", logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200", count: 540, category: "Fast Fashion" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const TIERS = ['Luxury', 'Sportswear', 'Sustainable', 'Streetwear'];

// 2. Memoize individual Brand Cards
// This prevents re-rendering all 7+ cards while the user is just typing in the search box
const BrandCard = memo(({ brand }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-square rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-8 transition-all hover:shadow-xl hover:-translate-y-1">
      <Image 
        src={brand.logo} 
        alt={brand.name} 
        fill 
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-contain p-10 opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
    </div>
    
    <div className="mt-4 flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold">{brand.name}</h3>
        <p className="text-sm text-gray-400 font-medium">{brand.category}</p>
      </div>
      <span className="bg-gray-100 text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase">
        {brand.count} Items
      </span>
    </div>
  </div>
));
BrandCard.displayName = "BrandCard";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // 3. useMemo for filtered results
  // Only re-calculates when searchTerm changes, not on any other state update
  const filteredBrands = useMemo(() => {
    return BRAND_DATA.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 4. useCallback for the change handler
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header/>
      
      {/* HEADER SECTION */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">OUR BRANDS</h1>
          
          <div className="max-w-md mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition" size={20} />
            <input 
              type="text" 
              placeholder="Search for a brand..." 
              className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-white transition"
              onChange={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* ALPHABET NAVIGATION */}
      <nav className="sticky top-0 bg-white border-b z-30 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between gap-2 min-w-max">
          {ALPHABET.map(letter => (
            <button key={letter} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black hover:text-white transition font-bold text-sm">
              {letter}
            </button>
          ))}
        </div>
      </nav>

      {/* FEATURED BRANDS GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black">POPULAR PARTNERS</h2>
          <button className="text-black font-bold flex items-center gap-1 border-b-2 border-black pb-1">
            View All <ArrowUpRight size={18}/>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
        
        {filteredBrands.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No brands found matching "{searchTerm}"
          </div>
        )}
      </section>

      {/* BRAND DIRECTORY */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {TIERS.map(tier => (
              <TierList key={tier} tier={tier} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// 5. Separate and Memoize the static Directory lists
const TierList = memo(({ tier }) => (
  <div>
    <h4 className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase mb-6">{tier}</h4>
    <ul className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <li key={i} className="flex items-center gap-2 group cursor-pointer hover:text-black text-gray-600 font-medium">
          <span>{tier} Label {i}</span>
          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </li>
      ))}
    </ul>
  </div>
));
TierList.displayName = "TierList";