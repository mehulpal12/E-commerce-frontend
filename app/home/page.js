"use client"
import { useEffect, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"

// Critical components - Load immediately
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"

// Non-critical components - Lazy load as the user scrolls
const BrandLogos = dynamic(() => import("@/components/brand-logos"), { ssr: true })
const ProductSections = dynamic(() => import("@/components/product-sections"), { ssr: true })
const BrowseStyles = dynamic(() => import("@/components/browse-styles"), { ssr: true })
const Testimonials = dynamic(() => import("@/components/testimonials"), { ssr: true })
const Newsletter = dynamic(() => import("@/components/newsletter"), { ssr: true })
const Footer = dynamic(() => import("@/components/footer"), { ssr: true })

import useProductStore from "@/store/productStore"

export default function HomePage() {
  // Select only what we need from the store to prevent re-renders when other state changes
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  // 1. useCallback: Memoize the fetch function if it's passed to children
  const loadInitialData = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. useMemo: Memoize expensive layout styles or configurations
  const mainClass = useMemo(() => "mx-2 md:mx-16 bg-transparent", []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className={mainClass}>
        <HeroSection />
        <BrandLogos />
        {/* These components should be wrapped in React.memo internally */}
        <ProductSections />
        <BrowseStyles />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}