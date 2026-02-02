"use client";

import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { BadgeWithDot } from "@/components/base/badges/badges";

interface ApplicantInfoProps {
    applicant: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: number;
    };
    currentAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        moveInDate: number;
        rent: number;
        landlordName?: string;
        landlordPhone?: string;
    };
    status: string;
    submittedAt: number;
}

const getStatusConfig = (status: string): { color: "error" | "warning" | "success" | "gray" | "blue"; label: string } => {
    const config: Record<string, { color: "error" | "warning" | "success" | "gray" | "blue"; label: string }> = {
        submitted: { color: "error", label: "New" },
        under_review: { color: "warning", label: "In Review" },
        screening: { color: "blue", label: "Screening" },
        approved: { color: "success", label: "Approved" },
        conditionally_approved: { color: "warning", label: "Conditional" },
        denied: { color: "error", label: "Denied" },
        withdrawn: { color: "gray", label: "Withdrawn" },
        expired: { color: "gray", label: "Expired" },
    };
    return config[status] || { color: "gray", label: status };
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const getAge = (dateOfBirth: number): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const getYearsAtAddress = (moveInDate: number): string => {
    const years = Math.floor((Date.now() - moveInDate) / (365 * 24 * 60 * 60 * 1000));
    if (years < 1) {
        const months = Math.floor((Date.now() - moveInDate) / (30 * 24 * 60 * 60 * 1000));
        return `${months} month${months !== 1 ? "s" : ""}`;
    }
    return `${years} year${years !== 1 ? "s" : ""}`;
};

const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export function ApplicantInfo({ applicant, currentAddress, status, submittedAt }: ApplicantInfoProps) {
    const statusConfig = getStatusConfig(status);

    return (
        <div className="rounded-2xl border border-secondary bg-primary p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {/* Left - Avatar and Info */}
                <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-primary text-xl font-semibold">
                        {getInitials(applicant.firstName, applicant.lastName)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-primary">
                                {applicant.firstName} {applicant.lastName}
                            </h2>
                            <BadgeWithDot
                                color={statusConfig.color}
                                type="pill-color"
                                size="md"
                            >
                                {statusConfig.label}
                            </BadgeWithDot>
                        </div>
                        <p className="mt-1 text-sm text-tertiary">
                            DOB: {formatDate(applicant.dateOfBirth)} ({getAge(applicant.dateOfBirth)} years old)
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                            <a href={`mailto:${applicant.email}`} className="flex items-center gap-1.5 text-secondary hover:text-primary">
                                <Mail className="size-4" />
                                {applicant.email}
                            </a>
                            <a href={`tel:${applicant.phone}`} className="flex items-center gap-1.5 text-secondary hover:text-primary">
                                <Phone className="size-4" />
                                {applicant.phone}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right - Submitted Date */}
                <div className="text-right text-sm">
                    <p className="text-tertiary">Submitted</p>
                    <p className="font-medium text-primary">{formatDate(submittedAt)}</p>
                </div>
            </div>

            {/* Current Address */}
            <div className="mt-6 rounded-xl bg-secondary/50 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Current Address</h3>
                <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 size-4 text-tertiary" />
                    <div>
                        <p className="text-primary">{currentAddress.street}</p>
                        <p className="text-primary">
                            {currentAddress.city}, {currentAddress.state} {currentAddress.zip}
                        </p>
                        <p className="mt-2 text-tertiary">
                            Living here since {formatDate(currentAddress.moveInDate)} ({getYearsAtAddress(currentAddress.moveInDate)})
                        </p>
                        <p className="text-tertiary">
                            Current Rent: ${currentAddress.rent.toLocaleString()}/month
                        </p>
                        {currentAddress.landlordName && (
                            <p className="mt-2 text-tertiary">
                                Landlord: {currentAddress.landlordName}
                                {currentAddress.landlordPhone && ` · ${currentAddress.landlordPhone}`}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
