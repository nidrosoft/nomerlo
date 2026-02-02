"use client";

import { X, Check } from "lucide-react";
import { Home01, Users01, Building07, Calendar } from "@untitledui/icons";

export interface PropertyFilters {
    propertyTypes: string[];
    statuses: string[];
    minUnits: string;
    maxUnits: string;
    minOccupancy: string;
    maxOccupancy: string;
    minRevenue: string;
    maxRevenue: string;
}

interface PropertyFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: PropertyFilters;
    onFiltersChange: (filters: PropertyFilters) => void;
    onApply: () => void;
    onReset: () => void;
}

const propertyTypeOptions = [
    { value: "apartment", label: "Apartment Complex" },
    { value: "single-family", label: "Single Family Home" },
    { value: "multi-family", label: "Multi-Family" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "commercial", label: "Commercial" },
];

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Under Maintenance" },
];

export function PropertyFilterModal({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: PropertyFilterModalProps) {
    if (!isOpen) return null;

    const togglePropertyType = (type: string) => {
        const newTypes = filters.propertyTypes.includes(type)
            ? filters.propertyTypes.filter((t) => t !== type)
            : [...filters.propertyTypes, type];
        onFiltersChange({ ...filters, propertyTypes: newTypes });
    };

    const toggleStatus = (status: string) => {
        const newStatuses = filters.statuses.includes(status)
            ? filters.statuses.filter((s) => s !== status)
            : [...filters.statuses, status];
        onFiltersChange({ ...filters, statuses: newStatuses });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative m-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between rounded-t-3xl border-b border-gray-200 bg-white px-6 py-4">
                    <h2 className="text-xl font-semibold text-primary">Filter Properties</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 transition-colors hover:bg-secondary"
                    >
                        <X className="h-5 w-5 text-tertiary" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8 bg-white p-6">
                    {/* Property Type */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Building07 className="h-5 w-5 text-tertiary" />
                            <h3 className="font-medium text-primary">Property Type</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {propertyTypeOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-secondary p-3 transition-colors hover:bg-secondary"
                                    onClick={() => togglePropertyType(option.value)}
                                >
                                    <div
                                        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                            filters.propertyTypes.includes(option.value)
                                                ? "border-brand-solid bg-brand-solid"
                                                : "border-tertiary bg-primary"
                                        }`}
                                    >
                                        {filters.propertyTypes.includes(option.value) && (
                                            <Check className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    <span className="text-sm text-primary">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-tertiary" />
                            <h3 className="font-medium text-primary">Status</h3>
                        </div>
                        <div className="flex gap-2">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => toggleStatus(option.value)}
                                    className={`rounded-xl border px-4 py-2 transition-colors ${
                                        filters.statuses.includes(option.value)
                                            ? "border-brand-solid bg-brand-solid text-white"
                                            : "border-secondary text-secondary hover:border-tertiary"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Units Range */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Home01 className="h-5 w-5 text-tertiary" />
                            <h3 className="font-medium text-primary">Number of Units</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-tertiary">Minimum</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={filters.minUnits}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, minUnits: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-tertiary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-tertiary">Maximum</label>
                                <input
                                    type="number"
                                    placeholder="No max"
                                    value={filters.maxUnits}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, maxUnits: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-tertiary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Occupancy Range */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Users01 className="h-5 w-5 text-tertiary" />
                            <h3 className="font-medium text-primary">Occupancy Rate (%)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-tertiary">Minimum</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    value={filters.minOccupancy}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, minOccupancy: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-tertiary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-tertiary">Maximum</label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    min="0"
                                    max="100"
                                    value={filters.maxOccupancy}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, maxOccupancy: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-tertiary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Range */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <svg className="h-5 w-5 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v12M8 10h8M8 14h8" />
                            </svg>
                            <h3 className="font-medium text-primary">Monthly Revenue</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-tertiary">Minimum</label>
                                <input
                                    type="number"
                                    placeholder="$0"
                                    value={filters.minRevenue}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, minRevenue: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-tertiary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-tertiary">Maximum</label>
                                <input
                                    type="number"
                                    placeholder="No max"
                                    value={filters.maxRevenue}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, maxRevenue: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-tertiary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-white px-6 py-4">
                    <button
                        onClick={onReset}
                        className="font-medium text-secondary transition-colors hover:text-primary"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="rounded-xl bg-brand-solid px-6 py-3 font-medium text-white transition-colors hover:bg-brand-solid/90"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
