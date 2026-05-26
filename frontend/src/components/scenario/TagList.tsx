"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagListProps {
    items: { id: string; label: string }[];
    onRemove: (index: number) => void;
    variant?: "default" | "warning" | "danger";
    emptyText?: string;
}

const variantClasses = {
    default: "bg-accent text-accent-foreground border-primary/15",
    warning:
        "bg-[hsl(38,92%,95%)] text-[hsl(38,92%,25%)] border-[hsl(38,92%,80%)]",
    danger: "bg-destructive/10 text-destructive border-destructive/20",
};

export function TagList({
    items,
    onRemove,
    variant = "default",
    emptyText = "None added",
}: TagListProps) {
    if (items.length === 0) {
        return (
            <p className="text-xs text-muted-foreground italic py-1">
                {emptyText}
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className={cn(
                        "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                        variantClasses[variant],
                    )}
                >
                    <span className="truncate max-w-[200px]">{item.label}</span>
                    <button
                        type="button"
                        onClick={() => onRemove(idx)}
                        className="flex items-center justify-center rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                        aria-label={`Remove ${item.label}`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>
    );
}
