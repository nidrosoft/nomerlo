"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedListingsHeaderProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const FeaturedListingsHeader = ({
  onScrollLeft,
  onScrollRight,
}: FeaturedListingsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-2xl w-full sm:w-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Featured Properties
        </h2>
        <p className="text-sm sm:text-base text-gray-300">
          Explore our handpicked selection of premium properties
        </p>
      </div>

      <div className="flex gap-2 self-center sm:self-auto">
        <button
          onClick={onScrollLeft}
          className="rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:text-[#007481] p-2 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          onClick={onScrollRight}
          className="rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:text-[#007481] p-2 transition-colors"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedListingsHeader;
