"use client";

import { memo, useMemo } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  // 1. useMemo for Cloudinary URL Construction
  // Optimized with Cloudinary transformations: f_auto (format), q_auto (quality), w_500 (resize)
  const imageUrl = useMemo(() => {
    if (!product?.image) return "/placeholder-product.jpg";
    if (product.image.startsWith("http")) return product.image;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_500/${product.image}`;
  }, [product.image]);

  // 2. useMemo for Star Rating Calculation
  const renderedStars = useMemo(() => {
    const rating = product.rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 md:h-4 md:w-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  }, [product.rating]);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#F0EEED] mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          // Important: 'fill' is better for grids than fixed height/width for responsiveness
        />
        
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-1">
        <h3 className="font-bold text-sm md:text-base lg:text-lg text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">{renderedStars}</div>
          <span className="text-xs md:text-sm font-medium text-slate-500">
            {product.rating || 0}/<span className="opacity-60">5</span>
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="font-black text-lg md:text-xl text-slate-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-slate-400 line-through text-sm font-medium">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// 3. React.memo: Only re-render if the product object actually changes
export default memo(ProductCard);