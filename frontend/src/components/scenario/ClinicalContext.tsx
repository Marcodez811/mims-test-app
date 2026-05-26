import React from "react";

import { Label } from "@/components/ui/label";
import {
    ComboboxSearch,
    type ComboboxOption,
} from "@/components/ComboboxSearch";
import { TagList } from "@/components/scenario/TagList";
import { Stethoscope, Syringe, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Drug {
    id: string;
    name: string;
    type: string;
}

interface HealthIssue {
    code: string;
    label: string;
}

interface ClinicalContextProps {
    healthOptions: ComboboxOption[];
    drugOptions: ComboboxOption[];
    selectedHealthIssues: HealthIssue[];
    setSelectedHealthIssues: React.Dispatch<
        React.SetStateAction<HealthIssue[]>
    >;
    selectedPrescribedDrugs: Drug[];
    setSelectedPrescribedDrugs: React.Dispatch<React.SetStateAction<Drug[]>>;
    selectedAllergies: Drug[];
    setSelectedAllergies: React.Dispatch<React.SetStateAction<Drug[]>>;
}

export function ClinicalContext({
    healthOptions,
    drugOptions,
    selectedHealthIssues,
    setSelectedHealthIssues,
    selectedPrescribedDrugs,
    setSelectedPrescribedDrugs,
    selectedAllergies,
    setSelectedAllergies,
}: ClinicalContextProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-accent">
                    <Stethoscope className="h-4 w-4 text-accent-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    Clinical Context
                </h3>
            </div>

            {/* Health Issues */}
            <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    Health Issues (ICD-10)
                </Label>
                <ComboboxSearch
                    options={healthOptions}
                    onSelect={(opt) => {
                        if (
                            !selectedHealthIssues.find(
                                (h) => h.code === opt.value,
                            )
                        ) {
                            setSelectedHealthIssues((prev) => [
                                ...prev,
                                opt.data as unknown as HealthIssue,
                            ]);
                        }
                    }}
                    placeholder="Search diagnosis codes..."
                    searchPlaceholder="Type ICD-10 code or description..."
                    emptyText="No matching diagnoses."
                />
                <TagList
                    items={selectedHealthIssues.map((h) => ({
                        id: h.code,
                        label: h.label,
                    }))}
                    onRemove={(idx) =>
                        setSelectedHealthIssues((prev) =>
                            prev.filter((_, i) => i !== idx),
                        )
                    }
                    emptyText="No health issues added"
                />
            </div>

            <Separator />

            {/* Prescribed Drugs */}
            <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Syringe className="h-3.5 w-3.5" />
                    Current Medications
                </Label>
                <ComboboxSearch
                    options={drugOptions}
                    onSelect={(opt) => {
                        if (
                            !selectedPrescribedDrugs.find(
                                (d) => d.id === opt.value,
                            )
                        ) {
                            setSelectedPrescribedDrugs((prev) => [
                                ...prev,
                                opt.data as unknown as Drug,
                            ]);
                        }
                    }}
                    placeholder="Add existing medication..."
                    searchPlaceholder="Search drugs..."
                    emptyText="No matching drugs."
                />
                <TagList
                    items={selectedPrescribedDrugs.map((d) => ({
                        id: d.id,
                        label: d.name,
                    }))}
                    onRemove={(idx) =>
                        setSelectedPrescribedDrugs((prev) =>
                            prev.filter((_, i) => i !== idx),
                        )
                    }
                    variant="warning"
                    emptyText="No current medications"
                />
            </div>

            <Separator />

            {/* Allergies */}
            <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Known Allergies
                </Label>
                <ComboboxSearch
                    options={drugOptions}
                    onSelect={(opt) => {
                        if (
                            !selectedAllergies.find((d) => d.id === opt.value)
                        ) {
                            setSelectedAllergies((prev) => [
                                ...prev,
                                opt.data as unknown as Drug,
                            ]);
                        }
                    }}
                    placeholder="Add allergen..."
                    searchPlaceholder="Search drugs..."
                    emptyText="No matching drugs."
                />
                <TagList
                    items={selectedAllergies.map((d) => ({
                        id: d.id,
                        label: d.name,
                    }))}
                    onRemove={(idx) =>
                        setSelectedAllergies((prev) =>
                            prev.filter((_, i) => i !== idx),
                        )
                    }
                    variant="danger"
                    emptyText="No known allergies"
                />
            </div>
        </div>
    );
}
