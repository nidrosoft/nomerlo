"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { X, Calendar as CalendarIcon, CheckCircle, AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { DatePicker } from "@/components/application/date-picker/date-picker";

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: Date;
}

const EVENT_TYPES = [
    { id: "showing", label: "Property Showing", color: "brand" },
    { id: "maintenance", label: "Maintenance", color: "orange" },
    { id: "inspection", label: "Inspection", color: "purple" },
    { id: "moveIn", label: "Move-In", color: "green" },
    { id: "moveOut", label: "Move-Out", color: "rose" },
    { id: "lease", label: "Lease Event", color: "blue" },
    { id: "rent", label: "Rent Due", color: "orange" },
    { id: "reminder", label: "Reminder", color: "gray" },
    { id: "custom", label: "Custom Event", color: "brand" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
        id: `${hour.toString().padStart(2, "0")}:${minute}`,
        label: `${displayHour}:${minute} ${period}`,
    };
});

export function AddEventModal({ isOpen, onClose, selectedDate }: AddEventModalProps) {
    const [step, setStep] = useState<"form" | "success">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventType, setEventType] = useState<string>("custom");
    const [eventDate, setEventDate] = useState<CalendarDate | null>(
        selectedDate ? new CalendarDate(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            selectedDate.getDate()
        ) : today(getLocalTimeZone())
    );
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [allDay, setAllDay] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string>("");
    const [notes, setNotes] = useState("");

    // For showings
    const [prospectName, setProspectName] = useState("");
    const [prospectEmail, setProspectEmail] = useState("");
    const [prospectPhone, setProspectPhone] = useState("");

    const properties = useQuery(api.properties.queries.listProperties, {});
    const createEvent = useMutation(api.calendar.mutations.createEvent);

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Please enter an event title");
            return;
        }

        if (!eventDate) {
            setError("Please select a date");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const dateObj = eventDate.toDate(getLocalTimeZone());
            const [startHour, startMin] = startTime.split(":").map(Number);
            const [endHour, endMin] = endTime.split(":").map(Number);

            const startDateTime = new Date(dateObj);
            startDateTime.setHours(startHour, startMin, 0, 0);

            const endDateTime = new Date(dateObj);
            endDateTime.setHours(endHour, endMin, 0, 0);

            // Get organization ID from the first property if available
            const orgId = properties?.[0]?.organizationId;
            if (!orgId) {
                setError("No organization found");
                setIsSubmitting(false);
                return;
            }

            await createEvent({
                organizationId: orgId as Id<"organizations">,
                title: title.trim(),
                description: description.trim() || undefined,
                type: eventType as any,
                startTime: startDateTime.getTime(),
                endTime: endDateTime.getTime(),
                allDay,
                color: EVENT_TYPES.find((t) => t.id === eventType)?.color as any || "brand",
                propertyId: selectedProperty ? (selectedProperty as Id<"properties">) : undefined,
                prospectName: eventType === "showing" ? prospectName : undefined,
                prospectEmail: eventType === "showing" ? prospectEmail : undefined,
                prospectPhone: eventType === "showing" ? prospectPhone : undefined,
                notes: notes.trim() || undefined,
            });

            setStep("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep("form");
        setTitle("");
        setDescription("");
        setEventType("custom");
        setEventDate(today(getLocalTimeZone()));
        setStartTime("09:00");
        setEndTime("10:00");
        setAllDay(false);
        setSelectedProperty("");
        setNotes("");
        setProspectName("");
        setProspectEmail("");
        setProspectPhone("");
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-secondary bg-primary shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-secondary p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary">
                            <CalendarIcon className="size-5 text-brand-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Add Event</h2>
                            <p className="text-sm text-tertiary">Create a new calendar event</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="rounded-lg p-2 hover:bg-secondary">
                        <X className="size-5 text-tertiary" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-5">
                    {step === "form" ? (
                        <div className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-error-secondary/50 p-3 text-sm text-error-primary">
                                    <AlertCircle className="size-4" />
                                    {error}
                                </div>
                            )}

                            {/* Event Type */}
                            <div>
                                <Label>Event Type *</Label>
                                <Select
                                    selectedKey={eventType}
                                    onSelectionChange={(key) => setEventType(key as string)}
                                    placeholder="Select event type..."
                                    items={EVENT_TYPES}
                                    aria-label="Event type"
                                >
                                    {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                </Select>
                            </div>

                            {/* Title */}
                            <div>
                                <Label>Title *</Label>
                                <Input
                                    value={title}
                                    onChange={setTitle}
                                    placeholder="Event title"
                                />
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Date *</Label>
                                    <DatePicker
                                        aria-label="Event date"
                                        value={eventDate}
                                        onChange={setEventDate}
                                    />
                                </div>
                                <div>
                                    <Label>Start Time</Label>
                                    <Select
                                        selectedKey={startTime}
                                        onSelectionChange={(key) => setStartTime(key as string)}
                                        items={TIME_OPTIONS}
                                        aria-label="Start time"
                                    >
                                        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                    </Select>
                                </div>
                                <div>
                                    <Label>End Time</Label>
                                    <Select
                                        selectedKey={endTime}
                                        onSelectionChange={(key) => setEndTime(key as string)}
                                        items={TIME_OPTIONS}
                                        aria-label="End time"
                                    >
                                        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                    </Select>
                                </div>
                            </div>

                            {/* Property (optional) */}
                            {properties && properties.length > 0 && (
                                <div>
                                    <Label>Property (Optional)</Label>
                                    <Select
                                        selectedKey={selectedProperty}
                                        onSelectionChange={(key) => setSelectedProperty(key as string)}
                                        placeholder="Select a property..."
                                        items={properties.map((p) => ({ id: p._id, label: p.name }))}
                                        aria-label="Property"
                                    >
                                        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                    </Select>
                                </div>
                            )}

                            {/* Showing-specific fields */}
                            {eventType === "showing" && (
                                <div className="space-y-4 border-t border-secondary pt-5">
                                    <h3 className="font-medium text-primary">Prospect Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                value={prospectName}
                                                onChange={setProspectName}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={prospectEmail}
                                                onChange={setProspectEmail}
                                                placeholder="john@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            type="tel"
                                            value={prospectPhone}
                                            onChange={setProspectPhone}
                                            placeholder="(512) 555-0100"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <Label>Description (Optional)</Label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add event details..."
                                    rows={3}
                                    className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-solid focus:outline-none focus:ring-1 focus:ring-brand-solid"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-secondary/50">
                                <CheckCircle className="size-8 text-success-primary" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-primary">Event Created!</h3>
                            <p className="text-sm text-tertiary">
                                Your event "{title}" has been added to the calendar.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-secondary p-5">
                    {step === "form" ? (
                        <>
                            <Button color="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Event"}
                            </Button>
                        </>
                    ) : (
                        <Button color="primary" onClick={handleClose}>
                            Done
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
