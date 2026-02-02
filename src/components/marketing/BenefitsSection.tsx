"use client";

import React from "react";

const BenefitsSection = () => {
  const benefits = [
    {
      number: "01",
      title: "Best Platform",
      description:
        "Experience a comprehensive property management solution that streamlines every aspect of your real estate operations in one intuitive platform.",
    },
    {
      number: "02",
      title: "Comfort & Space",
      description:
        "Find your perfect space with our extensive property listings, offering comfortable living spaces that match your lifestyle and preferences.",
    },
    {
      number: "03",
      title: "24/7 Support",
      description:
        "Access round-the-clock support through our AI-powered assistance and dedicated customer service team for immediate help whenever you need it.",
    },
    {
      number: "04",
      title: "Best Market Price",
      description:
        "Get competitive market rates and transparent pricing for both property listings and management services, ensuring the best value for your investment.",
    },
  ];

  return (
    <div className="py-10 sm:py-16 md:py-24 bg-white">
      <div className="mx-4 sm:mx-10">
        <div className="border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-lg shadow-gray-200/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Benefits You Get When Using Our Services
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-10 md:mb-16 max-w-2xl text-sm sm:text-base md:text-lg">
              Transform your property management experience with our comprehensive
              platform designed to make property ownership and management
              effortless and profitable.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
              {benefits.map((benefit) => (
                <div
                  key={benefit.number}
                  className="space-y-2 sm:space-y-3 md:space-y-4"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-200">
                    {benefit.number}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 md:mt-16 rounded-2xl sm:rounded-3xl overflow-hidden">
              <img
                src="/images/benefit.png"
                alt="Modern waterfront property with concrete architecture"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
