"use client";

import { useState, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PackageOpen } from "lucide-react";
import ProductCard from "./product-card";
import useProductStore from "@/store/productStore";

// Animation Variants - Memoized implicitly as constants
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Memoized Product Item to prevent grid-jitter
const GridItem = memo(({ product }) => (
  <motion.div
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.2 }}
    className="h-full"
  >
    <Link href={`/products/${product._id}`}>
      <ProductCard product={product} />
    </Link>
  </motion.div>
));
GridItem.displayName = "GridItem";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selector optimization: avoid grabbing the whole store
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);

  // 1. useMemo: Derived Data Filtering
  // This replaces the useEffect and the filteredProducts state
  const displayedProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // 2. useCallback: Memoized clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  /* -------------------- LOADING STATE -------------------- */
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full"
        />
        <p className="mt-4 text-gray-400 font-medium">Curating your collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAFA] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Search Input (If you want it on this page as well) */}
        <div className="mb-8 max-w-md">
           <input 
             type="text"
             placeholder="Filter these results..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full px-6 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
           />
        </div>

        <AnimatePresence mode="wait">
          {displayedProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200"
            >
              <PackageOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800">No matches found</h3>
              <p className="text-gray-500 mb-6">Try a different keyword or color</p>
              <button onClick={clearSearch} className="px-6 py-2 bg-black text-white rounded-full text-sm">
                Reset Filter
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {displayedProducts.map((product) => (
                <GridItem key={product._id} product={product} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}