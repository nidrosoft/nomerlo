"use client";

import {
    Check,
    Home02,
    Edit05,
    Image01,
    CurrencyDollar,
    MessageChatCircle,
    File06,
    HelpCircle,
    Phone,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import type { SelectUnitData } from "./step-select-unit";
import type { ListingDetailsData } from "./step-listing-details";
import type { PhotoData } from "./step-photos";
import type { PricingData } from "./step-pricing";
import type { AISupportData } from "./step-ai-support";

interface StepReviewProps {
    unitData: SelectUnitData;
    listingDetails: ListingDetailsData;
    photos: PhotoData[];
    pricing: PricingData;
    aiSupport: AISupportData;
}

// Mock data for display
const MOCK_PROPERTIES: Record<string, { name: string; address: string }> = {
    "1": { name: "Sunset Apartments", address: "123 Sunset Blvd, Austin, TX" },
    "2": { name: "Park View Complex", address: "456 Park Ave, Austin, TX" },
    "3": { name: "Oak Street House", address: "789 Oak St, Austin, TX" },
};

const MOCK_UNITS: Record<string, Record<string, { name: string; details: string }>> = {
    "1": {
        "1a": { name: "Unit 4B", details: "2 bed, 2 bath · 1,200 sqft" },
        "1b": { name: "Studio 2A", details: "Studio · 500 sqft" },
        "1c": { name: "Unit 1A", details: "1 bed, 1 bath · 750 sqft" },
    },
    "2": {
        "2a": { name: "Unit 101", details: "3 bed, 2 bath · 1,500 sqft" },
        "2b": { name: "Unit 102", details: "2 bed, 1 bath · 1,000 sqft" },
    },
    "3": {
        "3a": { name: "Main House", details: "4 bed, 3 bath · 2,500 sqft" },
    },
};

const LEASE_TERMS: Record<string, string> = {
    month_to_month: "Month-to-Month",
    "6_months": "6 Months",
    "12_months": "12 Months",
    "24_months": "24 Months",
    flexible: "Flexible",
};

export function StepReview({
    unitData,
    listingDetails,
    photos,
    pricing,
    aiSupport,
}: StepReviewProps) {
    const property = MOCK_PROPERTIES[unitData.propertyId];
    const unit = MOCK_UNITS[unitData.propertyId]?.[unitData.unitId];

    const formatCurrency = (amount: string) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return "$0";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Not set";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-success-solid">
                    <Check className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Review & Publish</h2>
                    <p className="text-sm text-tertiary">
                        Review your listing before publishing
                    </p>
                </div>
            </div>

            {/* Property & Unit */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Home02 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Property & Unit</h3>
                </div>
                {property && unit && (
                    <div className="pl-10">
                        <p className="text-sm font-medium text-primary">{unit.name}</p>
                        <p className="text-sm text-tertiary">{unit.details}</p>
                        <p className="text-sm text-tertiary mt-1">
                            {property.name} · {property.address}
                        </p>
                    </div>
                )}
            </div>

            {/* Listing Details */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Edit05 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Listing Details</h3>
                </div>
                <div className="pl-10 space-y-2">
                    <p className="text-sm font-medium text-primary">
                        {listingDetails.title || "No title set"}
                    </p>
                    <p className="text-sm text-tertiary line-clamp-3">
                        {listingDetails.description || "No description set"}
                    </p>
                </div>
            </div>

            {/* Photos */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Image01 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">
                        Photos ({photos.length})
                    </h3>
                </div>
                {photos.length > 0 ? (
                    <div className="pl-10 flex gap-2 overflow-x-auto pb-2">
                        {photos.slice(0, 5).map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative flex-shrink-0 size-16 rounded-lg overflow-hidden border border-secondary"
                            >
                                <img
                                    src={photo.url}
                                    alt={`Photo ${index + 1}`}
                                    className="size-full object-cover"
                                />
                                {photo.isPrimary && (
                                    <div className="absolute inset-0 ring-2 ring-inset ring-brand-primary rounded-lg" />
                                )}
                            </div>
                        ))}
                        {photos.length > 5 && (
                            <div className="flex-shrink-0 size-16 rounded-lg bg-secondary_subtle flex items-center justify-center text-sm font-medium text-tertiary">
                                +{photos.length - 5}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="pl-10 text-sm text-tertiary">No photos uploaded</p>
                )}
            </div>

            {/* Pricing */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <CurrencyDollar className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Pricing & Terms</h3>
                </div>
                <div className="pl-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                        <p className="text-xs text-tertiary">Monthly Rent</p>
                        <p className="text-sm font-medium text-primary">
                            {formatCurrency(pricing.rentAmount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-tertiary">Deposit</p>
                        <p className="text-sm font-medium text-primary">
                            {formatCurrency(pricing.depositAmount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-tertiary">Available</p>
                        <p className="text-sm font-medium text-primary">
                            {formatDate(pricing.availableDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-tertiary">Lease Term</p>
                        <p className="text-sm font-medium text-primary">
                            {LEASE_TERMS[pricing.leaseTerm] || pricing.leaseTerm}
                        </p>
                    </div>
                </div>
                <div className="pl-10 mt-3 flex flex-wrap gap-2">
                    <Badge color={pricing.petsAllowed ? "success" : "gray"} type="pill-color" size="sm">
                        {pricing.petsAllowed ? "Pets Allowed" : "No Pets"}
                    </Badge>
                    <Badge color={pricing.smokingAllowed ? "success" : "gray"} type="pill-color" size="sm">
                        {pricing.smokingAllowed ? "Smoking Allowed" : "No Smoking"}
                    </Badge>
                    {pricing.utilitiesIncluded.length > 0 && (
                        <Badge color="brand" type="pill-color" size="sm">
                            {pricing.utilitiesIncluded.length} Utilities Included
                        </Badge>
                    )}
                </div>
            </div>

            {/* AI Support Summary */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <MessageChatCircle className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">AI Support</h3>
                </div>
                <div className="pl-10 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {aiSupport.chatEnabled && (
                            <Badge color="brand" type="pill-color" size="sm">
                                Chat Widget
                            </Badge>
                        )}
                        {aiSupport.phoneEnabled && (
                            <Badge color="brand" type="pill-color" size="sm">
                                Phone Support
                            </Badge>
                        )}
                        {aiSupport.whatsappEnabled && (
                            <Badge color="brand" type="pill-color" size="sm">
                                WhatsApp
                            </Badge>
                        )}
                        {aiSupport.smsEnabled && (
                            <Badge color="brand" type="pill-color" size="sm">
                                SMS
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-tertiary">
                        <span className="flex items-center gap-1">
                            <File06 className="size-4" />
                            {aiSupport.documents.length} documents
                        </span>
                        <span className="flex items-center gap-1">
                            <HelpCircle className="size-4" />
                            {aiSupport.faqs.length} FAQ items
                        </span>
                    </div>
                </div>
            </div>

            {/* Publish Notice */}
            <div className="rounded-lg bg-brand-secondary border border-brand-primary p-4">
                <p className="text-sm text-brand-primary">
                    <strong>Ready to publish!</strong> Your listing will be visible on the
                    marketplace once published. You can edit or unpublish at any time from
                    your dashboard.
                </p>
            </div>
        </div>
    );
}
