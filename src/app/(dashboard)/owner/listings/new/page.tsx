"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import {
    ListingFormLayout,
    StepSelectUnit,
    StepListingDetails,
    StepPhotos,
    StepPricing,
    StepAISupport,
    StepReview,
    type SelectUnitData,
    type ListingDetailsData,
    type PhotoData,
    type PricingData,
    type AISupportData,
} from "@/components/listings/create-listing";

const INITIAL_UNIT_DATA: SelectUnitData = {
    propertyId: "",
    unitId: "",
};

const INITIAL_LISTING_DATA: ListingDetailsData = {
    title: "",
    description: "",
};

const INITIAL_PRICING_DATA: PricingData = {
    rentAmount: "",
    depositAmount: "",
    availableDate: "",
    leaseTerm: "12_months",
    petsAllowed: false,
    petDeposit: "",
    smokingAllowed: false,
    utilitiesIncluded: [],
};

const INITIAL_AI_SUPPORT_DATA: AISupportData = {
    knowledgeBaseSource: "property",
    documents: [],
    faqs: [],
    chatEnabled: true,
    phoneEnabled: false,
    whatsappEnabled: false,
    smsEnabled: false,
    supportPhoneNumber: "",
    escalationPhoneNumber: "",
    showOnListing: true,
    showOnTenantPortal: true,
    embedEnabled: false,
    widgetPosition: "bottom-right",
    widgetColor: "#2563eb",
    welcomeMessage: "Hi! 👋 I'm your AI assistant. Ask me anything about this property, schedule a tour, or get help with your application.",
    escalateOnEmergency: true,
    escalateOnHumanRequest: true,
    escalateOnUnknown: false,
    canScheduleTours: true,
    canCreateMaintenanceRequests: false,
};

// Map form lease term to schema lease term
const mapLeaseTerm = (term: string): "month_to_month" | "6_months" | "12_months" | "24_months" | "flexible" => {
    const mapping: Record<string, "month_to_month" | "6_months" | "12_months" | "24_months" | "flexible"> = {
        "month_to_month": "month_to_month",
        "month-to-month": "month_to_month",
        "6_months": "6_months",
        "6-months": "6_months",
        "12_months": "12_months",
        "12-months": "12_months",
        "24_months": "24_months",
        "24-months": "24_months",
        "flexible": "flexible",
    };
    return mapping[term] || "12_months";
};

export default function NewListingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get current user's organization
    const orgData = useQuery(api.organizations.queries.getMyOrganization);
    
    // Create listing mutation
    const createListing = useMutation(api.listings.mutations.createListing);

    // Form data for each step
    const [unitData, setUnitData] = useState<SelectUnitData>(INITIAL_UNIT_DATA);
    const [listingDetails, setListingDetails] = useState<ListingDetailsData>(INITIAL_LISTING_DATA);
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [pricing, setPricing] = useState<PricingData>(INITIAL_PRICING_DATA);
    const [aiSupport, setAISupport] = useState<AISupportData>(INITIAL_AI_SUPPORT_DATA);

    // Step validation
    const isStep1Valid = unitData.propertyId !== "" && unitData.unitId !== "";
    const isStep2Valid = listingDetails.title.trim() !== "" && listingDetails.description.trim() !== "";
    const isStep3Valid = true; // Photos are optional
    const isStep4Valid =
        pricing.rentAmount !== "" &&
        pricing.depositAmount !== "" &&
        pricing.availableDate !== "" &&
        pricing.leaseTerm !== "";
    const isStep5Valid = true; // AI support is optional

    const getStepValidity = () => {
        switch (currentStep) {
            case 1:
                return isStep1Valid;
            case 2:
                return isStep2Valid;
            case 3:
                return isStep3Valid;
            case 4:
                return isStep4Valid;
            case 5:
                return isStep5Valid;
            case 6:
                return true; // Review step
            default:
                return false;
        }
    };

    const handleNext = async () => {
        if (currentStep === 6) {
            // Submit the listing
            setIsSubmitting(true);
            setError(null);
            
            try {
                // Check if we have an organization
                if (!orgData?.organization?._id) {
                    throw new Error("No organization found. Please complete onboarding first.");
                }

                // Parse the available date
                const availableDate = new Date(pricing.availableDate).getTime();

                // Prepare data for mutation
                const listingData = {
                    organizationId: orgData.organization._id,
                    propertyId: unitData.propertyId as Id<"properties">,
                    unitId: unitData.unitId as Id<"units">,
                    title: listingDetails.title,
                    description: listingDetails.description,
                    rentAmount: parseFloat(pricing.rentAmount),
                    depositAmount: parseFloat(pricing.depositAmount),
                    availableDate,
                    leaseTerm: mapLeaseTerm(pricing.leaseTerm),
                    requirements: {
                        petsAllowed: pricing.petsAllowed,
                        petDeposit: pricing.petDeposit ? parseFloat(pricing.petDeposit) : undefined,
                        smokingAllowed: pricing.smokingAllowed,
                    },
                    utilities: {
                        included: pricing.utilitiesIncluded,
                        tenantPays: [] as string[],
                    },
                };

                // Call the mutation
                const result = await createListing(listingData);
                
                if (result?.listingId) {
                    // Redirect to listings page
                    router.push("/owner/listings");
                }
            } catch (err) {
                console.error("Error creating listing:", err);
                setError(err instanceof Error ? err.message : "Failed to create listing");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1));
    };

    const handleCancel = () => {
        router.push("/owner/listings");
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepSelectUnit data={unitData} onChange={setUnitData} />;
            case 2:
                return <StepListingDetails data={listingDetails} onChange={setListingDetails} />;
            case 3:
                return <StepPhotos photos={photos} onChange={setPhotos} />;
            case 4:
                return <StepPricing data={pricing} onChange={setPricing} />;
            case 5:
                return <StepAISupport data={aiSupport} onChange={setAISupport} />;
            case 6:
                return (
                    <StepReview
                        unitData={unitData}
                        listingDetails={listingDetails}
                        photos={photos}
                        pricing={pricing}
                        aiSupport={aiSupport}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ListingFormLayout
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
        </ListingFormLayout>
    );
}
