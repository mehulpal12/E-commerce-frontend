"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// 1. Static Data Hoisting
// Defining this outside prevents the array from being re-created on every render.
const STYLES_DATA = [
  {
    name: "Casual",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759925719/shop-products/rq6geyec1iaisprat9sp.avif",
    containerClass: "md:col-span-1 aspect-[4/3] md:aspect-square",
  },
  {
    name: "Formal",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759922397/cld-sample-5.jpg",
    containerClass: "md:col-span-2 aspect-[4/3] md:aspect-[2/1]",
  },
  {
    name: "Party",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759922397/cld-sample-3.jpg",
    containerClass: "md:col-span-2 aspect-[4/3] md:aspect-[2/1]",
  },
  {
    name: "Gym",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759922397/cld-sample-2.jpg",
    containerClass: "md:col-span-1 aspect-[4/3] md:aspect-square",
  },
];

// 2. Memoized Sub-component
// This prevents individual cards from re-rendering unless their specific data changes.
const StyleCard = memo(({ name, image, containerClass }) => {
  // Use Cloudinary auto-optimization parameters via URL transformation
  const optimizedImage = useMemo(() => {
    if (image.includes("cloudinary.com")) {
      // Inserts auto-format, auto-quality, and a reasonable width for the grid slot
      return image.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
    }
    return image;
  }, [image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl ${containerClass}`}
    >
      <Image
        src={optimizedImage || "/placeholder.svg"}
        alt={name}
        fill // Using fill + sizes is more performant for responsive grid layouts
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="absolute top-6 left-6">
        <h3 className="text-2xl md:text-3xl font-bold text-white">{name}</h3>
      </div>
    </motion.div>
  );
});

StyleCard.displayName = "StyleCard";

function BrowseStyles() {
  // 3. useMemo for Grid Rendering
  // This ensures the mapping logic only runs if STYLES_DATA actually changes (which it won't).
  const renderedStyles = useMemo(() => {
    return STYLES_DATA.map((style) => (
      <StyleCard
        key={style.name}
        name={style.name}
        image={style.image}
        containerClass={style.containerClass}
      />
    ));
  }, []);

  return (
    <section className="container mx-auto px-4">
      <div className="bg-muted/30 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase tracking-tighter">
          Browse by dress style
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderedStyles}
        </div>
      </div>
    </section>
  );
}

// 4. Wrap the entire section in memo
export default memo(BrowseStyles);