"use client";

import { ArrowLeft, Edit, Trash2, Download, FileText } from "lucide-react";
import Link from "next/link";

const demoExpense = {
  id: "1",
  description: "Plumbing Repair - Unit 4B",
  category: "Maintenance",
  property: "Sunset Apartments",
  unit: "Unit 4B",
  vendor: "ABC Plumbing",
  amount: 450,
  date: "2024-01-20",
  status: "paid",
  notes: "Fixed leaking pipe under kitchen sink. Replaced old copper pipe with PEX.",
  receipt: "/receipts/plumbing-repair-jan20.pdf",
  createdAt: "2024-01-20T10:30:00Z",
  createdBy: "John Smith",
};

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/owner/expenses"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{demoExpense.description}</h1>
            <p className="text-gray-600 mt-1">{demoExpense.property}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-4xl font-bold text-gray-900">${demoExpense.amount.toLocaleString()}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              demoExpense.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            } capitalize`}>
              {demoExpense.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{demoExpense.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-gray-900">{demoExpense.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property</p>
              <p className="font-medium text-gray-900">{demoExpense.property}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unit</p>
              <p className="font-medium text-gray-900">{demoExpense.unit || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendor</p>
              <Link href="/owner/expenses/vendors" className="font-medium text-indigo-600 hover:text-indigo-700">
                {demoExpense.vendor}
              </Link>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium text-gray-900">{demoExpense.createdBy}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {demoExpense.notes && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-600">{demoExpense.notes}</p>
          </div>
        )}

        {/* Receipt */}
        {demoExpense.receipt && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipt</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">plumbing-repair-jan20.pdf</p>
                  <p className="text-sm text-gray-500">PDF • 245 KB</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Audit Info */}
        <div className="text-sm text-gray-500 text-center">
          Created on {new Date(demoExpense.createdAt).toLocaleDateString()} at {new Date(demoExpense.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
