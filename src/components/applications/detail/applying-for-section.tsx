"use client";

import { Building07 } from "@untitledui/icons";
import { DollarSign, Calendar, Clock } from "lucide-react";

interface AddressObject {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

interface ApplyingForSectionProps {
    property: {
        name: string;
        address: string | AddressObject;
    };
    unit: {
        name?: string;
        unitNumber?: string;
        bedrooms: number;
        bathrooms: number;
        sqft?: number;
    };
    listing: {
        rentAmount: number;
        depositAmount?: number;
    };
    desiredMoveIn: number;
    desiredLeaseTerm: string;
}

// Helper function to format address
const formatAddress = (address: string | AddressObject | undefined): string => {
    if (!address) return "Address not available";
    if (typeof address === "string") return address;
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const formatLeaseTerm = (term: string): string => {
    const terms: Record<string, string> = {
        "month_to_month": "Month-to-Month",
        "6_months": "6 Months",
        "12_months": "12 Months",
        "24_months": "24 Months",
        "flexible": "Flexible",
    };
    return terms[term] || term;
};

export function ApplyingForSection({
    property,
    unit,
    listing,
    desiredMoveIn,
    desiredLeaseTerm,
}: ApplyingForSectionProps) {
    return (
        <div className="rounded-2xl border border-secondary bg-primary p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary">Applying For</h3>

            <div className="rounded-xl bg-secondary/50 p-4">
                {/* Property & Unit */}
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-secondary">
                        <Building07 className="size-5 text-brand-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary">{unit.name || unit.unitNumber || "Unit"} - {property.name}</h4>
                        <p className="text-sm text-tertiary">{formatAddress(property.address)}</p>
                        <p className="mt-1 text-sm text-secondary">
                            {unit.bedrooms} bed · {unit.bathrooms} bath
                            {unit.sqft && ` · ${unit.sqft.toLocaleString()} sq ft`}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-secondary" />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-tertiary" />
                        <div>
                            <p className="text-xs text-tertiary">Asking Rent</p>
                            <p className="font-semibold text-primary">{formatCurrency(listing.rentAmount)}/mo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-tertiary" />
                        <div>
                            <p className="text-xs text-tertiary">Security Deposit</p>
                            <p className="font-semibold text-primary">{formatCurrency(listing.depositAmount || listing.rentAmount)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-tertiary" />
                        <div>
                            <p className="text-xs text-tertiary">Desired Move-in</p>
                            <p className="font-semibold text-primary">{formatDate(desiredMoveIn)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="size-4 text-tertiary" />
                        <div>
                            <p className="text-xs text-tertiary">Lease Term</p>
                            <p className="font-semibold text-primary">{formatLeaseTerm(desiredLeaseTerm)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
