"use client";

// pages/products.js - Fetch from API + Cloudinary Images

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "./product-card";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch products from backend API on component mount
  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, []);

  // Fetch products from your backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from your backend
      const response = await fetch("http://localhost:7000/api/products/");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Expected API response format:
      // [
      //   {
      //     id: 1,
      //     name: "Product Name",
      //     price: 145,
      //     size: "Large",
      //     color: "White",
      //     image: "cloudinary_url_or_public_id",
      //     description: "Product description"
      //   }
      // ]

      setProducts(Array.isArray(data) ? data : data.products || []);
      setFilteredProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts(products);
  };

  // Add to cart function
  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
  };

  // Get Cloudinary image URL
  const getCloudinaryImage = (imageUrl) => {
    // If imageUrl is already a full Cloudinary URL, return it
    if (imageUrl?.startsWith("http")) {
      return imageUrl;
    }

    // If imageUrl is a Cloudinary public_id, construct the URL
    if (imageUrl) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      return `https://res.cloudinary.com/${cloudName}/image/upload/${imageUrl}`;
    }

    // Fallback placeholder image
    return "/placeholder-product.jpg";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

    
      

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Results Info */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {searchQuery ? "Search Results" : "Our Products"}
          </h2>
          <p className="text-gray-600">
            {searchQuery ? (
              <>
                Found{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                result{filteredProducts.length !== 1 ? "s" : ""} for "
                <span className="font-semibold">{searchQuery}</span>"
              </>
            ) : (
              <>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}{" "}
                available
              </>
            )}
          </p>
        </div>

        {/* Products Grid or No Results */}
        {filteredProducts.length === 0 ? (
          // No Results Found
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">{searchQuery ? "🔍" : "📦"}</div>
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? (
                <>
                  We couldn't find any products matching "
                  <span className="font-semibold">{searchQuery}</span>"
                </>
              ) : (
                "Products will appear here once added by admin"
              )}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          // Products Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
               <Link key={product._id} href={`/products/${product._id}`  }>
            <ProductCard  product={product} />
           </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
