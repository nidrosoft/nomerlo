"use client";

import { Settings01 } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";

const PROPERTY_AMENITIES = [
    { id: "central_ac", label: "Central A/C" },
    { id: "dishwasher", label: "Dishwasher" },
    { id: "washer_dryer", label: "Washer/Dryer" },
    { id: "parking", label: "Parking" },
    { id: "garage", label: "Garage" },
    { id: "pool", label: "Pool" },
    { id: "gym", label: "Gym/Fitness" },
    { id: "laundry_onsite", label: "Laundry (On-site)" },
    { id: "storage", label: "Storage" },
    { id: "pet_friendly", label: "Pet Friendly" },
    { id: "furnished", label: "Furnished" },
    { id: "wheelchair", label: "Wheelchair Access" },
    { id: "elevator", label: "Elevator" },
    { id: "security", label: "Security System" },
    { id: "doorman", label: "Doorman/Concierge" },
    { id: "outdoor_space", label: "Outdoor Space" },
    { id: "bbq_area", label: "BBQ/Grill Area" },
    { id: "playground", label: "Playground" },
];

interface StepAmenitiesProps {
    selectedAmenities: string[];
    onChange: (amenities: string[]) => void;
}

export function StepAmenities({ selectedAmenities, onChange }: StepAmenitiesProps) {
    const toggleAmenity = (amenityId: string) => {
        if (selectedAmenities.includes(amenityId)) {
            onChange(selectedAmenities.filter((id) => id !== amenityId));
        } else {
            onChange([...selectedAmenities, amenityId]);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <Settings01 className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Property Amenities</h2>
                    <p className="text-sm text-tertiary">
                        Select the amenities available at your property. These help attract tenants.
                    </p>
                </div>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {PROPERTY_AMENITIES.map((amenity) => (
                    <label
                        key={amenity.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-secondary bg-primary p-3 transition-colors hover:bg-primary_hover"
                    >
                        <Checkbox
                            isSelected={selectedAmenities.includes(amenity.id)}
                            onChange={() => toggleAmenity(amenity.id)}
                        />
                        <span className="text-sm font-medium text-secondary">{amenity.label}</span>
                    </label>
                ))}
            </div>

            {/* Selected count */}
            <p className="text-sm text-tertiary">
                {selectedAmenities.length} amenities selected
            </p>
        </div>
    );
}
