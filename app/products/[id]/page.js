"use client";

import React, { useState, use, useEffect, useMemo, useCallback, memo } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import useProductStore from "@/store/productStore";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

// 1. Memoized Star Renderer
const Stars = memo(({ rating = 4.5 }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
});
Stars.displayName = "Stars";

// 2. Memoized Related Product Card - Corrected Image Handling
const RelatedProductCard = memo(({ rp }) => (
  <Link href={`/product/${rp._id}`} className="group">
    {/* Corrected: Removed object-contain p-4, added object-cover */}
    <div className="aspect-square bg-[#F0EEED] rounded-xl mb-4 relative overflow-hidden mx-2">
      <Image 
        src={rp.image || "/placeholder-product.jpg"} 
        alt={rp.name} 
        fill 
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300" // Fills space, no padding
      />
    </div>
    <h3 className="font-semibold font-sans truncate text-black group-hover:text-slate-700 transition-colors">
      {rp.name}
    </h3>
    <div className="flex items-center space-x-2 mt-1">
      <span className="font-bold text-black">₹{rp.price}</span>
      {rp.discount && <span className="text-red-500 text-sm">-{rp.discount}%</span>}
    </div>
  </Link>
));
RelatedProductCard.displayName = "RelatedProductCard";

export default function ProductPage({ params }) {
  
  const { id } = use(params);
   const router = useRouter();


  // Local State
  const [selectedColor, setSelectedColor] = useState("olive");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [cartCount, setCartCount] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Zustand Store
  const { currentProduct: product, fetchProductById, isLoading } = useProductStore();

  // 3. Fetch Logic
  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id, fetchProductById]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:7000/api/products?limit=4`);
        const data = await res.json();
        // Fallback data if API fails to show grid correction
        const fallbackProducts = [
          { _id: '1', name: 'Raw Edge Tee', price: '1499', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500' },
          { _id: '2', name: 'Classic Denim', price: '3299', discount: 10, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=500' },
          { _id: '3', name: 'Checkered Shirt', price: '2199', image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=500' },
          { _id: '4', name: 'Chino Shorts', price: '1799', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500' },
        ];
        if (data.success) {
          setRelatedProducts(data.products.slice(0, 4));
        } else {
          setRelatedProducts(fallbackProducts);
        }
      } catch (error) {
        console.error("Related products fetch failed:", error);
      }
    };
    fetchRelated();
  }, []);

  // 4. Cart Logic with useCallback
  const updateCartCount = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  useEffect(() => {
    updateCartCount();
  }, [updateCartCount]);

  const addToCart = useCallback((productToAdd) => {
    if (!productToAdd) return;
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item) => item._id === productToAdd._id);

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({ ...productToAdd, quantity, selectedColor, selectedSize });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    updateCartCount();
    router.push("/cart")

  }, [quantity, selectedColor, selectedSize, updateCartCount]);

  // 5. Memoized Static Constants
  const colors = useMemo(() => [
    { name: "olive", bg: "bg-green-700" },
    { name: "forest", bg: "bg-green-800" },
    { name: "navy", bg: "bg-blue-900" },
  ], []);

  const sizes = useMemo(() => ["Small", "Medium", "Large", "X-Large"], []);

  // Guard Clause
  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} | Shop.co</title>
      </Head>

      <div className="min-h-screen bg-white text-black">
        <Header cartCount={cartCount} />

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Main Product Image Correction */}
            {/* Corrected: Removed object-contain p-4, added object-cover */}
            <div className="aspect-square bg-[#F0EEED] rounded-2xl overflow-hidden relative">
              <Image
                src={product.image || "/placeholder-product.jpg"}
                alt={product.name}
                fill
                priority // Priority for LCP
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover " // Fills space perfectly
              />
            </div>

            {/* Info Section */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl  tracking-tighter font-semibold font-sans">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <Stars rating={product.rating} />
                <span className="text-gray-600 font-medium">{product.rating}/5</span>
              </div>
              
              <div className="flex items-center space-x-3 text-3xl font-semibold font-sans">
                <span>₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                    </span>
                )}
              </div>
              
              <p className="text-slate-600 leading-relaxed">{product.description || "Soft, breathable fabric for superior comfort and style."}</p>

              {/* Size Selection */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-slate-500 mb-3 font-medium">Choose Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border rounded-full font-medium transition ${selectedSize === size ? "bg-black text-white border-black" : "bg-[#F0F0F0] border-[#F0F0F0] text-slate-700 hover:border-slate-300"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and CTA */}
              <div className="flex space-x-4 pt-8 border-t border-slate-100">
                <div className="flex items-center border border-gray-100 rounded-full bg-[#F0F0F0]">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-6 py-4 text-xl">−</button>
                  <span className="px-4 font-bold w-16 text-center text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-6 py-4 text-xl">+</button>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition transform active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-12">
            {activeTab === "reviews" && <ReviewsGrid />}
            {activeTab === "faqs" && <FAQSection />}
            {activeTab === "details" && <div className="text-slate-600 p-4">{product.description || "Product details go here."}</div>}
          </div>
        </div>

        {/* Related Products Grid */}
        <section className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-100">
          <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-tighter">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((rp) => (
              <RelatedProductCard key={rp._id} rp={rp} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

// Sub-components to keep the main render tree clean
const TabHeader = memo(({ activeTab, setActiveTab }) => (
  <div className="flex justify-between border-b border-slate-100">
    {["details", "reviews", "faqs"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 py-5 capitalize border-b-2 transition text-lg ${activeTab === tab ? "border-black text-black font-semibold" : "border-transparent text-slate-500 hover:text-black"}`}
      >
        {tab}
      </button>
    ))}
  </div>
));
TabHeader.displayName = "TabHeader";

// Static sections moved out to avoid re-renders
const ReviewsGrid = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Reviews Data Mapping */}
    <div className="border border-slate-100 p-8 rounded-2xl bg-white shadow-sm">
      <Stars rating={5} />
      <p className="font-bold mt-4 text-lg">Samantha D.</p>
      <p className="text-slate-600 my-3 leading-relaxed">"I absolutely love this shirt! Fabric feels so comfortable. As a UX designer, I appreciate the attention to detail."</p>
      <p className="text-sm text-slate-400 mt-6">Posted on August 14, 2023</p>
    </div>
    <div className="border border-slate-100 p-8 rounded-2xl bg-white shadow-sm">
      <Stars rating={4} />
      <p className="font-bold mt-4 text-lg">Alex M.</p>
      <p className="text-slate-600 my-3 leading-relaxed">"The colors are vibrant and the print quality is top-notch. It fits perfectly."</p>
      <p className="text-sm text-slate-400 mt-6">Posted on August 15, 2023</p>
    </div>
  </div>
));
ReviewsGrid.displayName = "ReviewsGrid";

const FAQSection = memo(() => (
  <div className="space-y-4 max-w-3xl mx-auto">
    <details className="border border-slate-100 p-6 rounded-xl cursor-pointer bg-white shadow-sm group">
      <summary className="font-bold text-lg flex justify-between items-center text-black">
        Is this product original?
        <span className="text-2xl transition-transform group-open:rotate-180">+</span>
      </summary>
      <p className="mt-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
        Yes, 100% original and sourced from authorized distributors.
      </p>
    </details>
    <details className="border border-slate-100 p-6 rounded-xl cursor-pointer bg-white shadow-sm group">
      <summary className="font-bold text-lg flex justify-between items-center text-black">
        What is the return policy?
        <span className="text-2xl transition-transform group-open:rotate-180">+</span>
      </summary>
      <p className="mt-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
        Return within 7 days if unused and in original packaging.
      </p>
    </details>
  </div>
));
FAQSection.displayName = "FAQSection";