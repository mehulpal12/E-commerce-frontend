"use client";

import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// Memoize sub-components to prevent re-renders when the parent re-renders
const StatItem = memo(({ value, label }) => (
  <div className="space-y-1">
    <div className="text-3xl font-bold tracking-tight">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
));
StatItem.displayName = "StatItem";

function HeroSection() {
  // 1. useMemo for Animation Variants 
  // This ensures the objects aren't re-created on every render cycle.
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] }, // Custom cubic-bezier for smoother feel
    },
  }), []);

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center ">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 z-10"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-black"
            >
              FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-gray-600 max-w-md leading-relaxed"
            >
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-12 py-7 text-lg rounded-full bg-black hover:bg-gray-800 transition-all active:scale-95"
              >
                Shop Now
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-6 md:gap-8 pt-4"
            >
              <StatItem value="200+" label="International Brands" />
              <div className="w-px h-12 bg-gray-300 hidden sm:block" />
              <StatItem value="2,000+" label="High-Quality Products" />
              <div className="w-px h-12 bg-gray-300 hidden sm:block" />
              <StatItem value="30,000+" label="Happy Customers" />
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[0.9/1] overflow-hidden  ">
              {/* IMAGE OPTIMIZATION:
                  1. priority: For LCP (Largest Contentful Paint)
                  2. sizes: Tells browser which size to download based on screen width
                  3. quality: Reduced to 85 (unnoticeable difference, huge file saving)
              */}
              <Image
                src="https://res.cloudinary.com/datsq9ufg/image/upload/v1760100137/fash_axu2rw.jpg"
                alt="Fashion Hero Models"
                fill
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top rounded-lg"
              />
              
              {/* Decorative Stars */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 20, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 right-5 md:right-10"
              >
                <Star className="h-10 w-10 md:h-14 md:w-14 fill-black text-black" />
              </motion.div>
              
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute top-1/2 left-0"
              >
                <Star className="h-6 w-6 md:h-8 md:w-8 fill-black text-black" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);