"use client";

import { useRef } from "react";
import FeaturedListingsHeader from "./FeaturedListingsHeader";
import PropertyCard from "./PropertyCard";
import { createDemoProperties } from "./demoProperties";

const FeaturedListings = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const properties = createDemoProperties();

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="py-16 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black opacity-95"></div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <FeaturedListingsHeader
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
        />

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 sm:space-x-6 snap-x scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <a href="/listings">
            <button className="rounded-full px-6 py-2 backdrop-blur-md bg-white/10 border border-white/20 text-white hover:text-[#007481] transition-colors">
              View All Properties
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;
