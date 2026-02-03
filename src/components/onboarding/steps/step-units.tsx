"use client";

import { useState } from "react";
import { Layers, Check } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { OnboardingCard, OnboardingHeader, SelectionCard } from "../onboarding-layout";

interface UnitData {
    allSame: boolean;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    rent: string;
    deposit: string;
    namingStyle: string;
}

interface StepUnitsProps {
    propertyName: string;
    unitCount: number;
    onContinue: (data: UnitData) => void;
    onBack: () => void;
    initialData?: UnitData;
}

const BEDROOM_OPTIONS = [
    { value: "studio", label: "Studio" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5+", label: "5+" },
];

const BATHROOM_OPTIONS = [
    { value: "1", label: "1" },
    { value: "1.5", label: "1.5" },
    { value: "2", label: "2" },
    { value: "2.5", label: "2.5" },
    { value: "3", label: "3" },
    { value: "3+", label: "3+" },
];

const NAMING_STYLES = [
    { value: "letters", label: "Letters (A, B, C, D)" },
    { value: "numbers", label: "Numbers (1, 2, 3, 4)" },
    { value: "floor", label: "Floor-based (1A, 1B, 2A, 2B)" },
    { value: "custom", label: "Custom (I'll name them myself)" },
];

export function StepUnits({ propertyName, unitCount, onContinue, onBack, initialData }: StepUnitsProps) {
    const [allSame, setAllSame] = useState(initialData?.allSame ?? true);
    const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || "");
    const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || "");
    const [sqft, setSqft] = useState(initialData?.sqft || "");
    const [rent, setRent] = useState(initialData?.rent || "");
    const [deposit, setDeposit] = useState(initialData?.deposit || "");
    const [namingStyle, setNamingStyle] = useState(initialData?.namingStyle || "letters");

    const canContinue = bedrooms && bathrooms && rent;

    const handleContinue = () => {
        if (canContinue) {
            onContinue({ allSame, bedrooms, bathrooms, sqft, rent, deposit, namingStyle });
        }
    };

    return (
        <OnboardingCard>
            <OnboardingHeader
                icon={<Layers className="h-6 w-6" />}
                title="Set Up Your Units"
                description={`${propertyName || "Your Property"} · ${unitCount} units`}
            />

            <div className="space-y-6">
                {/* Quick setup option */}
                <div>
                    <label className="mb-4 block text-sm font-medium text-primary">
                        Quick Setup: Are all units the same configuration?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <SelectionCard
                            selected={allSame}
                            onClick={() => setAllSame(true)}
                            icon={<Check className="h-5 w-5" />}
                            title="Yes, All Same"
                            description={`Set up one unit, we'll duplicate for all ${unitCount}`}
                        />
                        <SelectionCard
                            selected={!allSame}
                            onClick={() => setAllSame(false)}
                            icon={<Layers className="h-5 w-5" />}
                            title="No, Different"
                            description="Configure each unit individually"
                        />
                    </div>
                </div>

                {/* Unit template */}
                <div className="rounded-lg border border-secondary p-4 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tertiary">
                        {allSame ? "Unit Template" : "Unit 1 Details"}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* Bedrooms */}
                        <div>
                            <Label htmlFor="bedrooms">Bedrooms *</Label>
                            <Select
                                id="bedrooms"
                                placeholder="Select"
                                selectedKey={bedrooms}
                                onSelectionChange={(key) => setBedrooms(key as string)}
                                className="mt-1.5"
                            >
                                {BEDROOM_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} id={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <Label htmlFor="bathrooms">Bathrooms *</Label>
                            <Select
                                id="bathrooms"
                                placeholder="Select"
                                selectedKey={bathrooms}
                                onSelectionChange={(key) => setBathrooms(key as string)}
                                className="mt-1.5"
                            >
                                {BATHROOM_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} id={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Square Feet */}
                        <div>
                            <Label htmlFor="sqft">Square Feet</Label>
                            <Input
                                id="sqft"
                                type="text"
                                placeholder="e.g., 850"
                                value={sqft}
                                onChange={(value) => setSqft(value)}
                                className="mt-1.5"
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {/* Monthly Rent */}
                        <div>
                            <Label htmlFor="rent">Monthly Rent *</Label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-fg-quaternary">$</span>
                                </div>
                                <Input
                                    id="rent"
                                    type="text"
                                    placeholder="1,500"
                                    value={rent}
                                    onChange={(value) => setRent(value)}
                                    className="pl-7"
                                />
                            </div>
                        </div>

                        {/* Security Deposit */}
                        <div>
                            <Label htmlFor="deposit">Security Deposit</Label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-fg-quaternary">$</span>
                                </div>
                                <Input
                                    id="deposit"
                                    type="text"
                                    placeholder="1,500"
                                    value={deposit}
                                    onChange={(value) => setDeposit(value)}
                                    className="pl-7"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unit Naming */}
                <div>
                    <Label>Unit Naming (Auto-generated)</Label>
                    <div className="mt-3 space-y-2">
                        {NAMING_STYLES.map((style) => (
                            <label
                                key={style.value}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-secondary p-3 transition-colors hover:bg-primary_hover"
                            >
                                <input
                                    type="radio"
                                    name="namingStyle"
                                    value={style.value}
                                    checked={namingStyle === style.value}
                                    onChange={(e) => setNamingStyle(e.target.value)}
                                    className="h-4 w-4 text-brand-solid focus:ring-brand-solid"
                                />
                                <span className="text-secondary">{style.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 pt-4">
                    <Button color="secondary" size="lg" onClick={onBack}>
                        Back
                    </Button>
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
        </OnboardingCard>
    );
}
