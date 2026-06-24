"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "I found three rare classics through Bindr. that I had searched for years. The community is incredible.",
    author: "Emma W.",
    location: "Brooklyn, NY"
  },
  {
    quote: "It feels like walking into a cozy independent bookstore, but with readers from all over the city.",
    author: "James L.",
    location: "Austin, TX"
  },
  {
    quote: "Bindr. completely changed how I read. I've exchanged over 50 books and met wonderful people along the way.",
    author: "Sophia K.",
    location: "London, UK"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-32 px-8 md:px-16 bg-accent border-y border-border">
      <div className="max-w-4xl mx-auto text-center relative h-64 md:h-48 flex items-center justify-center">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0, 
              y: index === currentIndex ? 0 : 20,
              pointerEvents: index === currentIndex ? "auto" : "none"
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-full"
          >
            <p className="font-serif text-3xl md:text-5xl text-white leading-tight mb-8">
              &quot;{t.quote}&quot;
            </p>
            <div>
              <p className="font-serif text-lg text-white font-medium">{t.author}</p>
              <p className="text-white/60 text-sm uppercase tracking-widest">{t.location}</p>
            </div>
          </motion.div>
        ))}

        <div className="absolute -bottom-10 flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-6" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
