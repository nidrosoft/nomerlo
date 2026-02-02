"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { XClose, SearchSm, CheckCircle, AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

interface NewMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConversationCreated?: (conversationId: string) => void;
}

export function NewMessageModal({ isOpen, onClose, onConversationCreated }: NewMessageModalProps) {
    const [step, setStep] = useState<"select" | "compose" | "success">("select");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<{
        name: string;
        unit?: string;
    } | null>(null);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tenants = useQuery(api.tenants.queries.listTenants, {});
    const createConversation = useMutation(api.messages.mutations.createConversation);

    // Filter tenants by search
    const filteredTenants = tenants?.filter((tenant) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = `${tenant.firstName} ${tenant.lastName}`.toLowerCase();
        return name.includes(query) || tenant.email.toLowerCase().includes(query);
    });

    const handleSelectTenant = (tenant: typeof tenants extends (infer T)[] | undefined ? T : never) => {
        setSelectedTenantId(tenant._id);
        setSelectedTenant({
            name: `${tenant.firstName} ${tenant.lastName}`,
            unit: tenant.unit?.unitNumber,
        });
        setStep("compose");
    };

    const handleSend = async () => {
        if (!selectedTenantId || !message.trim()) {
            setError("Please enter a message");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Get the first tenant to find org ID
            const tenant = tenants?.find((t) => t._id === selectedTenantId);
            if (!tenant) {
                setError("Tenant not found");
                return;
            }

            const conversationId = await createConversation({
                organizationId: tenant.organizationId as Id<"organizations">,
                participants: [
                    {
                        userId: tenant.userId as Id<"users">,
                        role: "tenant",
                        name: `${tenant.firstName} ${tenant.lastName}`,
                    },
                ],
                tenantId: selectedTenantId as Id<"tenants">,
                propertyId: tenant.propertyId,
                unitId: tenant.unitId,
                initialMessage: subject ? `${subject}\n\n${message}` : message,
                senderId: tenant.userId as Id<"users">, // This should be current user
            });

            setStep("success");
            onConversationCreated?.(conversationId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep("select");
        setSearchQuery("");
        setSelectedTenantId(null);
        setSelectedTenant(null);
        setSubject("");
        setMessage("");
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-secondary bg-primary shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-secondary p-5">
                    <h2 className="text-lg font-semibold text-primary">New Message</h2>
                    <button onClick={handleClose} className="rounded-lg p-2 hover:bg-secondary">
                        <XClose className="size-5 text-tertiary" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto p-5">
                    {step === "select" && (
                        <div className="space-y-4">
                            <p className="text-sm text-tertiary">Select a recipient:</p>

                            {/* Search */}
                            <div className="relative">
                                <SearchSm className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary" />
                                <input
                                    type="text"
                                    placeholder="Search tenants, applicants, or vendors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-secondary bg-primary py-2.5 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-solid focus:outline-none focus:ring-1 focus:ring-brand-solid"
                                />
                            </div>

                            {/* Recipients list */}
                            <div className="max-h-64 space-y-1 overflow-y-auto">
                                <p className="mb-2 text-xs font-medium uppercase text-tertiary">
                                    Tenants
                                </p>
                                {filteredTenants?.map((tenant) => (
                                    <button
                                        key={tenant._id}
                                        onClick={() => handleSelectTenant(tenant)}
                                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary text-sm font-medium text-primary">
                                            {tenant.firstName[0]}
                                            {tenant.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-primary">
                                                {tenant.firstName} {tenant.lastName}
                                            </p>
                                            <p className="text-xs text-tertiary">
                                                {tenant.unit?.unitNumber}
                                                {tenant.property?.name && ` - ${tenant.property.name}`}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                                {filteredTenants?.length === 0 && (
                                    <p className="py-4 text-center text-sm text-tertiary">
                                        No tenants found
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "compose" && (
                        <div className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-error-secondary/50 p-3 text-sm text-error-primary">
                                    <AlertCircle className="size-4" />
                                    {error}
                                </div>
                            )}

                            {/* Selected recipient */}
                            <div className="flex items-center gap-3 rounded-lg border border-secondary p-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-secondary text-sm font-medium text-brand-primary">
                                    {selectedTenant?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-primary">
                                        {selectedTenant?.name}
                                    </p>
                                    {selectedTenant?.unit && (
                                        <p className="text-xs text-tertiary">{selectedTenant.unit}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setStep("select")}
                                    className="text-sm text-brand-primary hover:underline"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Subject (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter subject..."
                                    className="w-full rounded-lg border border-secondary bg-primary px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-solid focus:outline-none focus:ring-1 focus:ring-brand-solid"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Message *
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    rows={5}
                                    className="w-full rounded-lg border border-secondary bg-primary px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-solid focus:outline-none focus:ring-1 focus:ring-brand-solid"
                                />
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="py-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-secondary/50">
                                <CheckCircle className="size-8 text-success-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-primary">Message Sent!</h3>
                            <p className="text-sm text-tertiary">
                                Your message to {selectedTenant?.name} has been sent.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-secondary p-5">
                    {step === "select" && (
                        <Button color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    {step === "compose" && (
                        <>
                            <Button color="secondary" onClick={() => setStep("select")}>
                                Back
                            </Button>
                            <Button color="primary" onClick={handleSend} disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </>
                    )}
                    {step === "success" && (
                        <Button color="primary" onClick={handleClose}>
                            Done
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
