"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Navbar } from "@/components/marketing/navbar";
import Footer from "@/components/marketing/Footer";
import { MapPin, Bed, Bath, Maximize2, ChevronRight, ChevronDown, LayoutGrid, List, SlidersHorizontal, ArrowUpRight, Check, X, DollarSign, Home, Ruler, Calendar } from "lucide-react";

// Custom Dropdown Component with Checkboxes and Metrics
interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: DropdownOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const displayText = selected.length > 0 
    ? `${selected.length} selected` 
    : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
      >
        <span className={selected.length > 0 ? "text-gray-900" : "text-gray-500"}>{displayText}</span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-[0px_32px_64px_-12px_rgba(0,0,0,0.14)] p-4 z-50">
          <div className="flex flex-col gap-3">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-1 transition-colors"
                onClick={() => toggleOption(option.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selected.includes(option.value)
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-300 bg-white"
                  }`}>
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option.label}</span>
                </div>
                {option.count !== undefined && (
                  <span className="text-sm text-gray-400">{option.count}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Filter Modal Component
interface EnhancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    minPrice: string;
    maxPrice: string;
    minBeds: string;
    maxBeds: string;
    minBaths: string;
    maxBaths: string;
    minSqft: string;
    maxSqft: string;
    amenities: string[];
    propertyAge: string;
  };
  onFiltersChange: (filters: EnhancedFilterModalProps['filters']) => void;
  onApply: () => void;
  onReset: () => void;
}

const amenityOptions = [
  { value: "parking", label: "Parking" },
  { value: "pool", label: "Swimming Pool" },
  { value: "gym", label: "Gym/Fitness" },
  { value: "laundry", label: "In-Unit Laundry" },
  { value: "ac", label: "Air Conditioning" },
  { value: "pets", label: "Pet Friendly" },
  { value: "balcony", label: "Balcony/Patio" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "furnished", label: "Furnished" },
  { value: "elevator", label: "Elevator" },
];

const propertyAgeOptions = [
  { value: "new", label: "New Construction (< 1 year)" },
  { value: "recent", label: "1-5 years" },
  { value: "established", label: "5-15 years" },
  { value: "vintage", label: "15+ years" },
];

function EnhancedFilterModal({ isOpen, onClose, filters, onFiltersChange, onApply, onReset }: EnhancedFilterModalProps) {
  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-semibold text-gray-900">Enhanced Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Price Range</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Minimum</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Maximum</label>
                <input
                  type="number"
                  placeholder="No max"
                  value={filters.maxPrice}
                  onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bed className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Bedrooms</h3>
            </div>
            <div className="flex gap-2">
              {["Any", "1+", "2+", "3+", "4+", "5+"].map((option) => (
                <button
                  key={option}
                  onClick={() => onFiltersChange({ ...filters, minBeds: option === "Any" ? "" : option.replace("+", "") })}
                  className={`px-4 py-2 rounded-xl border transition-colors ${
                    (option === "Any" && !filters.minBeds) || filters.minBeds === option.replace("+", "")
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bath className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Bathrooms</h3>
            </div>
            <div className="flex gap-2">
              {["Any", "1+", "2+", "3+", "4+"].map((option) => (
                <button
                  key={option}
                  onClick={() => onFiltersChange({ ...filters, minBaths: option === "Any" ? "" : option.replace("+", "") })}
                  className={`px-4 py-2 rounded-xl border transition-colors ${
                    (option === "Any" && !filters.minBaths) || filters.minBaths === option.replace("+", "")
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Square Footage */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Square Footage</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Minimum</label>
                <input
                  type="number"
                  placeholder="No min"
                  value={filters.minSqft}
                  onChange={(e) => onFiltersChange({ ...filters, minSqft: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Maximum</label>
                <input
                  type="number"
                  placeholder="No max"
                  value={filters.maxSqft}
                  onChange={(e) => onFiltersChange({ ...filters, maxSqft: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Property Age */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Property Age</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {propertyAgeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-3 border border-gray-200 transition-colors"
                  onClick={() => onFiltersChange({ ...filters, propertyAge: filters.propertyAge === option.value ? "" : option.value })}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    filters.propertyAge === option.value
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-300 bg-white"
                  }`}>
                    {filters.propertyAge === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900 text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Amenities</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {amenityOptions.map((amenity) => (
                <label
                  key={amenity.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-3 border border-gray-200 transition-colors"
                  onClick={() => toggleAmenity(amenity.value)}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.amenities.includes(amenity.value)
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-300 bg-white"
                  }`}>
                    {filters.amenities.includes(amenity.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900 text-sm">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-3xl">
          <button
            onClick={onReset}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={() => { onApply(); onClose(); }}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

const sampleListings = [
  { 
    id: 1, 
    title: "Cascading Waters Villa of Serenity", 
    price: 4500, 
    beds: 5, 
    baths: 6, 
    sqft: 5320, 
    address: "3891 Ranchview Dr. Richardson, California", 
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 2, 
    title: "Starlit Cove Private Villa Retreat", 
    price: 5200, 
    beds: 6, 
    baths: 8, 
    sqft: 6740, 
    address: "3891 Ranchview Dr. Richardson, California", 
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 3, 
    title: "Modern Downtown Luxury Apartment", 
    price: 2400, 
    beds: 2, 
    baths: 2, 
    sqft: 1200, 
    address: "456 Market St, San Francisco, CA", 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 4, 
    title: "Cozy Studio in Tech District", 
    price: 1850, 
    beds: 1, 
    baths: 1, 
    sqft: 550, 
    address: "789 Innovation Way, Austin, TX", 
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 5, 
    title: "Spacious Family Home with Garden", 
    price: 3200, 
    beds: 4, 
    baths: 3, 
    sqft: 2800, 
    address: "123 Oak Lane, Denver, CO", 
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 6, 
    title: "Luxury Condo with Ocean Views", 
    price: 4800, 
    beds: 3, 
    baths: 2, 
    sqft: 1800, 
    address: "555 Beachfront Ave, Miami, FL", 
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 7, 
    title: "Charming Victorian Flat", 
    price: 2800, 
    beds: 2, 
    baths: 1, 
    sqft: 1100, 
    address: "234 Heritage St, San Francisco, CA", 
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
  { 
    id: 8, 
    title: "Modern Loft in Arts District", 
    price: 2200, 
    beds: 1, 
    baths: 1, 
    sqft: 950, 
    address: "678 Creative Blvd, Seattle, WA", 
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop&q=60",
    verified: true 
  },
];

// Filter options
const locationOptions = [
  { value: "san-francisco", label: "San Francisco, CA" },
  { value: "austin", label: "Austin, TX" },
  { value: "denver", label: "Denver, CO" },
  { value: "miami", label: "Miami, FL" },
  { value: "seattle", label: "Seattle, WA" },
  { value: "los-angeles", label: "Los Angeles, CA" },
];

const typeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio", label: "Studio" },
];

const categoryOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "bungalows", label: "Bungalows" },
  { value: "penthouse", label: "Penthouse" },
  { value: "villa", label: "Villa" },
  { value: "houses", label: "Houses" },
];

const priceOptions = [
  { value: "0-1500", label: "$0 - $1,500" },
  { value: "1500-2500", label: "$1,500 - $2,500" },
  { value: "2500-4000", label: "$2,500 - $4,000" },
  { value: "4000-6000", label: "$4,000 - $6,000" },
  { value: "6000+", label: "$6,000+" },
];

export default function ListingsPage() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Fetch listings from Convex
  const convexListings = useQuery(api.listings.queries.listActiveListings);
  
  // Transform Convex listings to match the display format
  const dbListings = useMemo(() => {
    if (!convexListings) return [];
    return convexListings.map((listing, index) => ({
      id: index + 100, // Use different IDs to avoid collision with sample data
      slug: listing.slug,
      title: listing.title,
      price: listing.rentAmount,
      beds: listing.unit?.bedrooms || 0,
      baths: listing.unit?.bathrooms || 0,
      sqft: listing.unit?.sqft || 0,
      address: listing.property 
        ? `${listing.property.address.street}, ${listing.property.address.city}, ${listing.property.address.state}`
        : "",
      image: listing.property?.images?.[0]?.url || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
      verified: listing.verificationStatus === "verified",
    }));
  }, [convexListings]);
  
  // Combine database listings with sample listings (db listings first)
  const allListings = useMemo(() => {
    return [...dbListings, ...sampleListings];
  }, [dbListings]);
  
  // Enhanced filter state
  const [enhancedFilters, setEnhancedFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    maxBeds: "",
    minBaths: "",
    maxBaths: "",
    minSqft: "",
    maxSqft: "",
    amenities: [] as string[],
    propertyAge: "",
  });

  // Reset enhanced filters
  const resetEnhancedFilters = () => {
    setEnhancedFilters({
      minPrice: "",
      maxPrice: "",
      minBeds: "",
      maxBeds: "",
      minBaths: "",
      maxBaths: "",
      minSqft: "",
      maxSqft: "",
      amenities: [],
      propertyAge: "",
    });
  };

  // Sort and filter listings
  const sortedAndFilteredListings = useMemo(() => {
    let filtered = [...allListings];

    // Apply enhanced filters
    if (enhancedFilters.minPrice) {
      filtered = filtered.filter(l => l.price >= parseInt(enhancedFilters.minPrice));
    }
    if (enhancedFilters.maxPrice) {
      filtered = filtered.filter(l => l.price <= parseInt(enhancedFilters.maxPrice));
    }
    if (enhancedFilters.minBeds) {
      filtered = filtered.filter(l => l.beds >= parseInt(enhancedFilters.minBeds));
    }
    if (enhancedFilters.minBaths) {
      filtered = filtered.filter(l => l.baths >= parseInt(enhancedFilters.minBaths));
    }
    if (enhancedFilters.minSqft) {
      filtered = filtered.filter(l => l.sqft >= parseInt(enhancedFilters.minSqft));
    }
    if (enhancedFilters.maxSqft) {
      filtered = filtered.filter(l => l.sqft <= parseInt(enhancedFilters.maxSqft));
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        // For demo, reverse order (assuming higher ID = newer)
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "beds":
        filtered.sort((a, b) => b.beds - a.beds);
        break;
      case "sqft":
        filtered.sort((a, b) => b.sqft - a.sqft);
        break;
      default:
        break;
    }

    return filtered;
  }, [sortBy, enhancedFilters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (enhancedFilters.minPrice || enhancedFilters.maxPrice) count++;
    if (enhancedFilters.minBeds) count++;
    if (enhancedFilters.minBaths) count++;
    if (enhancedFilters.minSqft || enhancedFilters.maxSqft) count++;
    if (enhancedFilters.amenities.length > 0) count++;
    if (enhancedFilters.propertyAge) count++;
    return count;
  }, [enhancedFilters]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Black Header Section */}
      <section className="pt-24 pb-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm mb-8">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span className="text-white">Properties</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse Properties
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover your perfect rental from our collection of verified listings across the country.
          </p>
        </div>
      </section>

      {/* Results Header - FIRST (flipped position) */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left side - View toggle and results count */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-full border transition-colors ${
                    viewMode === "grid" 
                      ? "border-gray-900 bg-gray-900 text-white" 
                      : "border-gray-900 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-full border transition-colors ${
                    viewMode === "list" 
                      ? "border-gray-900 bg-gray-900 text-white" 
                      : "border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600">
                Showing 1–{sortedAndFilteredListings.length} of {allListings.length} results
              </p>
            </div>

            {/* Right side - Filter and Sort */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-10 text-gray-900 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="beds">Most Bedrooms</option>
                  <option value="sqft">Largest</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Dropdowns Section - SECOND (flipped position) */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterDropdown
              label="Location"
              options={locationOptions}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
            <FilterDropdown
              label="Type"
              options={typeOptions}
              selected={selectedTypes}
              onChange={setSelectedTypes}
            />
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />
            <FilterDropdown
              label="Price Range"
              options={priceOptions}
              selected={selectedPrices}
              onChange={setSelectedPrices}
            />
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedAndFilteredListings.map((listing) => (
              <a
                key={listing.id}
                href={`/listings/${listing.slug || listing.id}`}
                className="group bg-white border border-gray-200 rounded-2xl p-2 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="px-3 pb-2">
                  {/* Title and Price Row */}
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-800 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {listing.address.split(',')[0]}
                      </p>
                    </div>
                    <span className="text-lg font-medium text-gray-800 flex-shrink-0">
                      ${listing.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Specs Row */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-6 text-gray-500 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4" />
                        {listing.beds}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4" />
                        {listing.baths}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="h-4 w-4" />
                        {listing.sqft.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Plus Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to favorites or similar action
                      }}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16">
            <button className="px-4 py-2 border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors">
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 border transition-colors ${
                  page === 1
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Enhanced Filter Modal */}
      <EnhancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={enhancedFilters}
        onFiltersChange={setEnhancedFilters}
        onApply={() => {}}
        onReset={resetEnhancedFilters}
      />
    </div>
  );
}
