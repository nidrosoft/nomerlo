"use client";

import { ArrowLeft, TrendingUp, TrendingDown, Eye, MessageSquare, FileText, Calendar } from "lucide-react";
import Link from "next/link";

const analyticsData = {
  listing: {
    id: "1",
    title: "Modern Downtown Apartment",
    property: "Sunset Apartments",
    unit: "Unit 4B",
  },
  overview: {
    totalViews: 342,
    viewsChange: 12,
    totalInquiries: 18,
    inquiriesChange: -5,
    totalApplications: 5,
    applicationsChange: 25,
    conversionRate: 5.3,
  },
  viewsByDay: [
    { date: "Jan 15", views: 45 },
    { date: "Jan 16", views: 52 },
    { date: "Jan 17", views: 38 },
    { date: "Jan 18", views: 61 },
    { date: "Jan 19", views: 48 },
    { date: "Jan 20", views: 55 },
    { date: "Jan 21", views: 43 },
  ],
  topSources: [
    { source: "Direct Search", views: 145, percentage: 42 },
    { source: "Zillow", views: 89, percentage: 26 },
    { source: "Apartments.com", views: 62, percentage: 18 },
    { source: "Social Media", views: 46, percentage: 14 },
  ],
};

export default function ListingAnalyticsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/owner/listings/${params.id}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listing
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Listing Analytics</h1>
        <p className="text-gray-600 mt-1">{analyticsData.listing.title}</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Total Views</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalViews}</p>
          <div className="flex items-center gap-1 mt-2">
            {analyticsData.overview.viewsChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${analyticsData.overview.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.viewsChange >= 0 ? '+' : ''}{analyticsData.overview.viewsChange}% vs last week
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Inquiries</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalInquiries}</p>
          <div className="flex items-center gap-1 mt-2">
            {analyticsData.overview.inquiriesChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${analyticsData.overview.inquiriesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.inquiriesChange >= 0 ? '+' : ''}{analyticsData.overview.inquiriesChange}% vs last week
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Applications</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalApplications}</p>
          <div className="flex items-center gap-1 mt-2">
            {analyticsData.overview.applicationsChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${analyticsData.overview.applicationsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analyticsData.overview.applicationsChange >= 0 ? '+' : ''}{analyticsData.overview.applicationsChange}% vs last week
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">Conversion Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
          <p className="text-sm text-gray-500 mt-2">Views to Applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {analyticsData.viewsByDay.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-indigo-500 rounded-t"
                  style={{ height: `${(day.views / 70) * 100}%` }}
                />
                <p className="text-xs text-gray-500 mt-2">{day.date.split(' ')[1]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {analyticsData.topSources.map((source, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">{source.views} views ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips to Improve Performance</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add more high-quality photos to increase engagement</li>
          <li>• Update your listing description with more details about amenities</li>
          <li>• Consider adjusting your rent price based on market trends</li>
          <li>• Respond quickly to inquiries to improve conversion rates</li>
        </ul>
      </div>
    </div>
  );
}
