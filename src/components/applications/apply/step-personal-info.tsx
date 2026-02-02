"use client";

export interface PersonalInfoData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
}

interface StepPersonalInfoProps {
    data: PersonalInfoData;
    onChange: (data: PersonalInfoData) => void;
}

export function StepPersonalInfo({ data, onChange }: StepPersonalInfoProps) {
    const handleChange = (field: keyof PersonalInfoData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-primary">Personal Information</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Please provide your basic contact information.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        First Name <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="John"
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Last Name <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Doe"
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Email Address <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Phone Number <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Date of Birth <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="date"
                        value={data.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary focus:border-brand-primary focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
