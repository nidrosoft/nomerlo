"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Search, Phone, Mail, MapPin, Star, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const demoVendors = [
  {
    id: "1",
    name: "ABC Plumbing",
    contactName: "Mike Johnson",
    email: "mike@abcplumbing.com",
    phone: "(555) 123-4567",
    categories: ["Plumbing"],
    rating: 4.8,
    completedJobs: 12,
    totalSpent: 5400,
    status: "active",
  },
  {
    id: "2",
    name: "Cool Air Services",
    contactName: "Sarah Williams",
    email: "sarah@coolair.com",
    phone: "(555) 234-5678",
    categories: ["HVAC", "Electrical"],
    rating: 4.5,
    completedJobs: 8,
    totalSpent: 3200,
    status: "active",
  },
  {
    id: "3",
    name: "Green Thumb LLC",
    contactName: "David Chen",
    email: "david@greenthumb.com",
    phone: "(555) 345-6789",
    categories: ["Landscaping"],
    rating: 4.9,
    completedJobs: 24,
    totalSpent: 4800,
    status: "active",
  },
  {
    id: "4",
    name: "Quick Fix Handyman",
    contactName: "Tom Brown",
    email: "tom@quickfix.com",
    phone: "(555) 456-7890",
    categories: ["General Maintenance", "Repairs"],
    rating: 4.2,
    completedJobs: 15,
    totalSpent: 2800,
    status: "active",
  },
];

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = demoVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/owner/expenses"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600 mt-1">Manage your service providers and contractors</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="h-5 w-5" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vendors by name or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.contactName}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${vendor.email}`} className="hover:text-indigo-600">{vendor.email}</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <a href={`tel:${vendor.phone}`} className="hover:text-indigo-600">{vendor.phone}</a>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {vendor.categories.map((cat, i) => (
                <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-500">{vendor.completedJobs} jobs</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-900 font-medium">${vendor.totalSpent.toLocaleString()} spent</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
