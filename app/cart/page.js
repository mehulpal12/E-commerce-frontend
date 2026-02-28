"use client"
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';

// 1. Memoized Cart Item Component
// This prevents other items from re-rendering when one item is updated.
const CartItem = memo(({ item, onRemove, onUpdateQuantity, getCloudinaryImage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-4">
        <div className="relative h-32 w-32 md:h-64 md:w-64 bg-gray-100 flex-shrink-0">
          <Image
            src={getCloudinaryImage(item.image)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover rounded-lg"
            // Use unoptimized if testing locally without Cloudinary setup, 
            // but keep it for production performance.
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">Size: {item.size}</p>
              <p className="text-sm text-gray-600">Color: {item.color}</p>
            </div>
            <button
              onClick={() => onRemove(item._id)}
              className="text-red-500 hover:text-red-700 p-2 transition-colors"
              aria-label="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold">${item.price}</span>
            <div className="flex items-center bg-gray-100 rounded-full">
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-full transition"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-full transition"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = "CartItem";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const saveCart = useCallback((updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  }, []);

  // 2. useCallback for Handlers
  // Prevents the CartItem from thinking the function reference changed on every render.
  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const updated = prev.filter(item => item._id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => {
      const updated = prev.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, [removeFromCart]);

  // 3. useMemo for Calculations
  // Total logic only recalculates when the 'cart' array actually changes.
  const totals = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const discount = subtotal * 0.2;
    const deliveryFee = subtotal > 0 ? 15 : 0;
    const finalTotal = subtotal - discount + deliveryFee;

    return { subtotal, count, discount, deliveryFee, finalTotal };
  }, [cart]);

  const getCloudinaryImage = useCallback((imageUrl) => {
    if (imageUrl?.startsWith("http")) return imageUrl;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (imageUrl && cloudName) {
      // Senior Tip: Add quality/format auto-transformations for better image performance
      return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_500/${imageUrl}`;
    }
    return "/placeholder-product.jpg";
  }, []);

  const handleStripeCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => router.back()} className="text-2xl font-bold hover:opacity-70 transition flex items-center">
              <span className="mr-2">←</span> SHOP.CO
            </button>
            <div className="text-sm font-medium text-gray-600">
              {totals.count} {totals.count === 1 ? 'item' : 'items'}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 italic tracking-tighter">YOUR CART</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-dashed border-gray-300">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <button onClick={() => router.push('/home')} className="mt-4 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <CartItem 
                    key={`${item._id}-${item.size}`} 
                    item={item} 
                    onRemove={removeFromCart} 
                    onUpdateQuantity={updateQuantity}
                    getCloudinaryImage={getCloudinaryImage}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-black">${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Discount (-20%)</span>
                      <span className="font-bold text-red-500">-${totals.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-black">${totals.deliveryFee}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-2xl font-black">
                      <span>Total</span>
                      <span>${totals.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleStripeCheckout} 
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-900 transition-all font-bold flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Go to Checkout →"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}