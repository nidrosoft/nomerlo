"use client";

import { Edit05, Stars01 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { Button } from "@/components/base/buttons/button";

export interface ListingDetailsData {
    title: string;
    description: string;
}

interface StepListingDetailsProps {
    data: ListingDetailsData;
    onChange: (data: ListingDetailsData) => void;
}

export function StepListingDetails({ data, onChange }: StepListingDetailsProps) {
    const handleGenerateWithAI = () => {
        // TODO: Integrate with AI to generate description
        onChange({
            ...data,
            title: data.title || "Spacious Modern Apartment with City Views",
            description:
                data.description ||
                "Welcome to this beautiful, move-in ready apartment in a prime location! This stunning unit features an open floor plan with abundant natural light, modern finishes throughout, and breathtaking city views. The updated kitchen boasts stainless steel appliances, granite countertops, and ample cabinet space. Enjoy the convenience of in-unit laundry, central air conditioning, and a private balcony perfect for morning coffee. Building amenities include a fitness center, rooftop terrace, and secure parking. Located steps from restaurants, shopping, and public transit. Don't miss this gem!",
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <Edit05 className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Listing Details</h2>
                    <p className="text-sm text-tertiary">
                        Create an engaging title and description for your listing
                    </p>
                </div>
            </div>

            {/* AI Generate Button */}
            <div className="rounded-lg border border-brand-secondary bg-brand-secondary p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Stars01 className="size-5 text-brand-primary" />
                        <div>
                            <p className="text-sm font-medium text-brand-primary">
                                Generate with AI
                            </p>
                            <p className="text-sm text-brand-tertiary">
                                Let AI create a compelling listing description for you
                            </p>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={handleGenerateWithAI}>
                        Generate
                    </Button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>Listing Title *</Label>
                    <Input
                        placeholder="e.g., Modern Downtown Apartment with City Views"
                        value={data.title}
                        onChange={(value) => onChange({ ...data, title: value })}
                    />
                    <p className="text-xs text-tertiary">
                        Create an eye-catching title that highlights key features
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label>Description *</Label>
                    <TextArea
                        placeholder="Describe the property, amenities, neighborhood, and what makes it special..."
                        value={data.description}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        rows={8}
                    />
                    <p className="text-xs text-tertiary">
                        {data.description.length} / 2000 characters
                    </p>
                </div>
            </div>
        </div>
    );
}
