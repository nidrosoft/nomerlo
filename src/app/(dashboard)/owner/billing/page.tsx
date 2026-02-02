"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import {
    Plus,
    Settings01,
    SearchMd,
    FileText,
    CheckCircle,
    Send01,
    XCircle,
    Eye,
    CreditCard02,
    ArrowUp,
    ArrowDown,
    Receipt,
} from "@untitledui/icons";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Table, TableCard } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { RevenueStats } from "@/components/billing";

// Status options for the select dropdown
const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "paid", label: "Paid" },
    { id: "sent", label: "Sent" },
    { id: "overdue", label: "Overdue" },
    { id: "draft", label: "Draft" },
];

// Demo data
const demoInvoices = [
    { _id: "inv-1" as Id<"invoices">, invoiceNumber: "INV-2026-001", tenant: { firstName: "Sarah", lastName: "Johnson" }, unit: { name: "Unit A", unitNumber: "A" }, total: 1500, amountDue: 0, status: "paid", dueDate: Date.now() - 5 * 24 * 60 * 60 * 1000, type: "invoice" as const },
    { _id: "inv-2" as Id<"invoices">, invoiceNumber: "INV-2026-002", tenant: { firstName: "Mike", lastName: "Chen" }, unit: { name: "Unit C", unitNumber: "C" }, total: 1800, amountDue: 1800, status: "sent", dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000, type: "invoice" as const },
    { _id: "inv-3" as Id<"invoices">, invoiceNumber: "INV-2026-003", tenant: { firstName: "Lisa", lastName: "Park" }, unit: { name: "Unit D", unitNumber: "D" }, total: 1600, amountDue: 0, status: "paid", dueDate: Date.now() - 3 * 24 * 60 * 60 * 1000, type: "invoice" as const },
    { _id: "inv-4" as Id<"invoices">, invoiceNumber: "INV-2026-004", tenant: { firstName: "Tom", lastName: "Wilson" }, unit: { name: "Unit 2A", unitNumber: "2A" }, total: 2200, amountDue: 0, status: "paid", dueDate: Date.now() - 4 * 24 * 60 * 60 * 1000, type: "invoice" as const },
    { _id: "inv-5" as Id<"invoices">, invoiceNumber: "INV-2026-005", tenant: { firstName: "Emma", lastName: "Davis" }, unit: { name: "Unit 3B", unitNumber: "3B" }, total: 2100, amountDue: 2100, status: "overdue", dueDate: Date.now() - 7 * 24 * 60 * 60 * 1000, type: "invoice" as const },
];

const demoPayments = [
    { _id: "pay-1", tenant: { firstName: "Sarah", lastName: "Johnson" }, amount: 1500, paymentMethod: "ach", paidAt: Date.now() - 2 * 24 * 60 * 60 * 1000, type: "payment" as const, status: "completed" },
    { _id: "pay-2", tenant: { firstName: "Tom", lastName: "Wilson" }, amount: 2200, paymentMethod: "ach", paidAt: Date.now() - 3 * 24 * 60 * 60 * 1000, type: "payment" as const, status: "completed" },
    { _id: "pay-3", tenant: { firstName: "Lisa", lastName: "Park" }, amount: 1600, paymentMethod: "card", paidAt: Date.now() - 4 * 24 * 60 * 60 * 1000, type: "payment" as const, status: "completed" },
];

const demoStats = { collected: 7500, outstanding: 3900, expected: 11400, collectionRate: 66, totalInvoices: 5, paidCount: 3, pendingCount: 2, overdueCount: 1 };

// Helper functions
const getStatusBadgeColor = (status: string): "success" | "warning" | "gray" | "error" | "brand" => {
    const colors: Record<string, "success" | "warning" | "gray" | "error" | "brand"> = { paid: "success", completed: "success", sent: "brand", viewed: "brand", partial: "warning", overdue: "error", draft: "gray", cancelled: "gray" };
    return colors[status] || "gray";
};

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = { paid: "Paid", completed: "Completed", sent: "Sent", viewed: "Viewed", partial: "Partial", overdue: "Overdue", draft: "Draft", cancelled: "Cancelled" };
    return labels[status] || status;
};

const formatDate = (timestamp: number): string => new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const formatCurrency = (amount: number): string => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

const getPaymentMethodLabel = (method: string): string => {
    const labels: Record<string, string> = { ach: "ACH", card: "Card", check: "Check", cash: "Cash", manual: "Manual" };
    return labels[method] || method;
};

export default function BillingPage() {
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Fetch data from Convex
    const invoicesData = useQuery(api.invoices.queries.getRecentInvoices, { limit: 20 });
    const paymentsData = useQuery(api.payments.queries.getRecentPayments, { limit: 20 });
    const statsData = useQuery(api.invoices.queries.getInvoiceStats, {});

    // Mutations
    const sendInvoice = useMutation(api.invoices.mutations.sendInvoice);
    const markAsPaid = useMutation(api.invoices.mutations.markAsPaid);
    const cancelInvoice = useMutation(api.invoices.mutations.cancelInvoice);

    const isLoading = invoicesData === undefined || statsData === undefined;

    // Transform and combine data
    const combinedData = useMemo(() => {
        if (isLoading) return [];

        const invoices = (invoicesData && invoicesData.length > 0 ? invoicesData : demoInvoices).map((inv: any) => ({
            id: inv._id,
            type: "invoice" as const,
            reference: inv.invoiceNumber,
            tenant: inv.tenant ? `${inv.tenant.firstName} ${inv.tenant.lastName}` : "Unknown",
            unit: inv.unit?.name || inv.unit?.unitNumber || "N/A",
            amount: inv.total,
            status: inv.status,
            date: inv.dueDate,
            paymentMethod: null,
            rawData: inv,
        }));

        const payments = (paymentsData && paymentsData.length > 0 ? paymentsData : demoPayments).map((pay: any) => ({
            id: pay._id,
            type: "payment" as const,
            reference: `PAY-${pay._id.slice(-6).toUpperCase()}`,
            tenant: pay.tenant ? `${pay.tenant.firstName} ${pay.tenant.lastName}` : "Unknown",
            unit: "—",
            amount: pay.amount,
            status: "completed",
            date: pay.paidAt || pay.createdAt,
            paymentMethod: pay.paymentMethod,
            rawData: pay,
        }));

        return [...invoices, ...payments].sort((a, b) => b.date - a.date);
    }, [invoicesData, paymentsData, isLoading]);

    // Filter data based on tab, search, and status
    const filteredData = useMemo(() => {
        return combinedData.filter((item) => {
            const matchesTab = selectedTab === "all" || item.type === selectedTab;
            const matchesSearch = item.tenant.toLowerCase().includes(searchQuery.toLowerCase()) || item.reference.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || item.status === statusFilter;
            return matchesTab && matchesSearch && matchesStatus;
        });
    }, [combinedData, selectedTab, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        if (isLoading) return demoStats;
        return statsData && statsData.totalInvoices > 0 ? statsData : demoStats;
    }, [statsData, isLoading]);

    // Handlers
    const handleSendInvoice = async (id: Id<"invoices">) => {
        try { await sendInvoice({ invoiceId: id }); } catch (error) { console.error("Failed to send invoice:", error); }
    };
    const handleMarkPaid = async (id: Id<"invoices">) => {
        try { await markAsPaid({ invoiceId: id }); } catch (error) { console.error("Failed to mark as paid:", error); }
    };
    const handleCancelInvoice = async (id: Id<"invoices">) => {
        try { await cancelInvoice({ invoiceId: id }); } catch (error) { console.error("Failed to cancel invoice:", error); }
    };

    const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Billing Center</h1>
                    <p className="text-md text-tertiary">Manage invoices, track payments, and monitor revenue</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/owner/billing/settings">
                        <Button color="secondary" size="md" iconLeading={Settings01}>Settings</Button>
                    </Link>
                    <Link href="/owner/billing/invoices/new">
                        <Button color="primary" size="md" iconLeading={Plus}>Create Invoice</Button>
                    </Link>
                </div>
            </div>

            {/* Revenue Stats */}
            <div>
                <p className="mb-4 text-sm font-medium text-tertiary uppercase tracking-wide">Revenue Overview — {currentMonth}</p>
                <RevenueStats collected={stats.collected} outstanding={stats.outstanding} expected={stats.expected} collectionRate={stats.collectionRate} paidCount={stats.paidCount} pendingCount={stats.pendingCount} totalInvoices={stats.totalInvoices} isLoading={isLoading} />
            </div>

            {/* Main Table - Listings Style */}
            <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-2xl">
                {/* Header bar */}
                <div className="flex gap-4 px-5 pt-3 pb-2.5">
                    <p className="text-sm font-semibold text-primary">Transactions</p>
                </div>

                {/* Summary section with filters */}
                <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                    <div className="flex flex-1 flex-col gap-3">
                        <p className="text-display-sm font-semibold text-primary">{filteredData.length}</p>
                        <div className="flex items-center gap-4">
                            <Input className="w-full md:w-80" size="sm" aria-label="Search transactions" placeholder="Search by tenant or reference..." icon={SearchMd} value={searchQuery} onChange={(value) => setSearchQuery(value)} />
                            <div className="w-40">
                                <Select selectedKey={statusFilter} onSelectionChange={(key) => setStatusFilter(key as string)} placeholder="All Status" items={statusOptions} aria-label="Filter by status">
                                    {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Tabs className="w-auto" selectedKey={selectedTab} onSelectionChange={(value) => setSelectedTab(value as string)}>
                        <TabList type="button-minimal" items={[{ id: "all", label: "All" }, { id: "invoice", label: "Invoices" }, { id: "payment", label: "Payments" }]} />
                    </Tabs>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center bg-primary py-20">
                        <LoadingIndicator type="line-simple" size="md" label="Loading transactions..." />
                    </div>
                ) : (
                    <Table aria-label="Transactions" className="bg-primary">
                        <Table.Header className="bg-primary">
                            <Table.Head id="type" label="Type" />
                            <Table.Head id="reference" label="Reference" isRowHeader className="w-full" />
                            <Table.Head id="tenant" label="Tenant" className="max-lg:hidden" />
                            <Table.Head id="amount" label="Amount" />
                            <Table.Head id="status" label="Status" />
                            <Table.Head id="date" label="Date" className="max-md:hidden" />
                            <Table.Head id="method" label="Method" className="max-md:hidden" />
                            <Table.Head id="actions" label="" />
                        </Table.Header>

                        <Table.Body items={filteredData}>
                            {(item) => (
                                <Table.Row id={item.id}>
                                    {/* Type Icon */}
                                    <Table.Cell>
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.type === "invoice" ? "bg-brand-secondary" : "bg-success-secondary"}`}>
                                            {item.type === "invoice" ? <Receipt className="size-4 text-brand-primary" /> : <ArrowDown className="size-4 text-success-primary" />}
                                        </div>
                                    </Table.Cell>

                                    {/* Reference */}
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            {item.type === "invoice" ? (
                                                <Link href={`/owner/billing/invoices/${item.id}`} className="font-medium text-primary hover:text-brand-primary">{item.reference}</Link>
                                            ) : (
                                                <span className="font-medium text-primary">{item.reference}</span>
                                            )}
                                            <span className="text-xs text-tertiary capitalize">{item.type}</span>
                                        </div>
                                    </Table.Cell>

                                    {/* Tenant */}
                                    <Table.Cell className="max-lg:hidden">
                                        <span className="text-secondary">{item.tenant}</span>
                                    </Table.Cell>

                                    {/* Amount */}
                                    <Table.Cell>
                                        <span className={`font-medium ${item.type === "payment" ? "text-success-primary" : "text-primary"}`}>
                                            {item.type === "payment" ? "+" : ""}{formatCurrency(item.amount)}
                                        </span>
                                    </Table.Cell>

                                    {/* Status */}
                                    <Table.Cell>
                                        <BadgeWithDot color={getStatusBadgeColor(item.status)} type="pill-color" size="sm">{getStatusLabel(item.status)}</BadgeWithDot>
                                    </Table.Cell>

                                    {/* Date */}
                                    <Table.Cell className="max-md:hidden">
                                        <span className="text-tertiary">{formatDate(item.date)}</span>
                                    </Table.Cell>

                                    {/* Method */}
                                    <Table.Cell className="max-md:hidden">
                                        <span className="text-tertiary">{item.paymentMethod ? getPaymentMethodLabel(item.paymentMethod) : "—"}</span>
                                    </Table.Cell>

                                    {/* Actions */}
                                    <Table.Cell className="px-4">
                                        {item.type === "invoice" ? (
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover className="w-min">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href={`/owner/billing/invoices/${item.id}`} icon={Eye}><span className="pr-4">View</span></Dropdown.Item>
                                                        {item.status === "draft" && <Dropdown.Item icon={Send01} onAction={() => handleSendInvoice(item.id as Id<"invoices">)}><span className="pr-4">Send</span></Dropdown.Item>}
                                                        {item.status !== "paid" && item.status !== "cancelled" && <Dropdown.Item icon={CheckCircle} onAction={() => handleMarkPaid(item.id as Id<"invoices">)}><span className="pr-4">Mark Paid</span></Dropdown.Item>}
                                                        {item.status !== "cancelled" && item.status !== "paid" && (
                                                            <>
                                                                <Dropdown.Separator />
                                                                <Dropdown.Item icon={XCircle} className="text-error-primary" onAction={() => handleCancelInvoice(item.id as Id<"invoices">)}><span className="pr-4">Cancel</span></Dropdown.Item>
                                                            </>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        ) : (
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover className="w-min">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item icon={Eye}><span className="pr-4">View Receipt</span></Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                )}

                {/* Empty State */}
                {!isLoading && filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center bg-primary py-12 text-center">
                        <Receipt className="mb-3 size-10 text-fg-disabled" />
                        <h3 className="text-lg font-medium text-primary">No transactions found</h3>
                        <p className="mt-1 text-sm text-tertiary">{searchQuery || statusFilter !== "all" ? "Try adjusting your search or filter" : "Create your first invoice to get started"}</p>
                    </div>
                )}
            </TableCard.Root>
        </div>
    );
}
