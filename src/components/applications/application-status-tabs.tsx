"use client";

interface StatusTab {
    id: string;
    label: string;
    count: number;
    showDot?: boolean;
}

interface ApplicationStatusTabsProps {
    tabs: StatusTab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function ApplicationStatusTabs({ tabs, activeTab, onTabChange }: ApplicationStatusTabsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                            ? "bg-brand-secondary text-brand-primary"
                            : "bg-secondary/50 text-secondary hover:bg-secondary hover:text-primary"
                    }`}
                >
                    {tab.showDot && tab.count > 0 && (
                        <span className="h-2 w-2 rounded-full bg-error-primary" />
                    )}
                    <span>{tab.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                        activeTab === tab.id
                            ? "bg-brand-primary/20 text-brand-primary"
                            : "bg-tertiary/20 text-tertiary"
                    }`}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
