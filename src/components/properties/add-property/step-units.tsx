"use client";

import { Plus, Trash01, Home01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";

const BEDROOM_OPTIONS = [
    { id: "0", label: "Studio" },
    { id: "1", label: "1 Bedroom" },
    { id: "2", label: "2 Bedrooms" },
    { id: "3", label: "3 Bedrooms" },
    { id: "4", label: "4 Bedrooms" },
    { id: "5", label: "5+ Bedrooms" },
];

const BATHROOM_OPTIONS = [
    { id: "1", label: "1 Bathroom" },
    { id: "1.5", label: "1.5 Bathrooms" },
    { id: "2", label: "2 Bathrooms" },
    { id: "2.5", label: "2.5 Bathrooms" },
    { id: "3", label: "3 Bathrooms" },
    { id: "3.5", label: "3.5+ Bathrooms" },
];

const FLOOR_OPTIONS = [
    { id: "basement", label: "Basement" },
    { id: "1", label: "1st Floor" },
    { id: "2", label: "2nd Floor" },
    { id: "3", label: "3rd Floor" },
    { id: "4", label: "4th+ Floor" },
];

export interface UnitData {
    id: string;
    name: string;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    floor: string;
    rent: string;
    deposit: string;
}

interface StepUnitsProps {
    units: UnitData[];
    onChange: (units: UnitData[]) => void;
}

export function StepUnits({ units, onChange }: StepUnitsProps) {
    const addUnit = () => {
        const newUnit: UnitData = {
            id: crypto.randomUUID(),
            name: `Unit ${String.fromCharCode(65 + units.length)}`,
            bedrooms: "2",
            bathrooms: "1",
            sqft: "",
            floor: "1",
            rent: "",
            deposit: "",
        };
        onChange([...units, newUnit]);
    };

    const removeUnit = (id: string) => {
        onChange(units.filter((unit) => unit.id !== id));
    };

    const updateUnit = (id: string, field: keyof UnitData, value: string) => {
        onChange(units.map((unit) => (unit.id === id ? { ...unit, [field]: value } : unit)));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                        <Home01 className="size-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-primary">Property Units</h2>
                        <p className="text-sm text-tertiary">
                            Add the units for your property. You can add more units later.
                        </p>
                    </div>
                </div>
                <Button color="secondary" size="sm" iconLeading={Plus} onPress={addUnit}>
                    Add Unit
                </Button>
            </div>

            {/* Units List */}
            {units.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary py-12">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
                        <Home01 className="size-6 text-fg-quaternary" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-secondary">No units added yet</p>
                    <p className="mt-1 text-sm text-tertiary">Click "Add Unit" to get started</p>
                    <Button color="secondary" size="sm" iconLeading={Plus} onPress={addUnit} className="mt-4">
                        Add Your First Unit
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {units.map((unit, index) => (
                        <div
                            key={unit.id}
                            className="rounded-lg border border-secondary bg-secondary_subtle p-4"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-semibold text-primary">Unit {index + 1}</span>
                                {units.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeUnit(unit.id)}
                                        className="text-fg-quaternary hover:text-error-primary transition-colors"
                                    >
                                        <Trash01 className="size-4" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <Label>Unit Name *</Label>
                                    <Input
                                        placeholder="Unit A"
                                        value={unit.name}
                                        onChange={(value) => updateUnit(unit.id, "name", value)}
                                    />
                                </div>
                                <div>
                                    <Label>Bedrooms *</Label>
                                    <Select
                                        placeholder="Select"
                                        selectedKey={unit.bedrooms}
                                        onSelectionChange={(key) => updateUnit(unit.id, "bedrooms", key as string)}
                                        items={BEDROOM_OPTIONS}
                                    >
                                        {(item) => <SelectItem id={item.id} textValue={item.label}>{item.label}</SelectItem>}
                                    </Select>
                                </div>
                                <div>
                                    <Label>Bathrooms *</Label>
                                    <Select
                                        placeholder="Select"
                                        selectedKey={unit.bathrooms}
                                        onSelectionChange={(key) => updateUnit(unit.id, "bathrooms", key as string)}
                                        items={BATHROOM_OPTIONS}
                                    >
                                        {(item) => <SelectItem id={item.id} textValue={item.label}>{item.label}</SelectItem>}
                                    </Select>
                                </div>
                                <div>
                                    <Label>Square Feet</Label>
                                    <Input
                                        placeholder="850"
                                        value={unit.sqft}
                                        onChange={(value) => updateUnit(unit.id, "sqft", value)}
                                    />
                                </div>
                                <div>
                                    <Label>Floor Level</Label>
                                    <Select
                                        placeholder="Select"
                                        selectedKey={unit.floor}
                                        onSelectionChange={(key) => updateUnit(unit.id, "floor", key as string)}
                                        items={FLOOR_OPTIONS}
                                    >
                                        {(item) => <SelectItem id={item.id} textValue={item.label}>{item.label}</SelectItem>}
                                    </Select>
                                </div>
                                <div>
                                    <Label>Monthly Rent *</Label>
                                    <Input
                                        placeholder="$1,500"
                                        value={unit.rent}
                                        onChange={(value) => updateUnit(unit.id, "rent", value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
