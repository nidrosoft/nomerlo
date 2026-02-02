"use client";

import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from "lucide-react";

interface ApplicationToolbarProps {
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    totalResults: number;
    filteredResults: number;
    activeFilterCount: number;
    onFilterClick: () => void;
}

const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "oldest", label: "Oldest First" },
    { id: "name_asc", label: "Name: A to Z" },
    { id: "name_desc", label: "Name: Z to A" },
    { id: "income_high", label: "Highest Income" },
    { id: "income_low", label: "Lowest Income" },
    { id: "move_in_soon", label: "Soonest Move-in" },
];

export function ApplicationToolbar({
    viewMode,
    onViewModeChange,
    sortBy,
    onSortChange,
    totalResults,
    filteredResults,
    activeFilterCount,
    onFilterClick,
}: ApplicationToolbarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side - View toggle and results count */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={`rounded-full border p-3 transition-colors ${
                            viewMode === "grid"
                                ? "border-primary bg-primary text-fg-primary shadow-sm"
                                : "border-secondary text-tertiary hover:bg-secondary"
                        }`}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={`rounded-full border p-3 transition-colors ${
                            viewMode === "list"
                                ? "border-primary bg-primary text-fg-primary shadow-sm"
                                : "border-secondary text-tertiary hover:bg-secondary"
                        }`}
                    >
                        <List className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-secondary">
                    Showing {filteredResults === totalResults ? "" : `${filteredResults} of `}
                    <span className="font-medium text-primary">{totalResults}</span> applications
                </p>
            </div>

            {/* Right side - Filter and Sort */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onFilterClick}
                    className="flex items-center gap-2 rounded-full border border-secondary px-5 py-3 text-primary transition-colors hover:bg-secondary"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-solid text-xs text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none rounded-full border border-secondary bg-primary px-5 py-3 pr-10 text-primary focus:outline-none focus:border-tertiary cursor-pointer"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary" />
                </div>
            </div>
        </div>
    );
}
