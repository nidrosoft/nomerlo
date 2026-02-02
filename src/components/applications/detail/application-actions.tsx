"use client";

import { useState } from "react";
import { Check, X, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/base/buttons/button";

interface ApplicationActionsProps {
    status: string;
    onApprove: (notes?: string) => void;
    onDeny: (reason: string) => void;
    onRequestInfo: () => void;
    isLoading?: boolean;
}

export function ApplicationActions({
    status,
    onApprove,
    onDeny,
    onRequestInfo,
    isLoading,
}: ApplicationActionsProps) {
    const [showDenyModal, setShowDenyModal] = useState(false);
    const [denyReason, setDenyReason] = useState("");

    const isDecided = ["approved", "conditionally_approved", "denied", "withdrawn", "expired"].includes(status);

    if (isDecided) {
        return (
            <div className="rounded-2xl border border-secondary bg-primary p-6">
                <h3 className="mb-2 text-lg font-semibold text-primary">Decision Made</h3>
                <p className="text-sm text-tertiary">
                    This application has been {status === "approved" ? "approved" : status === "denied" ? "denied" : status}.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-2xl border border-secondary bg-primary p-6">
                <h3 className="mb-4 text-lg font-semibold text-primary">Actions</h3>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => onApprove()}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-success-primary hover:bg-success-primary/90"
                    >
                        <Check className="size-4" />
                        Approve
                    </Button>

                    <Button
                        onClick={() => setShowDenyModal(true)}
                        disabled={isLoading}
                        variant="secondary"
                        className="flex items-center gap-2 border-error-secondary text-error-primary hover:bg-error-secondary"
                    >
                        <X className="size-4" />
                        Deny
                    </Button>

                    <Button
                        onClick={onRequestInfo}
                        disabled={isLoading}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        <Mail className="size-4" />
                        Request Info
                    </Button>
                </div>

                <p className="mt-4 text-xs text-tertiary">
                    Approving will create a lease and invite the applicant to sign.
                    Denying will send a notification to the applicant.
                </p>
            </div>

            {/* Deny Modal */}
            {showDenyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDenyModal(false)} />
                    <div className="relative m-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="mb-4 text-lg font-semibold text-primary">Deny Application</h3>
                        <p className="mb-4 text-sm text-tertiary">
                            Please provide a reason for denying this application. This will be recorded but not shared with the applicant.
                        </p>
                        <textarea
                            value={denyReason}
                            onChange={(e) => setDenyReason(e.target.value)}
                            placeholder="Enter reason for denial..."
                            className="mb-4 w-full rounded-xl border border-secondary bg-primary p-3 text-sm focus:border-brand-primary focus:outline-none"
                            rows={4}
                        />
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDenyModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    onDeny(denyReason);
                                    setShowDenyModal(false);
                                }}
                                disabled={!denyReason.trim()}
                                className="bg-error-primary hover:bg-error-primary/90"
                            >
                                Confirm Denial
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
