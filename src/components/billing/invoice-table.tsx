"use client";

import Link from "next/link";
import { Eye, Send01, CheckCircle, XCircle, DotsHorizontal } from "@untitledui/icons";
import { Table, TableCard } from "@/components/application/table/table";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import type { Id } from "../../../convex/_generated/dataModel";

interface InvoiceData {
    _id: Id<"invoices">;
    invoiceNumber: string;
    tenant: { firstName: string; lastName: string } | null;
    unit: { name?: string; unitNumber?: string } | null;
    total: number;
    amountDue: number;
    status: string;
    dueDate: number;
}

interface InvoiceTableProps {
    invoices: InvoiceData[];
    onSend?: (id: Id<"invoices">) => void;
    onMarkPaid?: (id: Id<"invoices">) => void;
    onCancel?: (id: Id<"invoices">) => void;
    showActions?: boolean;
}

const getStatusBadgeColor = (status: string): "success" | "warning" | "gray" | "error" | "brand" => {
    const colors: Record<string, "success" | "warning" | "gray" | "error" | "brand"> = {
        paid: "success",
        sent: "brand",
        viewed: "brand",
        partial: "warning",
        overdue: "error",
        draft: "gray",
        cancelled: "gray",
    };
    return colors[status] || "gray";
};

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        paid: "Paid",
        sent: "Sent",
        viewed: "Viewed",
        partial: "Partial",
        overdue: "Overdue",
        draft: "Draft",
        cancelled: "Cancelled",
    };
    return labels[status] || status;
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

export function InvoiceTable({ 
    invoices, 
    onSend, 
    onMarkPaid, 
    onCancel,
    showActions = true,
}: InvoiceTableProps) {
    return (
        <Table aria-label="Invoices" className="bg-primary">
            <Table.Header className="bg-primary">
                <Table.Head id="invoice" label="Invoice" isRowHeader className="w-full" />
                <Table.Head id="tenant" label="Tenant" className="max-lg:hidden" />
                <Table.Head id="unit" label="Unit" className="max-md:hidden" />
                <Table.Head id="amount" label="Amount" />
                <Table.Head id="status" label="Status" />
                <Table.Head id="due" label="Due" className="max-md:hidden" />
                {showActions && <Table.Head id="actions" label="" />}
            </Table.Header>

            <Table.Body items={invoices}>
                {(invoice) => (
                    <Table.Row id={invoice._id}>
                        <Table.Cell>
                            <Link
                                href={`/owner/billing/invoices/${invoice._id}`}
                                className="font-medium text-primary hover:text-brand-primary"
                            >
                                {invoice.invoiceNumber}
                            </Link>
                        </Table.Cell>

                        <Table.Cell className="max-lg:hidden">
                            <span className="text-secondary">
                                {invoice.tenant
                                    ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}`
                                    : "Unknown"}
                            </span>
                        </Table.Cell>

                        <Table.Cell className="max-md:hidden">
                            <span className="text-tertiary">
                                {invoice.unit?.name || invoice.unit?.unitNumber || "N/A"}
                            </span>
                        </Table.Cell>

                        <Table.Cell>
                            <span className="font-medium text-primary">
                                {formatCurrency(invoice.total)}
                            </span>
                        </Table.Cell>

                        <Table.Cell>
                            <BadgeWithDot
                                color={getStatusBadgeColor(invoice.status)}
                                type="pill-color"
                                size="sm"
                            >
                                {getStatusLabel(invoice.status)}
                            </BadgeWithDot>
                        </Table.Cell>

                        <Table.Cell className="max-md:hidden">
                            <span className="text-tertiary">{formatDate(invoice.dueDate)}</span>
                        </Table.Cell>

                        {showActions && (
                            <Table.Cell className="px-4">
                                <Dropdown.Root>
                                    <Dropdown.DotsButton />
                                    <Dropdown.Popover className="w-min">
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                href={`/owner/billing/invoices/${invoice._id}`}
                                                icon={Eye}
                                            >
                                                <span className="pr-4">View</span>
                                            </Dropdown.Item>
                                            {invoice.status === "draft" && onSend && (
                                                <Dropdown.Item
                                                    icon={Send01}
                                                    onAction={() => onSend(invoice._id)}
                                                >
                                                    <span className="pr-4">Send</span>
                                                </Dropdown.Item>
                                            )}
                                            {invoice.status !== "paid" && invoice.status !== "cancelled" && onMarkPaid && (
                                                <Dropdown.Item
                                                    icon={CheckCircle}
                                                    onAction={() => onMarkPaid(invoice._id)}
                                                >
                                                    <span className="pr-4">Mark Paid</span>
                                                </Dropdown.Item>
                                            )}
                                            {invoice.status !== "cancelled" && invoice.status !== "paid" && onCancel && (
                                                <>
                                                    <Dropdown.Separator />
                                                    <Dropdown.Item
                                                        icon={XCircle}
                                                        className="text-error-primary"
                                                        onAction={() => onCancel(invoice._id)}
                                                    >
                                                        <span className="pr-4">Cancel</span>
                                                    </Dropdown.Item>
                                                </>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown.Popover>
                                </Dropdown.Root>
                            </Table.Cell>
                        )}
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    );
}
