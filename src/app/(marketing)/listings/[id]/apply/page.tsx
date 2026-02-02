"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import {
    ApplyFormLayout,
    StepPersonalInfo,
    StepCurrentResidence,
    StepEmployment,
    StepAdditionalInfo,
    StepEmergencyContact,
    StepReview,
    type PersonalInfoData,
    type CurrentResidenceData,
    type EmploymentData,
    type AdditionalInfoData,
    type EmergencyContactData,
} from "@/components/applications/apply";

// Initial form data
const INITIAL_PERSONAL_INFO: PersonalInfoData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
};

const INITIAL_CURRENT_RESIDENCE: CurrentResidenceData = {
    street: "",
    city: "",
    state: "",
    zip: "",
    moveInDate: "",
    rent: "",
    landlordName: "",
    landlordPhone: "",
};

const INITIAL_EMPLOYMENT: EmploymentData = {
    status: "employed",
    employer: "",
    position: "",
    income: "",
    startDate: "",
    supervisorName: "",
    supervisorPhone: "",
};

const INITIAL_ADDITIONAL_INFO: AdditionalInfoData = {
    occupants: [],
    pets: [],
    vehicles: [],
    desiredMoveIn: "",
    desiredLeaseTerm: "12_months",
};

const INITIAL_EMERGENCY_CONTACT: EmergencyContactData = {
    name: "",
    relationship: "",
    phone: "",
};

// Demo listing data
const demoListing = {
    title: "Modern Downtown Apartment",
    propertyName: "Main Street Apartments",
    address: "123 Main Street, Unit B, Austin, TX 78701",
    rentAmount: 1500,
    depositAmount: 1500,
};

interface Props {
    params: Promise<{ id: string }>;
}

export default function ApplyPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch listing by ID
    const listing = useQuery(api.listings.queries.getListing, { listingId: id as Id<"listings"> });

    // Create application mutation
    const createApplication = useMutation(api.applications.mutations.createApplication);

    // Form state
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(INITIAL_PERSONAL_INFO);
    const [currentResidence, setCurrentResidence] = useState<CurrentResidenceData>(INITIAL_CURRENT_RESIDENCE);
    const [employment, setEmployment] = useState<EmploymentData>(INITIAL_EMPLOYMENT);
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData>(INITIAL_ADDITIONAL_INFO);
    const [emergencyContact, setEmergencyContact] = useState<EmergencyContactData>(INITIAL_EMERGENCY_CONTACT);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Use listing data or demo
    const listingData = listing || demoListing;
    const applicationFee = 35; // Standard fee

    // Validation
    const isStep1Valid =
        personalInfo.firstName.trim() !== "" &&
        personalInfo.lastName.trim() !== "" &&
        personalInfo.email.trim() !== "" &&
        personalInfo.phone.trim() !== "" &&
        personalInfo.dateOfBirth !== "";

    const isStep2Valid =
        currentResidence.street.trim() !== "" &&
        currentResidence.city.trim() !== "" &&
        currentResidence.state.trim() !== "" &&
        currentResidence.zip.trim() !== "" &&
        currentResidence.moveInDate !== "" &&
        currentResidence.rent !== "";

    const isStep3Valid =
        Boolean(employment.status) &&
        employment.income !== "";

    const isStep4Valid =
        additionalInfo.desiredMoveIn !== "" &&
        additionalInfo.desiredLeaseTerm !== "";

    const isStep5Valid =
        emergencyContact.name.trim() !== "" &&
        emergencyContact.relationship.trim() !== "" &&
        emergencyContact.phone.trim() !== "";

    const isStep6Valid = agreedToTerms;

    const getStepValidity = () => {
        switch (currentStep) {
            case 1: return isStep1Valid;
            case 2: return isStep2Valid;
            case 3: return isStep3Valid;
            case 4: return isStep4Valid;
            case 5: return isStep5Valid;
            case 6: return isStep6Valid;
            default: return false;
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = async () => {
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit application
            setIsSubmitting(true);
            setError(null);

            try {
                if (!listing?._id) {
                    // Demo mode
                    alert("Demo mode: Application would be submitted. In production, this will save to the database.");
                    router.push(`/listings/${id}`);
                    return;
                }

                await createApplication({
                    listingId: listing._id,
                    applicant: {
                        firstName: personalInfo.firstName,
                        lastName: personalInfo.lastName,
                        email: personalInfo.email,
                        phone: personalInfo.phone,
                        dateOfBirth: new Date(personalInfo.dateOfBirth).getTime(),
                    },
                    currentAddress: {
                        street: currentResidence.street,
                        city: currentResidence.city,
                        state: currentResidence.state,
                        zip: currentResidence.zip,
                        moveInDate: new Date(currentResidence.moveInDate).getTime(),
                        rent: parseFloat(currentResidence.rent),
                        landlordName: currentResidence.landlordName || undefined,
                        landlordPhone: currentResidence.landlordPhone || undefined,
                    },
                    employment: {
                        status: employment.status,
                        employer: employment.employer || undefined,
                        position: employment.position || undefined,
                        income: parseFloat(employment.income),
                        startDate: employment.startDate ? new Date(employment.startDate).getTime() : undefined,
                        supervisorName: employment.supervisorName || undefined,
                        supervisorPhone: employment.supervisorPhone || undefined,
                    },
                    occupants: additionalInfo.occupants.map((o) => ({
                        name: o.name,
                        relationship: o.relationship,
                        age: parseInt(o.age),
                    })),
                    pets: additionalInfo.pets.map((p) => ({
                        type: p.type,
                        breed: p.breed,
                        weight: parseFloat(p.weight),
                    })),
                    vehicles: additionalInfo.vehicles.map((v) => ({
                        make: v.make,
                        model: v.model,
                        year: parseInt(v.year),
                        licensePlate: v.licensePlate,
                    })),
                    emergencyContact: {
                        name: emergencyContact.name,
                        relationship: emergencyContact.relationship,
                        phone: emergencyContact.phone,
                    },
                    desiredMoveIn: new Date(additionalInfo.desiredMoveIn).getTime(),
                    desiredLeaseTerm: additionalInfo.desiredLeaseTerm,
                    applicationFee,
                });

                // Redirect to success page or listing
                router.push(`/listings/${id}?applied=true`);
            } catch (err) {
                console.error("Error submitting application:", err);
                setError(err instanceof Error ? err.message : "Failed to submit application");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleCancel = () => {
        router.push(`/listings/${id}`);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepPersonalInfo data={personalInfo} onChange={setPersonalInfo} />;
            case 2:
                return <StepCurrentResidence data={currentResidence} onChange={setCurrentResidence} />;
            case 3:
                return <StepEmployment data={employment} onChange={setEmployment} />;
            case 4:
                return <StepAdditionalInfo data={additionalInfo} onChange={setAdditionalInfo} />;
            case 5:
                return <StepEmergencyContact data={emergencyContact} onChange={setEmergencyContact} />;
            case 6:
                return (
                    <StepReview
                        personalInfo={personalInfo}
                        currentResidence={currentResidence}
                        employment={employment}
                        additionalInfo={additionalInfo}
                        emergencyContact={emergencyContact}
                        listingInfo={{
                            title: listingData.title || "Rental Unit",
                            address: ("address" in listingData ? listingData.address : null) || (listing?.property as { address?: { street?: string } } | null)?.address?.street || "Address",
                            rent: listingData.rentAmount || listing?.rentAmount || 0,
                            deposit: listingData.depositAmount || listing?.depositAmount || 0,
                        }}
                        applicationFee={applicationFee}
                        agreedToTerms={agreedToTerms}
                        onAgreedToTermsChange={setAgreedToTerms}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ApplyFormLayout
            listingTitle={listingData.title || listing?.title || "Rental Application"}
            propertyName={("propertyName" in listingData ? listingData.propertyName : null) || listing?.property?.name || "Property"}
            currentStep={currentStep}
            totalSteps={6}
            onBack={handleBack}
            onNext={handleNext}
            onCancel={handleCancel}
            isNextDisabled={!getStepValidity()}
            isSubmitting={isSubmitting}
        >
            {error && (
                <div className="mb-4 rounded-xl border border-error-secondary bg-error-secondary/50 p-4 text-sm text-error-primary">
                    {error}
                </div>
            )}
            {renderStep()}
        </ApplyFormLayout>
    );
}
