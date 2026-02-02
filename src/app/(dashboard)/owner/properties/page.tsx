"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import {
    PropertyFilterDropdown,
    PropertyCard,
    PropertyToolbar,
    PropertyFilterModal,
    type DashboardProperty,
    type PropertyFilters,
    type FilterOption,
} from "@/components/dashboard/properties";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Filter options
const locationOptions: FilterOption[] = [
    { value: "san-francisco", label: "San Francisco, CA" },
    { value: "austin", label: "Austin, TX" },
    { value: "denver", label: "Denver, CO" },
    { value: "miami", label: "Miami, FL" },
    { value: "seattle", label: "Seattle, WA" },
    { value: "los-angeles", label: "Los Angeles, CA" },
];

const typeOptions: FilterOption[] = [
    { value: "apartment", label: "Apartment" },
    { value: "single-family", label: "Single Family" },
    { value: "multi-family", label: "Multi-Family" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
];

const statusOptions: FilterOption[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
];

const unitOptions: FilterOption[] = [
    { value: "1-5", label: "1-5 units" },
    { value: "6-10", label: "6-10 units" },
    { value: "11-25", label: "11-25 units" },
    { value: "26-50", label: "26-50 units" },
    { value: "50+", label: "50+ units" },
];

// Demo properties data
const demoProperties: DashboardProperty[] = [
    {
        id: "1",
        name: "Sunset Apartments",
        address: "3891 Ranchview Dr",
        city: "San Francisco",
        state: "CA",
        propertyType: "Apartment",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
        totalUnits: 24,
        occupiedUnits: 22,
        vacantUnits: 2,
        monthlyRevenue: 48000,
        status: "active",
    },
    {
        id: "2",
        name: "Oak Street Condos",
        address: "456 Oak Street",
        city: "Austin",
        state: "TX",
        propertyType: "Condo",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        totalUnits: 12,
        occupiedUnits: 12,
        vacantUnits: 0,
        monthlyRevenue: 28800,
        status: "active",
    },
    {
        id: "3",
        name: "Downtown Lofts",
        address: "789 Main Street",
        city: "Denver",
        state: "CO",
        propertyType: "Multi-Family",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
        totalUnits: 8,
        occupiedUnits: 6,
        vacantUnits: 2,
        monthlyRevenue: 14400,
        status: "maintenance",
    },
    {
        id: "4",
        name: "Riverside Townhomes",
        address: "321 River Road",
        city: "Seattle",
        state: "WA",
        propertyType: "Townhouse",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
        totalUnits: 6,
        occupiedUnits: 5,
        vacantUnits: 1,
        monthlyRevenue: 18000,
        status: "active",
    },
    {
        id: "5",
        name: "Palm Beach Villa",
        address: "555 Ocean Drive",
        city: "Miami",
        state: "FL",
        propertyType: "Single Family",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
        totalUnits: 1,
        occupiedUnits: 1,
        vacantUnits: 0,
        monthlyRevenue: 8500,
        status: "active",
    },
    {
        id: "6",
        name: "Mountain View Complex",
        address: "999 Highland Ave",
        city: "Los Angeles",
        state: "CA",
        propertyType: "Apartment",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60",
        totalUnits: 36,
        occupiedUnits: 30,
        vacantUnits: 6,
        monthlyRevenue: 72000,
        status: "active",
    },
];

const initialFilters: PropertyFilters = {
    propertyTypes: [],
    statuses: [],
    minUnits: "",
    maxUnits: "",
    minOccupancy: "",
    maxOccupancy: "",
    minRevenue: "",
    maxRevenue: "",
};

export default function PropertiesPage() {
    // State
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

    // Quick filters
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

    // Fetch properties from Convex
    const convexProperties = useQuery(api.properties.queries.listProperties, {});

    // Check if data is still loading
    const isLoading = convexProperties === undefined;

    // Transform Convex properties to display format
    const dbProperties: DashboardProperty[] = useMemo(() => {
        if (!convexProperties) return [];
        return convexProperties.map((property) => ({
            id: property._id,
            name: property.name,
            address: property.address.street,
            city: property.address.city,
            state: property.address.state,
            propertyType: property.type.charAt(0).toUpperCase() + property.type.slice(1),
            image: property.images?.[0]?.url,
            totalUnits: property.units?.length || 0,
            occupiedUnits: property.units?.filter((u) => u.status === "occupied").length || 0,
            vacantUnits: property.units?.filter((u) => u.status === "vacant").length || 0,
            monthlyRevenue: property.units?.reduce((sum, u) => sum + (u.rentAmount || 0), 0) || 0,
            status: property.status as "active" | "inactive" | "maintenance",
        }));
    }, [convexProperties]);

    // Use database properties, or demo data ONLY if query finished with empty results
    const allProperties = useMemo(() => {
        if (isLoading) return [];
        return dbProperties.length > 0 ? dbProperties : demoProperties;
    }, [dbProperties, isLoading]);

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.propertyTypes.length > 0) count++;
        if (filters.statuses.length > 0) count++;
        if (filters.minUnits || filters.maxUnits) count++;
        if (filters.minOccupancy || filters.maxOccupancy) count++;
        if (filters.minRevenue || filters.maxRevenue) count++;
        if (selectedLocations.length > 0) count++;
        if (selectedTypes.length > 0) count++;
        if (selectedStatuses.length > 0) count++;
        if (selectedUnits.length > 0) count++;
        return count;
    }, [filters, selectedLocations, selectedTypes, selectedStatuses, selectedUnits]);

    // Filter and sort properties
    const filteredProperties = useMemo(() => {
        let result = [...allProperties];

        // Apply modal filters
        if (filters.propertyTypes.length > 0) {
            result = result.filter((p) =>
                filters.propertyTypes.some((t) => p.propertyType.toLowerCase().includes(t))
            );
        }
        if (filters.statuses.length > 0) {
            result = result.filter((p) => filters.statuses.includes(p.status));
        }
        if (filters.minUnits) {
            result = result.filter((p) => p.totalUnits >= parseInt(filters.minUnits));
        }
        if (filters.maxUnits) {
            result = result.filter((p) => p.totalUnits <= parseInt(filters.maxUnits));
        }
        if (filters.minOccupancy) {
            result = result.filter((p) => {
                const rate = p.totalUnits > 0 ? (p.occupiedUnits / p.totalUnits) * 100 : 0;
                return rate >= parseInt(filters.minOccupancy);
            });
        }
        if (filters.maxOccupancy) {
            result = result.filter((p) => {
                const rate = p.totalUnits > 0 ? (p.occupiedUnits / p.totalUnits) * 100 : 0;
                return rate <= parseInt(filters.maxOccupancy);
            });
        }
        if (filters.minRevenue) {
            result = result.filter((p) => (p.monthlyRevenue || 0) >= parseInt(filters.minRevenue));
        }
        if (filters.maxRevenue) {
            result = result.filter((p) => (p.monthlyRevenue || 0) <= parseInt(filters.maxRevenue));
        }

        // Apply quick filters
        if (selectedTypes.length > 0) {
            result = result.filter((p) =>
                selectedTypes.some((t) => p.propertyType.toLowerCase().includes(t))
            );
        }
        if (selectedStatuses.length > 0) {
            result = result.filter((p) => selectedStatuses.includes(p.status));
        }

        // Sort
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => b.id.localeCompare(a.id));
                break;
            case "oldest":
                result.sort((a, b) => a.id.localeCompare(b.id));
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "units-high":
                result.sort((a, b) => b.totalUnits - a.totalUnits);
                break;
            case "units-low":
                result.sort((a, b) => a.totalUnits - b.totalUnits);
                break;
            case "revenue-high":
                result.sort((a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0));
                break;
            case "revenue-low":
                result.sort((a, b) => (a.monthlyRevenue || 0) - (b.monthlyRevenue || 0));
                break;
        }

        return result;
    }, [allProperties, filters, selectedTypes, selectedStatuses, sortBy]);

    // Reset filters - memoized to prevent recreation on every render
    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
        setSelectedLocations([]);
        setSelectedTypes([]);
        setSelectedStatuses([]);
        setSelectedUnits([]);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Properties</h1>
                    <p className="text-md text-tertiary">
                        Manage your rental properties and track occupancy
                    </p>
                </div>
                <Link href="/owner/properties/new">
                    <Button color="primary" size="md" iconLeading={Plus}>
                        Add Property
                    </Button>
                </Link>
            </div>

            {/* Toolbar - View toggle, results count, filter button, sort */}
            <PropertyToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalResults={allProperties.length}
                filteredResults={filteredProperties.length}
                activeFilterCount={activeFilterCount}
                onFilterClick={() => setIsFilterModalOpen(true)}
            />

            {/* Quick Filter Dropdowns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <PropertyFilterDropdown
                    label="Location"
                    options={locationOptions}
                    selected={selectedLocations}
                    onChange={setSelectedLocations}
                />
                <PropertyFilterDropdown
                    label="Property Type"
                    options={typeOptions}
                    selected={selectedTypes}
                    onChange={setSelectedTypes}
                />
                <PropertyFilterDropdown
                    label="Status"
                    options={statusOptions}
                    selected={selectedStatuses}
                    onChange={setSelectedStatuses}
                />
                <PropertyFilterDropdown
                    label="Units"
                    options={unitOptions}
                    selected={selectedUnits}
                    onChange={setSelectedUnits}
                />
            </div>

            {/* Properties Grid/List */}
            {isLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-secondary bg-primary py-20">
                    <LoadingIndicator type="line-simple" size="md" label="Loading properties..." />
                </div>
            ) : (
                <div
                    className={`grid gap-5 ${
                        viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                    }`}
                >
                    {filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProperties.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-secondary bg-primary py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                        <Plus className="size-8 text-tertiary" />
                    </div>
                    <h3 className="text-lg font-medium text-primary">No properties found</h3>
                    <p className="mt-1 text-sm text-tertiary">
                        {activeFilterCount > 0
                            ? "Try adjusting your filters to see more results"
                            : "Add your first property to get started"}
                    </p>
                    {activeFilterCount > 0 ? (
                        <button
                            onClick={resetFilters}
                            className="mt-4 text-sm font-medium text-brand-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    ) : (
                        <Link href="/owner/properties/new" className="mt-4">
                            <Button color="primary" size="md" iconLeading={Plus}>
                                Add Property
                            </Button>
                        </Link>
                    )}
                </div>
            )}

            {/* Enhanced Filter Modal */}
            <PropertyFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={() => {}}
                onReset={() => setFilters(initialFilters)}
            />
        </div>
    );
}
