"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { ArrowLeft, Upload02, CheckCircle, Receipt } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { Checkbox } from "@/components/base/checkbox/checkbox";

// Category options
const categoryOptions = [
    { id: "maintenance", label: "Maintenance & Repairs" },
    { id: "utilities", label: "Utilities" },
    { id: "insurance", label: "Insurance" },
    { id: "taxes", label: "Property Taxes" },
    { id: "landscaping", label: "Landscaping" },
    { id: "cleaning", label: "Cleaning" },
    { id: "legal", label: "Legal & Professional" },
    { id: "advertising", label: "Advertising" },
    { id: "office", label: "Office/Admin" },
    { id: "other", label: "Other" },
];

// Tax category options
const taxCategoryOptions = [
    { id: "repairs", label: "Schedule E - Repairs and Maintenance" },
    { id: "insurance", label: "Schedule E - Insurance" },
    { id: "taxes", label: "Schedule E - Taxes" },
    { id: "utilities", label: "Schedule E - Utilities" },
    { id: "management", label: "Schedule E - Management Fees" },
    { id: "legal", label: "Schedule E - Legal and Professional" },
    { id: "advertising", label: "Schedule E - Advertising" },
    { id: "other", label: "Schedule E - Other" },
];

export default function NewExpensePage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        propertyId: "",
        unitId: "",
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        vendorId: "",
        vendorName: "",
        notes: "",
        isTaxDeductible: true,
        taxCategory: "",
    });

    // Fetch data
    const propertiesData = useQuery(api.properties.queries.listProperties, {});
    const vendorsData = useQuery(api.vendors.queries.getVendorOptions, {});

    // Mutation
    const createExpense = useMutation(api.expenses.mutations.createExpense);

    // Build property options
    const propertyOptions = [
        { id: "", label: "All Properties" },
        ...(propertiesData || []).map((p: { _id: string; name: string }) => ({ id: p._id, label: p.name })),
    ];

    // Build vendor options
    const vendorOptions = [
        { id: "", label: "Select vendor (optional)" },
        ...(vendorsData || []).map((v: { id: string; name: string }) => ({ id: v.id, label: v.name })),
        { id: "new", label: "+ Add New Vendor" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category || !formData.description || !formData.amount) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSaving(true);
        try {
            await createExpense({
                propertyId: formData.propertyId ? (formData.propertyId as Id<"properties">) : undefined,
                unitId: formData.unitId ? (formData.unitId as Id<"units">) : undefined,
                category: formData.category,
                description: formData.description,
                amount: parseFloat(formData.amount),
                date: new Date(formData.date).getTime(),
                vendorId: formData.vendorId && formData.vendorId !== "new" ? (formData.vendorId as Id<"vendors">) : undefined,
                vendorName: formData.vendorName || undefined,
                isTaxDeductible: formData.isTaxDeductible,
                taxCategory: formData.taxCategory || undefined,
                notes: formData.notes || undefined,
                status: "paid",
            });

            setShowSaved(true);
            setTimeout(() => {
                router.push("/owner/expenses");
            }, 1000);
        } catch (error) {
            console.error("Failed to create expense:", error);
            alert("Failed to create expense. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/owner/expenses">
                    <Button color="tertiary" size="sm" iconLeading={ArrowLeft}>Back</Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Add Expense</h1>
                    <p className="text-md text-tertiary">Record a new property expense</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Expense Details */}
                <div className="rounded-2xl border border-secondary bg-primary p-6 space-y-6">
                    <div className="border-b border-secondary pb-4">
                        <h3 className="text-lg font-semibold text-primary">Expense Details</h3>
                        <p className="text-sm text-tertiary">Enter the expense information</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Property</label>
                            <Select
                                selectedKey={formData.propertyId}
                                onSelectionChange={(key) => setFormData({ ...formData, propertyId: key as string })}
                                items={propertyOptions}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Category *</label>
                            <Select
                                selectedKey={formData.category}
                                onSelectionChange={(key) => setFormData({ ...formData, category: key as string })}
                                items={categoryOptions}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Description *</label>
                        <Input
                            placeholder="e.g., Plumbing repair for Unit 4B"
                            value={formData.description}
                            onChange={(v) => setFormData({ ...formData, description: v })}
                            size="sm"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Amount *</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(v) => setFormData({ ...formData, amount: v })}
                                size="sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Date *</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(v) => setFormData({ ...formData, date: v })}
                                size="sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Vendor</label>
                        <Select
                            selectedKey={formData.vendorId}
                            onSelectionChange={(key) => setFormData({ ...formData, vendorId: key as string })}
                            items={vendorOptions}
                        >
                            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                        </Select>
                        {formData.vendorId === "new" && (
                            <Input
                                placeholder="Enter vendor name"
                                value={formData.vendorName}
                                onChange={(v) => setFormData({ ...formData, vendorName: v })}
                                size="sm"
                                className="mt-2"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Notes</label>
                        <Input
                            placeholder="Additional details..."
                            value={formData.notes}
                            onChange={(v) => setFormData({ ...formData, notes: v })}
                            size="sm"
                        />
                    </div>
                </div>

                {/* Receipt Upload */}
                <div className="rounded-2xl border border-secondary bg-primary p-6 space-y-4">
                    <div className="border-b border-secondary pb-4">
                        <h3 className="text-lg font-semibold text-primary">Receipt</h3>
                        <p className="text-sm text-tertiary">Upload a receipt for this expense</p>
                    </div>

                    <div className="border-2 border-dashed border-secondary rounded-xl p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                                <Upload02 className="size-6 text-tertiary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary">Drag and drop or click to upload</p>
                                <p className="text-xs text-tertiary mt-1">PDF, PNG, JPG up to 10MB</p>
                            </div>
                            <Button color="secondary" size="sm" type="button">
                                Browse Files
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tax Settings */}
                <div className="rounded-2xl border border-secondary bg-primary p-6 space-y-4">
                    <div className="border-b border-secondary pb-4">
                        <h3 className="text-lg font-semibold text-primary">Tax Settings</h3>
                        <p className="text-sm text-tertiary">Configure tax deduction settings</p>
                    </div>

                    <Checkbox
                        isSelected={formData.isTaxDeductible}
                        onChange={(v) => setFormData({ ...formData, isTaxDeductible: v })}
                    >
                        <span className="text-sm text-primary">This expense is tax-deductible</span>
                    </Checkbox>

                    {formData.isTaxDeductible && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Tax Category</label>
                            <Select
                                selectedKey={formData.taxCategory}
                                onSelectionChange={(key) => setFormData({ ...formData, taxCategory: key as string })}
                                items={taxCategoryOptions}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Link href="/owner/expenses">
                        <Button color="secondary" size="md">Cancel</Button>
                    </Link>
                    <Button
                        color="primary"
                        size="md"
                        type="submit"
                        iconLeading={showSaved ? CheckCircle : Receipt}
                        isDisabled={isSaving}
                    >
                        {isSaving ? "Saving..." : showSaved ? "Saved!" : "Save Expense"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
