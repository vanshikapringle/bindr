"use client";

import { motion } from "framer-motion";

const genres = [
  "Fiction", "Fantasy", "Mystery", "Romance", 
  "Self Help", "Philosophy", "History", "Science", "Classics"
];

export default function Marquee() {
  return (
    <section className="w-full py-12 border-y border-border overflow-hidden bg-background flex flex-col items-center">
      <p className="text-sm font-medium text-muted uppercase tracking-widest mb-8">Trusted By Readers Of</p>
      <div className="relative w-full flex">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        <motion.div 
          className="flex whitespace-nowrap gap-16 px-8"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {/* Double the array for seamless looping */}
          {[...genres, ...genres, ...genres].map((genre, index) => (
            <span 
              key={index} 
              className="font-serif text-3xl md:text-4xl text-foreground opacity-80"
            >
              {genre}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
