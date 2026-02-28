"use client";

import React, { useMemo, memo } from "react";
import Image from "next/image";
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Header from "../../../components/header";
import Link from "next/link";
import Footer from "@/components/footer";

// 1. Memoize the ProductCard to prevent re-renders when parent state changes
const ProductCard = memo(({ name, price, rating, image }) => {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[3/4] rounded-2xl bg-[#F0EEED] relative overflow-hidden mb-4">
        <Image 
          src={image} 
          alt={name} 
          fill 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <h3 className="font-bold text-lg mb-1 truncate">{name}</h3>
      <div className="flex items-center gap-1 mb-2">
        <Star size={14} className="fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating}/5</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">₹{price}</span>
      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

// 2. Memoize Badge items
const TrustBadge = memo(({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center text-center space-y-3">
    <div className="bg-white p-4 rounded-full shadow-sm">
      <Icon size={32} />
    </div>
    <h3 className="font-bold text-xl">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
));
TrustBadge.displayName = "TrustBadge";

export default function SalesPage() {
  // 3. useMemo for static data to prevent recreation on every render
  const newArrivals = useMemo(() => [
    { id: 1, name: "T-shirt with Tape Details", price: "120", rating: 4.5, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500" },
    { id: 2, name: "Skinny Fit Jeans", price: "240", rating: 3.5, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=500" },
    { id: 3, name: "Checkered Shirt", price: "180", rating: 4.8, image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=500" },
    { id: 4, name: "Sleeve Striped T-shirt", price: "130", rating: 4.2, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=500" },
  ], []);

  const trustBadges = useMemo(() => [
    { icon: Truck, title: "Fast & Free Shipping", desc: "On all orders over ₹999" },
    { icon: ShieldCheck, title: "Secure Payments", desc: "100% secure payment processing" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day money back guarantee" },
  ], []);

  return (
    <div className="bg-white text-gray-900 font-sans">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center bg-[#F2F0F1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 z-10">
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Browse through our diverse range of meticulously crafted garments, designed 
              to bring out your individuality and cater to your sense of style.
            </p>
            <Link href="/home" className="inline-block bg-black text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-transform hover:scale-105 shadow-xl">
              Shop Now
            </Link>

            <div className="flex gap-8 pt-8 border-t border-gray-200">
              <div><h3 className="text-3xl font-bold">200+</h3><p className="text-sm text-gray-500">International Brands</p></div>
              <div><h3 className="text-3xl font-bold">2,000+</h3><p className="text-sm text-gray-500">High-Quality Products</p></div>
              <div><h3 className="text-3xl font-bold">30,000+</h3><p className="text-sm text-gray-500">Happy Customers</p></div>
            </div>
          </div>
        </div>

        {/* Hero Image Optimization: Added 'priority' for LCP */}
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000"
            alt="Fashion Header"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
      </section>

      {/* 2. BRAND BAR */}
      <div className="bg-black py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-8 opacity-50 grayscale contrast-200">
          {["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"].map((brand) => (
            <span key={brand} className="text-white text-3xl font-serif font-bold italic">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* 3. NEW ARRIVALS */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-black text-center mb-12">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="border border-gray-200 px-12 py-3 rounded-full font-bold hover:bg-gray-50 transition">
            View All
          </button>
        </div>
      </section>

      {/* 4. TRUST BADGES */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustBadges.map((badge, index) => (
            <TrustBadge key={index} {...badge} />
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 -mb-20 relative z-20">
        <div className="bg-black rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            STAY UP TO DATE ABOUT <br /> OUR LATEST OFFERS
          </h2>
          <div className="w-full lg:w-96 space-y-4">
            <input className="w-full px-6 py-3 rounded-full outline-none" placeholder="Enter your email address" />
            <button className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-100 transition">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
    <div className="md:mt-32">
        <Footer/>
    </div>
    </div>
  );
}