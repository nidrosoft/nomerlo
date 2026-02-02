"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Property Owner",
    image: "/images/explore-1.png",
    quote:
      "This platform has revolutionized how I manage my properties. The automated rent collection and maintenance tracking have saved me countless hours. It's a game-changer for property owners who want to streamline their operations.",
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    image: "/images/explore-2.png",
    quote:
      "The comprehensive reporting tools and analytics have given me invaluable insights into my property portfolio's performance. I can make data-driven decisions with confidence, and the tenant screening process is seamless.",
  },
  {
    name: "Emily Rodriguez",
    role: "Property Manager",
    image: "/images/explore-3.png",
    quote:
      "Managing multiple properties used to be overwhelming, but this software has made it effortless. The communication tools and maintenance coordination features have improved our tenant satisfaction significantly.",
  },
  {
    name: "David Thompson",
    role: "Landlord",
    image: "/images/explore-4.png",
    quote:
      "I've tried several property management platforms, but this one stands out. The AI-powered screening and automated notifications have reduced my workload dramatically. It's worth every penny.",
  },
  {
    name: "Lisa Anderson",
    role: "Real Estate Professional",
    image: "/images/explore-1.png",
    quote:
      "The integration capabilities with other real estate platforms and the intuitive interface make this software indispensable. It's helped us scale our property management business efficiently.",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="py-12 sm:py-16 md:py-24 bg-black mx-4 sm:mx-10 rounded-2xl sm:rounded-3xl shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            What Our Client's Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 md:mb-12">
            Discover why property owners and managers trust our platform to
            streamline their operations and enhance their property management
            experience.
          </p>
        </div>

        <div className="relative">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full overflow-hidden bg-gray-700">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                  {currentTestimonial.name}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>
            <blockquote className="text-base sm:text-xl md:text-2xl font-medium leading-relaxed text-white max-w-4xl">
              "{currentTestimonial.quote}"
            </blockquote>
          </div>

          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={goToPrevious}
              className="bg-white text-black hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goToNext}
              className="bg-white text-black hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
