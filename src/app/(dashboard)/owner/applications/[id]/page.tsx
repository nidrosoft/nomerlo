"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import {
    ApplicantInfo,
    ApplyingForSection,
    EmploymentSection,
    ScreeningResults,
    ApplicationActions,
    InternalNotes,
} from "@/components/applications/detail";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Demo application data for display when no real data
const demoApplication = {
    _id: "demo-1",
    applicant: {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.w@email.com",
        phone: "(512) 555-0188",
        dateOfBirth: Date.now() - 32 * 365 * 24 * 60 * 60 * 1000,
    },
    currentAddress: {
        street: "456 Current Street, Apt 12",
        city: "Austin",
        state: "TX",
        zip: "78702",
        moveInDate: Date.now() - 3 * 365 * 24 * 60 * 60 * 1000,
        rent: 1200,
        landlordName: "Tom Wilson",
        landlordPhone: "(512) 555-1234",
    },
    employment: {
        status: "employed" as const,
        employer: "TechCorp Inc.",
        position: "Senior Designer",
        income: 5800,
        startDate: Date.now() - 4 * 365 * 24 * 60 * 60 * 1000,
        supervisorName: "Jane Manager",
        supervisorPhone: "(512) 555-9999",
    },
    status: "under_review",
    screeningStatus: "completed" as const,
    creditScore: 720,
    backgroundCheckPassed: true,
    evictionCheckPassed: true,
    desiredMoveIn: Date.now() + 21 * 24 * 60 * 60 * 1000,
    desiredLeaseTerm: "12_months",
    submittedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    internalNotes: "",
    property: {
        name: "Main Street Apartments",
        address: "123 Main Street, Austin, TX 78701",
    },
    unit: {
        name: "Unit B",
        bedrooms: 2,
        bathrooms: 1,
        sqft: 850,
    },
    listing: {
        rentAmount: 1500,
        depositAmount: 1500,
    },
};

interface Props {
    params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Fetch application from Convex
    const application = useQuery(
        api.applications.queries.getApplication,
        { applicationId: id as Id<"applications"> }
    );

    // Mutations
    const approveApplication = useMutation(api.applications.mutations.approveApplication);
    const denyApplication = useMutation(api.applications.mutations.denyApplication);
    const addNote = useMutation(api.applications.mutations.addInternalNote);
    const runScreening = useMutation(api.applications.mutations.runScreening);

    // Show loading state while data is being fetched
    const isLoadingData = application === undefined;
    
    // Use demo data only if application is not found (null), not while loading
    const app = application === null ? demoApplication : (application || demoApplication);
    const isDemo = application === null;

    const handleApprove = async (notes?: string) => {
        if (isDemo) {
            alert("Demo mode: Application would be approved");
            return;
        }
        setIsLoading(true);
        try {
            await approveApplication({ applicationId: id as Id<"applications">, notes });
            router.push("/owner/applications");
        } catch (error) {
            console.error("Error approving:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeny = async (reason: string) => {
        if (isDemo) {
            alert("Demo mode: Application would be denied");
            return;
        }
        setIsLoading(true);
        try {
            await denyApplication({ applicationId: id as Id<"applications">, reason });
            router.push("/owner/applications");
        } catch (error) {
            console.error("Error denying:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestInfo = () => {
        // TODO: Implement message/email flow
        alert("This will open a message composer to request more information");
    };

    const handleAddNote = async (note: string) => {
        if (isDemo) {
            alert("Demo mode: Note would be added");
            return;
        }
        try {
            await addNote({ applicationId: id as Id<"applications">, note });
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    const handleRunScreening = async () => {
        if (isDemo) {
            alert("Demo mode: Screening would be initiated");
            return;
        }
        setIsLoading(true);
        try {
            await runScreening({ 
                applicationId: id as Id<"applications">, 
                packageType: "comprehensive" 
            });
        } catch (error) {
            console.error("Error running screening:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading indicator while data is being fetched
    if (isLoadingData) {
        return (
            <div className="space-y-6">
                <Link
                    href="/owner/applications"
                    className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary"
                >
                    <ArrowLeft className="size-4" />
                    Back to Applications
                </Link>
                <div className="flex items-center justify-center rounded-2xl border border-secondary bg-primary py-32">
                    <LoadingIndicator type="line-simple" size="lg" label="Loading application..." />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/owner/applications"
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary"
            >
                <ArrowLeft className="size-4" />
                Back to Applications
            </Link>

            {/* Demo Banner */}
            {isDemo && (
                <div className="rounded-xl border border-warning-secondary bg-warning-secondary/50 p-4 text-sm text-warning-primary">
                    Viewing demo data. Real application data will appear when applications are submitted.
                </div>
            )}

            {/* Application ID Header */}
            <div>
                <h1 className="text-2xl font-semibold text-primary">
                    Application #{id.slice(-8).toUpperCase()}
                </h1>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="space-y-6 lg:col-span-2">
                    <ApplicantInfo
                        applicant={app.applicant}
                        currentAddress={app.currentAddress}
                        status={app.status}
                        submittedAt={app.submittedAt}
                    />

                    <ApplyingForSection
                        property={app.property || { name: "Unknown", address: "Unknown" }}
                        unit={app.unit || { name: "Unknown", bedrooms: 0, bathrooms: 0 }}
                        listing={app.listing || { rentAmount: 0, depositAmount: 0 }}
                        desiredMoveIn={app.desiredMoveIn}
                        desiredLeaseTerm={app.desiredLeaseTerm}
                    />

                    <EmploymentSection
                        employment={app.employment}
                        rentAmount={app.listing?.rentAmount || 0}
                    />

                    <ScreeningResults
                        screeningStatus={app.screeningStatus}
                        creditScore={app.creditScore}
                        backgroundCheckPassed={app.backgroundCheckPassed}
                        evictionCheckPassed={app.evictionCheckPassed}
                        onRunScreening={handleRunScreening}
                    />
                </div>

                {/* Right Column - Actions & Notes */}
                <div className="space-y-6">
                    <ApplicationActions
                        status={app.status}
                        onApprove={handleApprove}
                        onDeny={handleDeny}
                        onRequestInfo={handleRequestInfo}
                        isLoading={isLoading}
                    />

                    <InternalNotes
                        notes={app.internalNotes || ""}
                        onAddNote={handleAddNote}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
