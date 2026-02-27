import { create } from 'zustand';

const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  // The function to call the backend
  fetchProducts: async () => {
    // 1. Prevent redundant calls if products are already loaded
    if (get().isLoading || get().products.length > 0) return;

    set({ isLoading: true });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.ok ? await response.json() : [];
    //   console.log(data.products[0]);
      
      
      // 2. Update the global state
      set({ products: data.products, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  fetchProductById: async (id) => {
    // Optional: Check if the product is already loaded to avoid a new API call
    if (get().currentProduct?._id === id) return;

    set({ isLoading: true, currentProduct: null }); // Reset before fetching
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
      const data = await res.json();
      set({ currentProduct: data.product, isLoading: false });
    } catch (error) {
      console.error("Fetch error:", error);
      set({ isLoading: false });
    }
  }

}));

export default useProductStore;