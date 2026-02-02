"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X, Copy, Check, Mail, Link as LinkIcon, Clock } from "lucide-react";
import { Button } from "@/components/base/buttons/button";

interface InviteApplicantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteApplicantModal({ isOpen, onClose }: InviteApplicantModalProps) {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const [expiresIn, setExpiresIn] = useState("7");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"form" | "link">("form");

    // Convex mutation
    const createInvite = useMutation(api.applications.mutations.createInvite);

    if (!isOpen) return null;

    const handleGenerateLink = async (sendEmail = false) => {
        if (!firstName.trim() || !lastName.trim()) {
            setError("Please enter first and last name");
            return;
        }
        if (sendEmail && !email.trim()) {
            setError("Please enter an email address");
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const result = await createInvite({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@pending.invite`,
                message: message.trim() || undefined,
                expiresInDays: parseInt(expiresIn),
            });

            // Build the full invite link
            const link = `${window.location.origin}${result.inviteLink}`;
            setGeneratedLink(link);
            setStep("link");

            // TODO: If sendEmail is true, trigger email sending via a separate function
            // For now, we just generate the link
        } catch (err) {
            console.error("Error creating invite:", err);
            setError(err instanceof Error ? err.message : "Failed to create invite");
        } finally {
            setIsSending(false);
        }
    };

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setEmail("");
        setFirstName("");
        setLastName("");
        setMessage("");
        setGeneratedLink("");
        setError(null);
        setStep("form");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-secondary bg-primary p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary">
                            <Mail className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Invite Applicant</h2>
                            <p className="text-sm text-tertiary">Send an application invite link</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="rounded-full p-2 text-tertiary hover:bg-secondary transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 rounded-xl border border-error-secondary bg-error-secondary/30 p-4 text-sm text-error-primary">
                        {error}
                    </div>
                )}

                {step === "form" ? (
                    <>
                        {/* Form */}
                        <div className="space-y-4">
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
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john.doe@email.com (optional for link only)"
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Link Expires In
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tertiary" />
                                    <select
                                        value={expiresIn}
                                        onChange={(e) => setExpiresIn(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-secondary bg-primary pl-12 pr-10 py-3 text-primary focus:border-brand-primary focus:outline-none cursor-pointer"
                                    >
                                        <option value="1">1 day</option>
                                        <option value="3">3 days</option>
                                        <option value="7">7 days</option>
                                        <option value="14">14 days</option>
                                        <option value="30">30 days</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Personal Message (Optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Add a personal message to include in the invite email..."
                                    rows={3}
                                    className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => handleGenerateLink(false)}
                                disabled={isSending || !firstName.trim() || !lastName.trim()}
                                className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LinkIcon className="h-4 w-4" />
                                Generate Link Only
                            </button>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleGenerateLink(true)}
                                    disabled={!email.trim() || !firstName.trim() || !lastName.trim() || isSending}
                                >
                                    {isSending ? "Creating..." : "Send Invite"}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Link Generated */}
                        <div className="space-y-4">
                            <div className="rounded-xl border border-success-secondary bg-success-secondary/30 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="h-5 w-5 text-success-primary" />
                                    <span className="font-medium text-success-primary">
                                        Invite created successfully!
                                    </span>
                                </div>
                                <p className="text-sm text-secondary">
                                    {email ? `Invite for ${firstName} ${lastName} (${email}). ` : `Invite for ${firstName} ${lastName}. `}
                                    The link will expire in {expiresIn} days.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1.5">
                                    Application Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={generatedLink}
                                        readOnly
                                        className="flex-1 rounded-xl border border-secondary bg-secondary/50 px-4 py-3 text-primary font-mono text-sm"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="flex items-center gap-2 rounded-xl border border-secondary bg-primary px-4 py-3 text-primary hover:bg-secondary transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 text-success-primary" />
                                                <span className="text-success-primary">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="secondary" onClick={handleClose}>
                                Done
                            </Button>
                            <Button onClick={() => {
                                setStep("form");
                                setGeneratedLink("");
                                setFirstName("");
                                setLastName("");
                                setEmail("");
                                setMessage("");
                            }}>
                                Create Another
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
