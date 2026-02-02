"use client";

import { useState } from "react";
import { StickyNote } from "lucide-react";
import { Button } from "@/components/base/buttons/button";

interface InternalNotesProps {
    notes: string;
    onAddNote: (note: string) => void;
    isLoading?: boolean;
}

export function InternalNotes({ notes, onAddNote, isLoading }: InternalNotesProps) {
    const [newNote, setNewNote] = useState("");

    const handleSubmit = () => {
        if (newNote.trim()) {
            onAddNote(newNote.trim());
            setNewNote("");
        }
    };

    // Parse notes (they're stored with timestamps)
    const parsedNotes = notes
        ? notes.split("\n\n").filter((n) => n.trim())
        : [];

    return (
        <div className="rounded-2xl border border-secondary bg-primary p-6">
            <div className="mb-4 flex items-center gap-2">
                <StickyNote className="size-5 text-tertiary" />
                <h3 className="text-lg font-semibold text-primary">Internal Notes</h3>
            </div>

            <p className="mb-4 text-xs text-tertiary">
                These notes are only visible to you and your team.
            </p>

            {/* Existing Notes */}
            {parsedNotes.length > 0 && (
                <div className="mb-4 max-h-48 space-y-3 overflow-y-auto rounded-xl bg-secondary/50 p-4">
                    {parsedNotes.map((note, index) => (
                        <div key={index} className="border-b border-secondary pb-3 last:border-0 last:pb-0">
                            <p className="text-sm text-primary whitespace-pre-wrap">{note}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add New Note */}
            <div className="space-y-3">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full rounded-xl border border-secondary bg-primary p-3 text-sm focus:border-brand-primary focus:outline-none"
                    rows={3}
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!newNote.trim() || isLoading}
                    size="sm"
                >
                    Add Note
                </Button>
            </div>
        </div>
    );
}
