"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

// 1. Move static data OUTSIDE the component. 
// This ensures the reference is stable and never triggers a re-render.
const BRANDS = [
  { name: "VERSACE", logo: "VERSACE" },
  { name: "ZARA", logo: "ZARA" },
  { name: "GUCCI", logo: "GUCCI" },
  { name: "PRADA", logo: "PRADA" },
  { name: "Calvin Klein", logo: "Calvin Klein" },
];

const BrandLogos = () => {
  // 2. useMemo: Although the data is outside, if you were to transform it 
  // (e.g., sorting), you'd wrap it in useMemo. 
  const renderedBrands = useMemo(() => {
    return BRANDS.map((brand) => (
      <motion.div
        key={brand.name}
        whileHover={{ scale: 1.1, opacity: 1 }}
        initial={{ opacity: 0.7 }}
        className="text-2xl md:text-4xl font-black tracking-tighter cursor-default transition-all"
      >
        {brand.logo}
      </motion.div>
    ));
  }, []);

  return (
    <section className="py-10 bg-black text-white overflow-hidden rounded-lg">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center md:justify-between items-center gap-10 md:gap-4"
        >
          {renderedBrands}
        </motion.div>
      </div>
    </section>
  );
};


export default memo(BrandLogos);