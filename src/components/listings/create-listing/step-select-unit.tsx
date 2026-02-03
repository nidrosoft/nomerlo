"use client";

import { Home02, Building07 } from "@untitledui/icons";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";

// Mock data - replace with actual Convex queries
const MOCK_PROPERTIES = [
    { id: "1", name: "Sunset Apartments", address: "123 Sunset Blvd, Austin, TX" },
    { id: "2", name: "Park View Complex", address: "456 Park Ave, Austin, TX" },
    { id: "3", name: "Oak Street House", address: "789 Oak St, Austin, TX" },
];

const MOCK_UNITS: Record<string, Array<{ id: string; name: string; details: string; status: string }>> = {
    "1": [
        { id: "1a", name: "Unit 4B", details: "2 bed, 2 bath · 1,200 sqft", status: "vacant" },
        { id: "1b", name: "Studio 2A", details: "Studio · 500 sqft", status: "occupied" },
        { id: "1c", name: "Unit 1A", details: "1 bed, 1 bath · 750 sqft", status: "vacant" },
    ],
    "2": [
        { id: "2a", name: "Unit 101", details: "3 bed, 2 bath · 1,500 sqft", status: "vacant" },
        { id: "2b", name: "Unit 102", details: "2 bed, 1 bath · 1,000 sqft", status: "vacant" },
    ],
    "3": [
        { id: "3a", name: "Main House", details: "4 bed, 3 bath · 2,500 sqft", status: "vacant" },
    ],
};

export interface SelectUnitData {
    propertyId: string;
    unitId: string;
}

interface StepSelectUnitProps {
    data: SelectUnitData;
    onChange: (data: SelectUnitData) => void;
}

export function StepSelectUnit({ data, onChange }: StepSelectUnitProps) {
    const availableUnits = data.propertyId ? MOCK_UNITS[data.propertyId] || [] : [];
    const vacantUnits = availableUnits.filter((u) => u.status === "vacant");

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <Home02 className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Select Property & Unit</h2>
                    <p className="text-sm text-tertiary">
                        Choose the property and vacant unit you want to list
                    </p>
                </div>
            </div>

            {/* Property Selection */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>Property *</Label>
                    <Select
                        placeholder="Select a property"
                        selectedKey={data.propertyId}
                        onSelectionChange={(key) => {
                            onChange({ propertyId: key as string, unitId: "" });
                        }}
                        items={MOCK_PROPERTIES.map((p) => ({
                            id: p.id,
                            label: p.name,
                            supportingText: p.address,
                        }))}
                    >
                        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                    </Select>
                </div>

                {/* Unit Selection */}
                {data.propertyId && (
                    <div className="flex flex-col gap-1.5">
                        <Label>Unit *</Label>
                        {vacantUnits.length === 0 ? (
                            <div className="rounded-lg border border-warning-subtle bg-warning-secondary p-4">
                                <p className="text-sm text-warning-primary">
                                    No vacant units available for this property. All units are currently
                                    occupied.
                                </p>
                            </div>
                        ) : (
                            <Select
                                placeholder="Select a vacant unit"
                                selectedKey={data.unitId}
                                onSelectionChange={(key) => {
                                    onChange({ ...data, unitId: key as string });
                                }}
                                items={vacantUnits.map((u) => ({
                                    id: u.id,
                                    label: u.name,
                                    supportingText: u.details,
                                }))}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Unit Preview */}
            {data.unitId && (
                <div className="rounded-lg border border-secondary bg-secondary_subtle p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                            <Building07 className="size-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary">
                                {vacantUnits.find((u) => u.id === data.unitId)?.name}
                            </p>
                            <p className="text-sm text-tertiary">
                                {vacantUnits.find((u) => u.id === data.unitId)?.details}
                            </p>
                            <p className="text-sm text-tertiary mt-1">
                                {MOCK_PROPERTIES.find((p) => p.id === data.propertyId)?.address}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
