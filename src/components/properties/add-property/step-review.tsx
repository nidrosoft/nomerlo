"use client";

import { Building07, Home01, MarkerPin01, Settings01, Check } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import type { BasicInfoData } from "./step-basic-info";
import type { UnitData } from "./step-units";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
    single_family: "Single-Family Home",
    multi_family_small: "Multi-Family (2-4 units)",
    multi_family_large: "Multi-Family (5+ units)",
    condo: "Condo/Townhouse",
    apartment: "Apartment Building",
    commercial: "Commercial",
};

const AMENITY_LABELS: Record<string, string> = {
    central_ac: "Central A/C",
    dishwasher: "Dishwasher",
    washer_dryer: "Washer/Dryer",
    parking: "Parking",
    garage: "Garage",
    pool: "Pool",
    gym: "Gym/Fitness",
    laundry_onsite: "Laundry (On-site)",
    storage: "Storage",
    pet_friendly: "Pet Friendly",
    furnished: "Furnished",
    wheelchair: "Wheelchair Access",
    elevator: "Elevator",
    security: "Security System",
    doorman: "Doorman/Concierge",
    outdoor_space: "Outdoor Space",
    bbq_area: "BBQ/Grill Area",
    playground: "Playground",
};

interface StepReviewProps {
    basicInfo: BasicInfoData;
    units: UnitData[];
    amenities: string[];
}

export function StepReview({ basicInfo, units, amenities }: StepReviewProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-success-solid">
                    <Check className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Review Your Property</h2>
                    <p className="text-sm text-tertiary">
                        Please review the information below before creating your property.
                    </p>
                </div>
            </div>

            {/* Property Address */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <MarkerPin01 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Property Address</h3>
                </div>
                <div className="mt-3 space-y-1 pl-10">
                    <p className="text-sm text-secondary">{basicInfo.streetAddress}</p>
                    <p className="text-sm text-secondary">
                        {basicInfo.city}, {basicInfo.state} {basicInfo.zipCode}
                    </p>
                </div>
            </div>

            {/* Property Details */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Building07 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Property Details</h3>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 pl-10 sm:grid-cols-4">
                    {basicInfo.propertyName && (
                        <div>
                            <p className="text-xs text-tertiary">Name</p>
                            <p className="text-sm font-medium text-secondary">{basicInfo.propertyName}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-tertiary">Type</p>
                        <p className="text-sm font-medium text-secondary">
                            {PROPERTY_TYPE_LABELS[basicInfo.propertyType] || basicInfo.propertyType}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-tertiary">Units</p>
                        <p className="text-sm font-medium text-secondary">{basicInfo.numberOfUnits}</p>
                    </div>
                    {basicInfo.yearBuilt && (
                        <div>
                            <p className="text-xs text-tertiary">Year Built</p>
                            <p className="text-sm font-medium text-secondary">{basicInfo.yearBuilt}</p>
                        </div>
                    )}
                    {basicInfo.totalSqft && (
                        <div>
                            <p className="text-xs text-tertiary">Total Sq Ft</p>
                            <p className="text-sm font-medium text-secondary">{basicInfo.totalSqft}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Units */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Home01 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Units ({units.length})</h3>
                </div>
                <div className="mt-3 space-y-3 pl-10">
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className="flex items-center justify-between rounded-lg bg-secondary_subtle p-3"
                        >
                            <div>
                                <p className="text-sm font-medium text-primary">{unit.name}</p>
                                <p className="text-xs text-tertiary">
                                    {unit.bedrooms} bed · {unit.bathrooms} bath
                                    {unit.sqft && ` · ${unit.sqft} sq ft`}
                                </p>
                            </div>
                            {unit.rent && (
                                <Badge color="success" type="modern" size="sm">
                                    ${unit.rent}/mo
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
                <div className="rounded-lg border border-secondary p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                            <Settings01 className="size-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-primary">Amenities ({amenities.length})</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 pl-10">
                        {amenities.map((amenityId) => (
                            <Badge key={amenityId} color="gray" type="pill-color" size="sm">
                                {AMENITY_LABELS[amenityId] || amenityId}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Confirmation note */}
            <div className="rounded-lg bg-brand-secondary p-4">
                <p className="text-sm text-brand-primary">
                    By clicking "Create Property", your property will be added to your portfolio. 
                    You can edit details and create listings later.
                </p>
            </div>
        </div>
    );
}
