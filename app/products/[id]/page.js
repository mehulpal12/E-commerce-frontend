"use client"
// pages/product.js
import { useState, use, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductPage({params}) {
  const { id } = use(params);
  const [selectedColor, setSelectedColor] = useState('olive');
  const [product, setProduct] = useState([]);
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews');
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  

  const colors = [
    { name: 'olive', bg: 'bg-green-700', selected: selectedColor === 'olive' },
    { name: 'forest', bg: 'bg-green-800', selected: selectedColor === 'forest' },
    { name: 'navy', bg: 'bg-blue-900', selected: selectedColor === 'navy' }
  ];

  const sizes = ['Small', 'Medium', 'Large', 'X-Large'];

  const reviews = [
    {
      id: 1,
      name: 'Samantha D.',
      rating: 4.5,
      date: 'August 14, 2023',
      comment: 'I absolutely love this shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt.'
    },
    {
      id: 2,
      name: 'Alex M.',
      rating: 4,
      date: 'August 15, 2023',
      comment: 'This T-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a LINUX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.'
    },
    {
      id: 3,
      name: 'Ethan R.',
      rating: 4,
      date: 'August 16, 2023',
      comment: 'This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt.'
    },
    {
      id: 4,
      name: 'Olivia P.',
      rating: 4.5,
      date: 'August 17, 2023',
      comment: 'As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out.'
    }
  ];

  const relatedProducts = [
    {
      id: 1,
      name: 'Polo with Contrast Trims',
      price: 212,
      originalPrice: 242,
      discount: 20,
      rating: 4.0,
      image: '/api/placeholder/300/300'
    },
    {
      id: 2,
      name: 'Gradient Graphic T-shirt',
      price: 145,
      rating: 3.5,
      image: '/api/placeholder/300/300'
    },
    {
      id: 3,
      name: 'Polo with Tipping Details',
      price: 180,
      rating: 4.5,
      image: '/api/placeholder/300/300'
    },
    {
      id: 4,
      name: 'Black Striped T-shirt',
      price: 120,
      originalPrice: 150,
      discount: 20,
      rating: 5.0,
      image: '/api/placeholder/300/300'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }

    return stars;
  };

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const res = await fetch(`http://localhost:7000/api/products/${id}`);
        const data = await res.json();
        console.log(data.product+"dfhgdfj");
        
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    console.log("Product ID from URL:", id);

    fetchProducts();
    
  }, [id]);
  
  console.log(product + "edgerg");


  useEffect(() => {
    updateCartCount();
  }, []);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  // Add to cart function
  const addToCart = (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists
    const existingItemIndex = existingCart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
      // Product exists, increase quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // New product, add with quantity 1
      existingCart.push({ ...product, quantity: 1 });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    // alert(`${product.name} added to cart!`);
  };

  return (
    <>
      <Head>
        <title>ONE LIFE GRAPHIC T-SHIRT - Shop.co</title>
        <title>{product.name}</title>
        <meta name="description" content="Premium graphic t-shirt with unique design" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-black text-white text-center py-2 text-sm">
          Sign up and get 20% off to your first order. <span className="underline cursor-pointer">Sign Up Now</span>
        </header>

        {/* Navigation */}
        <nav className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">SHOP.CO</h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-gray-600">Shop</a>
                <a href="#" className="hover:text-gray-600">On Sale</a>
                <a href="#" className="hover:text-gray-600">New Arrivals</a>
                <a href="#" className="hover:text-gray-600">Brands</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="px-4 py-2 border border-gray-300 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">🛒</button>
              <button className="p-2 hover:bg-gray-100 rounded">👤</button>
            </div>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <a href="/" className="hover:text-black">Home</a> &gt; 
            <a href="#" className="hover:text-black"> Shop</a> &gt; 
            <a href="#" className="hover:text-black"> Men</a> &gt; 
            <span className="text-black"> T-shirts</span>
          </div>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full  flex ">
                  <Image src={product.image} alt='product' width={600} height={250}  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-black">
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg"></div>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-black">
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 rounded-lg"></div>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-black">
                  <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {renderStars(4.5)}
                  </div>
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl font-bold">{product.price}</span>
                  <span className="text-xl text-gray-500 line-through">$300</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">{product.discount}</span>
                </div>
                <p className="text-gray-600">
                  This graphic t-shirt which is perfect for any occasion. Crafted from a soft and 
                  breathable fabric, it offers superior comfort and style.
                </p>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-medium mb-3">Select Colors</h3>
                <div className="flex space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full ${color.bg} ${
                        color.selected ? 'ring-2 ring-black ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-medium mb-3">Choose Size</h3>
                <div className="flex space-x-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-full ${
                        selectedSize === size
                          ? 'bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex space-x-4">
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 rounded-l-full"
                  >
                    −
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 rounded-r-full"
                  >
                    +
                  </button>
                </div>
               <Link href={`/cart`}>
                 <button
                        onClick={() => addToCart(product)}
                        className={`px-6 py-2 rounded-full font-medium transition `}
                      >
                        add to cart
                      </button>
               </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="border-t border-gray-200">
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === 'details' ? 'border-black text-black' : 'border-transparent text-gray-500'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-gray-500'
                }`}
              >
                Rating & Reviews
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === 'faqs' ? 'border-black text-black' : 'border-transparent text-gray-500'
                }`}
              >
                FAQs
              </button>
            </div>

            {activeTab === 'reviews' && (
              <div className="py-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                  <h2 className="text-2xl font-bold mb-4 lg:mb-0">All Reviews (451)</h2>
                  <div className="flex space-x-4">
                    <select className="border border-gray-300 rounded px-3 py-2">
                      <option>Latest</option>
                      <option>Oldest</option>
                      <option>Highest Rated</option>
                    </select>
                    <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">
                      Write a Review
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <h4 className="font-medium">{review.name}</h4>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">⋯</button>
                      </div>
                      <p className="text-gray-600 mb-4">{review.comment}</p>
                      <p className="text-sm text-gray-400">Posted on {review.date}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button className="border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-50">
                    Load More Reviews
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center mb-12">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${
                    product.id === 1 ? 'from-blue-100 to-blue-200' :
                    product.id === 2 ? 'from-pink-100 to-pink-200' :
                    product.id === 3 ? 'from-red-100 to-red-200' :
                    'from-gray-100 to-gray-200'
                  } group-hover:scale-105 transition duration-300`}></div>
                </div>
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-2">{product.rating}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-500 line-through">${product.originalPrice}</span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              STAY UP TO DATE ABOUT<br />OUR LATEST OFFERS
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
                  We have clothes that suits your style and which you're proud to wear. 
                  From women to men.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                  <div className="w-8 h-8 bg-black rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">COMPANY</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-black">About</a></li>
                  <li><a href="#" className="hover:text-black">Features</a></li>
                  <li><a href="#" className="hover:text-black">Works</a></li>
                  <li><a href="#" className="hover:text-black">Career</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">HELP</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-black">Customer Support</a></li>
                  <li><a href="#" className="hover:text-black">Delivery Details</a></li>
                  <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">FAQ</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-black">Account</a></li>
                  <li><a href="#" className="hover:text-black">Manage Deliveries</a></li>
                  <li><a href="#" className="hover:text-black">Orders</a></li>
                  <li><a href="#" className="hover:text-black">Payments</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">RESOURCES</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-black">Free eBooks</a></li>
                  <li><a href="#" className="hover:text-black">Development Tutorial</a></li>
                  <li><a href="#" className="hover:text-black">How to - Blog</a></li>
                  <li><a href="#" className="hover:text-black">Youtube Playlist</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
              <p>Shop.co © 2000-2023, All Rights Reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}