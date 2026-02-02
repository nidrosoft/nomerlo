"use client";

import React from "react";
import { MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react";

const PropertyCard = ({
  image,
  title,
  address,
  beds,
  baths,
  sqft,
}: {
  image: string;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
}) => (
  <div className="space-y-3 sm:space-y-4">
    <div className="relative rounded-3xl overflow-hidden group transition-all duration-300 hover:shadow-2xl">
      <img
        src={image}
        alt={title}
        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 right-4 flex gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <a
          href="/listings"
          className="bg-white hover:bg-gray-100 rounded-full px-4 py-2 text-sm font-medium"
        >
          View
        </a>
        <button className="bg-white hover:bg-gray-100 px-2 py-2 rounded-full">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">{title}</h3>
      <div className="flex items-center text-gray-600 mb-3">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="text-sm">{address}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-600">
        <div className="flex items-center gap-1">
          <BedDouble className="h-4 w-4" />
          <span className="text-sm">{beds} bedrooms</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4" />
          <span className="text-sm">{baths} baths</span>
        </div>
        <div className="flex items-center gap-1">
          <Square className="h-4 w-4" />
          <span className="text-sm">{sqft} Sqft</span>
        </div>
      </div>
    </div>
  </div>
);

const ExploreProperties = () => {
  const properties = [
    {
      image: "/images/explore-1.png",
      title: "Cascading Waters Villa of Serenity",
      address: "3891 Ranchview Dr. Richardson, California",
      beds: 5,
      baths: 6,
      sqft: 5320,
    },
    {
      image: "/images/explore-2.png",
      title: "Starlit Cove Private Villa Retreat",
      address: "3891 Ranchview Dr. Richardson, California",
      beds: 6,
      baths: 8,
      sqft: 6740,
    },
    {
      image: "/images/explore-3.png",
      title: "Golden Sands Haven by the Bay",
      address: "3891 Ranchview Dr. Richardson, California",
      beds: 4,
      baths: 5,
      sqft: 4800,
    },
    {
      image: "/images/explore-4.png",
      title: "Enchanted Garden View Villa Retreat",
      address: "3891 Ranchview Dr. Richardson, California",
      beds: 5,
      baths: 6,
      sqft: 5500,
    },
  ];

  return (
    <div className="py-10 sm:py-16 md:py-24 bg-white">
      <div className="mx-4 sm:mx-6 md:mx-10">
        <div className="border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-5 sm:p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6">
                Explore Our Latest Properties
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl">
                Discover an exclusive collection of architectural masterpieces,
                where luxury meets innovation. Each property is carefully selected
                to offer unparalleled living experiences, combining stunning
                designs with premium locations for those seeking exceptional
                homes.
              </p>
            </div>

            <div className="flex justify-end items-center mb-6 sm:mb-8 md:mb-12">
              <div className="flex gap-2">
                <a
                  href="/listings"
                  className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  View All
                </a>
                <button className="border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {properties.map((property, index) => (
                <PropertyCard key={index} {...property} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreProperties;
