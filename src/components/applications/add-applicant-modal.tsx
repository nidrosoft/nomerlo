"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { X, UserPlus, DollarSign } from "lucide-react";
import { Button } from "@/components/base/buttons/button";

interface AddApplicantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddApplicantModal({ isOpen, onClose }: AddApplicantModalProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [selectedListing, setSelectedListing] = useState("");
    const [income, setIncome] = useState("");
    const [employer, setEmployer] = useState("");
    const [desiredMoveIn, setDesiredMoveIn] = useState("");
    const [leaseTerm, setLeaseTerm] = useState("12_months");
    const [notes, setNotes] = useState("");

    // Fetch active listings from Convex
    const listings = useQuery(api.listings.queries.listListings, {});

    // Mutation to add applicant
    const addApplicant = useMutation(api.applications.mutations.addApplicantManually);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedListing) {
            setError("Please select a listing");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await addApplicant({
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth: dateOfBirth || undefined,
                listingId: selectedListing as Id<"listings">,
                income: parseFloat(income) || 0,
                employer: employer || undefined,
                desiredMoveIn: new Date(desiredMoveIn).getTime(),
                leaseTerm,
                notes: notes || undefined,
            });

            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            console.error("Error adding applicant:", err);
            setError(err instanceof Error ? err.message : "Failed to add applicant");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setDateOfBirth("");
        setSelectedListing("");
        setIncome("");
        setEmployer("");
        setDesiredMoveIn("");
        setLeaseTerm("12_months");
        setNotes("");
        setError(null);
        setSuccess(false);
        onClose();
    };

    const isStep1Valid = firstName && lastName && email && phone;
    const isStep2Valid = selectedListing;
    const isStep3Valid = income && desiredMoveIn;

    // Get selected listing details
    const selectedListingData = listings?.find((l) => l._id === selectedListing);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-secondary bg-primary p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary">
                            <UserPlus className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Add Applicant</h2>
                            <p className="text-sm text-tertiary">Manually add an application</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-full p-2 text-tertiary hover:bg-secondary transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 rounded-xl border border-error-secondary bg-error-secondary/30 p-4 text-sm text-error-primary">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-xl border border-success-secondary bg-success-secondary/30 p-4 text-sm text-success-primary">
                        Applicant added successfully!
                    </div>
                )}

                {/* Step Indicator */}
                <div className="flex items-center mb-6">
                    {[1, 2, 3].map((s, idx) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                    step >= s
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary text-tertiary"
                                }`}
                            >
                                {s}
                            </div>
                            {idx < 2 && (
                                <div
                                    className={`mx-2 h-0.5 w-12 ${
                                        step > s ? "bg-brand-primary" : "bg-secondary"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-primary mb-4">Applicant Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1.5">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john.doe@email.com"
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(512) 555-0100"
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-primary mb-4">Select Listing</h3>
                        {!listings || listings.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-secondary p-8 text-center">
                                <p className="text-secondary">No listings available.</p>
                                <p className="text-sm text-tertiary mt-1">
                                    Create a listing first to add applicants.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {listings.map((listing) => (
                                    <button
                                        key={listing._id}
                                        onClick={() => setSelectedListing(listing._id)}
                                        className={`w-full text-left rounded-xl border p-4 transition-colors ${
                                            selectedListing === listing._id
                                                ? "border-brand-primary bg-brand-secondary/20"
                                                : "border-secondary hover:border-tertiary"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-primary">{listing.title}</p>
                                                <p className="text-sm text-tertiary">
                                                    {listing.property?.name} • {listing.unit?.unitNumber || "N/A"}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-primary">
                                                ${listing.rentAmount?.toLocaleString()}/mo
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-primary mb-4">Application Details</h3>
                        
                        {selectedListingData && (
                            <div className="rounded-xl border border-secondary bg-secondary/30 p-4 mb-4">
                                <p className="text-sm text-tertiary">Applying for:</p>
                                <p className="font-medium text-primary">{selectedListingData.title}</p>
                                <p className="text-sm text-secondary">
                                    ${selectedListingData.rentAmount?.toLocaleString()}/mo
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Monthly Income *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tertiary" />
                                    <input
                                        type="number"
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                        placeholder="5000"
                                        className="w-full rounded-xl border border-secondary bg-primary pl-12 pr-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Employer
                                </label>
                                <input
                                    type="text"
                                    value={employer}
                                    onChange={(e) => setEmployer(e.target.value)}
                                    placeholder="Company Name"
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Desired Move-in Date *
                                </label>
                                <input
                                    type="date"
                                    value={desiredMoveIn}
                                    onChange={(e) => setDesiredMoveIn(e.target.value)}
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Lease Term
                                </label>
                                <select
                                    value={leaseTerm}
                                    onChange={(e) => setLeaseTerm(e.target.value)}
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none cursor-pointer"
                                >
                                    <option value="6_months">6 months</option>
                                    <option value="12_months">12 months</option>
                                    <option value="18_months">18 months</option>
                                    <option value="24_months">24 months</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1.5">
                                Internal Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this applicant..."
                                rows={3}
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
                        disabled={isSubmitting}
                    >
                        {step === 1 ? "Cancel" : "Back"}
                    </Button>
                    {step < 3 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!isStep3Valid || isSubmitting || success}
                        >
                            {isSubmitting ? "Adding..." : success ? "Added!" : "Add Applicant"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
