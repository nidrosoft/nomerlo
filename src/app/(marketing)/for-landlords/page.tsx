"use client";

import { Navbar } from "@/components/marketing/navbar";
import Footer from "@/components/marketing/Footer";
import { CreditCard, ClipboardList, UserCheck, FileText, Wrench, BarChart3, Check, Shield, Zap, Lock, DollarSign, MessageSquare } from "lucide-react";

export default function ForLandlordsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Height with Background Image */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/for-landlord.jpg")',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Navbar positioned on top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar />
        </div>

        {/* Hero Text Content - Centered Vertically */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 lg:px-[100px]">
          <div className="max-w-5xl text-center mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
              Property Management
              <br />
              Made Simple
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto tracking-tight mb-8">
              Stop juggling spreadsheets, chasing payments, and playing phone tag with tenants.
              <br />
              Nomerlo handles it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/sign-up/landlord" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors inline-block">
                List Your Property Free
              </a>
              <a href="#features" className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors inline-block">
                Learn More
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-300">
              Free for 1-3 units • No credit card required • Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Sound Familiar - Card Decorator UI (same as For Tenants "Why Renters Love Nomerlo") */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl md:text-4xl font-semibold text-gray-900 lg:text-5xl">Sound Familiar?</h2>
            <p className="mt-4 text-gray-600 text-lg">The struggles every landlord knows too well. There's a better way.</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-sm gap-6 md:max-w-full md:grid-cols-3 md:mt-16">
            {/* Card 1 - Chasing Rent */}
            <div className="group text-center rounded-lg bg-gray-50 border-0 shadow-none p-6">
              <div className="pb-3">
                <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                  <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-gray-200">
                    <DollarSign className="size-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Chasing Rent</h3>
              </div>
              <p className="text-sm text-gray-600">Reminders, late fees, awkward conversations. Every. Single. Month.</p>
            </div>

            {/* Card 2 - Endless Texts */}
            <div className="group text-center rounded-lg bg-gray-50 border-0 shadow-none p-6">
              <div className="pb-3">
                <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                  <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-gray-200">
                    <MessageSquare className="size-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Endless Texts</h3>
              </div>
              <p className="text-sm text-gray-600">"Is the plumber coming?" "When's rent due?" Your phone never stops.</p>
            </div>

            {/* Card 3 - Spreadsheet Chaos */}
            <div className="group text-center rounded-lg bg-gray-50 border-0 shadow-none p-6">
              <div className="pb-3">
                <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                  <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-gray-200">
                    <BarChart3 className="size-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Spreadsheet Chaos</h3>
              </div>
              <p className="text-sm text-gray-600">Payment logs, expense files, lease docs scattered everywhere.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="#features" className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 font-medium transition-colors">
              There's a better way
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid - Black Background with Grid Borders & Hover Effects (same as For Tenants) */}
      <section id="features" className="py-20 bg-[#0d0a04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tight max-w-md">
              Everything You Need to Manage Properties Like a Pro
            </h2>
            <p className="text-base text-white/75 max-w-xl leading-relaxed tracking-tight">
              From listing your first vacancy to collecting rent—it's all here. Powerful tools designed to save you time and maximize your returns.
            </p>
          </div>
          
          {/* Features Grid with Borders and Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {[
              {
                number: "01",
                title: "Rent Collection",
                description: "Same-day ACH deposits. Autopay setup. Automatic late fee calculations. Never chase a payment again.",
                icon: <CreditCard className="h-6 w-6" />,
              },
              {
                number: "02",
                title: "Listings & Marketing",
                description: "AI-powered listings that convert. One-click syndication to Zillow, Trulia, and 20+ sites.",
                icon: <ClipboardList className="h-6 w-6" />,
              },
              {
                number: "03",
                title: "Tenant Screening",
                description: "Credit, criminal, and eviction checks in minutes. Make informed decisions with comprehensive reports.",
                icon: <UserCheck className="h-6 w-6" />,
              },
              {
                number: "04",
                title: "Lease Management",
                description: "Digital leases with legally-binding e-signatures. Auto-renewals and rent increase notices.",
                icon: <FileText className="h-6 w-6" />,
              },
              {
                number: "05",
                title: "Maintenance Tracking",
                description: "Receive requests with photos. Assign vendors. Track progress. Keep tenants informed automatically.",
                icon: <Wrench className="h-6 w-6" />,
              },
              {
                number: "06",
                title: "Reports & Accounting",
                description: "Income statements, expense tracking, tax-ready documents. Export to your accountant in one click.",
                icon: <BarChart3 className="h-6 w-6" />,
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
                  md:border-b lg:border-b-0
                  ${index < 3 ? 'lg:border-b' : ''}
                `}
              >
                {/* Hover gradient effect */}
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

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Start free. Upgrade as you grow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "Free", units: "1-3 units", features: ["Rent collection", "Basic screening", "Maintenance requests", "Email support"] },
              { name: "Professional", price: "$12", units: "per unit/month", features: ["Everything in Starter", "Advanced screening", "Digital leases", "Accounting reports", "Priority support"], popular: true },
              { name: "Enterprise", price: "Custom", units: "50+ units", features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "API access", "SLA guarantee"] },
            ].map((plan, i) => (
              <div key={i} className={`p-6 rounded-lg border ${plan.popular ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-200'}`}>
                {plan.popular && <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">Most Popular</span>}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.units}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 text-gray-900 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="/sign-up/landlord" className={`block text-center py-2 px-4 rounded-lg font-medium transition-colors ${plan.popular ? 'bg-gray-900 text-white hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a href="/pricing" className="text-gray-900 hover:text-gray-600 font-medium inline-flex items-center gap-2">
              View full pricing details
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials - Wall of Love (same as For Tenants) */}
      <section className="flex flex-col items-center gap-16 bg-gray-50 py-16 lg:py-24">
        <div className="flex max-w-7xl flex-col items-center gap-4 px-4 text-center lg:gap-5 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 lg:text-5xl">What Landlords Are Saying</h2>
          <p className="text-lg text-gray-600 lg:text-xl">Hear first-hand from property owners who've transformed their business.</p>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:px-8">
          {[
            {
              id: "review-01",
              quote: "Nomerlo made renting my first investment property a breeze. I had no idea what I was doing, but their platform walked me through everything step by step.",
              author: {
                name: "Mike Chen",
                location: "4 units in Austin",
                imageUrl: "https://www.untitledui.com/images/avatars/eduard-franz?fm=webp&q=80",
              },
            },
            {
              id: "review-02",
              quote: "The rent collection feature alone is worth it. I went from chasing tenants every month to having 100% on-time payments with autopay. Game changer.",
              author: {
                name: "Sarah Martinez",
                location: "12 units in Denver",
                imageUrl: "https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80",
              },
            },
            {
              id: "review-03",
              quote: "Best property management software I've used. And I've tried them all. The tenant screening saved me from a nightmare tenant last month.",
              author: {
                name: "David Kim",
                location: "8 units in Seattle",
                imageUrl: "https://www.untitledui.com/images/avatars/kari-rasmussen?fm=webp&q=80",
              },
            },
            {
              id: "review-04",
              quote: "The maintenance tracking is incredible. Tenants submit requests with photos, I assign vendors, and everyone stays in the loop automatically.",
              author: {
                name: "Jennifer Walsh",
                location: "6 units in Miami",
                imageUrl: "https://www.untitledui.com/images/avatars/sienna-hewitt?fm=webp&q=80",
              },
            },
            {
              id: "review-05",
              quote: "Tax season used to be a nightmare. Now I export everything to my accountant in one click. The reports are exactly what I need.",
              author: {
                name: "Robert Thompson",
                location: "15 units in Chicago",
                imageUrl: "https://www.untitledui.com/images/avatars/aliah-lane?fm=webp&q=80",
              },
            },
            {
              id: "review-06",
              quote: "Support team is amazing. Had an issue at 10pm on a Saturday and got help within 15 minutes. That's the kind of service that keeps me loyal.",
              author: {
                name: "Amanda Foster",
                location: "23 units in Phoenix",
                imageUrl: "https://www.untitledui.com/images/avatars/lily-rose-chedjou?fm=webp&q=80",
              },
            },
          ].map((review) => (
            <div key={review.id} className="flex flex-col items-start gap-8 rounded-xl bg-white p-6 lg:justify-between lg:p-8">
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

      {/* CTA Section with Screen Mockups (same as For Tenants) */}
      <section className="overflow-hidden bg-black pt-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex w-full max-w-3xl flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Ready to simplify your property management?
            </h2>
            <p className="mt-4 text-lg text-white/70 md:mt-6 md:text-xl">
              Join thousands of landlords who've made the switch. Start free today.
            </p>
            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12">
              <a 
                href="/pricing" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors"
              >
                View Pricing
              </a>
              <a 
                href="/sign-up/landlord" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Start Free Trial
              </a>
            </div>
          </div>

          {/* Right Content - Screen Mockups */}
          <div className="relative mx-auto min-h-[360px] md:min-h-[400px] lg:mx-0 lg:min-h-[568px]">
            {/* Desktop Dashboard Mockup */}
            <img
              className="aspect-[3/2] h-auto w-full max-w-5xl rounded object-cover shadow-2xl ring-4 ring-white/10 max-md:hidden md:ml-24 md:h-[360px] md:w-auto md:rounded-xl lg:absolute lg:inset-0 lg:left-24 lg:ml-0 lg:h-[512px]"
              src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
              alt="Nomerlo landlord dashboard"
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
                      alt="Nomerlo mobile app"
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
