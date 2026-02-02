"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Paperclip, Image01 as ImageIcon, Send03 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function MessageInput({ onSend, disabled, placeholder = "Type a message..." }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    return (
        <div className="border-t border-secondary bg-primary p-4">
            <div className="flex items-center gap-3">
                {/* Attachment buttons */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                        title="Attach file"
                    >
                        <Paperclip className="size-5" />
                    </button>
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                        title="Attach photo"
                    >
                        <ImageIcon className="size-5" />
                    </button>
                </div>

                {/* Text input */}
                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={1}
                        className="w-full resize-none rounded-xl border border-secondary bg-primary px-4 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-solid focus:outline-none focus:ring-1 focus:ring-brand-solid disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ minHeight: "42px" }}
                    />
                </div>

                {/* Send button - matched height with input */}
                <Button
                    color="primary"
                    size="md"
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    iconLeading={Send03}
                    className="h-[42px] shrink-0"
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
