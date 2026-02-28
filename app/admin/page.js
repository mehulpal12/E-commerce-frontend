"use client";

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Trash2, Package, AlertTriangle, TrendingUp, ShoppingBag } from "lucide-react";

// 1. Memoized StatCard
// Prevents KPI cards from re-rendering unless their specific value changes
const StatCard = memo(({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5">
    <div className={`${color} p-3 rounded-xl text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-800">{value}</h3>
    </div>
  </div>
));
StatCard.displayName = "StatCard";

// 2. Memoized Table Row
// This is the most important optimization. It prevents the entire table 
// from re-rendering when you type in the "Add Product" form.
const ProductRow = memo(({ product, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
    <td className="px-6 py-4 text-gray-600">₹{product.price.toLocaleString()}</td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
      }`}>
        {product.stock < 5 ? 'Low Stock: ' : ''}{product.stock} in store
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button
        onClick={() => onDelete(product._id)}
        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
));
ProductRow.displayName = "ProductRow";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "", price: "", stock: "", category: "", discount: ""
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [API_URL]);

  // 3. useCallback for Delete Logic
  // Ensures the function identity is stable so ProductRow memo works correctly
  const deleteProduct = useCallback(async (id) => {
    if (!window.confirm("Are you sure?")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(prev => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  }, [API_URL]);

  // 4. useMemo for KPI Calculations
  // Only recalculates when the 'products' array changes
  const stats = useMemo(() => {
    const lowStock = products.filter((p) => p.stock < 5).length;
    const totalVal = products.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0);
    return { lowStock, totalVal };
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(prev => [...prev, data.product || formData]);
        setFormData({ name: "", price: "", stock: "", category: "", discount: "" });
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Manage inventory and track performance.</p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Products" value={products.length} icon={<Package size={20}/>} color="bg-blue-600" />
          <StatCard title="Low Stock" value={stats.lowStock} icon={<AlertTriangle size={20}/>} color="bg-red-500" />
          <StatCard title="Orders" value="0" icon={<ShoppingBag size={20}/>} color="bg-orange-500" />
          <StatCard title="Value" value={`₹${stats.totalVal.toLocaleString()}`} icon={<TrendingUp size={20}/>} color="bg-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold mb-5 text-gray-700">Add New Product</h2>
            <form onSubmit={addProduct} className="space-y-4">
              <input 
                name="name" 
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Product Name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" className="p-2.5 border rounded-lg" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                <input name="stock" type="number" className="p-2.5 border rounded-lg" placeholder="Stock" value={formData.stock} onChange={handleInputChange} required />
              </div>
              <input name="category" className="w-full p-2.5 border rounded-lg" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
              <input name="discount" type="number" className="w-full p-2.5 border rounded-lg" placeholder="Discount" value={formData.discount} onChange={handleInputChange} required />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Add Product
              </button>
            </form>
          </section>

          {/* Table Section */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">Inventory Empty</td></tr>
                ) : (
                  products.map((p) => (
                    <ProductRow key={p._id || p.id} product={p} onDelete={deleteProduct} />
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}