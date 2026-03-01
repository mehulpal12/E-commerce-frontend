"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Head from "next/head";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import Header from "@/components/header";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ================= PRODUCT CARD ================= */

const ProductCard = memo(({ product, renderStars, getCloudinaryImage }) => (
  <div className="group cursor-pointer">
    <div className="aspect-square rounded-lg mb-4 overflow-hidden relative h-64 bg-gray-100">
      <Image
        src={getCloudinaryImage(product.image)}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    <h3 className="font-medium mb-2 group-hover:text-gray-600 transition truncate">
      {product.name}
    </h3>

    <div className="flex mb-2">
      {renderStars(product.rating)}
      <span className="text-sm text-gray-600 ml-2">{product.rating}/5</span>
    </div>

    <div className="flex items-center space-x-2">
      <span className="font-bold text-lg">${product.price}</span>

      {product.originalPrice && (
        <>
          <span className="text-gray-500 line-through">
            ${product.originalPrice}
          </span>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
            -{product.discount}%
          </span>
        </>
      )}
    </div>
  </div>
));
ProductCard.displayName = "ProductCard";

/* ================= MAIN PAGE ================= */

export default function CasualPage() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const categories = useMemo(
    () => ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"],
    [],
  );

  const getCloudinaryImage = useCallback((imageUrl) => {
    if (imageUrl?.startsWith("http")) return imageUrl;
    if (imageUrl) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      return `https://res.cloudinary.com/${cloudName}/image/upload/${imageUrl}`;
    }
    return "/placeholder-product.jpg";
  }, []);

  const renderStars = useCallback((rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          {i <= rating ? "★" : "☆"}
        </span>,
      );
    }
    return stars;
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      const matchesCategory = sortBy === "" || p.category === sortBy;

      return matchesPrice && matchesCategory;
    });
  }, [products, priceRange, sortBy]);

  return (
    <div className="overflow-hidden bg-white min-h-screen">
      <Head>
        <title>Casual Wear - Shop.co</title>
      </Head>

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Filters</h2>

              <div className="mb-8">
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2 text-sm font-bold">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium mb-4">Category</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Casual</h1>

              <div className="flex items-center gap-4">
                <p className="hidden sm:block text-gray-500 text-sm">
                  Showing {filteredProducts.length} Products
                </p>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                >
                  <ProductCard
                    product={product}
                    renderStars={renderStars}
                    getCloudinaryImage={getCloudinaryImage}
                  />
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No products found in this price range.
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2 text-sm font-bold">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium mb-4">Category</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-black text-white py-3 rounded-full font-medium"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
