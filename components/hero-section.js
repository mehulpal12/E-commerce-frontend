"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child element
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden  min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
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
              className="text-lg text-gray-600 max-w-md leading-relaxed"
            >
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button size="lg" className="w-full sm:w-auto px-10 py-7 text-lg rounded-full bg-black hover:bg-gray-800 transition-all">
                Shop Now
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-4"
            >
              <StatItem value="200+" label="International Brands" />
              <div className="w-px h-12 bg-gray-200 hidden sm:block" />
              <StatItem value="2,000+" label="High-Quality Products" />
              <div className="w-px h-12 bg-gray-200 hidden sm:block" />
              <StatItem value="30,000+" label="Happy Customers" />
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[0.85/1] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://res.cloudinary.com/datsq9ufg/image/upload/v1760100137/fash_axu2rw.jpg"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                alt="Fashion Hero"
                fill
                priority
              />
              
              {/* Decorative Animated Stars */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 right-10"
              >
                <Star className="h-12 w-12 fill-black text-black" />
              </motion.div>
              
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute top-1/2 left-4"
              >
                <Star className="h-6 w-6 fill-black text-black opacity-30" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}