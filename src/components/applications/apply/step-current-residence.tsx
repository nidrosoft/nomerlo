"use client";

export interface CurrentResidenceData {
    street: string;
    city: string;
    state: string;
    zip: string;
    moveInDate: string;
    rent: string;
    landlordName: string;
    landlordPhone: string;
}

interface StepCurrentResidenceProps {
    data: CurrentResidenceData;
    onChange: (data: CurrentResidenceData) => void;
}

export function StepCurrentResidence({ data, onChange }: StepCurrentResidenceProps) {
    const handleChange = (field: keyof CurrentResidenceData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-primary">Current Residence</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Tell us about where you currently live.
                </p>
            </div>

            <div className="space-y-6">
                {/* Address */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Street Address <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.street}
                        onChange={(e) => handleChange("street", e.target.value)}
                        placeholder="123 Current Street, Apt 4"
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-primary">
                            City <span className="text-error-primary">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Austin"
                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-primary">
                            State <span className="text-error-primary">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.state}
                            onChange={(e) => handleChange("state", e.target.value)}
                            placeholder="TX"
                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-primary">
                            ZIP Code <span className="text-error-primary">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.zip}
                            onChange={(e) => handleChange("zip", e.target.value)}
                            placeholder="78701"
                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-primary">
                            Move-in Date <span className="text-error-primary">*</span>
                        </label>
                        <input
                            type="date"
                            value={data.moveInDate}
                            onChange={(e) => handleChange("moveInDate", e.target.value)}
                            className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-primary">
                            Current Monthly Rent <span className="text-error-primary">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary">$</span>
                            <input
                                type="number"
                                value={data.rent}
                                onChange={(e) => handleChange("rent", e.target.value)}
                                placeholder="1200"
                                className="w-full rounded-xl border border-secondary bg-primary py-3 pl-8 pr-4 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Landlord Reference */}
                <div className="rounded-xl bg-secondary/50 p-4">
                    <h3 className="mb-4 text-sm font-medium text-primary">Landlord Reference (Optional)</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-tertiary">
                                Landlord Name
                            </label>
                            <input
                                type="text"
                                value={data.landlordName}
                                onChange={(e) => handleChange("landlordName", e.target.value)}
                                placeholder="John Smith"
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-tertiary">
                                Landlord Phone
                            </label>
                            <input
                                type="tel"
                                value={data.landlordPhone}
                                onChange={(e) => handleChange("landlordPhone", e.target.value)}
                                placeholder="(555) 123-4567"
                                className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
