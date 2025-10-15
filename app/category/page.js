"use client";
// pages/casual.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import Image from "next/image";

export default function CasualPage() {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [50, 200],
    colors: [],
    sizes: [],
    dressStyle: [],
  });

  const [sortBy, setSortBy] = useState("");

  const [products, setProducts] = useState([]);
  const [filterProducts, setfilterProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

  const colors = [
    { name: "green", bg: "bg-green-500" },
    { name: "red", bg: "bg-red-500" },
    { name: "yellow", bg: "bg-yellow-500" },
    { name: "orange", bg: "bg-orange-500" },
    { name: "blue", bg: "bg-blue-500" },
    { name: "purple", bg: "bg-purple-500" },
    { name: "pink", bg: "bg-pink-500" },
    { name: "white", bg: "bg-white border border-gray-300" },
    { name: "black", bg: "bg-black" },
  ];

  const sizes = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X-Large",
  ];
  const dressStyles = ["Casual", "Formal", "Party", "Gym"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/products/"); // your backend route
        const data = await res.json();
        setProducts(data.products);
        // assuming backend returns { products: [...] }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    // console.log(newArrivals);

    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>
      );
    }
    return stars;
  };

  const getProductImage = (imageType) => {
    const imageStyles = {
      gradient: "bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100",
      polo: "bg-gradient-to-br from-red-200 to-red-300",
      "striped-black": "bg-gradient-to-r from-gray-800 via-white to-gray-800",
      jeans: "bg-gradient-to-br from-blue-600 to-blue-800",
      checkered: "bg-gradient-to-br from-red-400 to-blue-600",
      "striped-sleeve": "bg-gradient-to-br from-orange-400 to-red-500",
      "vertical-striped": "bg-gradient-to-br from-green-400 to-green-600",
      courage: "bg-gradient-to-br from-orange-500 to-red-500",
      bermuda: "bg-gradient-to-br from-blue-300 to-blue-500",
    };
    return imageStyles[imageType] || "bg-gray-200";
  };

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const totalPages = 10;
  const currentPageProducts = filterProducts;

  // const filteredProducts = () => {
  //   const p = products.filter(
  //     (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  //   );
  //   setfilterProducts(p);
  // };

  useEffect(() => {
  let filtered = [...products];

  // Apply category filter
  if (sortBy !== "") {
    filtered = filtered.filter((p) => p.category === sortBy);
  }

  // Apply price range filter
  filtered = filtered.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  setfilterProducts(filtered);
}, [sortBy, priceRange, products]);



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

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Casual Wear - Shop.co</title>
        <meta
          name="description"
          content="Browse our collection of casual wear"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-black text-white text-center py-2 text-sm">
          Sign up and get 20% off to your first order.{" "}
          <span className="underline cursor-pointer">Sign Up Now</span>
          <button className="absolute right-4 top-2 text-white hover:text-gray-300">
            ✕
          </button>
        </header>

        {/* Navigation */}
        <nav className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
             <Link href={'/home'}> <h1 className="text-2xl font-bold">SHOP.CO</h1></Link>
              <div className="hidden md:flex space-x-6">
                <a href="/home" className="hover:text-gray-600 flex items-center">
                  Shop <span className="ml-1">▼</span>
                </a>
                <a href="/home" className="hover:text-gray-600">
                  On Sale
                </a>
                <a href="/home" className="hover:text-gray-600">
                  New Arrivals
                </a>
                <a href="/home" className="hover:text-gray-600">
                  Brands
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">

             <Link href={"/cart"}> <button  className="p-2 hover:bg-gray-100 rounded">🛒</button></Link>
              <Link href={"/user/userDetail"}><button className="p-2 hover:bg-gray-100 rounded">👤</button></Link>
            </div>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <a href="#" className="hover:text-black">
              Home
            </a>{" "}
            &gt;
            <span className="text-black ml-1">Casual</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    ⚙
                  </button>
                </div>

              

                {/* Price Range */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Price</h3>
                    <span className="text-gray-400">▲</span>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={1000}
                      onValueChange={(newValue) => setPriceRange(newValue)}
                    />
                  </div>
                </div>

               

                {/* Dress Style */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Sort by Gender</h3>
                    <span className="text-gray-400">▲</span>
                  </div>
                  <div className="space-y-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                     
                      className="border border-gray-300 rounded px-3 w-full text-center py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option>Mens</option>
                      <option>Women</option>
                      <option>Kids</option>
                    </select>
                  </div>
                </div>

             
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Casual</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm">
                    Showing 1- {products.length} of {products.length} Products
                  </span>
                
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden border border-gray-300 px-4 py-2 rounded"
                  >
                    Filters
                  </button>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6 border border-gray-200 rounded-lg p-4">
                  <div className="grid mb-4">
                   <div className="">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={1000}
                      onValueChange={(newValue) => setPriceRange(newValue)}
                    />
                  </div>
                   
                  </div>
                
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentPageProducts.map((product) => (
                  <div key={product._id} className="group cursor-pointer">
                    <div className="aspect-square rounded-lg mb-4 overflow-hidden">
                     <div className="relative h-64 bg-gray-100">
                  <Image
                    src={getCloudinaryImage(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                    width={350}
                    height={250}
                  />
                </div>
                    </div>
                    <h3 className="font-medium mb-2 group-hover:text-gray-600 transition">
                      {product.name}
                    </h3>
                    <div className="flex mb-2">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating}/5
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">
                        ${product.price}
                      </span>
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
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center">
                  ← Previous
                </button>

                {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && setCurrentPage(page)
                    }
                    className={`px-3 py-2 border rounded ${
                      page === currentPage || (currentPage === 1 && page === 1)
                        ? "bg-black text-white border-black"
                        : page === "..."
                        ? "border-transparent cursor-default"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-black text-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              STAY UP TO DATE ABOUT
              <br />
              OUR LATEST OFFERS
            </h2>
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-full text-black focus:outline-none"
              />
              <button className="w-full bg-white text-black py-3 rounded-full hover:bg-gray-100 transition duration-200">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-bold mb-4">SHOP.CO</h3>
                <p className="text-gray-600 mb-6">
                  We have clothes that suits your style and which you're proud
                  to wear. From women to men.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">COMPANY</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-black">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Career
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">HELP</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-black">
                      Customer Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Delivery Details
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">FAQ</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-black">
                      Account
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Manage Deliveries
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Orders
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Payments
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">RESOURCES</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-black">
                      Free eBooks
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Development Tutorial
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      How to - Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-black">
                      Youtube Playlist
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8">
              <div className="flex flex-col lg:flex-row justify-between items-center">
                <p className="text-gray-600 mb-4 lg:mb-0">
                  Shop.co © 2000-2023, All Rights Reserved
                </p>
                <div className="flex space-x-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    PP
                  </div>
                  <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
                    AP
                  </div>
                  <div className="w-12 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">
                    GP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
