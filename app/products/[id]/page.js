"use client";
// pages/product.js
import { useState, use, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import useProductStore from "@/store/productStore";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ProductPage({ params }) {
  const { id } = use(params);

  

  // Local State
  const [selectedColor, setSelectedColor] = useState("olive");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [cartCount, setCartCount] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Zustand Store
  const { currentProduct: product, fetchProductById, isLoading } = useProductStore();

  // 1. Fetch Main Product via Zustand
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // 2. Fetch Related Products Locally
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:7000/api/products?limit=4`);
        const data = await res.json();
        if (data.success) {
          setRelatedProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error("Related products fetch failed:", error);
      }
    };
    fetchRelated();
  }, []);

  // 3. Cart Logic
  useEffect(() => {
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  const addToCart = (productToAdd) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item) => item._id === productToAdd._id);

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({ ...productToAdd, quantity: quantity, selectedColor, selectedSize });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    updateCartCount();
  };

  // 4. Loading Guard - IMPORTANT: Prevents crash while product is null
  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  // Helper for stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const colors = [
    { name: "olive", bg: "bg-green-700", selected: selectedColor === "olive" },
    { name: "forest", bg: "bg-green-800", selected: selectedColor === "forest" },
    { name: "navy", bg: "bg-blue-900", selected: selectedColor === "navy" },
  ];

  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const reviews = [
    { id: 1, name: "Samantha D.", rating: 4.5, date: "Aug 14, 2023", comment: "I absolutely love this shirt! Fabric feels so comfortable." },
    { id: 2, name: "Alex M.", rating: 4, date: "Aug 15, 2023", comment: "The colors are vibrant and the print quality is top-notch." }
  ];

  const faqs = [
    { question: "Is this product original?", answer: "Yes, 100% original and sourced from authorized distributors." },
    { question: "What is the return policy?", answer: "Return within 7 days if unused and in original packaging." }
  ];

  return (
    <>
      <Head>
        <title>{product.name} | Shop.co</title>
        <meta name="description" content={product.description || "Premium product"} />
      </Head>

      <div className="min-h-screen bg-white">
        <header className="bg-black text-white text-center py-2 text-sm">
          Sign up and get 20% off to your first order. <span className="underline cursor-pointer">Sign Up Now</span>
        </header>

        <Header/>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              <Image
                src={product.image || "/no-image.png"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(product.rating || 4.5)}</div>
                <span className="text-gray-600">{product.rating}/5</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">-{product.discount}%</span>
                )}
              </div>
              <p className="text-gray-600">{product.description || "Crafted from soft and breathable fabric, it offers superior comfort and style."}</p>

              <div>
                <h3 className="font-medium mb-3">Select Colors</h3>
                <div className="flex space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full ${color.bg} ${color.selected ? "ring-2 ring-black ring-offset-2" : ""}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Choose Size</h3>
                <div className="flex space-x-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-full ${selectedSize === size ? "bg-black text-white" : "border-gray-300 hover:border-black"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2">−</button>
                  <span className="px-4 py-2 font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2">+</button>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex space-x-8 border-b mb-8">
            {["details", "reviews", "faqs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 capitalize border-b-2 ${activeTab === tab ? "border-black text-black font-bold" : "border-transparent text-gray-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="border p-6 rounded-xl">
                  <div className="flex mb-2 text-yellow-400">{renderStars(r.rating)}</div>
                  <p className="font-bold">{r.name}</p>
                  <p className="text-gray-600 my-2">"{r.comment}"</p>
                  <p className="text-sm text-gray-400">Posted on {r.date}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="border p-4 rounded-lg cursor-pointer">
                  <summary className="font-bold">{f.question}</summary>
                  <p className="mt-2 text-gray-600">{f.answer}</p>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="max-w-7xl mx-auto px-4 py-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-12 uppercase">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link href={`/product/${rp._id}`} key={rp._id} className="group">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                  <Image src={rp.image || "/no-image.png"} alt={rp.name} fill className="object-contain p-4" />
                </div>
                <h3 className="font-bold truncate">{rp.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-bold">₹{rp.price}</span>
                  {rp.discount && <span className="text-red-500 text-sm">-{rp.discount}%</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}