"use client";

import { Plus, X } from "lucide-react";

export interface OccupantData {
    name: string;
    relationship: string;
    age: string;
}

export interface PetData {
    type: string;
    breed: string;
    weight: string;
}

export interface VehicleData {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
}

export interface AdditionalInfoData {
    occupants: OccupantData[];
    pets: PetData[];
    vehicles: VehicleData[];
    desiredMoveIn: string;
    desiredLeaseTerm: string;
}

interface StepAdditionalInfoProps {
    data: AdditionalInfoData;
    onChange: (data: AdditionalInfoData) => void;
}

export function StepAdditionalInfo({ data, onChange }: StepAdditionalInfoProps) {
    // Occupants
    const addOccupant = () => {
        onChange({
            ...data,
            occupants: [...data.occupants, { name: "", relationship: "", age: "" }],
        });
    };

    const removeOccupant = (index: number) => {
        onChange({
            ...data,
            occupants: data.occupants.filter((_, i) => i !== index),
        });
    };

    const updateOccupant = (index: number, field: keyof OccupantData, value: string) => {
        const updated = [...data.occupants];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, occupants: updated });
    };

    // Pets
    const addPet = () => {
        onChange({
            ...data,
            pets: [...data.pets, { type: "", breed: "", weight: "" }],
        });
    };

    const removePet = (index: number) => {
        onChange({
            ...data,
            pets: data.pets.filter((_, i) => i !== index),
        });
    };

    const updatePet = (index: number, field: keyof PetData, value: string) => {
        const updated = [...data.pets];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, pets: updated });
    };

    // Vehicles
    const addVehicle = () => {
        onChange({
            ...data,
            vehicles: [...data.vehicles, { make: "", model: "", year: "", licensePlate: "" }],
        });
    };

    const removeVehicle = (index: number) => {
        onChange({
            ...data,
            vehicles: data.vehicles.filter((_, i) => i !== index),
        });
    };

    const updateVehicle = (index: number, field: keyof VehicleData, value: string) => {
        const updated = [...data.vehicles];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, vehicles: updated });
    };

    const leaseTerms = [
        { value: "month_to_month", label: "Month-to-Month" },
        { value: "6_months", label: "6 Months" },
        { value: "12_months", label: "12 Months" },
        { value: "24_months", label: "24 Months" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-primary">Additional Information</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Tell us about anyone else who will be living with you, any pets, and vehicles.
                </p>
            </div>

            {/* Move-in Preferences */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Desired Move-in Date <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="date"
                        value={data.desiredMoveIn}
                        onChange={(e) => onChange({ ...data, desiredMoveIn: e.target.value })}
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Desired Lease Term <span className="text-error-primary">*</span>
                    </label>
                    <select
                        value={data.desiredLeaseTerm}
                        onChange={(e) => onChange({ ...data, desiredLeaseTerm: e.target.value })}
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                    >
                        {leaseTerms.map((term) => (
                            <option key={term.value} value={term.value}>
                                {term.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Co-Occupants */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-primary">Additional Occupants</h3>
                    <button
                        type="button"
                        onClick={addOccupant}
                        className="flex items-center gap-1 text-sm text-brand-primary hover:underline"
                    >
                        <Plus className="size-4" /> Add Occupant
                    </button>
                </div>
                {data.occupants.length === 0 ? (
                    <p className="text-sm text-tertiary">No additional occupants</p>
                ) : (
                    <div className="space-y-3">
                        {data.occupants.map((occupant, index) => (
                            <div key={index} className="flex items-start gap-2 rounded-lg bg-primary p-3">
                                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                                    <input
                                        type="text"
                                        value={occupant.name}
                                        onChange={(e) => updateOccupant(index, "name", e.target.value)}
                                        placeholder="Name"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={occupant.relationship}
                                        onChange={(e) => updateOccupant(index, "relationship", e.target.value)}
                                        placeholder="Relationship"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={occupant.age}
                                        onChange={(e) => updateOccupant(index, "age", e.target.value)}
                                        placeholder="Age"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeOccupant(index)}
                                    className="p-1 text-tertiary hover:text-error-primary"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pets */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-primary">Pets</h3>
                    <button
                        type="button"
                        onClick={addPet}
                        className="flex items-center gap-1 text-sm text-brand-primary hover:underline"
                    >
                        <Plus className="size-4" /> Add Pet
                    </button>
                </div>
                {data.pets.length === 0 ? (
                    <p className="text-sm text-tertiary">No pets</p>
                ) : (
                    <div className="space-y-3">
                        {data.pets.map((pet, index) => (
                            <div key={index} className="flex items-start gap-2 rounded-lg bg-primary p-3">
                                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                                    <input
                                        type="text"
                                        value={pet.type}
                                        onChange={(e) => updatePet(index, "type", e.target.value)}
                                        placeholder="Type (Dog, Cat...)"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={pet.breed}
                                        onChange={(e) => updatePet(index, "breed", e.target.value)}
                                        placeholder="Breed"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={pet.weight}
                                        onChange={(e) => updatePet(index, "weight", e.target.value)}
                                        placeholder="Weight (lbs)"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removePet(index)}
                                    className="p-1 text-tertiary hover:text-error-primary"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Vehicles */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-primary">Vehicles</h3>
                    <button
                        type="button"
                        onClick={addVehicle}
                        className="flex items-center gap-1 text-sm text-brand-primary hover:underline"
                    >
                        <Plus className="size-4" /> Add Vehicle
                    </button>
                </div>
                {data.vehicles.length === 0 ? (
                    <p className="text-sm text-tertiary">No vehicles</p>
                ) : (
                    <div className="space-y-3">
                        {data.vehicles.map((vehicle, index) => (
                            <div key={index} className="flex items-start gap-2 rounded-lg bg-primary p-3">
                                <div className="grid flex-1 gap-2 sm:grid-cols-4">
                                    <input
                                        type="text"
                                        value={vehicle.make}
                                        onChange={(e) => updateVehicle(index, "make", e.target.value)}
                                        placeholder="Make"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={vehicle.model}
                                        onChange={(e) => updateVehicle(index, "model", e.target.value)}
                                        placeholder="Model"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={vehicle.year}
                                        onChange={(e) => updateVehicle(index, "year", e.target.value)}
                                        placeholder="Year"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={vehicle.licensePlate}
                                        onChange={(e) => updateVehicle(index, "licensePlate", e.target.value)}
                                        placeholder="License Plate"
                                        className="rounded-lg border border-secondary px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeVehicle(index)}
                                    className="p-1 text-tertiary hover:text-error-primary"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
