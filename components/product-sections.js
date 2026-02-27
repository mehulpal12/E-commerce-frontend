"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, PackageOpen } from "lucide-react";
import ProductCard from "./product-card";
import useProductStore from "@/store/productStore";

// Animation for each product card (viewport-based)
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ProductsPage() {

    
  // product list is stored globally in zustand
  const { products, isLoading } = useProductStore();
  console.log(products);
  

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(`${API_URL}/api/products?limit=20`);
  //     if (!res.ok) throw new Error("Failed to fetch products");

  //     const data = await res.json();
  //     const list = data.products || [];
  //     setProducts(list);
  //     setFilteredProducts(list);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSearch = (value) => {
    setSearchQuery(value);

    const filtered = (products || []).filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.description?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(filtered);
  };
    useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  
  /* -------------------- LOADING STATE -------------------- */
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-white">
  //       <motion.div
  //         animate={{ rotate: 360 }}
  //         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  //         className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full"
  //       />
  //       <p className="mt-4 text-gray-500 font-medium animate-pulse">
  //         Loading products...
  //       </p>
  //     </div>
  //   );
  // }

  // show a spinner or message while initial load
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full"
        />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  // no products at all (fetch finished but returned empty)
  if (!isLoading && products.length === 0) {
    return <div className="p-4">No products found.</div>;
  }

  /* -------------------- ERROR STATE -------------------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // ensure filtered list mirrors products if user hasn't typed a query

  return (
    <div className="min-h-screen bg-[#FBFAFA] pb-20">

      {/* ================= PRODUCT GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence>
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1.5, y: 0 }}
              viewport={{ amount: 0.2 }}  
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
            >
              <PackageOpen size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search
              </p>
              <button
                onClick={() => handleSearch("")}
                className="underline font-bold"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  className="h-full"
                >
                  <Link href={`/products/${product._id}`}>
                    <ProductCard product={product} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
