"use client";

import { ArrowLeft, Edit, Pause, Play, Trash2, ExternalLink, Eye, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";

const demoListing = {
  id: "1",
  title: "Modern Downtown Apartment",
  description: "Beautiful 2-bedroom apartment in the heart of downtown. Features modern finishes, in-unit laundry, and stunning city views. Walking distance to restaurants, shops, and public transit.",
  property: "Sunset Apartments",
  unit: "Unit 4B",
  address: "123 Main Street, San Francisco, CA 94102",
  rent: 2500,
  deposit: 2500,
  status: "active",
  availableDate: "2024-02-01",
  leaseTerm: "12 months",
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  petsAllowed: true,
  smokingAllowed: false,
  views: 342,
  inquiries: 18,
  applications: 5,
  publishedAt: "2024-01-15",
  images: [
    "/images/explore-1.png",
    "/images/explore-2.png",
    "/images/explore-3.png",
  ],
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/owner/listings"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{demoListing.title}</h1>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 capitalize">
                {demoListing.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{demoListing.property} • {demoListing.unit}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/listings/${demoListing.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Public Listing
            </Link>
            <Link
              href={`/owner/listings/${demoListing.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={demoListing.images[0]}
                alt={demoListing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex gap-2">
              {demoListing.images.slice(1).map((img, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{demoListing.description}</p>
          </div>

          {/* Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium text-gray-900">{demoListing.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-medium text-gray-900">{demoListing.bathrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Square Feet</p>
                <p className="font-medium text-gray-900">{demoListing.sqft.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lease Term</p>
                <p className="font-medium text-gray-900">{demoListing.leaseTerm}</p>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Policies</h2>
            <div className="flex gap-4">
              <div className={`px-3 py-2 rounded-lg ${demoListing.petsAllowed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {demoListing.petsAllowed ? '✓ Pets Allowed' : '✗ No Pets'}
              </div>
              <div className={`px-3 py-2 rounded-lg ${demoListing.smokingAllowed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {demoListing.smokingAllowed ? '✓ Smoking Allowed' : '✗ No Smoking'}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span className="font-semibold text-gray-900">${demoListing.rent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit</span>
                <span className="font-semibold text-gray-900">${demoListing.deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available</span>
                <span className="font-semibold text-gray-900">{demoListing.availableDate}</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
              <Link
                href={`/owner/listings/${demoListing.id}/analytics`}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                View Analytics
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>Views</span>
                </div>
                <span className="font-semibold text-gray-900">{demoListing.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>Inquiries</span>
                </div>
                <span className="font-semibold text-gray-900">{demoListing.inquiries}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>Applications</span>
                </div>
                <span className="font-semibold text-gray-900">{demoListing.applications}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Pause className="h-4 w-4" />
                Pause Listing
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
