"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, User, X, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProductStore from "@/store/productStore";
import { cn } from "@/lib/utils";



const NavLinks = memo(function NavLinks({
  vertical = false,
  onItemClick,
}) {
  const pathname = usePathname();

  const links = [
    { name: "On Sale", href: "/smallpage/onsale" },
    { name: "New Arrivals", href: "/smallpage/newarrivals" },
    { name: "Brands", href: "/smallpage/brands" },
    { name: "Category", href: "/category" },
  ];


  return (
    <nav
      className={cn(
        "flex",
        vertical ? "flex-col space-y-4 bg-white" : "items-center space-x-8"
      )}
    >
      {links.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onItemClick}
            className={cn(
              "relative text-sm font-medium transition-colors duration-200",
              active ? "text-black font-semibold" : "text-muted-foreground hover:text-black",
              vertical && "flex items-center justify-between py-2 border-b"
            )}
          >
            {link.name}

            {active && !vertical && (
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-black" />
            )}

            {vertical && <ChevronRight size={16} />}
          </Link>
        );
      })}
    </nav>
  );
});

/* ---------------- HEADER ---------------- */

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const products = useProductStore((state) => state.products);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "unset";
  }, [menuOpen, searchOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    return products
      ?.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [products, query]);

  const closeSearch = useCallback(() => {
    setQuery("");
    setSearchOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Left */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </Button>

          <Link href="/home" className="text-xl font-black">
            SHOP.CO
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block relative w-[300px]">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
          />

          {filteredProducts?.length > 0 && (
            <div className="absolute mt-2 w-full rounded-lg border bg-white shadow-lg">
              {filteredProducts.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p._id}`}
                  onClick={closeSearch}
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag size={20} />
            </Button>
          </Link>

          <Link href="/user/userDetail">
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </Link>
        </div>
      </div>

      {/* ---------------- MOBILE SEARCH ---------------- */}

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              className="fixed top-0 left-0 w-full bg-white p-4 z-50 md:hidden"
            >
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 rounded-full bg-gray-100 px-4 py-2 outline-none"
                />
                <Button onClick={closeSearch}>Cancel</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- MOBILE SIDEBAR ---------------- */}

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-full w-[260px] bg-white p-6 z-50 md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">SHOP.CO</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>

              <NavLinks
                vertical
                onItemClick={() => setMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}