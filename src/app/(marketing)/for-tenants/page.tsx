"use client";

import { useState } from "react";
import { Navbar } from "@/components/marketing/navbar";
import Footer from "@/components/marketing/Footer";
import { Search, Shield, Zap, MessageSquare, DollarSign, Wrench, Check, FileText, Key, Lock } from "lucide-react";

export default function ForTenantsPage() {
  const [location, setLocation] = useState("");
  const [beds, setBeds] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (beds) params.set("beds", beds);
    if (price) params.set("price", price);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Height with Background Image */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/hero-tenant.jpg")',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Navbar positioned on top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar />
        </div>

        {/* Hero Text Content - Centered with search box */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="w-full text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.1] tracking-tight mb-6 whitespace-nowrap">
              Find Your Perfect Rental
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 tracking-tight mb-8 sm:mb-12">
              Browse verified listings, apply online, and move in with confidence in days, not weeks.
              <br />
              No fake listings, no scams.
            </p>

            {/* Search box — glass-style container (same as main homepage) */}
            <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-full p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-3">
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
              <button 
                className="w-full md:w-auto rounded-full px-6 bg-black hover:bg-gray-800 h-12 text-white font-medium transition-colors flex-shrink-0"
                onClick={handleSearch}
              >
                <span className="flex items-center justify-center">
                  <span>Search</span>
                  <span className="ml-2 text-lg">🔍</span>
                </span>
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-200">
              Popular: <a href="/search?city=san-francisco" className="text-white hover:underline">San Francisco</a> • <a href="/search?city=austin" className="text-white hover:underline">Austin</a> • <a href="/search?city=denver" className="text-white hover:underline">Denver</a> • <a href="/search?city=miami" className="text-white hover:underline">Miami</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nomerlo - Card Decorator UI */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl md:text-4xl font-semibold text-gray-900 lg:text-5xl">Why Renters Love Nomerlo</h2>
            <p className="mt-4 text-gray-600 text-lg">Everything you need to find your perfect home, all in one place.</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-sm gap-6 md:max-w-full md:grid-cols-3 md:mt-16">
            {/* Card 1 - Verified Listings */}
            <div className="group text-center rounded-lg bg-gray-50 border-0 shadow-none p-6">
              <div className="pb-3">
                {/* Card Decorator with Grid Pattern */}
                <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                  <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-gray-200">
                    <Shield className="size-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Verified Listings</h3>
              </div>
              <p className="text-sm text-gray-600">Every listing is verified by our team. No fake photos, no bait-and-switch, no scams.</p>
            </div>

            {/* Card 2 - Apply Instantly */}
            <div className="group text-center rounded-lg bg-gray-50 border-0 shadow-none p-6">
              <div className="pb-3">
                <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                  <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-gray-200">
                    <Zap className="size-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Apply Instantly</h3>
              </div>
              <p className="text-sm text-gray-600">One application works for multiple properties. No more filling out the same forms over and over.</p>
            </div>

            {/* Card 3 - Secure & Safe */}
            <div className="group text-center rounded-lg bg-gray-50 border-0 shadow-none p-6">
              <div className="pb-3">
                <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                  <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-gray-200">
                    <Lock className="size-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Secure & Safe</h3>
              </div>
              <p className="text-sm text-gray-600">Your data is protected. Communicate directly with verified landlords through our secure platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Black Background with Grid Borders & Hover Effects */}
      <section id="features" className="py-20 bg-[#0d0a04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tight max-w-md">
              Everything You Need to Find Your Home
            </h2>
            <p className="text-base text-white/75 max-w-xl leading-relaxed tracking-tight">
              From search to move-in, we've got you covered. With our modern platform and dedicated support, finding your perfect rental is faster, transparent, and stress-free.
            </p>
          </div>
          
          {/* Features Grid with Borders and Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {[
              {
                number: "01",
                title: "Smart Search",
                description: "Filter by location, price, amenities, and more. Our intelligent search helps you find exactly what you need in seconds.",
                icon: <Search className="h-6 w-6" />,
              },
              {
                number: "02",
                title: "Verified Listings",
                description: "Every listing is verified by our team. No fake photos, no bait-and-switch, no scams. Only real homes from real landlords.",
                icon: <Shield className="h-6 w-6" />,
              },
              {
                number: "03",
                title: "Instant Apply",
                description: "One application works for multiple properties. Apply in minutes, not hours. Track your application status in real-time.",
                icon: <Zap className="h-6 w-6" />,
              },
              {
                number: "04",
                title: "Secure Messaging",
                description: "Chat directly with verified landlords. All communication in one place, secure and easy to track.",
                icon: <MessageSquare className="h-6 w-6" />,
              },
              {
                number: "05",
                title: "Easy Payments",
                description: "Pay rent online with ease. Set up autopay and never miss a payment. View your payment history anytime.",
                icon: <DollarSign className="h-6 w-6" />,
              },
              {
                number: "06",
                title: "Maintenance Requests",
                description: "Submit requests with photos. Track progress in real-time. Get issues resolved faster than ever.",
                icon: <Wrench className="h-6 w-6" />,
              },
            ].map((feature, index) => (
              <div
                key={feature.number}
                className={`
                  flex flex-col py-10 px-8 relative group/feature
                  border-white/10
                  ${index % 3 !== 2 ? 'lg:border-r' : ''}
                  ${index < 3 ? 'lg:border-b' : ''}
                  ${index % 2 !== 1 ? 'md:border-r lg:border-r-0' : 'md:border-r-0'}
                  ${index < 4 ? 'md:border-b lg:border-b-0' : ''}
                  ${index < 3 ? '' : ''}
                  md:border-b lg:border-b-0
                  ${index < 3 ? 'lg:border-b' : ''}
                `}
              >
                {/* Hover gradient effect - top rows fade up, bottom rows fade down */}
                {index < 3 ? (
                  <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                ) : (
                  <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                )}
                
                {/* Number */}
                <p className="text-2xl md:text-3xl font-semibold text-white/30 uppercase tracking-tight mb-6 relative z-10">
                  {feature.number}
                </p>
                
                {/* Icon */}
                <div className="mb-4 relative z-10 text-white/60 group-hover/feature:text-emerald-400 transition-colors duration-300">
                  {feature.icon}
                </div>
                
                {/* Title with animated left bar */}
                <div className="text-xl md:text-2xl font-semibold mb-3 relative z-10">
                  <div className="absolute -left-8 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/20 group-hover/feature:bg-emerald-500 transition-all duration-300 origin-center" />
                  <span className="group-hover/feature:translate-x-2 transition duration-300 inline-block text-white">
                    {feature.title}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-sm md:text-base text-white/60 leading-relaxed relative z-10 max-w-xs group-hover/feature:text-white/75 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Tabs with Mockup UI */}
      <section className="overflow-hidden bg-gray-50 py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="flex w-full flex-col lg:max-w-3xl">
            <span className="text-sm font-semibold text-gray-500 md:text-base">How It Works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-gray-900 lg:text-5xl">Find your home in 3 simple steps</h2>
            <p className="mt-4 text-lg text-gray-600 md:mt-5 md:text-xl">
              Our streamlined process makes finding and securing your perfect rental faster and easier than ever before.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:gap-16 lg:grid-cols-2 lg:items-center">
            {/* Steps List */}
            <ul className="flex flex-col">
              {[
                {
                  title: "Search & Discover",
                  subtitle: "Browse thousands of verified listings. Filter by location, price, bedrooms, amenities, and more to find properties that match your needs.",
                  icon: <Search className="h-5 w-5" />,
                },
                {
                  title: "Apply with One Click",
                  subtitle: "Submit your rental application once and use it for multiple properties. Track your application status in real-time and get notified instantly.",
                  icon: <FileText className="h-5 w-5" />,
                },
                {
                  title: "Sign & Move In",
                  subtitle: "Sign your lease digitally, set up automatic rent payments, and get your keys. Welcome to your new home—it's that simple.",
                  icon: <Key className="h-5 w-5" />,
                },
              ].map((item, index) => (
                <li 
                  key={item.title} 
                  className="group border-l-2 border-gray-200 hover:border-gray-900 pl-6 py-6 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">{item.title}</h3>
                      <p className="mt-2 text-gray-600">{item.subtitle}</p>
                      <a 
                        href="/listings" 
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        Learn more
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Mockup Image */}
            <div className="relative -ml-4 w-screen md:w-full lg:h-[560px]">
              <div className="-mx-4 flex items-center justify-center lg:absolute lg:mr-9.5 lg:-ml-0 lg:h-[560px] lg:w-[50vw] lg:justify-start">
                <img
                  alt="Nomerlo Dashboard Mockup"
                  src="https://www.untitledui.com/marketing/screen-mockups/mackbook-pro-screen-mockup-light.webp"
                  className="h-full object-contain lg:max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Wall of Love */}
      <section className="flex flex-col items-center gap-16 bg-white py-16 lg:py-24">
        <div className="flex max-w-7xl flex-col items-center gap-4 px-4 text-center lg:gap-5 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 lg:text-5xl">What Renters Are Saying</h2>
          <p className="text-lg text-gray-600 lg:text-xl">Hear first-hand from our incredible community of renters.</p>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:px-8">
          {[
            {
              id: "review-01",
              quote: "So much better than Craigslist! Every listing I viewed was real and exactly as described. No more wasting time on fake posts.",
              author: {
                name: "Sienna Hewitt",
                location: "Renter in San Francisco",
                imageUrl: "https://www.untitledui.com/images/avatars/sienna-hewitt?fm=webp&q=80",
              },
            },
            {
              id: "review-02",
              quote: "The verified listings feature is a game-changer. I knew every property was legit before I even scheduled a tour. Found my apartment in 3 days!",
              author: {
                name: "Kari Rasmussen",
                location: "Renter in Austin",
                imageUrl: "https://www.untitledui.com/images/avatars/kari-rasmussen?fm=webp&q=80",
              },
            },
            {
              id: "review-03",
              quote: "One application for multiple properties saved me hours of paperwork. Applied to 5 apartments and got approved for 3 within a week!",
              author: {
                name: "Amélie Laurent",
                location: "Renter in Denver",
                imageUrl: "https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80",
              },
            },
            {
              id: "review-04",
              quote: "The secure messaging made communicating with my landlord so easy. No more sketchy phone calls or email chains. Everything is in one place.",
              author: {
                name: "Aliah Lane",
                location: "Renter in Miami",
                imageUrl: "https://www.untitledui.com/images/avatars/aliah-lane?fm=webp&q=80",
              },
            },
            {
              id: "review-05",
              quote: "Paying rent online with autopay is so convenient. I set it up once and never worry about late fees. The payment history is super helpful for taxes too.",
              author: {
                name: "Eduard Franz",
                location: "Renter in Seattle",
                imageUrl: "https://www.untitledui.com/images/avatars/eduard-franz?fm=webp&q=80",
              },
            },
            {
              id: "review-06",
              quote: "Submitted a maintenance request at 10pm and my landlord responded by morning. The photo upload feature made it easy to show exactly what was wrong.",
              author: {
                name: "Lily-Rose Chedjou",
                location: "Renter in Chicago",
                imageUrl: "https://www.untitledui.com/images/avatars/lily-rose-chedjou?fm=webp&q=80",
              },
            },
          ].map((review) => (
            <div key={review.id} className="flex flex-col items-start gap-8 rounded-xl bg-gray-50 p-6 lg:justify-between lg:p-8">
              <div className="flex flex-col items-start gap-4">
                {/* Star Rating */}
                <div aria-hidden="true" className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-base font-medium text-gray-900">"{review.quote}"</blockquote>
              </div>
              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={review.author.imageUrl}
                  alt={review.author.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">{review.author.name}</span>
                    {/* Verified Badge */}
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">{review.author.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section with Screen Mockups */}
      <section className="overflow-hidden bg-black pt-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex w-full max-w-3xl flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Ready to find your perfect home?
            </h2>
            <p className="mt-4 text-lg text-white/70 md:mt-6 md:text-xl">
              Join thousands of renters who found their dream home with Nomerlo. Start your search today.
            </p>
            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12">
              <a 
                href="/sign-up/tenant" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors"
              >
                Create Account
              </a>
              <a 
                href="/listings" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Browse Rentals
              </a>
            </div>
          </div>

          {/* Right Content - Screen Mockups */}
          <div className="relative mx-auto min-h-[360px] md:min-h-[400px] lg:mx-0 lg:min-h-[568px]">
            {/* Desktop Dashboard Mockup */}
            <img
              className="aspect-[3/2] h-auto w-full max-w-5xl rounded object-cover shadow-2xl ring-4 ring-white/10 max-md:hidden md:ml-24 md:h-[360px] md:w-auto md:rounded-xl lg:absolute lg:inset-0 lg:left-24 lg:ml-0 lg:h-[512px]"
              src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
              alt="Nomerlo tenant dashboard showing rental listings"
            />

            {/* Mobile App Mockup */}
            <div className="absolute left-1/2 -translate-x-1/2 md:top-12 md:left-0 md:translate-x-0 lg:top-18">
              <div className="relative w-[180px] md:w-[180px] lg:w-[244px]">
                {/* Phone Frame */}
                <div className="relative rounded-[32px] md:rounded-[40px] bg-gray-900 p-2 shadow-2xl ring-1 ring-white/10">
                  {/* Screen */}
                  <div className="overflow-hidden rounded-[24px] md:rounded-[32px] bg-white">
                    <img
                      src="https://www.untitledui.com/marketing/screen-mockups/dashboard-mobile-mockup-dark-01.webp"
                      alt="Nomerlo mobile app showing property search"
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
