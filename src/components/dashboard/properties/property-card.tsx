"use client";

import Link from "next/link";
import { Users01, Home01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";

export interface DashboardProperty {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    propertyType: string;
    image?: string;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    monthlyRevenue?: number;
    status: "active" | "inactive" | "maintenance";
}

interface PropertyCardProps {
    property: DashboardProperty;
    viewMode: "grid" | "list";
}

const getStatusBadgeColor = (status: string): "success" | "warning" | "gray" => {
    const colors: Record<string, "success" | "warning" | "gray"> = {
        active: "success",
        inactive: "gray",
        maintenance: "warning",
    };
    return colors[status] || "gray";
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export function PropertyCard({ property, viewMode }: PropertyCardProps) {
    const occupancyRate = property.totalUnits > 0 
        ? Math.round((property.occupiedUnits / property.totalUnits) * 100) 
        : 0;

    if (viewMode === "list") {
        return (
            <Link
                href={`/owner/properties/${property.id}`}
                className="group flex items-center gap-6 rounded-2xl border border-secondary bg-primary p-4 transition-shadow hover:shadow-md"
            >
                {/* Image */}
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                        src={property.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=60"}
                        alt={property.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-primary">
                                {property.name}
                            </h3>
                            <BadgeWithDot
                                color={getStatusBadgeColor(property.status)}
                                type="pill-color"
                                size="sm"
                                className="capitalize"
                            >
                                {property.status}
                            </BadgeWithDot>
                        </div>
                        <p className="truncate text-sm text-tertiary">
                            {property.address}, {property.city}, {property.state}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-secondary">
                            <span className="flex items-center gap-1">
                                <Home01 className="size-4" />
                                {property.totalUnits} units
                            </span>
                            <span className="flex items-center gap-1">
                                <Users01 className="size-4" />
                                {occupancyRate}% occupied
                            </span>
                        </div>
                    </div>

                    {/* Revenue */}
                    {property.monthlyRevenue && property.monthlyRevenue > 0 ? (
                        <div className="text-right">
                            <p className="text-lg font-semibold text-primary">
                                {formatCurrency(property.monthlyRevenue)}
                            </p>
                            <p className="text-sm text-tertiary">/ month</p>
                        </div>
                    ) : null}
                </div>
            </Link>
        );
    }

    // Grid view
    return (
        <Link
            href={`/owner/properties/${property.id}`}
            className="group rounded-2xl border border-secondary bg-primary p-2 transition-shadow hover:shadow-lg"
        >
            {/* Image */}
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
                <img
                    src={property.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60"}
                    alt={property.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Property type badge */}
                <span className="absolute left-3 top-3 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                    {property.propertyType}
                </span>
                {/* Status badge */}
                <div className="absolute right-3 top-3">
                    <BadgeWithDot
                        color={getStatusBadgeColor(property.status)}
                        type="pill-color"
                        size="sm"
                        className="capitalize bg-white/90 backdrop-blur-sm"
                    >
                        {property.status}
                    </BadgeWithDot>
                </div>
            </div>

            {/* Content */}
            <div className="px-3 pb-2">
                {/* Title and Address */}
                <div className="mb-1">
                    <h3 className="truncate text-lg font-medium text-primary">
                        {property.name}
                    </h3>
                    <p className="truncate text-sm text-tertiary">
                        {property.city}, {property.state}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="mt-4 flex items-center gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1.5">
                        <Home01 className="size-4" />
                        {property.totalUnits} units
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Users01 className="size-4" />
                        {occupancyRate}%
                    </span>
                    {property.vacantUnits > 0 && (
                        <span className="text-warning-primary">
                            {property.vacantUnits} vacant
                        </span>
                    )}
                </div>

                {/* Revenue */}
                {property.monthlyRevenue && property.monthlyRevenue > 0 ? (
                    <div className="mt-3 border-t border-secondary pt-3">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-tertiary">Monthly Revenue</span>
                            <span className="text-lg font-semibold text-primary">
                                {formatCurrency(property.monthlyRevenue)}
                            </span>
                        </div>
                    </div>
                ) : null}
            </div>
        </Link>
    );
}
