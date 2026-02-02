"use client";

import { Navbar } from "./navbar";
import HeroSection from "./hero-section";
import FeaturedListings from "./featured-listings/FeaturedListings";
import HowItWorksSection from "./HowItWorksSection";
import BenefitsSection from "./BenefitsSection";
import ExploreProperties from "./ExploreProperties";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "./Footer";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Home, Key } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem, ScaleIn, FloatingElement } from "@/components/ui/motion-primitives";

export const HomeScreen = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            
            {/* Featured Listings - Black background with horizontal scroll */}
            <FeaturedListings />

            {/* Value Proposition Split */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInUp>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">One Platform, Two Experiences</h2>
                        </div>
                    </FadeInUp>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* For Landlords - Black Card */}
                        <FadeInLeft delay={0.1}>
                            <div className="bg-black rounded-xl overflow-hidden p-8 h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                                    <Home className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex items-center mb-4">
                                    <span className="text-sm font-semibold text-white/60 uppercase tracking-wide">FOR LANDLORDS</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Property Management Made Simple</h3>
                                <p className="text-white/60 mb-6">Everything you need to list, lease, and manage your rental properties.</p>
                                
                                <div className="space-y-3 mb-8">
                                    {[
                                        "Collect rent online",
                                        "Screen tenants", 
                                        "Digital leases",
                                        "Track maintenance",
                                        "AI-powered support"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center text-white/80">
                                            <span className="h-5 w-5 mr-3 text-white">✓</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex gap-3">
                                    <a href="/sign-up/landlord" className="bg-white hover:bg-gray-100 text-black px-6 py-2 rounded-lg transition-all duration-300 inline-block font-medium hover:shadow-lg hover:shadow-white/20">
                                        List Your Property
                                    </a>
                                    <a href="/for-landlords" className="border border-white/30 text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 inline-block">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </FadeInLeft>
                        
                        {/* For Tenants - Black Card */}
                        <FadeInRight delay={0.2}>
                            <div className="bg-black rounded-xl overflow-hidden p-8 h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                                    <Key className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex items-center mb-4">
                                    <span className="text-sm font-semibold text-white/60 uppercase tracking-wide">FOR TENANTS</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Verified Listings You Can Trust</h3>
                                <p className="text-white/60 mb-6">Find your perfect home with confidence. No fake listings, no scams.</p>
                                
                                <div className="space-y-3 mb-8">
                                    {[
                                        "Every listing verified",
                                        "Apply online instantly",
                                        "Secure messaging", 
                                        "Easy rent payments",
                                        "Maintenance requests"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center text-white/80">
                                            <span className="h-5 w-5 mr-3 text-white">✓</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex gap-3">
                                    <a href="/listings" className="bg-white hover:bg-gray-100 text-black px-6 py-2 rounded-lg transition-all duration-300 inline-block font-medium hover:shadow-lg hover:shadow-white/20">
                                        Find Your Home
                                    </a>
                                    <a href="/for-tenants" className="border border-white/30 text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 inline-block">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </FadeInRight>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* Trust Indicators - Black Background with Animated Counters */}
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInUp>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Trusted by landlords and tenants across the country</h2>
                        </div>
                    </FadeInUp>
                    
                    <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                        <StaggerItem>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                                <AnimatedCounter target={5000} suffix="+" />
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">Landlords</div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                                <AnimatedCounter target={50000} suffix="+" />
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">Units Managed</div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                                <AnimatedCounter target={100} suffix="%" />
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">Verified Listings</div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                                <AnimatedCounter target={4.9} decimals={1} suffix="/5" />
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">Average Rating</div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                                <AnimatedCounter target={50} prefix="$" suffix="M+" />
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">Rent Processed Monthly</div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
            </section>

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Explore Properties Section */}
            <ExploreProperties />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* CTA Section with Screen Mockups */}
            <section className="overflow-hidden bg-black pt-16 md:py-24 mt-16 md:mt-24">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2">
                    {/* Left Content */}
                    <FadeInLeft>
                        <div className="flex w-full max-w-3xl flex-col">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                                Ready to get started?
                            </h2>
                            <p className="mt-4 text-lg text-white/70 md:mt-6 md:text-xl">
                                Join thousands of landlords and tenants who've made the switch. Start free today.
                            </p>
                            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12">
                                <a 
                                    href="/listings" 
                                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                                >
                                    Find Your Home
                                </a>
                                <a 
                                    href="/sign-up/landlord" 
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                                >
                                    List Your Property
                                </a>
                            </div>
                        </div>
                    </FadeInLeft>

                    {/* Right Content - Screen Mockups */}
                    <FadeInRight delay={0.2}>
                        <div className="relative mx-auto min-h-[360px] md:min-h-[400px] lg:mx-0 lg:min-h-[568px]">
                            {/* Desktop Dashboard Mockup */}
                            <ScaleIn delay={0.3}>
                                <img
                                    className="aspect-[3/2] h-auto w-full max-w-5xl rounded object-cover shadow-2xl ring-4 ring-white/10 max-md:hidden md:ml-24 md:h-[360px] md:w-auto md:rounded-xl lg:absolute lg:inset-0 lg:left-24 lg:ml-0 lg:h-[512px]"
                                    src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
                                    alt="Nomerlo dashboard"
                                />
                            </ScaleIn>

                            {/* Mobile App Mockup */}
                            <div className="absolute left-1/2 -translate-x-1/2 md:top-12 md:left-0 md:translate-x-0 lg:top-18">
                                <FloatingElement duration={4} distance={8}>
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
                                </FloatingElement>
                            </div>
                        </div>
                    </FadeInRight>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};
