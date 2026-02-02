"use client";

import { X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";

export interface ApplicationFilters {
    statuses: string[];
    properties: string[];
    minIncome: string;
    maxIncome: string;
    minCreditScore: string;
    hasPets: boolean | null;
    screeningComplete: boolean | null;
}

interface ApplicationFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: ApplicationFilters;
    onFiltersChange: (filters: ApplicationFilters) => void;
    onApply: () => void;
    onReset: () => void;
    propertyOptions: { id: string; name: string }[];
}

export function ApplicationFilterModal({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onApply,
    onReset,
    propertyOptions,
}: ApplicationFilterModalProps) {
    if (!isOpen) return null;

    const toggleStatus = (status: string) => {
        const newStatuses = filters.statuses.includes(status)
            ? filters.statuses.filter((s) => s !== status)
            : [...filters.statuses, status];
        onFiltersChange({ ...filters, statuses: newStatuses });
    };

    const toggleProperty = (propertyId: string) => {
        const newProperties = filters.properties.includes(propertyId)
            ? filters.properties.filter((p) => p !== propertyId)
            : [...filters.properties, propertyId];
        onFiltersChange({ ...filters, properties: newProperties });
    };

    const statusOptions = [
        { id: "submitted", label: "New" },
        { id: "under_review", label: "In Review" },
        { id: "screening", label: "Screening" },
        { id: "approved", label: "Approved" },
        { id: "denied", label: "Denied" },
        { id: "withdrawn", label: "Withdrawn" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative m-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between rounded-t-3xl border-b border-gray-200 bg-white px-6 py-4">
                    <h2 className="text-lg font-semibold text-primary">Filter Applications</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-tertiary hover:bg-secondary hover:text-primary"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8 bg-white p-6">
                    {/* Status */}
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-primary">Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status.id}
                                    onClick={() => toggleStatus(status.id)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                        filters.statuses.includes(status.id)
                                            ? "bg-brand-primary text-white"
                                            : "bg-secondary/50 text-secondary hover:bg-secondary"
                                    }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Property */}
                    {propertyOptions.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-primary">Property</h3>
                            <div className="flex flex-wrap gap-2">
                                {propertyOptions.map((property) => (
                                    <button
                                        key={property.id}
                                        onClick={() => toggleProperty(property.id)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                            filters.properties.includes(property.id)
                                                ? "bg-brand-primary text-white"
                                                : "bg-secondary/50 text-secondary hover:bg-secondary"
                                        }`}
                                    >
                                        {property.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Income Range */}
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-primary">Monthly Income</h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minIncome}
                                onChange={(e) => onFiltersChange({ ...filters, minIncome: e.target.value })}
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                            />
                            <span className="text-tertiary">to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxIncome}
                                onChange={(e) => onFiltersChange({ ...filters, maxIncome: e.target.value })}
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Credit Score */}
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-primary">Minimum Credit Score</h3>
                        <input
                            type="number"
                            placeholder="e.g., 650"
                            value={filters.minCreditScore}
                            onChange={(e) => onFiltersChange({ ...filters, minCreditScore: e.target.value })}
                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                        />
                    </div>

                    {/* Screening Status */}
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-primary">Screening Status</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onFiltersChange({ ...filters, screeningComplete: null })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.screeningComplete === null
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary/50 text-secondary hover:bg-secondary"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => onFiltersChange({ ...filters, screeningComplete: true })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.screeningComplete === true
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary/50 text-secondary hover:bg-secondary"
                                }`}
                            >
                                Complete
                            </button>
                            <button
                                onClick={() => onFiltersChange({ ...filters, screeningComplete: false })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.screeningComplete === false
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary/50 text-secondary hover:bg-secondary"
                                }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>

                    {/* Has Pets */}
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-primary">Pets</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onFiltersChange({ ...filters, hasPets: null })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.hasPets === null
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary/50 text-secondary hover:bg-secondary"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => onFiltersChange({ ...filters, hasPets: false })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.hasPets === false
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary/50 text-secondary hover:bg-secondary"
                                }`}
                            >
                                No Pets
                            </button>
                            <button
                                onClick={() => onFiltersChange({ ...filters, hasPets: true })}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    filters.hasPets === true
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary/50 text-secondary hover:bg-secondary"
                                }`}
                            >
                                Has Pets
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-white px-6 py-4">
                    <button
                        onClick={onReset}
                        className="text-sm font-medium text-tertiary hover:text-primary"
                    >
                        Reset All
                    </button>
                    <Button onClick={onApply}>
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
