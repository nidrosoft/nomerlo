"use client";

import { CurrencyDollar, Calendar, File05 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Checkbox } from "@/components/base/checkbox/checkbox";

export interface PricingData {
    rentAmount: string;
    depositAmount: string;
    availableDate: string;
    leaseTerm: string;
    petsAllowed: boolean;
    petDeposit: string;
    smokingAllowed: boolean;
    utilitiesIncluded: string[];
}

interface StepPricingProps {
    data: PricingData;
    onChange: (data: PricingData) => void;
}

const LEASE_TERMS = [
    { id: "month_to_month", label: "Month-to-Month" },
    { id: "6_months", label: "6 Months" },
    { id: "12_months", label: "12 Months" },
    { id: "24_months", label: "24 Months" },
    { id: "flexible", label: "Flexible" },
];

const UTILITIES = [
    { id: "water", label: "Water" },
    { id: "trash", label: "Trash" },
    { id: "sewer", label: "Sewer" },
    { id: "gas", label: "Gas" },
    { id: "electric", label: "Electric" },
    { id: "internet", label: "Internet" },
    { id: "cable", label: "Cable TV" },
];

export function StepPricing({ data, onChange }: StepPricingProps) {
    const toggleUtility = (utilityId: string) => {
        const current = data.utilitiesIncluded;
        if (current.includes(utilityId)) {
            onChange({
                ...data,
                utilitiesIncluded: current.filter((id) => id !== utilityId),
            });
        } else {
            onChange({
                ...data,
                utilitiesIncluded: [...current, utilityId],
            });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <DollarSign className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Pricing & Availability</h2>
                    <p className="text-sm text-tertiary">
                        Set your rent, deposit, and lease terms
                    </p>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <CurrencyDollar className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Pricing</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <Label>Monthly Rent *</Label>
                        <Input
                            placeholder="2,500"
                            value={data.rentAmount}
                            onChange={(value) => onChange({ ...data, rentAmount: value })}
                            type="number"
                            icon={() => <span className="text-tertiary">$</span>}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Security Deposit *</Label>
                        <Input
                            placeholder="2,500"
                            value={data.depositAmount}
                            onChange={(value) => onChange({ ...data, depositAmount: value })}
                            type="number"
                            icon={() => <span className="text-tertiary">$</span>}
                        />
                    </div>
                </div>
            </div>

            {/* Availability Section */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Calendar className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Availability</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <Label>Available Date *</Label>
                        <Input
                            type="date"
                            value={data.availableDate}
                            onChange={(value) => onChange({ ...data, availableDate: value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Lease Term *</Label>
                        <Select
                            placeholder="Select lease term"
                            selectedKey={data.leaseTerm}
                            onSelectionChange={(key) =>
                                onChange({ ...data, leaseTerm: key as string })
                            }
                            items={LEASE_TERMS}
                        />
                    </div>
                </div>
            </div>

            {/* Policies Section */}
            <div className="rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <File05 className="size-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-primary">Policies</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <Checkbox
                                isSelected={data.petsAllowed}
                                onChange={(isSelected) =>
                                    onChange({ ...data, petsAllowed: isSelected })
                                }
                            />
                            <span className="text-sm font-medium text-secondary">
                                Pets Allowed
                            </span>
                        </label>
                        {data.petsAllowed && (
                            <div className="ml-8 flex flex-col gap-1.5">
                                <Label>Pet Deposit</Label>
                                <Input
                                    placeholder="500"
                                    value={data.petDeposit}
                                    onChange={(value) => onChange({ ...data, petDeposit: value })}
                                    type="number"
                                    icon={() => <span className="text-tertiary">$</span>}
                                    className="max-w-[200px]"
                                />
                            </div>
                        )}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                            isSelected={data.smokingAllowed}
                            onChange={(isSelected) =>
                                onChange({ ...data, smokingAllowed: isSelected })
                            }
                        />
                        <span className="text-sm font-medium text-secondary">
                            Smoking Allowed
                        </span>
                    </label>
                </div>
            </div>

            {/* Utilities Section */}
            <div className="rounded-lg border border-secondary p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Utilities Included</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {UTILITIES.map((utility) => (
                        <label
                            key={utility.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-secondary bg-primary p-3 transition-colors hover:bg-primary_hover"
                        >
                            <Checkbox
                                isSelected={data.utilitiesIncluded.includes(utility.id)}
                                onChange={() => toggleUtility(utility.id)}
                            />
                            <span className="text-sm font-medium text-secondary">
                                {utility.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
