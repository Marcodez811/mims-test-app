import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ComboboxSearch,
    type ComboboxOption,
} from "@/components/ComboboxSearch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Drug {
    id: string;
    name: string;
    type: string;
}

interface PrescribingDrugProps {
    drugOptions: ComboboxOption[];
    prescribingDrug: Drug | null;
    setPrescribingDrug: (d: Drug | null) => void;
    dose: string;
    setDose: (v: string) => void;
    unit: string;
    setUnit: (v: string) => void;
    route: string;
    setRoute: (v: string) => void;
    form: string;
    setForm: (v: string) => void;
    frequency: string;
    setFrequency: (v: string) => void;
    durationValue: string;
    setDurationValue: (v: string) => void;
    durationUnit: string;
    setDurationUnit: (v: string) => void;
    indication: string;
    setIndication: (v: string) => void;
    initialDose: boolean;
    setInitialDose: (v: boolean) => void;
    maintenanceDose: boolean;
    setMaintenanceDose: (v: boolean) => void;
}

export function PrescribingDrug({
    drugOptions,
    prescribingDrug,
    setPrescribingDrug,
    dose,
    setDose,
    unit,
    setUnit,
    route,
    setRoute,
    form,
    setForm,
    frequency,
    setFrequency,
    durationValue,
    setDurationValue,
    durationUnit,
    setDurationUnit,
    indication,
    setIndication,
    initialDose,
    setInitialDose,
    maintenanceDose,
    setMaintenanceDose,
}: PrescribingDrugProps) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-accent">
                    <Pill className="h-4 w-4 text-accent-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    Prescribing Drug
                </h3>
                <Badge
                    variant="secondary"
                    className="ml-auto text-[10px] uppercase tracking-wider font-semibold"
                >
                    Primary
                </Badge>
            </div>

            {/* Drug Name */}
            <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Drug Name
                </Label>
                <ComboboxSearch
                    options={drugOptions}
                    value={prescribingDrug?.id}
                    onSelect={(opt) =>
                        setPrescribingDrug(opt.data as unknown as Drug)
                    }
                    placeholder="Search generic or brand name..."
                    searchPlaceholder="Type to search drugs..."
                    emptyText="No drugs found."
                />
                {prescribingDrug && (
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {prescribingDrug.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {prescribingDrug.id}
                        </span>
                    </div>
                )}
            </div>

            {/* Route of Administration & Form */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Route
                    </Label>
                    <Select
                        value={route || "__none__"}
                        onValueChange={(v) =>
                            setRoute(v === "__none__" ? "" : v)
                        }
                    >
                        <SelectTrigger className="bg-card">
                            <SelectValue placeholder="Auto-detect" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__none__">
                                Auto-detect
                            </SelectItem>
                            <SelectItem value="Oral">Oral</SelectItem>
                            <SelectItem value="Topical">Topical</SelectItem>
                            <SelectItem value="Inhalation">
                                Inhalation
                            </SelectItem>
                            <SelectItem value="Intravenous">
                                Intravenous
                            </SelectItem>
                            <SelectItem value="Intramuscular">
                                Intramuscular
                            </SelectItem>
                            <SelectItem value="Subcutaneous">
                                Subcutaneous
                            </SelectItem>
                            <SelectItem value="Rectal">Rectal</SelectItem>
                            <SelectItem value="Ophthalmic">
                                Ophthalmic
                            </SelectItem>
                            <SelectItem value="Nasal">Nasal</SelectItem>
                            <SelectItem value="Transdermal">
                                Transdermal
                            </SelectItem>
                            <SelectItem value="Sublingual">
                                Sublingual
                            </SelectItem>
                            <SelectItem value="Systemic">Systemic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Form
                    </Label>
                    <Select
                        value={form || "__none__"}
                        onValueChange={(v) =>
                            setForm(v === "__none__" ? "" : v)
                        }
                    >
                        <SelectTrigger className="bg-card">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__none__">None</SelectItem>
                            <SelectItem value="Tablet">Tablet</SelectItem>
                            <SelectItem value="Capsule">Capsule</SelectItem>
                            <SelectItem value="Syrup">Syrup</SelectItem>
                            <SelectItem value="Injection">Injection</SelectItem>
                            <SelectItem value="Cream">Cream</SelectItem>
                            <SelectItem value="Ointment">Ointment</SelectItem>
                            <SelectItem value="Metered Aerosol">
                                Metered Aerosol
                            </SelectItem>
                            <SelectItem value="Drops">Drops</SelectItem>
                            <SelectItem value="Patch">Patch</SelectItem>
                            <SelectItem value="Suppository">
                                Suppository
                            </SelectItem>
                            <SelectItem value="Powder">Powder</SelectItem>
                            <SelectItem value="Solution">Solution</SelectItem>
                            <SelectItem value="Suspension">
                                Suspension
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Dose Amount & Unit */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label
                        htmlFor="dose"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                        Dose Amount
                    </Label>
                    <Input
                        id="dose"
                        type="number"
                        value={dose}
                        onChange={(e) => setDose(e.target.value)}
                        className="bg-card"
                        min={0}
                    />
                </div>
                <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Unit
                    </Label>
                    <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger className="bg-card">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="mcg">mcg</SelectItem>
                            <SelectItem value="mL">mL</SelectItem>
                            <SelectItem value="IU">IU</SelectItem>
                            <SelectItem value="unit">unit</SelectItem>
                            <SelectItem value="mmol">mmol</SelectItem>
                            <SelectItem value="tab">Tablet</SelectItem>
                            <SelectItem value="cap">Capsule</SelectItem>
                            <SelectItem value="puff">Puff</SelectItem>
                            <SelectItem value="drop">Drop</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Frequency & Duration */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Frequency
                    </Label>
                    <Select
                        value={frequency || "__none__"}
                        onValueChange={(v) =>
                            setFrequency(v === "__none__" ? "" : v)
                        }
                    >
                        <SelectTrigger className="bg-card">
                            <SelectValue placeholder="Not specified" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__none__">
                                Not specified
                            </SelectItem>
                            <SelectItem value="once a day">
                                Once a day
                            </SelectItem>
                            <SelectItem value="twice a day">
                                Twice a day
                            </SelectItem>
                            <SelectItem value="three times a day">
                                Three times a day
                            </SelectItem>
                            <SelectItem value="four times a day">
                                Four times a day
                            </SelectItem>
                            <SelectItem value="every 4 hours">
                                Every 4 hours
                            </SelectItem>
                            <SelectItem value="every 6 hours">
                                Every 6 hours
                            </SelectItem>
                            <SelectItem value="every 8 hours">
                                Every 8 hours
                            </SelectItem>
                            <SelectItem value="every 12 hours">
                                Every 12 hours
                            </SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Duration
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="—"
                            value={durationValue}
                            onChange={(e) => setDurationValue(e.target.value)}
                            className="bg-card flex-1"
                            min={0}
                        />
                        <Select
                            value={durationUnit}
                            onValueChange={setDurationUnit}
                        >
                            <SelectTrigger className="bg-card w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Day">Day</SelectItem>
                                <SelectItem value="Week">Week</SelectItem>
                                <SelectItem value="Month">Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Indication */}
            <div>
                <Label
                    htmlFor="indication"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block"
                >
                    Indication
                </Label>
                <Input
                    id="indication"
                    type="text"
                    placeholder="e.g. Pain, Infection, Hypertension..."
                    value={indication}
                    onChange={(e) => setIndication(e.target.value)}
                    className="bg-card"
                />
            </div>

            {/* Initial / Maintenance Dose flags */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                    <Checkbox
                        id="initialDose"
                        checked={initialDose}
                        onCheckedChange={(c) => setInitialDose(!!c)}
                    />
                    <Label
                        htmlFor="initialDose"
                        className="text-sm font-medium text-foreground cursor-pointer"
                    >
                        Initial Dose
                    </Label>
                </div>
                <div className="flex items-center gap-2.5">
                    <Checkbox
                        id="maintenanceDose"
                        checked={maintenanceDose}
                        onCheckedChange={(c) => setMaintenanceDose(!!c)}
                    />
                    <Label
                        htmlFor="maintenanceDose"
                        className="text-sm font-medium text-foreground cursor-pointer"
                    >
                        Maintenance Dose
                    </Label>
                </div>
            </div>
        </div>
    );
}
