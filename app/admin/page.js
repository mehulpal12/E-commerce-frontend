"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Package, AlertTriangle, TrendingUp, ShoppingBag } from "lucide-react";
import { v4 as uuid} from "uuid";

export default function AdminPage() {
  // State for products list
  const [products, setProducts] = useState([]);
  const uid = uuid();

  // Add Product Logic
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL

     useEffect(() => {
      const fetchProducts = async () => {
        try {
          
          const res = await fetch(`${API_URL}/api/products/`);
          // `https://e-commerce-backend-psi-three.vercel.app/api/products/${id}`
          const data = await res.json();
          // console.log(data.products+"dfhgdfj");
          
          setProducts(data.products);
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      };
  
      fetchProducts();
      
    }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    // Simple Validation
    if (!name || price <= 0 || stock < 0 || !category || discount < 0) {
      alert("Please enter valid product details.");
      return;
    }

    const newProduct = {
      id: Date.now(), // Unique ID based on timestamp
      name,
      price,
      stock,
      category,
      discount
    };

    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      const data = await response.json();
      setProducts([...products, newProduct]);
      // console.log("Product added:", data);
    } catch (err) {
      console.error("Error adding product:", err);
    }

    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    setDiscount("");
  };

  // Delete Product Logic
  const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
    if (response.ok) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p._id !== id));
    }
  }
  };

  // Derived Values for Dashboard KPIs
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your product inventory and track performance.</p>
        </header>

        {/* Dashboard KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Products" value={products.length} icon={<Package size={20}/>} color="bg-blue-600" />
          <StatCard title="Low Stock" value={lowStockCount} icon={<AlertTriangle size={20}/>} color="bg-red-500" />
          <StatCard title="Today's Orders" value="0" icon={<ShoppingBag size={20}/>} color="bg-orange-500" />
          <StatCard title="Inventory Value" value={`₹${totalValue.toLocaleString()}`} icon={<TrendingUp size={20}/>} color="bg-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section: Add Product Form */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold mb-5 text-gray-700">Add New Product</h2>
            <form onSubmit={addProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  name="name" 
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                  placeholder="e.g. Sony Headphones" 
                  value={name}
                  onChange={e=>setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number" 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="0" 
                    value={price}
                    onChange={e=>setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input 
                    name="stock" 
                    type="number" 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="0" 
                    value={stock}
                    onChange={e=>setStock(e.target.value)}
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                <input 
                  name="category" 
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                  placeholder="e.g. mens women" 
                  value={category}
                  onChange={e=>setCategory(e.target.value)}
                />
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">discount (₹)</label>
                  <input 
                    name="discount" 
                    type="number" 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="0" 
                    value={discount}
                    onChange={e=>setDiscount(e.target.value)}
                  />
                </div>
                
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md active:scale-[0.98]"
              >
                Add Product
              </button>
            </form>
          </section>

          {/* Section: Product Table */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Product Inventory</h2>
              <span className="text-sm text-gray-500">{products.length} Products Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <Package size={40} className="text-gray-200" />
                          <p>No products added to the list yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                        <td className="px-6 py-4 text-gray-600">₹{p.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            p.stock < 5 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {p.stock < 5 ? 'Low Stock: ' : ''}{p.stock} in store
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

/**
 * StatCard Component for Dashboard KPIs
 */
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5">
      <div className={`${color} p-3 rounded-xl text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-800">{value}</h3>
      </div>
    </div>
  );
}