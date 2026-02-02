"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Building2, 
    Mail, 
    ArrowRight,
    Home,
    Calendar,
    DollarSign
} from "lucide-react";

interface Props {
    params: Promise<{ code: string }>;
}

export default function InvitePage({ params }: Props) {
    const { code } = use(params);

    // Fetch invite from Convex
    const invite = useQuery(api.applications.inviteQueries.getInviteByCode, {
        inviteCode: code,
    });

    // Mutation to mark invite as opened
    const markOpened = useMutation(api.applications.mutations.markInviteOpened);

    // Mark as opened when component mounts with valid invite
    if (invite && invite.status === "pending") {
        markOpened({ inviteCode: code }).catch(console.error);
    }

    // Loading state
    if (invite === undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-48 rounded-lg bg-secondary mx-auto" />
                        <div className="h-64 rounded-2xl bg-secondary" />
                    </div>
                </div>
            </div>
        );
    }

    // Invite not found
    if (invite === null) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary flex items-center justify-center p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="rounded-2xl border border-secondary bg-primary p-8 shadow-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-secondary/50">
                            <XCircle className="h-8 w-8 text-error-primary" />
                        </div>
                        <h1 className="mb-2 text-2xl font-semibold text-primary">
                            Invite Not Found
                        </h1>
                        <p className="mb-6 text-secondary">
                            This invite link is invalid or has been removed. Please contact the property manager for a new invite.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary border border-secondary hover:bg-secondary transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Invite expired
    if (invite.isExpired || invite.status === "expired") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary flex items-center justify-center p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="rounded-2xl border border-secondary bg-primary p-8 shadow-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning-secondary/50">
                            <Clock className="h-8 w-8 text-warning-primary" />
                        </div>
                        <h1 className="mb-2 text-2xl font-semibold text-primary">
                            Invite Expired
                        </h1>
                        <p className="mb-2 text-secondary">
                            This invite link has expired.
                        </p>
                        <p className="mb-6 text-sm text-tertiary">
                            Expired on {new Date(invite.expiresAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                        <div className="space-y-3">
                            <p className="text-sm text-secondary">
                                Please contact <strong>{invite.organization?.name || "the property manager"}</strong> for a new invite.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary border border-secondary hover:bg-secondary transition-colors"
                            >
                                <Home className="h-4 w-4" />
                                Go to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Invite already completed
    if (invite.status === "completed") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary flex items-center justify-center p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="rounded-2xl border border-secondary bg-primary p-8 shadow-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-secondary/50">
                            <CheckCircle2 className="h-8 w-8 text-success-primary" />
                        </div>
                        <h1 className="mb-2 text-2xl font-semibold text-primary">
                            Application Submitted
                        </h1>
                        <p className="mb-6 text-secondary">
                            You've already submitted your application. The property manager will review it and get back to you soon.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary border border-secondary hover:bg-secondary transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Valid invite - show invitation details
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-primary flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="rounded-2xl border border-secondary bg-primary p-8 shadow-lg">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary">
                            <Mail className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h1 className="mb-2 text-2xl font-semibold text-primary">
                            You're Invited to Apply
                        </h1>
                        <p className="text-secondary">
                            {invite.organization?.name || "A property manager"} has invited you to submit a rental application.
                        </p>
                    </div>

                    {/* Applicant Info */}
                    <div className="rounded-xl bg-secondary/50 p-4 mb-6">
                        <p className="text-sm text-tertiary mb-1">Invitation for:</p>
                        <p className="font-semibold text-primary text-lg">
                            {invite.firstName} {invite.lastName}
                        </p>
                        <p className="text-sm text-secondary">{invite.email}</p>
                    </div>

                    {/* Property Info (if available) */}
                    {invite.listing && invite.property && (
                        <div className="rounded-xl border border-secondary p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-secondary">
                                    <Building2 className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-primary">
                                        {invite.listing.title}
                                    </h3>
                                    <p className="text-sm text-tertiary">
                                        {invite.property.name} • {invite.unit?.unitNumber || "Unit"}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                                        <span className="flex items-center gap-1 text-secondary">
                                            <DollarSign className="h-4 w-4" />
                                            {formatCurrency(invite.listing.rentAmount)}/mo
                                        </span>
                                        {invite.unit?.bedrooms !== undefined && (
                                            <span className="text-secondary">
                                                {invite.unit.bedrooms} bed • {invite.unit.bathrooms} bath
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Personal Message (if any) */}
                    {invite.message && (
                        <div className="rounded-xl bg-secondary/30 border border-secondary p-4 mb-6">
                            <p className="text-sm text-tertiary mb-1">Personal message:</p>
                            <p className="text-primary italic">"{invite.message}"</p>
                        </div>
                    )}

                    {/* Expiration */}
                    <div className="flex items-center justify-center gap-2 text-sm text-tertiary mb-6">
                        <Calendar className="h-4 w-4" />
                        <span>
                            This invite expires on{" "}
                            {new Date(invite.expiresAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    {/* CTA */}
                    <Link
                        href={invite.listingId ? `/browse/${invite.listingId}/apply?invite=${code}` : `/browse?invite=${code}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-4 font-semibold text-white hover:bg-brand-primary/90 transition-colors"
                    >
                        Start Application
                        <ArrowRight className="h-5 w-5" />
                    </Link>

                    <p className="mt-4 text-center text-xs text-tertiary">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
