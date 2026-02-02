"use client";

export interface EmploymentData {
    status: "employed" | "self_employed" | "unemployed" | "retired" | "student";
    employer: string;
    position: string;
    income: string;
    startDate: string;
    supervisorName: string;
    supervisorPhone: string;
}

interface StepEmploymentProps {
    data: EmploymentData;
    onChange: (data: EmploymentData) => void;
}

export function StepEmployment({ data, onChange }: StepEmploymentProps) {
    const handleChange = (field: keyof EmploymentData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const employmentStatuses = [
        { value: "employed", label: "Employed" },
        { value: "self_employed", label: "Self-Employed" },
        { value: "unemployed", label: "Unemployed" },
        { value: "retired", label: "Retired" },
        { value: "student", label: "Student" },
    ];

    const showEmployerFields = data.status === "employed" || data.status === "self_employed";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-primary">Employment Information</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Tell us about your current employment and income.
                </p>
            </div>

            {/* Employment Status */}
            <div>
                <label className="mb-3 block text-sm font-medium text-primary">
                    Employment Status <span className="text-error-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {employmentStatuses.map((status) => (
                        <button
                            key={status.value}
                            type="button"
                            onClick={() => handleChange("status", status.value)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                data.status === status.value
                                    ? "bg-brand-primary text-white"
                                    : "bg-secondary/50 text-secondary hover:bg-secondary"
                            }`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Monthly Income */}
            <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                    Monthly Income (before taxes) <span className="text-error-primary">*</span>
                </label>
                <div className="relative max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary">$</span>
                    <input
                        type="number"
                        value={data.income}
                        onChange={(e) => handleChange("income", e.target.value)}
                        placeholder="5000"
                        className="w-full rounded-xl border border-secondary bg-primary py-3 pl-8 pr-4 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>
                <p className="mt-1 text-xs text-tertiary">
                    Include all sources of income (wages, self-employment, investments, etc.)
                </p>
            </div>

            {/* Employer Details */}
            {showEmployerFields && (
                <div className="space-y-4 rounded-xl bg-secondary/50 p-4">
                    <h3 className="text-sm font-medium text-primary">Employer Details</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-tertiary">
                                {data.status === "self_employed" ? "Business Name" : "Employer Name"}
                            </label>
                            <input
                                type="text"
                                value={data.employer}
                                onChange={(e) => handleChange("employer", e.target.value)}
                                placeholder="Acme Corp"
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-tertiary">
                                {data.status === "self_employed" ? "Your Role" : "Position/Title"}
                            </label>
                            <input
                                type="text"
                                value={data.position}
                                onChange={(e) => handleChange("position", e.target.value)}
                                placeholder="Software Engineer"
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-tertiary">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={data.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    {data.status === "employed" && (
                        <>
                            <div className="border-t border-secondary pt-4">
                                <h4 className="mb-3 text-sm text-tertiary">Supervisor (for verification)</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <input
                                            type="text"
                                            value={data.supervisorName}
                                            onChange={(e) => handleChange("supervisorName", e.target.value)}
                                            placeholder="Supervisor Name"
                                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            value={data.supervisorPhone}
                                            onChange={(e) => handleChange("supervisorPhone", e.target.value)}
                                            placeholder="Supervisor Phone"
                                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
