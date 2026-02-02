"use client";

import { useState } from "react";
import { Building2, Home, Building, Castle, MapPin, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { OnboardingCard, OnboardingHeader, SelectionCard } from "../onboarding-layout";

interface PropertyData {
    address: string;
    propertyType: string;
    propertyName: string;
    unitCount: string;
}

interface StepPropertyProps {
    onContinue: (data: PropertyData) => void;
    onBack: () => void;
    onSkip?: () => void;
    initialData?: PropertyData;
}

const PROPERTY_TYPES = [
    { value: "single_family", label: "Single Family", icon: "🏠" },
    { value: "multi_family", label: "Multi-Family", icon: "🏢" },
    { value: "condo_apt", label: "Condo/Apt", icon: "🏘️" },
    { value: "townhouse", label: "Townhouse", icon: "🏡" },
];

const UNIT_COUNT_OPTIONS = [
    { value: "1", label: "1 unit" },
    { value: "2", label: "2 units" },
    { value: "3", label: "3 units" },
    { value: "4", label: "4 units" },
    { value: "5", label: "5 units" },
    { value: "6-10", label: "6-10 units" },
    { value: "11-20", label: "11-20 units" },
    { value: "20+", label: "20+ units" },
];

export function StepProperty({ onContinue, onBack, onSkip, initialData }: StepPropertyProps) {
    const [address, setAddress] = useState(initialData?.address || "");
    const [propertyType, setPropertyType] = useState(initialData?.propertyType || "");
    const [propertyName, setPropertyName] = useState(initialData?.propertyName || "");
    const [unitCount, setUnitCount] = useState(initialData?.unitCount || "");
    const [addressVerified, setAddressVerified] = useState(false);

    const canContinue = address && propertyType && unitCount;

    const handleAddressChange = (value: string) => {
        setAddress(value);
        // Simulate address verification
        setAddressVerified(value.length > 10);
    };

    const handleContinue = () => {
        if (canContinue) {
            onContinue({ address, propertyType, propertyName, unitCount });
        }
    };

    return (
        <OnboardingCard>
            <OnboardingHeader
                icon={<Building2 className="h-6 w-6" />}
                title="Add Your First Property"
                description="Let's set up your first property to get started."
            />

            <div className="space-y-6">
                {/* Property Address */}
                <div>
                    <Label htmlFor="address">Property Address *</Label>
                    <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MapPin className="h-5 w-5 text-fg-quaternary" />
                        </div>
                        <Input
                            id="address"
                            type="text"
                            placeholder="Start typing for auto-complete..."
                            value={address}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {addressVerified && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-success-primary">
                            <Check className="h-4 w-4" />
                            Address verified
                        </p>
                    )}
                </div>

                {/* Property Type */}
                <div>
                    <Label>Property Type *</Label>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {PROPERTY_TYPES.map((type) => (
                            <SelectionCard
                                key={type.value}
                                selected={propertyType === type.value}
                                onClick={() => setPropertyType(type.value)}
                                icon={<span className="text-lg">{type.icon}</span>}
                                title={type.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Property Name (Optional) */}
                <div>
                    <Label htmlFor="propertyName">Property Name (Optional)</Label>
                    <Input
                        id="propertyName"
                        type="text"
                        placeholder="e.g., Main Street Apartments"
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        className="mt-1.5"
                    />
                </div>

                {/* Unit Count */}
                <div>
                    <Label htmlFor="unitCount">How many units does this property have? *</Label>
                    <Select
                        id="unitCount"
                        placeholder="Select unit count"
                        selectedKey={unitCount}
                        onSelectionChange={(key) => setUnitCount(key as string)}
                        className="mt-1.5"
                    >
                        {UNIT_COUNT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} id={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Tip */}
                <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
                    <Lightbulb className="h-5 w-5 flex-shrink-0 text-fg-quaternary" />
                    <p className="text-sm text-tertiary">
                        <strong className="text-secondary">Tip:</strong> If you have multiple identical units, 
                        you can set up one and duplicate it in the next step to save time!
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 pt-4">
                    <Button color="secondary" size="lg" onClick={onBack}>
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        {onSkip && (
                            <Button color="link-gray" size="lg" onClick={onSkip}>
                                Skip - Add later
                            </Button>
                        )}
                        <Button
                            color="primary"
                            size="lg"
                            onClick={handleContinue}
                            disabled={!canContinue}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingCard>
    );
}
