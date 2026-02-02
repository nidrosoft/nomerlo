"use client";

import { Building2, Key, Wrench, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-12 sm:py-24 bg-white">
      <div className="mx-4 sm:mx-10">
        <div className="border-2 border-gray-100 rounded-3xl p-5 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              How It Works
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-6 sm:leading-8 text-gray-600">
              Simple steps to get started with our property management platform
            </p>
          </div>
          <div className="mx-auto mt-6 sm:mt-10 md:mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8 md:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Property Owners",
                  description:
                    "Take control of your real estate portfolio with our comprehensive property management tools. List properties effortlessly, screen potential tenants automatically, and manage rent collection seamlessly. Our platform streamlines every aspect of property ownership, from maintenance coordination to financial reporting, helping you maximize your investment returns while minimizing administrative overhead.",
                  link: "/for-landlords",
                },
                {
                  icon: Key,
                  title: "Tenants",
                  description:
                    "Find your perfect home and enjoy a hassle-free rental experience. Browse verified listings, submit applications online, and communicate directly with property owners. Our platform makes it easy to pay rent, submit maintenance requests, and access important documents. Plus, build your rental history and improve your credit score through our automated rent reporting system.",
                  link: "/for-tenants",
                },
                {
                  icon: Wrench,
                  title: "Maintenance",
                  description:
                    "Experience efficient maintenance management that keeps properties in top condition. Submit and track maintenance requests with ease, coordinate with trusted service providers, and maintain detailed repair histories. Our AI-powered system helps diagnose issues quickly, schedule preventive maintenance, and ensure timely resolution of all property maintenance needs.",
                  link: "/help",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border-2 border-gray-100 transition-all duration-300 h-full"
                >
                  <div className="absolute top-6 sm:top-8 left-6 sm:left-8 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl bg-black">
                    <item.icon className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                  </div>
                  <div className="pt-16 sm:pt-20">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-4 hover:line-clamp-none transition-all duration-300">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      className="inline-flex items-center text-sm font-semibold text-[#007481] hover:text-[#006670] transition-colors duration-300"
                    >
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
