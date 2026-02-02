"use client";

import { useState, useRef } from "react";
import { Image01, Upload01, X, Star01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

export interface PhotoData {
    id: string;
    file?: File;
    url: string;
    caption?: string;
    roomType?: string;
    isPrimary: boolean;
}

interface StepPhotosProps {
    photos: PhotoData[];
    onChange: (photos: PhotoData[]) => void;
}

const ROOM_TYPES = [
    { id: "exterior", label: "Exterior" },
    { id: "living_room", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "bathroom", label: "Bathroom" },
    { id: "kitchen", label: "Kitchen" },
    { id: "dining", label: "Dining" },
    { id: "balcony", label: "Balcony" },
    { id: "other", label: "Other" },
];

export function StepPhotos({ photos, onChange }: StepPhotosProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPhotos: PhotoData[] = files.map((file, index) => ({
            id: `photo-${Date.now()}-${index}`,
            file,
            url: URL.createObjectURL(file),
            isPrimary: photos.length === 0 && index === 0,
        }));
        onChange([...photos, ...newPhotos]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemovePhoto = (id: string) => {
        const updated = photos.filter((p) => p.id !== id);
        // If we removed the primary, set the first one as primary
        if (updated.length > 0 && !updated.some((p) => p.isPrimary)) {
            updated[0].isPrimary = true;
        }
        onChange(updated);
    };

    const handleSetPrimary = (id: string) => {
        onChange(
            photos.map((p) => ({
                ...p,
                isPrimary: p.id === id,
            }))
        );
    };

    const handleUpdateCaption = (id: string, caption: string) => {
        onChange(
            photos.map((p) => (p.id === id ? { ...p, caption } : p))
        );
    };

    const handleUpdateRoomType = (id: string, roomType: string) => {
        onChange(
            photos.map((p) => (p.id === id ? { ...p, roomType } : p))
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-solid">
                    <Image01 className="size-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Property Photos</h2>
                    <p className="text-sm text-tertiary">
                        Upload high-quality photos to attract more tenants
                    </p>
                </div>
            </div>

            {/* Upload Area */}
            <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary bg-secondary_subtle p-8 cursor-pointer hover:border-brand-primary hover:bg-brand-secondary transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary mb-4">
                    <Upload01 className="size-6 text-tertiary" />
                </div>
                <p className="text-sm font-medium text-primary mb-1">
                    Click to upload or drag and drop
                </p>
                <p className="text-xs text-tertiary">
                    PNG, JPG up to 10MB each (recommended: 1920x1080)
                </p>
            </div>

            {/* Photos Grid */}
            {photos.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary">
                            {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
                        </p>
                        <p className="text-xs text-tertiary">
                            Drag to reorder · Click star to set cover photo
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-secondary bg-secondary_subtle"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption || `Photo ${index + 1}`}
                                    className="size-full object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                                {/* Primary Badge */}
                                {photo.isPrimary && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-brand-solid px-2 py-1">
                                        <Star01 className="size-3 text-white fill-white" />
                                        <span className="text-xs font-medium text-white">Cover</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!photo.isPrimary && (
                                        <button
                                            onClick={() => handleSetPrimary(photo.id)}
                                            className="flex size-8 items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors"
                                            title="Set as cover"
                                        >
                                            <Star01 className="size-4 text-gray-600" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemovePhoto(photo.id)}
                                        className="flex size-8 items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors"
                                        title="Remove photo"
                                    >
                                        <X className="size-4 text-gray-600" />
                                    </button>
                                </div>

                                {/* Caption Input (on hover) */}
                                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <input
                                        type="text"
                                        placeholder="Add caption..."
                                        value={photo.caption || ""}
                                        onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                                        className="w-full px-2 py-1 text-xs bg-white/90 rounded border-0 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Add More Button */}
                        <div
                            className="flex flex-col items-center justify-center aspect-[4/3] rounded-lg border-2 border-dashed border-secondary bg-secondary_subtle cursor-pointer hover:border-brand-primary hover:bg-brand-secondary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload01 className="size-6 text-tertiary mb-2" />
                            <span className="text-sm text-tertiary">Add more</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="rounded-lg border border-secondary p-4">
                <p className="text-sm font-medium text-primary mb-2">Photo Tips</p>
                <ul className="space-y-1 text-sm text-tertiary">
                    <li>• Use natural lighting when possible</li>
                    <li>• Include photos of all rooms and key amenities</li>
                    <li>• The cover photo appears first in search results</li>
                    <li>• Listings with 10+ photos get 2x more inquiries</li>
                </ul>
            </div>
        </div>
    );
}
