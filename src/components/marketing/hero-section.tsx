"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

const HeroSection = () => {
  const [location, setLocation] = useState("");
  const [beds, setBeds] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      select option:hover, select option:focus, select option:active, select option:checked {
        background: linear-gradient(#007481, #007481) !important;
        background-color: #007481 !important;
        border-radius: 9999px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (beds) params.set("beds", beds);
    if (price) params.set("price", price);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="relative min-h-[600px] h-screen overflow-hidden">
      {/* Full-bleed background with subtle zoom animation */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          backgroundImage: 'url("/images/hero-main.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a1d24",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content + search */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            Find Your Perfect Rental
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          >
            Thousands of verified listings. Zero headaches.
          </motion.p>

          {/* Search box — glass-style container */}
          <motion.div 
            className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-full p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-3"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="w-full md:flex-1 flex items-center px-3 py-2 md:py-0 bg-white/80 rounded-full">
              <span className="text-xl mr-2 flex-shrink-0">📍</span>
              <input
                type="text"
                placeholder="City, neighborhood, or ZIP"
                className="border-0 focus:outline-none focus:ring-0 px-3 h-10 md:h-12 w-full bg-transparent text-gray-900 placeholder-gray-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="w-full md:flex-1 flex items-center px-3 py-2 md:py-0 bg-white/80 rounded-full">
              <span className="text-xl mr-2 flex-shrink-0">🏠</span>
              <select
                className="w-full border-0 focus:outline-none focus:ring-0 px-3 h-10 md:h-12 bg-transparent rounded-full text-gray-900"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                style={{ appearance: "none" }}
              >
                <option value="">Beds</option>
                <option value="studio">Studio</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
            </div>
            <div className="w-full md:flex-1 flex items-center px-3 py-2 md:py-0 bg-white/80 rounded-full">
              <span className="text-xl mr-2 flex-shrink-0">💰</span>
              <select
                className="w-full border-0 focus:outline-none focus:ring-0 px-3 h-10 md:h-12 bg-transparent rounded-full text-gray-900"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ appearance: "none" }}
              >
                <option value="">Price</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-1500">$1,000-$1,500</option>
                <option value="1500-2000">$1,500-$2,000</option>
                <option value="2000-3000">$2,000-$3,000</option>
                <option value="3000+">$3,000+</option>
              </select>
            </div>
            <motion.button 
              className="w-full md:w-auto rounded-full px-6 bg-black hover:bg-gray-800 h-12 text-white font-medium transition-colors flex-shrink-0"
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                <span>Search</span>
                <span className="ml-2 text-lg">🔍</span>
              </span>
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="mt-6 text-sm text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Popular: <a href="/search?city=san-francisco" className="text-white hover:underline transition-colors">San Francisco</a> • <a href="/search?city=austin" className="text-white hover:underline transition-colors">Austin</a> • <a href="/search?city=denver" className="text-white hover:underline transition-colors">Denver</a> • <a href="/search?city=miami" className="text-white hover:underline transition-colors">Miami</a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
