"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("bindr_token")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section className="relative w-full py-24 md:py-32 flex items-center px-8 md:px-16 overflow-hidden">
      {/* Noticeable Grainy Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl z-10"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6">
            Give Your Books <br className="hidden md:block" />
            <span className="italic text-muted font-semibold">Another Life.</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-muted mb-10 leading-relaxed max-w-lg">
            Exchange books with readers around you, discover hidden gems, and build a personal library that evolves with every story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/register"} 
              className="bg-accent text-white px-8 py-4 rounded-full text-center font-medium hover:bg-accent-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoggedIn ? "Go to Dashboard" : "Join Bindr"}
            </Link>
            <Link 
              href="/collection" 
              className="bg-card text-foreground border border-border px-8 py-4 rounded-full text-center font-medium hover:bg-white transition-all shadow-sm"
            >
              Browse Collection
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Content - Marquee Columns (Moved outside the relative grid so it spans the full section) */}
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:flex justify-end gap-4 overflow-hidden pr-8 xl:pr-16 z-0">
        {/* Column 1 (Downwards) */}
        <div className="flex flex-col gap-4 animate-marquee-vertical min-w-[140px] w-40 mt-[-200px]">
          {[1, 2, 3, 4, 1, 2, 3, 4].map((item, i) => (
            <img 
              key={`c1-${i}`}
              src={`https://covers.openlibrary.org/b/isbn/${["9780545010221", "9780142424179", "9781501110368", "9780765382030"][item-1]}-L.jpg`} 
              alt="Book cover" 
              className="w-full h-auto aspect-[2/3] object-cover rounded-md shadow-md border border-border"
            />
          ))}
        </div>
        
        {/* Column 2 (Upwards) */}
        <div className="flex flex-col gap-4 animate-marquee-vertical-reverse min-w-[140px] w-40 mt-[-600px]">
          {[1, 2, 3, 4, 1, 2, 3, 4].map((item, i) => (
            <img 
              key={`c2-${i}`}
              src={`https://covers.openlibrary.org/b/isbn/${["9781501171345", "9780062457714", "9781594130015", "9780316015844"][item-1]}-L.jpg`} 
              alt="Book cover" 
              className="w-full h-auto aspect-[2/3] object-cover rounded-md shadow-md border border-border"
            />
          ))}
        </div>
        
        {/* Column 3 (Downwards) */}
        <div className="flex flex-col gap-4 animate-marquee-vertical min-w-[140px] w-40 mt-[-400px]">
          {[1, 2, 3, 4, 1, 2, 3, 4].map((item, i) => (
            <img 
              key={`c3-${i}`}
              src={`https://covers.openlibrary.org/b/isbn/${["9780547928227", "9780143039433", "9781400031702", "9780062315007"][item-1]}-L.jpg`} 
              alt="Book cover" 
              className="w-full h-auto aspect-[2/3] object-cover rounded-md shadow-md border border-border"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
