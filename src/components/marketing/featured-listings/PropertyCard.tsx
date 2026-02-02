"use client";

import { MapPin, Bed, Bath, Wifi, Star } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  property_type: string;
  photos?: string[];
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex-none w-[260px] sm:w-[280px] md:w-[320px] snap-start">
      <a href={`/listings/${property.id}`}>
        <div className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl backdrop-blur-md bg-white/10 border border-gray-800/80 h-full">
          <div className="relative h-48">
            <img
              src={
                property.photos && property.photos.length > 0
                  ? property.photos[0]
                  : "/images/featured-listing.png"
              }
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-3 py-1 text-xs font-medium">
              {property.property_type
                ? property.property_type.charAt(0).toUpperCase() +
                  property.property_type.slice(1)
                : "House"}
            </span>
            <div className="absolute top-3 right-3 flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mr-1" />
              <span className="text-xs font-medium">
                {(4 + Math.random()).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center text-gray-300 text-xs mb-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.address}</span>
            </div>
            <h3 className="font-bold text-base mb-2 text-white">
              {property.name}
            </h3>
            <div className="flex flex-wrap gap-4 mb-3">
              {property.bedrooms && (
                <div className="flex items-center text-gray-300 text-sm">
                  <Bed className="h-4 w-4 mr-1 text-[#007481]" />
                  <span>
                    {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center text-gray-300 text-sm">
                  <Bath className="h-4 w-4 mr-1 text-[#007481]" />
                  <span>
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "Bath" : "Baths"}
                  </span>
                </div>
              )}
              <div className="flex items-center text-gray-300 text-sm">
                <Wifi className="h-4 w-4 mr-1 text-[#007481]" />
                <span>WiFi</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg text-white">
                {property.price ? formatCurrency(property.price) : "$1,200"}
                <span className="text-sm font-normal text-gray-400">
                  {" "}
                  / month
                </span>
              </div>
              <button className="rounded-full px-4 py-1.5 bg-transparent border border-white/20 text-white hover:text-[#007481] text-sm transition-colors">
                View
              </button>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default PropertyCard;
