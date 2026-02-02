"use client";

import { Home01, Building07, Building08, MarkerPin01 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { cx } from "@/utils/cx";

const PROPERTY_TYPES = [
    { id: "single_family", label: "Single-Family Home", icon: Home01 },
    { id: "multi_family_small", label: "Multi-Family (2-4 units)", icon: Building07 },
    { id: "multi_family_large", label: "Multi-Family (5+ units)", icon: Building08 },
    { id: "condo", label: "Condo/Townhouse", icon: Home01 },
    { id: "apartment", label: "Apartment Building", icon: Building08 },
    { id: "commercial", label: "Commercial", icon: Building07 },
];

const US_STATES = [
    { id: "AL", label: "Alabama" }, { id: "AK", label: "Alaska" }, { id: "AZ", label: "Arizona" },
    { id: "AR", label: "Arkansas" }, { id: "CA", label: "California" }, { id: "CO", label: "Colorado" },
    { id: "CT", label: "Connecticut" }, { id: "DE", label: "Delaware" }, { id: "FL", label: "Florida" },
    { id: "GA", label: "Georgia" }, { id: "HI", label: "Hawaii" }, { id: "ID", label: "Idaho" },
    { id: "IL", label: "Illinois" }, { id: "IN", label: "Indiana" }, { id: "IA", label: "Iowa" },
    { id: "KS", label: "Kansas" }, { id: "KY", label: "Kentucky" }, { id: "LA", label: "Louisiana" },
    { id: "ME", label: "Maine" }, { id: "MD", label: "Maryland" }, { id: "MA", label: "Massachusetts" },
    { id: "MI", label: "Michigan" }, { id: "MN", label: "Minnesota" }, { id: "MS", label: "Mississippi" },
    { id: "MO", label: "Missouri" }, { id: "MT", label: "Montana" }, { id: "NE", label: "Nebraska" },
    { id: "NV", label: "Nevada" }, { id: "NH", label: "New Hampshire" }, { id: "NJ", label: "New Jersey" },
    { id: "NM", label: "New Mexico" }, { id: "NY", label: "New York" }, { id: "NC", label: "North Carolina" },
    { id: "ND", label: "North Dakota" }, { id: "OH", label: "Ohio" }, { id: "OK", label: "Oklahoma" },
    { id: "OR", label: "Oregon" }, { id: "PA", label: "Pennsylvania" }, { id: "RI", label: "Rhode Island" },
    { id: "SC", label: "South Carolina" }, { id: "SD", label: "South Dakota" }, { id: "TN", label: "Tennessee" },
    { id: "TX", label: "Texas" }, { id: "UT", label: "Utah" }, { id: "VT", label: "Vermont" },
    { id: "VA", label: "Virginia" }, { id: "WA", label: "Washington" }, { id: "WV", label: "West Virginia" },
    { id: "WI", label: "Wisconsin" }, { id: "WY", label: "Wyoming" },
];

export interface BasicInfoData {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    propertyName: string;
    propertyType: string;
    numberOfUnits: number;
    yearBuilt: string;
    totalSqft: string;
}

interface StepBasicInfoProps {
    data: BasicInfoData;
    onChange: (data: BasicInfoData) => void;
}

export function StepBasicInfo({ data, onChange }: StepBasicInfoProps) {
    const updateField = <K extends keyof BasicInfoData>(field: K, value: BasicInfoData[K]) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Property Address Section */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <MarkerPin01 className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Property Address</h2>
                    <p className="text-sm text-tertiary">Enter the address of your property</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <Label>Street Address *</Label>
                    <Input
                        placeholder="123 Main Street"
                        value={data.streetAddress}
                        onChange={(value) => updateField("streetAddress", value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label>City *</Label>
                        <Input
                            placeholder="Austin"
                            value={data.city}
                            onChange={(value) => updateField("city", value)}
                        />
                    </div>
                    <div>
                        <Label>State *</Label>
                        <Select
                            placeholder="Select state"
                            selectedKey={data.state}
                            onSelectionChange={(key) => updateField("state", key as string)}
                            items={US_STATES}
                        >
                            {(item) => <SelectItem id={item.id} textValue={item.label}>{item.label}</SelectItem>}
                        </Select>
                    </div>
                    <div>
                        <Label>ZIP Code *</Label>
                        <Input
                            placeholder="78701"
                            value={data.zipCode}
                            onChange={(value) => updateField("zipCode", value)}
                        />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-secondary" />

            {/* Property Details Section */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <Building07 className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Property Details</h2>
                    <p className="text-sm text-tertiary">Tell us more about your property</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <Label>Property Name (Optional)</Label>
                    <Input
                        placeholder="Give it a nickname for easy reference"
                        value={data.propertyName}
                        onChange={(value) => updateField("propertyName", value)}
                    />
                </div>

                <div>
                    <Label>Property Type *</Label>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {PROPERTY_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = data.propertyType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => updateField("propertyType", type.id)}
                                    className={cx(
                                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                                        isSelected
                                            ? "border-brand-solid bg-brand-secondary"
                                            : "border-secondary bg-primary hover:border-tertiary"
                                    )}
                                >
                                    <Icon className={cx("size-6", isSelected ? "text-brand-solid" : "text-fg-quaternary")} />
                                    <span className={cx("text-sm font-medium text-center", isSelected ? "text-brand-solid" : "text-secondary")}>
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label>Number of Units *</Label>
                        <Input
                            type="number"
                            placeholder="1"
                            value={data.numberOfUnits.toString()}
                            onChange={(value) => updateField("numberOfUnits", parseInt(value) || 1)}
                        />
                    </div>
                    <div>
                        <Label>Year Built</Label>
                        <Input
                            placeholder="1985"
                            value={data.yearBuilt}
                            onChange={(value) => updateField("yearBuilt", value)}
                        />
                    </div>
                    <div>
                        <Label>Total Square Feet</Label>
                        <Input
                            placeholder="3,400"
                            value={data.totalSqft}
                            onChange={(value) => updateField("totalSqft", value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
