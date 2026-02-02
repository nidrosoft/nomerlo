"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Plus, SearchMd, Download01, Eye, Edit02, Trash01 } from "@untitledui/icons";
import { Table, TableCard } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Category options
const categoryOptions = [
    { id: "all", label: "All Categories" },
    { id: "maintenance", label: "Maintenance" },
    { id: "utilities", label: "Utilities" },
    { id: "insurance", label: "Insurance" },
    { id: "taxes", label: "Property Taxes" },
    { id: "other", label: "Other" },
];

// Demo data
const demoExpenses = [
    { _id: "exp-1", category: "maintenance", description: "Plumbing Repair", propertyName: "Sunset Apartments", amount: 450, date: Date.now() - 2 * 24 * 60 * 60 * 1000, status: "paid" },
    { _id: "exp-2", category: "insurance", description: "Property Insurance", propertyName: "All Properties", amount: 2400, date: Date.now() - 5 * 24 * 60 * 60 * 1000, status: "paid" },
    { _id: "exp-3", category: "taxes", description: "Property Tax - Q1", propertyName: "Sunset Apartments", amount: 3200, date: Date.now() - 15 * 24 * 60 * 60 * 1000, status: "paid" },
];

const demoStats = {
    totalThisMonth: 6600,
    totalLastMonth: 5800,
    totalYTD: 24850,
    changePercent: 13.8,
    byCategory: [
        { category: "taxes", amount: 3200, percentage: 48 },
        { category: "insurance", amount: 2400, percentage: 36 },
        { category: "maintenance", amount: 800, percentage: 12 },
    ],
};

// Helper functions
const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
        maintenance: "Maintenance", utilities: "Utilities", insurance: "Insurance", taxes: "Property Taxes", other: "Other"
    };
    return labels[category] || category;
};

const getStatusBadgeColor = (status: string): "success" | "warning" | "gray" => {
    const colors: Record<string, "success" | "warning" | "gray"> = { paid: "success", pending: "warning", cancelled: "gray" };
    return colors[status] || "gray";
};

const formatDate = (timestamp: number): string => new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const formatCurrency = (amount: number): string => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

export default function ExpensesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Fetch data from Convex
    const expensesData = useQuery(api.expenses.queries.listExpenses, { limit: 50 });
    const statsData = useQuery(api.expenses.queries.getExpenseStats, {});

    // Mutations
    const deleteExpense = useMutation(api.expenses.mutations.deleteExpense);

    const isLoading = expensesData === undefined || statsData === undefined;

    // Use demo data if no real data
    const expenses = useMemo(() => {
        if (isLoading) return [];
        return expensesData && expensesData.length > 0 ? expensesData : demoExpenses;
    }, [expensesData, isLoading]);

    const stats = useMemo(() => {
        if (isLoading) return demoStats;
        return statsData && statsData.totalThisMonth > 0 ? statsData : demoStats;
    }, [statsData, isLoading]);

    // Filter data
    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [expenses, searchQuery, categoryFilter]);

    // Calculate category totals
    const maintenanceTotal = stats.byCategory?.find((c) => c.category === "maintenance")?.amount || 0;
    const utilitiesTotal = stats.byCategory?.find((c) => c.category === "utilities")?.amount || 0;

    // Handlers
    const handleDelete = async (id: Id<"expenses">) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try { await deleteExpense({ expenseId: id }); } catch (error) { console.error("Failed to delete expense:", error); }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-center py-20">
                    <LoadingIndicator type="line-simple" size="md" label="Loading expenses..." />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Expenses</h1>
                    <p className="text-md text-tertiary">Track and manage your property expenses</p>
                </div>
                <div className="flex gap-3">
                    <Button color="secondary" size="md" iconLeading={Download01}>Export</Button>
                    <Link href="/owner/expenses/new">
                        <Button color="primary" size="md" iconLeading={Plus}>Add Expense</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-primary border border-secondary">
                    <p className="text-sm text-tertiary">This Month</p>
                    <p className="text-2xl font-semibold text-primary">{formatCurrency(stats.totalThisMonth)}</p>
                    <p className="text-xs text-tertiary mt-1">{stats.changePercent >= 0 ? "+" : ""}{stats.changePercent}% vs last month</p>
                </div>
                <div className="p-5 rounded-2xl bg-primary border border-secondary">
                    <p className="text-sm text-tertiary">Year to Date</p>
                    <p className="text-2xl font-semibold text-primary">{formatCurrency(stats.totalYTD)}</p>
                    <p className="text-xs text-tertiary mt-1">All properties</p>
                </div>
                <div className="p-5 rounded-2xl bg-primary border border-secondary">
                    <p className="text-sm text-tertiary">Maintenance</p>
                    <p className="text-2xl font-semibold text-primary">{formatCurrency(maintenanceTotal)}</p>
                    <p className="text-xs text-tertiary mt-1">This month</p>
                </div>
                <div className="p-5 rounded-2xl bg-primary border border-secondary">
                    <p className="text-sm text-tertiary">Utilities</p>
                    <p className="text-2xl font-semibold text-primary">{formatCurrency(utilitiesTotal)}</p>
                    <p className="text-xs text-tertiary mt-1">This month</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Expenses Table */}
                <div className="lg:col-span-2">
                    <TableCard.Root className="bg-secondary_subtle shadow-xs rounded-2xl">
                        <div className="flex gap-4 px-5 pt-3 pb-2.5">
                            <p className="text-sm font-semibold text-primary">Expenses</p>
                        </div>

                        <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                            <Input
                                className="w-full lg:w-64"
                                placeholder="Search expenses..."
                                iconLeading={SearchMd}
                                value={searchQuery}
                                onChange={setSearchQuery}
                                size="sm"
                            />
                            <Select
                                className="w-full lg:w-40"
                                selectedKey={categoryFilter}
                                onSelectionChange={(key) => setCategoryFilter(key as string)}
                                items={categoryOptions}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                        </div>

                        <Table aria-label="Expenses" className="bg-primary">
                            <Table.Header className="bg-primary">
                                <Table.Head id="date" label="Date" />
                                <Table.Head id="description" label="Description" isRowHeader className="w-full" />
                                <Table.Head id="category" label="Category" />
                                <Table.Head id="property" label="Property" className="max-lg:hidden" />
                                <Table.Head id="amount" label="Amount" />
                                <Table.Head id="status" label="Status" />
                                <Table.Head id="actions" label="" />
                            </Table.Header>

                            <Table.Body items={filteredExpenses}>
                                {(expense) => (
                                    <Table.Row id={expense._id}>
                                        <Table.Cell>
                                            <span className="text-sm text-secondary">{formatDate(expense.date)}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link href={`/owner/expenses/${expense._id}`} className="text-sm font-medium text-primary hover:text-brand-primary">
                                                {expense.description}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-xs font-medium text-secondary bg-secondary/50 px-2 py-1 rounded-full whitespace-nowrap">
                                                {getCategoryLabel(expense.category)}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="max-lg:hidden">
                                            <span className="text-sm text-secondary">{expense.propertyName || "All Properties"}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm font-medium text-primary">{formatCurrency(expense.amount)}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <BadgeWithDot color={getStatusBadgeColor(expense.status)} size="sm">
                                                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                                            </BadgeWithDot>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover className="w-min">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href={`/owner/expenses/${expense._id}`} icon={Eye}>View</Dropdown.Item>
                                                        <Dropdown.Item href={`/owner/expenses/${expense._id}`} icon={Edit02}>Edit</Dropdown.Item>
                                                        <Dropdown.Item icon={Trash01} onAction={() => handleDelete(expense._id as Id<"expenses">)}>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </TableCard.Root>
                </div>

                {/* Category Breakdown */}
                <div className="p-6 rounded-2xl bg-primary border border-secondary">
                    <h3 className="text-lg font-semibold text-primary mb-4">By Category</h3>
                    {stats.byCategory?.map((cat) => (
                        <div key={cat.category} className="flex justify-between py-2 border-b border-secondary last:border-0">
                            <span className="text-sm text-secondary capitalize">{cat.category}</span>
                            <span className="text-sm font-medium text-primary">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
