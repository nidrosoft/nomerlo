"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { getLocalTimeZone, today, parseDate, CalendarDate } from "@internationalized/date";
import { X, UserPlus01, CheckCircle, AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Checkbox } from "@/components/base/checkbox/checkbox";

interface InviteTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteTenantModal({ isOpen, onClose }: InviteTenantModalProps) {
    const [step, setStep] = useState<"form" | "success">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [leaseStartDate, setLeaseStartDate] = useState<CalendarDate | null>(null);
    const [leaseEndDate, setLeaseEndDate] = useState<CalendarDate | null>(null);
    const [monthlyRent, setMonthlyRent] = useState("");
    const [securityDeposit, setSecurityDeposit] = useState("");
    const [sendEmail, setSendEmail] = useState(true);

    // Fetch units from properties
    const properties = useQuery(api.properties.queries.listProperties, {});
    const inviteTenant = useMutation(api.tenants.mutations.inviteTenant);

    // Build units list from properties
    const units = properties?.flatMap((property) =>
        (property.units || []).map((unit: any) => ({
            id: unit._id,
            propertyId: property._id,
            label: `${unit.unitNumber} - ${property.name}`,
            occupied: unit.status === "occupied",
        }))
    ) || [];

    const vacantUnits = units.filter((u) => !u.occupied);

    const handleSubmit = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !selectedUnit || !leaseStartDate || !leaseEndDate || !monthlyRent) {
            setError("Please fill in all required fields");
            return;
        }

        const selectedUnitData = units.find((u) => u.id === selectedUnit);
        if (!selectedUnitData) {
            setError("Please select a valid unit");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await inviteTenant({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                unitId: selectedUnit as Id<"units">,
                propertyId: selectedUnitData.propertyId as Id<"properties">,
                leaseStartDate: leaseStartDate.toDate(getLocalTimeZone()).getTime(),
                leaseEndDate: leaseEndDate.toDate(getLocalTimeZone()).getTime(),
                monthlyRent: parseFloat(monthlyRent),
                securityDeposit: securityDeposit ? parseFloat(securityDeposit) : undefined,
                sendInviteEmail: sendEmail,
            });

            setStep("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to invite tenant");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep("form");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setSelectedUnit("");
        setLeaseStartDate(null);
        setLeaseEndDate(null);
        setMonthlyRent("");
        setSecurityDeposit("");
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-secondary bg-primary shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-secondary p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary">
                            <UserPlus01 className="size-5 text-brand-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Invite Tenant</h2>
                            <p className="text-sm text-tertiary">Add a tenant to your property</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="rounded-lg p-2 hover:bg-secondary">
                        <X className="size-5 text-tertiary" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-5">
                    {step === "form" ? (
                        <div className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-error-secondary/50 p-3 text-sm text-error-primary">
                                    <AlertCircle className="size-4" />
                                    {error}
                                </div>
                            )}

                            {/* Unit Selection */}
                            <div>
                                <Label>Select Unit *</Label>
                                <Select
                                    selectedKey={selectedUnit}
                                    onSelectionChange={(key) => setSelectedUnit(key as string)}
                                    placeholder="Select a unit..."
                                    items={vacantUnits}
                                    aria-label="Select unit"
                                >
                                    {(item) => (
                                        <SelectItem id={item.id}>
                                            {item.label}
                                        </SelectItem>
                                    )}
                                </Select>
                                {vacantUnits.length === 0 && (
                                    <p className="mt-1 text-xs text-tertiary">No vacant units available</p>
                                )}
                            </div>

                            {/* Tenant Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>First Name *</Label>
                                    <Input
                                        value={firstName}
                                        onChange={setFirstName}
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <Label>Last Name *</Label>
                                    <Input
                                        value={lastName}
                                        onChange={setLastName}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Email Address *</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="john.doe@email.com"
                                />
                            </div>

                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={setPhone}
                                    placeholder="(512) 555-0100"
                                />
                            </div>

                            {/* Lease Details */}
                            <div className="border-t border-secondary pt-5">
                                <h3 className="mb-4 font-medium text-primary">Lease Details</h3>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Lease Start Date *</Label>
                                            <DatePicker
                                                aria-label="Lease start date"
                                                value={leaseStartDate}
                                                onChange={setLeaseStartDate}
                                                onApply={() => {}}
                                            />
                                        </div>
                                        <div>
                                            <Label>Lease End Date *</Label>
                                            <DatePicker
                                                aria-label="Lease end date"
                                                value={leaseEndDate}
                                                onChange={setLeaseEndDate}
                                                onApply={() => {}}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Monthly Rent *</Label>
                                            <Input
                                                type="number"
                                                value={monthlyRent}
                                                onChange={setMonthlyRent}
                                                placeholder="1500"
                                            />
                                        </div>
                                        <div>
                                            <Label>Security Deposit</Label>
                                            <Input
                                                type="number"
                                                value={securityDeposit}
                                                onChange={setSecurityDeposit}
                                                placeholder="1500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="border-t border-secondary pt-5">
                                <Checkbox
                                    isSelected={sendEmail}
                                    onChange={setSendEmail}
                                >
                                    Send invitation email to tenant
                                </Checkbox>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-secondary/50">
                                <CheckCircle className="size-8 text-success-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-primary">Tenant Invited!</h3>
                            <p className="text-sm text-tertiary">
                                {firstName} {lastName} has been added and an invitation has been sent to {email}.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-secondary p-5">
                    {step === "form" ? (
                        <>
                            <Button color="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </>
                    ) : (
                        <Button color="primary" onClick={handleClose}>
                            Done
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
