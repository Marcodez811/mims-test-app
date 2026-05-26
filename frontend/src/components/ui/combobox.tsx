"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxItem {
    value: string;
    label: string;
    original?: any;
}

interface ComboboxProps {
    items: ComboboxItem[];
    placeholder?: string;
    emptyText?: string;
    onSelect: (item: ComboboxItem) => void;
    value?: string;
    className?: string;
}

export function Combobox({
    items,
    placeholder = "Select item...",
    emptyText = "No item found.",
    onSelect,
    value,
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    // Filter items based on query manually to control limit (Shadcn Command filters automatically but handling large lists can be slow)
    // For performance with 90k items, we should slice the list passed to CommandGroup
    // However, Command performs local filtering. With 90k items we might need a virtualized list or just slice the input.
    // For now, let's trust the parent passes a somewhat manageable list OR we slice here.

    const filteredItems = React.useMemo(() => {
        if (!query) return items.slice(0, 50);
        const lower = query.toLowerCase();
        return items
            .filter((i) => i.label.toLowerCase().includes(lower))
            .slice(0, 50);
    }, [items, query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {value
                        ? items.find((item) => item.value === value)?.label ||
                          value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={placeholder}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {filteredItems.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
