import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientProfileProps {
    gender: string;
    setGender: (v: string) => void;
    age: string;
    setAge: (v: string) => void;
    weight: string;
    setWeight: (v: string) => void;
    height: string;
    setHeight: (v: string) => void;
    bsa: string;
    setBsa: (v: string) => void;
    pregMonth: string;
    setPregMonth: (v: string) => void;
    nursing: boolean;
    setNursing: (v: boolean) => void;
}

export function PatientProfile({
    gender,
    setGender,
    age,
    setAge,
    weight,
    setWeight,
    height,
    setHeight,
    bsa,
    setBsa,
    pregMonth,
    setPregMonth,
    nursing,
    setNursing,
}: PatientProfileProps) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-accent">
                    <User className="h-4 w-4 text-accent-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    Patient Profile
                </h3>
            </div>

            {/* Gender Selector */}
            <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Gender
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setGender("F")}
                        className={cn(
                            "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                            gender === "F"
                                ? "border-primary bg-accent text-accent-foreground shadow-sm"
                                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-accent/50",
                        )}
                    >
                        <span>Female</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setGender("M")}
                        className={cn(
                            "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                            gender === "M"
                                ? "border-primary bg-accent text-accent-foreground shadow-sm"
                                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-accent/50",
                        )}
                    >
                        <span>Male</span>
                    </button>
                </div>
            </div>

            {/* Age & Weight */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label
                        htmlFor="age"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                        Age (Years)
                    </Label>
                    <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="bg-card"
                        min={0}
                        max={120}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="weight"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                        Weight (kg)
                    </Label>
                    <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="bg-card"
                        min={0}
                    />
                </div>
            </div>

            {/* Height & BSA */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label
                        htmlFor="height"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                        Height (cm)
                    </Label>
                    <Input
                        id="height"
                        type="number"
                        placeholder="Optional"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="bg-card"
                        min={0}
                        max={300}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="bsa"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                        BSA (m²)
                    </Label>
                    <Input
                        id="bsa"
                        type="number"
                        placeholder="Optional"
                        value={bsa}
                        onChange={(e) => setBsa(e.target.value)}
                        className="bg-card"
                        min={0}
                        step={0.01}
                    />
                </div>
            </div>

            {/* Female-specific fields */}
            {gender === "F" && (
                <div className="rounded-lg border border-primary/20 bg-accent/60 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 text-accent-foreground">
                        <Baby className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Maternal Status
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label
                                htmlFor="preg-month"
                                className="text-xs font-medium text-muted-foreground mb-1.5 block"
                            >
                                Pregnancy Month
                            </Label>
                            <Input
                                id="preg-month"
                                type="number"
                                placeholder="1-9"
                                className="bg-card"
                                value={pregMonth}
                                min={0}
                                max={9}
                                onChange={(e) => setPregMonth(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end pb-2">
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="nursing"
                                    checked={nursing}
                                    onCheckedChange={(c) => setNursing(!!c)}
                                />
                                <Label
                                    htmlFor="nursing"
                                    className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                    Nursing / Lactating
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
