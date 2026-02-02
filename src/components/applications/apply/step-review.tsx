"use client";

import { Check } from "lucide-react";
import type { PersonalInfoData } from "./step-personal-info";
import type { CurrentResidenceData } from "./step-current-residence";
import type { EmploymentData } from "./step-employment";
import type { AdditionalInfoData } from "./step-additional-info";
import type { EmergencyContactData } from "./step-emergency-contact";

interface StepReviewProps {
    personalInfo: PersonalInfoData;
    currentResidence: CurrentResidenceData;
    employment: EmploymentData;
    additionalInfo: AdditionalInfoData;
    emergencyContact: EmergencyContactData;
    listingInfo: {
        title: string;
        address: string;
        rent: number;
        deposit: number;
    };
    applicationFee: number;
    agreedToTerms: boolean;
    onAgreedToTermsChange: (agreed: boolean) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString: string): string => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export function StepReview({
    personalInfo,
    currentResidence,
    employment,
    additionalInfo,
    emergencyContact,
    listingInfo,
    applicationFee,
    agreedToTerms,
    onAgreedToTermsChange,
}: StepReviewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-primary">Review Your Application</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Please review your information before submitting.
                </p>
            </div>

            {/* Applying For */}
            <div className="rounded-xl border border-brand-primary/30 bg-brand-secondary/20 p-4">
                <h3 className="mb-2 text-sm font-medium text-brand-primary">Applying For</h3>
                <p className="font-semibold text-primary">{listingInfo.title}</p>
                <p className="text-sm text-tertiary">{listingInfo.address}</p>
                <div className="mt-2 flex gap-4 text-sm">
                    <span className="text-primary">Rent: {formatCurrency(listingInfo.rent)}/mo</span>
                    <span className="text-primary">Deposit: {formatCurrency(listingInfo.deposit)}</span>
                </div>
            </div>

            {/* Personal Info */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Personal Information</h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                        <span className="text-tertiary">Name: </span>
                        <span className="text-primary">{personalInfo.firstName} {personalInfo.lastName}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">Email: </span>
                        <span className="text-primary">{personalInfo.email}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">Phone: </span>
                        <span className="text-primary">{personalInfo.phone}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">DOB: </span>
                        <span className="text-primary">{formatDate(personalInfo.dateOfBirth)}</span>
                    </div>
                </div>
            </div>

            {/* Current Residence */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Current Residence</h3>
                <div className="space-y-1 text-sm">
                    <p className="text-primary">{currentResidence.street}</p>
                    <p className="text-primary">
                        {currentResidence.city}, {currentResidence.state} {currentResidence.zip}
                    </p>
                    <p className="text-tertiary">
                        Since {formatDate(currentResidence.moveInDate)} · Rent: ${currentResidence.rent}/mo
                    </p>
                </div>
            </div>

            {/* Employment */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Employment</h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                        <span className="text-tertiary">Status: </span>
                        <span className="text-primary capitalize">{employment.status.replace("_", "-")}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">Income: </span>
                        <span className="text-primary">${employment.income}/mo</span>
                    </div>
                    {employment.employer && (
                        <div>
                            <span className="text-tertiary">Employer: </span>
                            <span className="text-primary">{employment.employer}</span>
                        </div>
                    )}
                    {employment.position && (
                        <div>
                            <span className="text-tertiary">Position: </span>
                            <span className="text-primary">{employment.position}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Move-in Details */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Move-in Details</h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                        <span className="text-tertiary">Desired Move-in: </span>
                        <span className="text-primary">{formatDate(additionalInfo.desiredMoveIn)}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">Lease Term: </span>
                        <span className="text-primary">{additionalInfo.desiredLeaseTerm.replace("_", " ")}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">Occupants: </span>
                        <span className="text-primary">{additionalInfo.occupants.length || "None"}</span>
                    </div>
                    <div>
                        <span className="text-tertiary">Pets: </span>
                        <span className="text-primary">{additionalInfo.pets.length || "None"}</span>
                    </div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-xl bg-secondary/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Emergency Contact</h3>
                <div className="text-sm">
                    <p className="text-primary">{emergencyContact.name} ({emergencyContact.relationship})</p>
                    <p className="text-tertiary">{emergencyContact.phone}</p>
                </div>
            </div>

            {/* Application Fee */}
            <div className="rounded-xl border border-secondary p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-primary">Application Fee</h3>
                        <p className="text-sm text-tertiary">Non-refundable processing fee</p>
                    </div>
                    <span className="text-xl font-bold text-primary">{formatCurrency(applicationFee)}</span>
                </div>
            </div>

            {/* Terms Agreement */}
            <div className="rounded-xl border border-secondary p-4">
                <label className="flex cursor-pointer items-start gap-3">
                    <div className="relative mt-0.5">
                        <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => onAgreedToTermsChange(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="flex h-5 w-5 items-center justify-center rounded border border-secondary bg-primary peer-checked:border-brand-primary peer-checked:bg-brand-primary">
                            {agreedToTerms && <Check className="size-3 text-white" />}
                        </div>
                    </div>
                    <div className="text-sm">
                        <span className="text-primary">I certify that all information provided is accurate and complete. </span>
                        <span className="text-tertiary">
                            I authorize the landlord to verify my employment, rental history, and run credit 
                            and background checks. I understand this application is subject to approval.
                        </span>
                    </div>
                </label>
            </div>
        </div>
    );
}
