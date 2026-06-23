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
    <section className="relative w-full min-h-[85vh] flex items-center px-8 md:px-16 overflow-hidden">
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
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] text-foreground mb-6">
            Give Your Books <br className="hidden md:block" />
            <span className="italic text-muted font-light">Another Life.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 leading-relaxed max-w-lg">
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

        {/* Right Content - Floating Books */}
        <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
          <div 
            className="absolute top-10 right-20 w-48 h-72 rounded-r-2xl rounded-l-md shadow-2xl border-l-[12px] border-black/20 p-6 flex flex-col justify-between z-20 transform -rotate-6 bg-[#C58A55] overflow-hidden"
            style={{ backgroundImage: `url(https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div 
            className="absolute bottom-10 right-40 w-56 h-80 rounded-r-2xl rounded-l-md shadow-2xl border-l-[14px] border-black/20 p-6 flex flex-col justify-between z-30 transform rotate-12 bg-[#4A5D4E] overflow-hidden"
            style={{ backgroundImage: `url(https://covers.openlibrary.org/b/isbn/9781400079278-L.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div 
            className="absolute top-32 right-64 w-40 h-60 rounded-r-xl rounded-l-sm shadow-xl border-l-[10px] border-black/20 p-4 flex flex-col justify-end z-10 transform -rotate-12 bg-[#70241C] overflow-hidden"
            style={{ backgroundImage: `url(https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
