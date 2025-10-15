"use client"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import BrandLogos from "@/components/brand-logos"
import ProductSections from "@/components/product-sections"
import BrowseStyles from "@/components/browse-styles"
import Testimonials from "@/components/testimonials"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"

export default function HomePage() {
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-2 md:mx-16 bg-transparent">
        <HeroSection />
        <BrandLogos />
        <ProductSections />
        <BrowseStyles />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
