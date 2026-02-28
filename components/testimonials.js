"use client"

import { useState, useCallback, useMemo, memo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 1. Hoist static data outside the component
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: "Alex K.",
    rating: 5,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: 3,
    name: "James L.",
    rating: 5,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
]

// 2. Memoize the Testimonial Card
// This prevents the card from re-rendering unless the 'isActive' status or data changes
const TestimonialCard = memo(({ testimonial, isActive }) => {
  // 3. useMemo for Star rendering
  // Stars are static for each rating; no need to re-map them every render
  const stars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
      />
    ))
  }, [testimonial.rating])

  return (
    <motion.div
      layout
      className={`bg-card border rounded-2xl p-6 transition-all duration-500 h-full ${
        isActive ? "ring-2 ring-black shadow-lg scale-[1.02]" : "opacity-60 scale-95"
      }`}
    >
      <div className="flex items-center mb-4">{stars}</div>
      <p className="text-muted-foreground mb-4 text-pretty italic">"{testimonial.text}"</p>
      <div className="font-bold flex items-center gap-2">
        {testimonial.name}
        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Verified</span>
      </div>
    </motion.div>
  )
})

TestimonialCard.displayName = "TestimonialCard"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 4. useCallback for navigation handlers
  // This ensures the functions have stable identities across renders
  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  return (
    <section className="container px-4 py-12 mx-auto">
      <div className="flex items-end justify-between mb-8">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-5xl font-black tracking-tighter"
        >
          OUR HAPPY CUSTOMERS
        </motion.h2>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevTestimonial} 
            className="rounded-full hover:bg-black hover:text-white transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextTestimonial} 
            className="rounded-full hover:bg-black hover:text-white transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isActive={index === currentIndex}
          />
        ))}
      </div>
    </section>
  )
}