"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:h-screen w-full mt-16 sm:mt-20 md:mt-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 mx-4 sm:mx-6 md:mx-10 bg-no-repeat bg-center bg-contain rounded-3xl"
        style={{
          backgroundImage: 'url("/images/footer.png")',
        }}
      />

      {/* Footer Content */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-20 lg:right-20 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6 md:space-x-8">
              <a
                href="/for-landlords"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                For Landlords
              </a>
              <a
                href="/for-tenants"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                For Tenants
              </a>
              <a
                href="/listings"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                Browse Rentals
              </a>
              <a
                href="/pricing"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                Pricing
              </a>
              <a
                href="/help"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                Help Center
              </a>
              <a
                href="/about"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="mt-6 sm:mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center md:text-left">
              &copy; 2026 Nomerlo. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
              <a
                href="/privacy"
                className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-gray-900"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-gray-900"
              >
                Terms of Service
              </a>
              <a
                href="/security"
                className="text-xs sm:text-sm md:text-base text-gray-600 hover:text-gray-900"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
