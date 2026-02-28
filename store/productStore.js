import { create } from 'zustand';

const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  lastFetched: null, 

  fetchProducts: async () => {
    const { products, lastFetched, isLoading } = get();
    

    const isCacheFresh = lastFetched && Date.now() - lastFetched < 5 * 60 * 1000;
    if (isLoading || (products.length > 0 && isCacheFresh)) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      
      set({ 
        products: data.products || [], 
        isLoading: false, 
        lastFetched: Date.now() 
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    const existingProduct = get().products.find(p => p._id === id);
    if (existingProduct) {
      set({ currentProduct: existingProduct });
      return; 
    }

    if (get().isLoading) return;

    set({ isLoading: true, currentProduct: null });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
      const data = await res.json();
      set({ currentProduct: data.product, isLoading: false });
    } catch (error) {
      set({ error: "Product not found", isLoading: false });
    }
  }
}));

export default useProductStore;