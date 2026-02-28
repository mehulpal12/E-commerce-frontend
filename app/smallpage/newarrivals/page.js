"use client";

import React, { useMemo, memo, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Filter, ChevronDown, X } from "lucide-react";
import Header from "@/components/header";

// 1. Memoized Product Card
const ProductCard = memo(({ product, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-2xl bg-[#F0EEED] overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={index < 4}
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10">
            New
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-lg truncate group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}/5</span>
        </div>
        <p className="text-xl font-bold">₹{product.price}</p>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

export default function NewArrivalsPage() {
  // --- STATE ---
  const [displayLimit, setDisplayLimit] = useState(3);
  const [activeCategory, setActiveCategory] = useState("All");

  // --- DATA ---
  // Using reliable Unsplash IDs to ensure images load
  const allProducts = useMemo(() => [
    { id: 1, category: "Tees", name: "Oversized Heavyweight Tee", price: "1,499", rating: 4.9, isNew: true, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" },
    { id: 2, category: "Outerwear", name: "Raw Edge Denim Jacket", price: "4,299", rating: 4.7, isNew: true, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80" },
    { id: 3, category: "Bottoms", name: "Relaxed Fit Chinos", price: "2,800", rating: 4.5, isNew: true, image: "https://images.unsplash.com/photo-1611042553484-d61f84d22784?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 4, category: "Bottoms", name: "Urban Utility Cargoes", price: "3,500", rating: 4.8, isNew: true, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80" },
    { id: 5, category: "Tees", name: "Vintage Wash Hoodie", price: "2,200", rating: 4.6, isNew: true, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80" },
    { id: 6, category: "Tees", name: "Minimalist Linen Shirt", price: "1,800", rating: 4.4, isNew: true, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
  ], []);

  const categories = ["All", "Tees", "Outerwear", "Bottoms"];

  // --- LOGIC ---
  const filteredProducts = useMemo(() => {
    const filtered = activeCategory === "All" 
      ? allProducts 
      : allProducts.filter(p => p.category === activeCategory);
    return filtered.slice(0, displayLimit);
  }, [allProducts, activeCategory, displayLimit]);

  const handleLoadMore = useCallback(() => {
    setDisplayLimit(prev => prev + 3);
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setDisplayLimit(3); // Reset limit when filter changes
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b pb-8">
          <div className="space-y-2">
            <p className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase">Spring Summer 2026</p>
            <h1 className="text-5xl font-black tracking-tighter">NEW ARRIVALS</h1>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  activeCategory === cat 
                  ? "bg-black text-white border-black" 
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* LOAD MORE LOGIC */}
        {displayLimit < allProducts.filter(p => activeCategory === "All" || p.category === activeCategory).length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-12 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Load More Products
            </button>
          </motion.div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-medium">
            No products found in this category.
          </div>
        )}
      </main>
    </div>
  );
}