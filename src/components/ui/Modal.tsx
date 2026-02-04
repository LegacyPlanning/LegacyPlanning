"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className={`${sizes[size]} w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200`}>
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
