"use client";

import { useState, useMemo } from "react";
import {
    Check,
    Circle,
    ChevronDown,
    X,
    HelpCircle,
    Rocket01,
    Activity,
    MessageChatCircle,
    BookOpen02,
    Mail01,
} from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

type PortalType = "owner" | "tenant" | "maintenance";
type TabType = "onboarding" | "support" | "status";

interface CompletionTask {
    id: string;
    label: string;
    completed: boolean;
    href?: string;
}

interface FloatingSupportWidgetProps {
    portalType: PortalType;
}

// ============================================================================
// Completion Tasks Configuration
// ============================================================================

const getOwnerTasks = (): CompletionTask[] => [
    { id: "profile", label: "Complete your profile", completed: true },
    { id: "property", label: "Add your first property", completed: true },
    { id: "bank", label: "Connect bank account", completed: false, href: "/owner/settings/payments" },
    { id: "lease", label: "Create a lease template", completed: false, href: "/owner/leases/templates" },
    { id: "listing", label: "Publish a listing", completed: false, href: "/owner/listings/new" },
];

const getTenantTasks = (): CompletionTask[] => [
    { id: "profile", label: "Complete your profile", completed: true },
    { id: "verify", label: "Verify your identity", completed: true },
    { id: "payment", label: "Set up payment method", completed: false, href: "/tenant/settings/payments" },
    { id: "insurance", label: "Add renters insurance", completed: false, href: "/tenant/insurance" },
    { id: "emergency", label: "Add emergency contacts", completed: false, href: "/tenant/settings/emergency" },
];

const getMaintenanceTasks = (): CompletionTask[] => [
    { id: "profile", label: "Complete your profile", completed: true },
    { id: "skills", label: "Add your skills", completed: true },
    { id: "availability", label: "Set availability", completed: false, href: "/maintenance/settings/availability" },
    { id: "certifications", label: "Upload certifications", completed: false, href: "/maintenance/settings/certifications" },
];

// ============================================================================
// Tab Components
// ============================================================================

interface OnboardingTabProps {
    tasks: CompletionTask[];
    progress: number;
    completedCount: number;
    totalCount: number;
}

function OnboardingTab({ tasks, progress, completedCount, totalCount }: OnboardingTabProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Progress Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                        Setup Progress
                    </span>
                    <span className="text-sm font-medium text-brand-primary">
                        {progress}% complete
                    </span>
                </div>
                <ProgressBar value={progress} />
                <p className="text-xs text-tertiary">
                    {completedCount} of {totalCount} tasks completed
                </p>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-1">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>

            {/* CTA */}
            {completedCount < totalCount && (
                <Button
                    size="sm"
                    color="primary"
                    className="w-full"
                    href={tasks.find((t) => !t.completed)?.href}
                >
                    Continue setup
                </Button>
            )}
        </div>
    );
}

interface TaskItemProps {
    task: CompletionTask;
}

function TaskItem({ task }: TaskItemProps) {
    const content = (
        <div
            className={cx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                task.completed
                    ? "text-tertiary"
                    : "text-secondary hover:bg-secondary_subtle cursor-pointer"
            )}
        >
            {task.completed ? (
                <div className="flex size-5 items-center justify-center rounded-full bg-success-solid">
                    <Check className="size-3 text-white" />
                </div>
            ) : (
                <Circle className="size-5 text-fg-quaternary" />
            )}
            <span className={cx(task.completed && "line-through")}>{task.label}</span>
        </div>
    );

    if (task.href && !task.completed) {
        return <a href={task.href}>{content}</a>;
    }

    return content;
}

function SupportTab({ portalType }: { portalType: PortalType }) {
    const basePath = portalType === "owner" ? "/owner" : portalType === "tenant" ? "/tenant" : "/maintenance";

    const supportOptions = [
        {
            icon: BookOpen02,
            label: "Help Center",
            description: "Browse articles and guides",
            href: `${basePath}/help`,
        },
        {
            icon: MessageChatCircle,
            label: "Live Chat",
            description: "Chat with our support team",
            action: () => console.log("Open chat"),
        },
        {
            icon: Mail01,
            label: "Email Support",
            description: "support@nomerlo.com",
            href: "mailto:support@nomerlo.com",
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <p className="mb-2 text-sm text-tertiary">
                How can we help you today?
            </p>
            {supportOptions.map((option) => (
                <a
                    key={option.label}
                    href={option.href}
                    onClick={option.action}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-secondary_subtle"
                >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-secondary">
                        <option.icon className="size-5 text-brand-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary">{option.label}</p>
                        <p className="text-xs text-tertiary">{option.description}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}

function StatusTab() {
    const statusItems = [
        { label: "API Services", status: "operational" as const },
        { label: "Payment Processing", status: "operational" as const },
        { label: "Email Notifications", status: "operational" as const },
        { label: "Document Storage", status: "operational" as const },
    ];

    const getStatusColor = (status: "operational" | "degraded" | "outage") => {
        switch (status) {
            case "operational":
                return "bg-success-solid";
            case "degraded":
                return "bg-warning-solid";
            case "outage":
                return "bg-error-solid";
        }
    };

    const getStatusLabel = (status: "operational" | "degraded" | "outage") => {
        switch (status) {
            case "operational":
                return "Operational";
            case "degraded":
                return "Degraded";
            case "outage":
                return "Outage";
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-success-solid" />
                <span className="text-sm font-medium text-primary">All systems operational</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-secondary p-3">
                {statusItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1">
                        <span className="text-sm text-secondary">{item.label}</span>
                        <div className="flex items-center gap-2">
                            <div className={cx("size-2 rounded-full", getStatusColor(item.status))} />
                            <span className="text-xs text-tertiary">{getStatusLabel(item.status)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <a
                href="https://status.nomerlo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs font-medium text-brand-primary hover:underline"
            >
                View status page →
            </a>
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function FloatingSupportWidget({ portalType }: FloatingSupportWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("onboarding");

    const tasks = useMemo(() => {
        switch (portalType) {
            case "owner":
                return getOwnerTasks();
            case "tenant":
                return getTenantTasks();
            case "maintenance":
                return getMaintenanceTasks();
            default:
                return getOwnerTasks();
        }
    }, [portalType]);

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;
    const progress = Math.round((completedCount / totalCount) * 100);
    const isComplete = completedCount === totalCount;

    const tabs = [
        { id: "onboarding" as const, label: "Onboarding", icon: Rocket01, showBadge: !isComplete },
        { id: "support" as const, label: "Support", icon: HelpCircle },
        { id: "status" as const, label: "Status", icon: Activity },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-80 origin-bottom-right rounded-2xl border border-secondary bg-white shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                            <span className="text-sm font-semibold text-primary">
                                {tabs.find((t) => t.id === activeTab)?.label}
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex size-6 items-center justify-center rounded-md text-fg-quaternary transition-colors hover:bg-secondary_subtle hover:text-fg-quaternary_hover"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-secondary">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cx(
                                        "relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors",
                                        activeTab === tab.id
                                            ? "text-brand-primary"
                                            : "text-tertiary hover:text-secondary"
                                    )}
                                >
                                    <tab.icon className="size-4" />
                                    <span className="max-sm:hidden">{tab.label}</span>
                                    {tab.showBadge && (
                                        <span className="flex size-4 items-center justify-center rounded-full bg-brand-solid text-[10px] font-semibold text-white">
                                            {totalCount - completedCount}
                                        </span>
                                    )}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-solid"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="max-h-80 overflow-y-auto p-4">
                            {activeTab === "onboarding" && (
                                <OnboardingTab
                                    tasks={tasks}
                                    progress={progress}
                                    completedCount={completedCount}
                                    totalCount={totalCount}
                                />
                            )}
                            {activeTab === "support" && <SupportTab portalType={portalType} />}
                            {activeTab === "status" && <StatusTab />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cx(
                    "flex size-14 items-center justify-center rounded-full shadow-lg transition-colors",
                    isOpen
                        ? "bg-gray-900 text-white"
                        : "bg-brand-solid text-white hover:bg-brand-solid_hover"
                )}
            >
                {isOpen ? (
                    <ChevronDown className="size-6" />
                ) : (
                    <div className="relative">
                        <HelpCircle className="size-6" />
                        {!isComplete && (
                            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-error-solid text-[10px] font-semibold text-white ring-2 ring-white">
                                {totalCount - completedCount}
                            </span>
                        )}
                    </div>
                )}
            </motion.button>
        </div>
    );
}
