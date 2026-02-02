"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface PropertyFilterDropdownProps {
    label: string;
    options: FilterOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function PropertyFilterDropdown({
    label,
    options,
    selected,
    onChange,
}: PropertyFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const displayText = selected.length > 0 ? `${selected.length} selected` : label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-2xl border border-secondary bg-primary px-4 py-3 text-primary transition-colors focus:border-tertiary focus:outline-none"
            >
                <span className={selected.length > 0 ? "text-primary" : "text-tertiary"}>
                    {displayText}
                </span>
                <ChevronDown
                    className={`h-5 w-5 text-quaternary transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-secondary bg-primary p-4 shadow-lg">
                    <div className="flex flex-col gap-3">
                        {options.map((option) => (
                            <label
                                key={option.value}
                                className="-m-1 flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                                onClick={() => toggleOption(option.value)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                            selected.includes(option.value)
                                                ? "border-brand-solid bg-brand-solid"
                                                : "border-tertiary bg-primary"
                                        }`}
                                    >
                                        {selected.includes(option.value) && (
                                            <Check className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    <span className="text-primary">{option.label}</span>
                                </div>
                                {option.count !== undefined && (
                                    <span className="text-sm text-quaternary">{option.count}</span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
