"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import {
    PropertyFormLayout,
    StepBasicInfo,
    StepUnits,
    StepAmenities,
    StepReview,
    type BasicInfoData,
    type UnitData,
} from "@/components/properties/add-property";

const INITIAL_BASIC_INFO: BasicInfoData = {
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    propertyName: "",
    propertyType: "",
    numberOfUnits: 1,
    yearBuilt: "",
    totalSqft: "",
};

const createInitialUnit = (): UnitData => ({
    id: crypto.randomUUID(),
    name: "Unit A",
    bedrooms: "2",
    bathrooms: "1",
    sqft: "",
    floor: "1",
    rent: "",
    deposit: "",
});

// Map form property type to schema property type
const mapPropertyType = (type: string): "single_family" | "multi_family" | "apartment" | "condo" | "townhouse" | "commercial" | "mixed_use" => {
    const mapping: Record<string, "single_family" | "multi_family" | "apartment" | "condo" | "townhouse" | "commercial" | "mixed_use"> = {
        "single-family": "single_family",
        "single_family": "single_family",
        "multi-family": "multi_family",
        "multi_family": "multi_family",
        "apartment": "apartment",
        "condo": "condo",
        "townhouse": "townhouse",
        "commercial": "commercial",
        "mixed-use": "mixed_use",
        "mixed_use": "mixed_use",
    };
    return mapping[type.toLowerCase()] || "apartment";
};

export default function NewPropertyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get current user's organization
    const orgData = useQuery(api.organizations.queries.getMyOrganization);
    
    // Create property mutation
    const createProperty = useMutation(api.properties.mutations.createProperty);

    // Form data state
    const [basicInfo, setBasicInfo] = useState<BasicInfoData>(INITIAL_BASIC_INFO);
    const [units, setUnits] = useState<UnitData[]>([createInitialUnit()]);
    const [amenities, setAmenities] = useState<string[]>([]);

    // Validation
    const isStep1Valid = 
        basicInfo.streetAddress.trim() !== "" &&
        basicInfo.city.trim() !== "" &&
        basicInfo.state !== "" &&
        basicInfo.zipCode.trim() !== "" &&
        basicInfo.propertyType !== "" &&
        basicInfo.numberOfUnits > 0;

    const isStep2Valid = units.length > 0 && units.every((unit) => unit.name.trim() !== "");

    const getStepValidity = () => {
        switch (currentStep) {
            case 1:
                return isStep1Valid;
            case 2:
                return isStep2Valid;
            case 3:
                return true; // Amenities are optional
            case 4:
                return true; // Review step
            default:
                return false;
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit the form
            setIsSubmitting(true);
            setError(null);
            
            try {
                // Check if we have an organization
                if (!orgData?.organization?._id) {
                    throw new Error("No organization found. Please complete onboarding first.");
                }

                // Prepare data for mutation
                const propertyData = {
                    organizationId: orgData.organization._id,
                    name: basicInfo.propertyName || `${basicInfo.streetAddress}, ${basicInfo.city}`,
                    type: mapPropertyType(basicInfo.propertyType),
                    address: {
                        street: basicInfo.streetAddress,
                        city: basicInfo.city,
                        state: basicInfo.state,
                        zip: basicInfo.zipCode,
                        country: "USA",
                    },
                    yearBuilt: basicInfo.yearBuilt ? parseInt(basicInfo.yearBuilt) : undefined,
                    totalSqft: basicInfo.totalSqft ? parseInt(basicInfo.totalSqft) : undefined,
                    amenities,
                    units: units.map((unit, index) => ({
                        name: unit.name,
                        unitNumber: unit.name || `Unit ${index + 1}`,
                        bedrooms: parseInt(unit.bedrooms) || 0,
                        bathrooms: parseFloat(unit.bathrooms) || 1,
                        sqft: unit.sqft ? parseInt(unit.sqft) : undefined,
                        floor: unit.floor ? parseInt(unit.floor) : undefined,
                        marketRent: unit.rent ? parseFloat(unit.rent) : 0,
                        depositAmount: unit.deposit ? parseFloat(unit.deposit) : undefined,
                        features: [],
                    })),
                };

                // Call the mutation
                const result = await createProperty(propertyData);
                
                if (result?.propertyId) {
                    // Redirect to properties list
                    router.push("/owner/properties");
                }
            } catch (err) {
                console.error("Error creating property:", err);
                setError(err instanceof Error ? err.message : "Failed to create property");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleCancel = () => {
        router.push("/owner/properties");
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepBasicInfo data={basicInfo} onChange={setBasicInfo} />;
            case 2:
                return <StepUnits units={units} onChange={setUnits} />;
            case 3:
                return <StepAmenities selectedAmenities={amenities} onChange={setAmenities} />;
            case 4:
                return <StepReview basicInfo={basicInfo} units={units} amenities={amenities} />;
            default:
                return null;
        }
    };

    return (
        <PropertyFormLayout
            currentStep={currentStep}
            onBack={handleBack}
            onNext={handleNext}
            onCancel={handleCancel}
            isNextDisabled={!getStepValidity()}
            isSubmitting={isSubmitting}
        >
            {error && (
                <div className="mb-4 rounded-lg border border-error-secondary bg-error-primary/10 p-4 text-error-primary">
                    {error}
                </div>
            )}
            {renderStep()}
        </PropertyFormLayout>
    );
}
