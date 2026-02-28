"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import useProductStore from "@/store/productStore";

// Memoize Navigation to prevent re-renders during search typing
const NavLinks = memo(() => (
  <nav className="hidden md:flex items-center space-x-8">
    {[ "On Sale", "New Arrivals", "Brands", "Category"].map((item) => (
      <Link
        key={item}
        href={item === "Category" ? "/category" : `/smallpage/${item.toLowerCase().replace(" ", "")}`}
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        {item}
      </Link>
    ))}
  </nav>
));
NavLinks.displayName = "NavLinks";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selector optimization: Only grab what we need
  const products = useProductStore((state) => state.products);

  // 1. useCallback: Memoize search handler
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // 2. useCallback: Memoize clear handler
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // 3. useMemo: Perform the expensive filter operation here
  // This ONLY runs when searchQuery or products array changes
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return (products || []).filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    ).slice(0, 6); // Limit results for performance and UI clarity
  }, [products, searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between md:px-16 px-8 mx-auto">
        {/* Logo */}
        <Link href="/home" className="text-2xl font-bold pe-8 lg:pe-16 shrink-0">
          SHOP.CO
        </Link>

        {/* Desktop Navigation */}
        <NavLinks />

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-200 rounded-full bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Floating Search Results */}
          {filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-[60]">
              {filteredProducts.map((product) => (
                <Link 
                  key={product._id} 
                  href={`/products/${product._id}`}
                  onClick={clearSearch}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b last:border-0"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">
                    IMG
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <IconButton href="/cart" icon={<ShoppingCart className="h-5 w-5" />} />
          <IconButton href="/user/userDetail" icon={<User className="h-5 w-5" />} />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

// Sub-component helper
const IconButton = memo(({ href, icon }) => (
  <Link href={href}>
    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
      {icon}
    </Button>
  </Link>
));
IconButton.displayName = "IconButton";