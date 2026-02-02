"use client";

export interface EmergencyContactData {
    name: string;
    relationship: string;
    phone: string;
}

interface StepEmergencyContactProps {
    data: EmergencyContactData;
    onChange: (data: EmergencyContactData) => void;
}

export function StepEmergencyContact({ data, onChange }: StepEmergencyContactProps) {
    const handleChange = (field: keyof EmergencyContactData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-primary">Emergency Contact</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Please provide a contact person we can reach in case of an emergency.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Full Name <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-primary placeholder:text-tertiary focus:border-brand-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                        Relationship <span className="text-error-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.relationship}
                        onChange={(e) => handleChange("relationship", e.target.value)}
                        placeholder="Parent, Spouse, Friend, etc."
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
            </div>

            <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm text-tertiary">
                    This person will only be contacted in case of an emergency. We will not share their 
                    information for any other purpose.
                </p>
            </div>
        </div>
    );
}
