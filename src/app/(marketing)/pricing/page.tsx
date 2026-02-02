"use client";

import { useState } from "react";
import { Navbar } from "@/components/marketing/navbar";
import Footer from "@/components/marketing/Footer";
import { Check, X, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

// Landlord FAQs
const landlordFaqs = [
  { q: "Can I try before I buy?", a: "Yes! Our Starter plan is completely free for up to 3 units. No credit card required. You can also start a 14-day free trial of Professional." },
  { q: "How does billing work?", a: "We bill monthly based on the number of units in your portfolio. You can upgrade, downgrade, or cancel anytime." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, ACH bank transfers, and wire transfers for Enterprise customers." },
  { q: "Is there a setup fee?", a: "No setup fees for Starter or Professional plans. Enterprise plans may include onboarding services." },
  { q: "Can I switch plans later?", a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle." },
  { q: "Do you offer discounts for annual billing?", a: "Yes! Save 20% when you pay annually on Professional plans." },
  { q: "How do I collect rent from tenants?", a: "Tenants can pay via ACH bank transfer, credit/debit card, or set up autopay. You'll receive same-day deposits on Professional plans." },
  { q: "What's included in tenant screening?", a: "Basic screening includes credit checks. Advanced screening (Professional+) adds criminal background, eviction history, and income verification." },
  { q: "Can I manage multiple properties?", a: "Yes! You can manage unlimited properties. Pricing is based on total units across all properties." },
  { q: "How do maintenance requests work?", a: "Tenants submit requests through their portal with photos. You can assign vendors, track progress, and communicate—all in one place." },
];

// Tenant FAQs
const tenantFaqs = [
  { q: "Is Nomerlo free for tenants?", a: "Yes! Nomerlo is completely free for tenants. You can search listings, apply, pay rent, and submit maintenance requests at no cost." },
  { q: "How do I know listings are verified?", a: "Every listing on Nomerlo is verified by our team. We confirm property ownership, photos, and listing accuracy before publishing." },
  { q: "How does the application process work?", a: "Create one renter profile with your info, income, and references. Apply to multiple properties with a single click—no repetitive forms." },
  { q: "What information do I need to apply?", a: "You'll need government ID, proof of income (pay stubs or tax returns), rental history, and references. Our system guides you through it." },
  { q: "How long does approval take?", a: "Most applications are reviewed within 24-48 hours. Some landlords using our instant screening can approve in minutes." },
  { q: "Can I pay rent online?", a: "Yes! Pay via bank transfer (ACH) or credit/debit card. You can also set up autopay to never miss a payment." },
  { q: "How do I submit maintenance requests?", a: "Log into your tenant portal, describe the issue, upload photos, and submit. You'll receive updates as your request is processed." },
  { q: "Is my personal information secure?", a: "Absolutely. We use bank-level encryption and never share your data with third parties without your consent." },
  { q: "Can I communicate with my landlord through Nomerlo?", a: "Yes! Our secure messaging system keeps all communication in one place with a complete history." },
  { q: "What if I have issues with my landlord?", a: "Our support team can help mediate disputes. We also provide resources on tenant rights and local regulations." },
];

export default function PricingPage() {
  const [openLandlordFaq, setOpenLandlordFaq] = useState<number | null>(0);
  const [openTenantFaq, setOpenTenantFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Black Background */}
      <section className="pt-32 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start free with up to 3 units. Upgrade as your portfolio grows.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900">Starter</h3>
              <p className="text-gray-500 mt-2">Perfect for getting started</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">Free</span>
              </div>
              <p className="text-gray-500 mt-2">For 1-3 units</p>
              
              <a href="/sign-up/landlord" className="mt-8 block w-full text-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Get Started Free
              </a>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Rent collection",
                  "Basic tenant screening",
                  "Maintenance requests",
                  "Tenant portal",
                  "Email support",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-gray-900 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Plan */}
            <div className="border-2 border-gray-900 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-900 text-white text-sm px-4 py-1 rounded-full">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Professional</h3>
              <p className="text-gray-500 mt-2">For growing portfolios</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">$12</span>
                <span className="text-gray-500 ml-2">per unit/month</span>
              </div>
              <p className="text-gray-500 mt-2">4-49 units</p>
              
              <a href="/sign-up/landlord" className="mt-8 block w-full text-center py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Start Free Trial
              </a>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Everything in Starter",
                  "Advanced tenant screening",
                  "Digital lease signing",
                  "Accounting & reports",
                  "Listing syndication",
                  "Priority support",
                  "API access",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-gray-900 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
              <p className="text-gray-500 mt-2">For large portfolios</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">Custom</span>
              </div>
              <p className="text-gray-500 mt-2">50+ units</p>
              
              <a href="/contact" className="mt-8 block w-full text-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Contact Sales
              </a>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Everything in Professional",
                  "Dedicated account manager",
                  "Custom integrations",
                  "White-label options",
                  "SLA guarantee",
                  "On-site training",
                  "Custom reporting",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-gray-900 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table - Dark Theme */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Compare Plans</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 font-semibold text-white">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-400">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-white">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Units", starter: "1-3", pro: "4-49", enterprise: "50+" },
                  { feature: "Rent Collection", starter: true, pro: true, enterprise: true },
                  { feature: "Same-day ACH", starter: false, pro: true, enterprise: true },
                  { feature: "Tenant Screening", starter: "Basic", pro: "Advanced", enterprise: "Advanced" },
                  { feature: "Digital Leases", starter: false, pro: true, enterprise: true },
                  { feature: "Maintenance Tracking", starter: true, pro: true, enterprise: true },
                  { feature: "Accounting Reports", starter: false, pro: true, enterprise: true },
                  { feature: "Listing Syndication", starter: false, pro: true, enterprise: true },
                  { feature: "API Access", starter: false, pro: true, enterprise: true },
                  { feature: "Dedicated Support", starter: false, pro: false, enterprise: true },
                  { feature: "Custom Integrations", starter: false, pro: false, enterprise: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-4 px-4 text-gray-300">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check className="h-5 w-5 text-white mx-auto" /> : <X className="h-5 w-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-white/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="h-5 w-5 text-white mx-auto" /> : <X className="h-5 w-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-white">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="h-5 w-5 text-white mx-auto" /> : <X className="h-5 w-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section - Side by Side */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to know about the product and billing.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Landlord FAQs */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mr-3 text-sm">🏠</span>
                For Landlords
              </h3>
              <div className="space-y-3">
                {landlordFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border border-gray-200 overflow-hidden transition-colors ${
                      openLandlordFaq === index ? 'bg-white' : 'bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setOpenLandlordFaq(openLandlordFaq === index ? null : index)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                          openLandlordFaq === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: openLandlordFaq === index ? 'auto' : 0,
                        opacity: openLandlordFaq === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tenant FAQs */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mr-3 text-sm">🔑</span>
                For Tenants
              </h3>
              <div className="space-y-3">
                {tenantFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border border-gray-200 overflow-hidden transition-colors ${
                      openTenantFaq === index ? 'bg-white' : 'bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setOpenTenantFaq(openTenantFaq === index ? null : index)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                          openTenantFaq === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: openTenantFaq === index ? 'auto' : 0,
                        opacity: openTenantFaq === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Screen Mockups */}
      <section className="overflow-hidden bg-black pt-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex w-full max-w-3xl flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-white/70 md:mt-6 md:text-xl">
              Join thousands of landlords managing their properties with Nomerlo. Start free today.
            </p>
            <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors"
              >
                Contact Sales
              </a>
              <a 
                href="/sign-up/landlord" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Start Free
              </a>
            </div>
          </div>

          {/* Right Content - Screen Mockups */}
          <div className="relative mx-auto min-h-[360px] md:min-h-[400px] lg:mx-0 lg:min-h-[568px]">
            {/* Desktop Dashboard Mockup */}
            <img
              className="aspect-[3/2] h-auto w-full max-w-5xl rounded object-cover shadow-2xl ring-4 ring-white/10 max-md:hidden md:ml-24 md:h-[360px] md:w-auto md:rounded-xl lg:absolute lg:inset-0 lg:left-24 lg:ml-0 lg:h-[512px]"
              src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
              alt="Nomerlo dashboard"
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
