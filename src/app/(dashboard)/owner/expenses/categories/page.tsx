"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const demoCategories = [
  { id: "1", name: "Maintenance", color: "#3B82F6", expenseCount: 24, totalAmount: 8500 },
  { id: "2", name: "Repairs", color: "#EF4444", expenseCount: 12, totalAmount: 4200 },
  { id: "3", name: "Insurance", color: "#10B981", expenseCount: 4, totalAmount: 9600 },
  { id: "4", name: "Taxes", color: "#F59E0B", expenseCount: 8, totalAmount: 25600 },
  { id: "5", name: "Utilities", color: "#8B5CF6", expenseCount: 36, totalAmount: 3200 },
  { id: "6", name: "Landscaping", color: "#06B6D4", expenseCount: 12, totalAmount: 2400 },
  { id: "7", name: "Cleaning", color: "#EC4899", expenseCount: 18, totalAmount: 1800 },
  { id: "8", name: "Legal", color: "#6366F1", expenseCount: 3, totalAmount: 2500 },
  { id: "9", name: "Marketing", color: "#14B8A6", expenseCount: 6, totalAmount: 1200 },
];

export default function ExpenseCategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const totalExpenses = demoCategories.reduce((sum, cat) => sum + cat.totalAmount, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-900">Expense Categories</h1>
            <p className="text-gray-600 mt-1">Organize and track expenses by category</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h2>
        <div className="flex items-center gap-2 h-8 rounded-lg overflow-hidden">
          {demoCategories.map((cat) => (
            <div
              key={cat.id}
              className="h-full"
              style={{
                backgroundColor: cat.color,
                width: `${(cat.totalAmount / totalExpenses) * 100}%`,
              }}
              title={`${cat.name}: $${cat.totalAmount.toLocaleString()}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {demoCategories.slice(0, 5).map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {demoCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {category.expenseCount} expenses
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-gray-900">${category.totalAmount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
