"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, Building2, Users, Search, ChevronRight } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for enhanced glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto">
          {/* Glass bar */}
          <div 
            className={`
              backdrop-blur-md border rounded-full px-4 sm:px-6 transition-all duration-300
              ${isScrolled 
                ? "bg-black/60 border-white/30 shadow-lg" 
                : "bg-white/10 border-white/20"
              }
            `}
          >
            <div className="flex justify-between h-14 sm:h-16 items-center">
              {/* Logo */}
              <a href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl sm:text-2xl font-bold text-white">nomerlo.</span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:items-center lg:space-x-1">
                <a 
                  href="/" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Home
                </a>
                <a 
                  href="/for-landlords" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  For Landlords
                </a>
                <a 
                  href="/for-tenants" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  For Tenants
                </a>
                <a 
                  href="/listings" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
                >
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Browse
                </a>
                <a 
                  href="/pricing" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Pricing
                </a>
              </div>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex lg:items-center lg:space-x-3">
                <a 
                  href="/sign-in" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors text-sm font-medium"
                >
                  Login
                </a>
                <a 
                  href="/sign-up/landlord" 
                  className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full inline-flex items-center text-sm font-medium transition-colors"
                >
                  List Property
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white hover:bg-white/10 p-2.5 rounded-full transition-colors active:scale-95"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-opacity duration-300
          ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Menu Panel */}
        <div
          className={`
            absolute top-[72px] sm:top-[84px] left-3 right-3 sm:left-4 sm:right-4
            bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl
            transform transition-all duration-300 ease-out overflow-hidden
            ${isMenuOpen 
              ? "translate-y-0 opacity-100" 
              : "-translate-y-4 opacity-0"
            }
          `}
        >
          {/* Main Navigation Links */}
          <div className="p-2">
            <a 
              href="/" 
              className="flex items-center gap-3 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-colors active:scale-[0.98]"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-base font-semibold">Home</span>
                <p className="text-sm text-white/60">Return to homepage</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40" />
            </a>

            <a 
              href="/for-landlords" 
              className="flex items-center gap-3 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-colors active:scale-[0.98]"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-base font-semibold">For Landlords</span>
                <p className="text-sm text-white/60">Manage your properties</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40" />
            </a>

            <a 
              href="/for-tenants" 
              className="flex items-center gap-3 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-colors active:scale-[0.98]"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-base font-semibold">For Tenants</span>
                <p className="text-sm text-white/60">Find your perfect home</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40" />
            </a>

            <a 
              href="/listings" 
              className="flex items-center gap-3 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-colors active:scale-[0.98]"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-base font-semibold">Browse Rentals</span>
                <p className="text-sm text-white/60">Search available listings</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40" />
            </a>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-white/10" />

          {/* CTA Section */}
          <div className="p-4 space-y-3">
            <a 
              href="/sign-in" 
              className="block w-full text-center text-white border border-white/20 hover:bg-white/10 px-6 py-3.5 rounded-2xl font-medium transition-colors active:scale-[0.98]"
              onClick={closeMenu}
            >
              Sign In
            </a>
            <a 
              href="/sign-up/landlord" 
              className="flex items-center justify-center w-full bg-white text-black hover:bg-gray-100 px-6 py-3.5 rounded-2xl font-medium transition-colors active:scale-[0.98]"
              onClick={closeMenu}
            >
              List Your Property
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
