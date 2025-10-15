"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem('cart');
    
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Animation */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your order!
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Your items will be shipped soon.
        </p>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            ✓ Payment confirmed<br/>
            ✓ Order placed successfully<br/>
            ✓ Confirmation email sent
          </p>
        </div>

        {/* Buttons */}
        <button 
          onClick={() => router.push('/home')}
          className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition font-medium mb-3"
        >
          Continue Shopping
        </button>

        <p className="text-xs text-gray-400">
          Redirecting in 5 seconds...
        </p>
      </div>
    </div>
  );
}
