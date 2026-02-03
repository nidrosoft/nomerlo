"use client";

import { useState, useRef } from "react";
import {
    MessageChatCircle,
    Upload01,
    X,
    Plus,
    Phone,
    MessageSquare01,
    Code02,
    File06,
    HelpCircle,
    Settings01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";

export interface KnowledgeBaseDocument {
    id: string;
    fileName: string;
    fileSize: number;
    category: string;
    file?: File;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface AISupportData {
    // Knowledge Base
    knowledgeBaseSource: "company" | "property" | "both";
    documents: KnowledgeBaseDocument[];
    faqs: FAQItem[];

    // Channels
    chatEnabled: boolean;
    phoneEnabled: boolean;
    whatsappEnabled: boolean;
    smsEnabled: boolean;

    // Phone settings
    supportPhoneNumber: string;
    escalationPhoneNumber: string;

    // Widget settings
    showOnListing: boolean;
    showOnTenantPortal: boolean;
    embedEnabled: boolean;
    widgetPosition: "bottom-right" | "bottom-left";
    widgetColor: string;
    welcomeMessage: string;

    // Escalation
    escalateOnEmergency: boolean;
    escalateOnHumanRequest: boolean;
    escalateOnUnknown: boolean;

    // Capabilities
    canScheduleTours: boolean;
    canCreateMaintenanceRequests: boolean;
}

const DOCUMENT_CATEGORIES = [
    { id: "policies", label: "Policies & Rules" },
    { id: "amenities", label: "Amenities Info" },
    { id: "move_in", label: "Move-in Guide" },
    { id: "move_out", label: "Move-out Guide" },
    { id: "faq", label: "FAQ Document" },
    { id: "lease_terms", label: "Lease Terms" },
    { id: "neighborhood", label: "Neighborhood Info" },
    { id: "utilities", label: "Utilities Info" },
    { id: "parking", label: "Parking Info" },
    { id: "pets", label: "Pet Policy" },
    { id: "other", label: "Other" },
];

interface StepAISupportProps {
    data: AISupportData;
    onChange: (data: AISupportData) => void;
}

export function StepAISupport({ data, onChange }: StepAISupportProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<"documents" | "faq" | "channels" | "widget">(
        "documents"
    );

    // Document upload handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newDocs: KnowledgeBaseDocument[] = files.map((file) => ({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            fileName: file.name,
            fileSize: file.size,
            category: "other",
            file,
        }));
        onChange({ ...data, documents: [...data.documents, ...newDocs] });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveDocument = (id: string) => {
        onChange({ ...data, documents: data.documents.filter((d) => d.id !== id) });
    };

    const handleUpdateDocumentCategory = (id: string, category: string) => {
        onChange({
            ...data,
            documents: data.documents.map((d) => (d.id === id ? { ...d, category } : d)),
        });
    };

    // FAQ handlers
    const handleAddFAQ = () => {
        const newFAQ: FAQItem = {
            id: `faq-${Date.now()}`,
            question: "",
            answer: "",
        };
        onChange({ ...data, faqs: [...data.faqs, newFAQ] });
    };

    const handleUpdateFAQ = (id: string, field: "question" | "answer", value: string) => {
        onChange({
            ...data,
            faqs: data.faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
        });
    };

    const handleRemoveFAQ = (id: string) => {
        onChange({ ...data, faqs: data.faqs.filter((f) => f.id !== id) });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const tabs = [
        { id: "documents", label: "Documents", icon: File06 },
        { id: "faq", label: "Quick Facts", icon: HelpCircle },
        { id: "channels", label: "Channels", icon: Phone },
        { id: "widget", label: "Widget", icon: Settings01 },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <MessageChatCircle className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">AI Support Setup</h2>
                    <p className="text-sm text-tertiary">
                        Configure knowledge base and support channels for your listing
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 rounded-lg bg-secondary_subtle p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? "bg-primary text-primary shadow-sm"
                                : "text-tertiary hover:text-secondary"
                        }`}
                    >
                        <tab.icon className="size-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Documents Tab */}
            {activeTab === "documents" && (
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-secondary p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                                <File06 className="size-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary">
                                Knowledge Base Documents
                            </h3>
                        </div>
                        <p className="text-sm text-tertiary mb-4">
                            Upload documents that the AI will use to answer tenant questions about
                            policies, amenities, rules, and procedures.
                        </p>

                        {/* Upload Area */}
                        <div
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary bg-secondary_subtle p-6 cursor-pointer hover:border-brand-primary hover:bg-brand-secondary transition-colors mb-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <Upload01 className="size-8 text-tertiary mb-2" />
                            <p className="text-sm font-medium text-primary">
                                Click to upload documents
                            </p>
                            <p className="text-xs text-tertiary">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                        </div>

                        {/* Document List */}
                        {data.documents.length > 0 && (
                            <div className="space-y-2">
                                {data.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center gap-3 rounded-lg border border-secondary bg-primary p-3"
                                    >
                                        <File06 className="size-5 text-tertiary flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-primary truncate">
                                                {doc.fileName}
                                            </p>
                                            <p className="text-xs text-tertiary">
                                                {formatFileSize(doc.fileSize)}
                                            </p>
                                        </div>
                                        <Select
                                            placeholder="Category"
                                            selectedKey={doc.category}
                                            onSelectionChange={(key) =>
                                                handleUpdateDocumentCategory(doc.id, key as string)
                                            }
                                            items={DOCUMENT_CATEGORIES}
                                            className="w-40"
                                        >
                                            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                        </Select>
                                        <button
                                            onClick={() => handleRemoveDocument(doc.id)}
                                            className="p-1 text-tertiary hover:text-error-primary transition-colors"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-secondary p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                                    <HelpCircle className="size-4 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Quick Facts / FAQ
                                </h3>
                            </div>
                            <Button color="secondary" size="sm" onClick={handleAddFAQ}>
                                <Plus className="size-4" />
                                Add Question
                            </Button>
                        </div>
                        <p className="text-sm text-tertiary mb-4">
                            Add common questions and answers for instant AI responses.
                        </p>

                        {data.faqs.length === 0 ? (
                            <div className="rounded-lg bg-secondary_subtle p-6 text-center">
                                <HelpCircle className="size-8 text-tertiary mx-auto mb-2" />
                                <p className="text-sm text-tertiary">
                                    No FAQ items yet. Add questions your tenants commonly ask.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.faqs.map((faq, index) => (
                                    <div
                                        key={faq.id}
                                        className="rounded-lg border border-secondary p-4"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <span className="text-xs font-medium text-tertiary">
                                                Q{index + 1}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveFAQ(faq.id)}
                                                className="p-1 text-tertiary hover:text-error-primary transition-colors"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Enter the question..."
                                                value={faq.question}
                                                onChange={(value) =>
                                                    handleUpdateFAQ(faq.id, "question", value)
                                                }
                                            />
                                            <TextArea
                                                placeholder="Enter the answer..."
                                                value={faq.answer}
                                                onChange={(value) =>
                                                    handleUpdateFAQ(faq.id, "answer", value)
                                                }
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Channels Tab */}
            {activeTab === "channels" && (
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-secondary p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                                <Phone className="size-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary">Support Channels</h3>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-secondary hover:bg-secondary_subtle transition-colors">
                                <Checkbox
                                    isSelected={data.chatEnabled}
                                    onChange={(isSelected) =>
                                        onChange({ ...data, chatEnabled: isSelected })
                                    }
                                />
                                <MessageSquare01 className="size-5 text-tertiary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-primary">AI Chat Widget</p>
                                    <p className="text-xs text-tertiary">
                                        Floating chat bubble on listing page
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-secondary hover:bg-secondary_subtle transition-colors">
                                <Checkbox
                                    isSelected={data.phoneEnabled}
                                    onChange={(isSelected) =>
                                        onChange({ ...data, phoneEnabled: isSelected })
                                    }
                                />
                                <Phone className="size-5 text-tertiary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-primary">
                                        AI Phone Support
                                    </p>
                                    <p className="text-xs text-tertiary">
                                        24/7 AI-powered phone answering
                                    </p>
                                </div>
                            </label>

                            {data.phoneEnabled && (
                                <div className="ml-8 space-y-3 pt-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label>Support Phone Number</Label>
                                        <Input
                                            placeholder="(512) 555-NOMO"
                                            value={data.supportPhoneNumber}
                                            onChange={(value) =>
                                                onChange({ ...data, supportPhoneNumber: value })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label>Escalation Phone (for emergencies)</Label>
                                        <Input
                                            placeholder="Your personal phone"
                                            value={data.escalationPhoneNumber}
                                            onChange={(value) =>
                                                onChange({ ...data, escalationPhoneNumber: value })
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Escalation Rules */}
                    <div className="rounded-lg border border-secondary p-4">
                        <h3 className="text-sm font-semibold text-primary mb-3">
                            Escalation Rules
                        </h3>
                        <p className="text-sm text-tertiary mb-4">
                            When should calls/chats be forwarded to you?
                        </p>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    isSelected={data.escalateOnEmergency}
                                    onChange={(isSelected) =>
                                        onChange({ ...data, escalateOnEmergency: isSelected })
                                    }
                                />
                                <span className="text-sm text-secondary">
                                    Emergency maintenance (water leaks, no heat, security)
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    isSelected={data.escalateOnHumanRequest}
                                    onChange={(isSelected) =>
                                        onChange({ ...data, escalateOnHumanRequest: isSelected })
                                    }
                                />
                                <span className="text-sm text-secondary">
                                    Caller explicitly requests to speak with landlord
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    isSelected={data.escalateOnUnknown}
                                    onChange={(isSelected) =>
                                        onChange({ ...data, escalateOnUnknown: isSelected })
                                    }
                                />
                                <span className="text-sm text-secondary">
                                    AI cannot answer the question
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Widget Tab */}
            {activeTab === "widget" && (
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-secondary p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                                <Settings01 className="size-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary">Widget Settings</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Checkbox
                                        isSelected={data.showOnListing}
                                        onChange={(isSelected) =>
                                            onChange({ ...data, showOnListing: isSelected })
                                        }
                                    />
                                    <span className="text-sm text-secondary">
                                        Show support widget on listing page
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Checkbox
                                        isSelected={data.showOnTenantPortal}
                                        onChange={(isSelected) =>
                                            onChange({ ...data, showOnTenantPortal: isSelected })
                                        }
                                    />
                                    <span className="text-sm text-secondary">
                                        Show support widget on tenant portal
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Checkbox
                                        isSelected={data.embedEnabled}
                                        onChange={(isSelected) =>
                                            onChange({ ...data, embedEnabled: isSelected })
                                        }
                                    />
                                    <span className="text-sm text-secondary">
                                        Enable embed code for external websites
                                    </span>
                                </label>
                            </div>

                            {data.embedEnabled && (
                                <div className="rounded-lg bg-secondary_subtle p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code02 className="size-4 text-tertiary" />
                                        <span className="text-sm font-medium text-primary">
                                            Embed Code
                                        </span>
                                    </div>
                                    <code className="block text-xs text-tertiary bg-primary p-3 rounded border border-secondary overflow-x-auto">
                                        {`<script src="https://nomerlo.com/widget/${Math.random().toString(36).substr(2, 8)}"></script>`}
                                    </code>
                                    <Button color="secondary" size="sm" className="mt-2">
                                        Copy Code
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="rounded-lg border border-secondary p-4">
                        <div className="flex flex-col gap-1.5">
                            <Label>Welcome Message</Label>
                            <TextArea
                                placeholder="Hi! 👋 I'm your AI assistant. Ask me anything about this property..."
                                value={data.welcomeMessage}
                                onChange={(value) =>
                                    onChange({ ...data, welcomeMessage: value })
                                }
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* AI Capabilities */}
                    <div className="rounded-lg border border-secondary p-4">
                        <h3 className="text-sm font-semibold text-primary mb-3">AI Capabilities</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    isSelected={data.canScheduleTours}
                                    onChange={(isSelected) =>
                                        onChange({ ...data, canScheduleTours: isSelected })
                                    }
                                />
                                <span className="text-sm text-secondary">
                                    Allow AI to schedule property tours
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    isSelected={data.canCreateMaintenanceRequests}
                                    onChange={(isSelected) =>
                                        onChange({
                                            ...data,
                                            canCreateMaintenanceRequests: isSelected,
                                        })
                                    }
                                />
                                <span className="text-sm text-secondary">
                                    Allow AI to create maintenance requests
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
