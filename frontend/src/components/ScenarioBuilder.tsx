import { useState, useEffect, useMemo } from "react";
import { PatientProfile } from "@/components/scenario/PatientProfile";
import { PrescribingDrug } from "@/components/scenario/PrescribingDrug";
import { ClinicalContext } from "@/components/scenario/ClinicalContext";
import { XmlPreview } from "@/components/scenario/XmlPreview";
import type { ComboboxOption } from "@/components/ComboboxSearch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    FlaskConical,
    Wifi,
    WifiOff,
    RotateCcw,
    Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
interface Drug {
    id: string;
    name: string;
    type: string;
}

interface HealthIssue {
    code: string;
    label: string;
}

// Sample data for demo (since the real data comes from a local API)
const SAMPLE_DRUGS: Drug[] = [
    { id: "DRUG001", name: "Amoxicillin 500mg Capsule", type: "GenericDrug" },
    { id: "DRUG002", name: "Ibuprofen 400mg Tablet", type: "GenericDrug" },
    { id: "DRUG003", name: "Metformin 850mg Tablet", type: "GenericDrug" },
    { id: "DRUG004", name: "Atorvastatin 20mg Tablet", type: "GenericDrug" },
    { id: "DRUG005", name: "Omeprazole 20mg Capsule", type: "GenericDrug" },
    { id: "DRUG006", name: "Lisinopril 10mg Tablet", type: "GenericDrug" },
    { id: "DRUG007", name: "Amlodipine 5mg Tablet", type: "GenericDrug" },
    { id: "DRUG008", name: "Ciprofloxacin 500mg Tablet", type: "GenericDrug" },
    { id: "DRUG009", name: "Warfarin 5mg Tablet", type: "GenericDrug" },
    { id: "DRUG010", name: "Aspirin 100mg Tablet", type: "GenericDrug" },
    { id: "DRUG011", name: "Paracetamol 500mg Tablet", type: "GenericDrug" },
    { id: "DRUG012", name: "Diclofenac 50mg Tablet", type: "GenericDrug" },
    { id: "DRUG013", name: "Simvastatin 40mg Tablet", type: "GenericDrug" },
    { id: "DRUG014", name: "Losartan 50mg Tablet", type: "GenericDrug" },
    { id: "DRUG015", name: "Furosemide 40mg Tablet", type: "GenericDrug" },
    { id: "BRAND001", name: "Augmentin 625mg", type: "BrandDrug" },
    { id: "BRAND002", name: "Lipitor 20mg", type: "BrandDrug" },
    { id: "BRAND003", name: "Norvasc 5mg", type: "BrandDrug" },
    { id: "BRAND004", name: "Glucophage 850mg", type: "BrandDrug" },
    { id: "BRAND005", name: "Nexium 40mg", type: "BrandDrug" },
];

const SAMPLE_HEALTH_ISSUES: HealthIssue[] = [
    { code: "E11", label: "Type 2 diabetes mellitus" },
    { code: "I10", label: "Essential hypertension" },
    { code: "J06.9", label: "Acute upper respiratory infection" },
    { code: "E78.5", label: "Hyperlipidemia, unspecified" },
    { code: "K21.0", label: "Gastro-esophageal reflux disease" },
    { code: "M54.5", label: "Low back pain" },
    { code: "J45.9", label: "Asthma, unspecified" },
    { code: "N39.0", label: "Urinary tract infection" },
    { code: "I25.1", label: "Atherosclerotic heart disease" },
    { code: "K29.7", label: "Gastritis, unspecified" },
    { code: "N18.3", label: "Chronic kidney disease, stage 3" },
    { code: "I48.91", label: "Atrial fibrillation, unspecified" },
    { code: "G43.9", label: "Migraine, unspecified" },
    { code: "F32.1", label: "Major depressive disorder, moderate" },
    { code: "E03.9", label: "Hypothyroidism, unspecified" },
];

export default function ScenarioBuilder() {
    // --- Data State ---
    const [drugs, setDrugs] = useState<Drug[]>(SAMPLE_DRUGS);
    const [healthIssues, setHealthIssues] =
        useState<HealthIssue[]>(SAMPLE_HEALTH_ISSUES);
    const [loading, setLoading] = useState(false);
    const [apiConnected, setApiConnected] = useState(false);

    // --- Form State: Patient Profile ---
    const [gender, setGender] = useState("F");
    const [age, setAge] = useState("30");
    const [weight, setWeight] = useState("60");
    const [height, setHeight] = useState("");
    const [bsa, setBsa] = useState("");
    const [pregMonth, setPregMonth] = useState("");
    const [nursing, setNursing] = useState(false);

    // --- Form State: Prescribing Drug ---
    const [prescribingDrug, setPrescribingDrug] = useState<Drug | null>(null);
    const [dose, setDose] = useState("100");
    const [unit, setUnit] = useState("mg");
    const [route, setRoute] = useState("");
    const [form, setForm] = useState("");
    const [frequency, setFrequency] = useState("");
    const [durationValue, setDurationValue] = useState("");
    const [durationUnit, setDurationUnit] = useState("Day");
    const [indication, setIndication] = useState("");
    const [initialDose, setInitialDose] = useState(false);
    const [maintenanceDose, setMaintenanceDose] = useState(false);

    // --- Form State: Clinical Context ---
    const [selectedHealthIssues, setSelectedHealthIssues] = useState<
        HealthIssue[]
    >([]);
    const [selectedPrescribedDrugs, setSelectedPrescribedDrugs] = useState<
        Drug[]
    >([]);
    const [selectedAllergies, setSelectedAllergies] = useState<Drug[]>([]);

    // --- Form State: Interaction Flags ---
    const [includeReferences, setIncludeReferences] = useState(true);
    const [includeCautionaryLabels, setIncludeCautionaryLabels] =
        useState(true);
    const [duplicateTherapy, setDuplicateTherapy] = useState(false);
    const [duplicateIngredient, setDuplicateIngredient] = useState(false);

    // --- Output State ---
    const [xmlOutput, setXmlOutput] = useState("");
    const [endpoint] = useState(
        "http://49.249.193.198:8081/RESTFTWebService/FTRequest/xmlrequestplus",
    );

    // --- Try to load remote data (via Vite proxy -> FastAPI) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check API health first
                const healthRes = await fetch("/api/health");
                if (!healthRes.ok) throw new Error("API not reachable");

                const [dRes, hRes] = await Promise.all([
                    fetch("/Scripts/drugs.json"),
                    fetch("/Scripts/health_issues.json"),
                ]);
                const dData = await dRes.json();
                const hData = await hRes.json();
                setDrugs(dData);
                setHealthIssues(hData);
                setApiConnected(true);
            } catch {
                setApiConnected(false);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- XML Generation ---
    useEffect(() => {
        // -- PatientProfile --
        let patientXml = `  <PatientProfile>\n    <Gender>${gender}</Gender>\n    <Age><Year>${age}</Year></Age>\n    <Weight>${weight}</Weight>\n`;
        if (height) patientXml += `    <Height>${height}</Height>\n`;
        if (bsa) patientXml += `    <BSA>${bsa}</BSA>\n`;
        if (gender === "F") {
            if (pregMonth)
                patientXml += `    <Pregnancy><Month>${pregMonth}</Month></Pregnancy>\n`;
            if (nursing) patientXml += `    <Nursing>true</Nursing>\n`;
        }
        patientXml += `  </PatientProfile>`;

        // -- Interaction --
        let interactionXml = "  <Interaction>\n";

        // Prescribing drug with RouteOfAdministration, Form, and full Dosing block
        if (prescribingDrug) {
            let drugChildren = "";
            if (route)
                drugChildren += `        <RouteOfAdministration name="${route}" />\n`;
            if (form) drugChildren += `        <Form name="${form}" />\n`;

            // Dosing block
            let dosingInner = "";
            if (initialDose)
                dosingInner += `          <InitialDose>true</InitialDose>\n`;
            if (maintenanceDose)
                dosingInner += `          <MaintenanceDose>true</MaintenanceDose>\n`;
            dosingInner += `          <Dose><Value>${dose}</Value><Unit>${unit}</Unit></Dose>\n`;
            if (frequency)
                dosingInner += `          <Frequency name="${frequency}" />\n`;
            if (indication)
                dosingInner += `          <Indications>\n            <Indication name="${indication}" />\n          </Indications>\n`;
            if (durationValue)
                dosingInner += `          <Duration><${durationUnit}>${durationValue}</${durationUnit}></Duration>\n`;

            drugChildren += `        <Dosing>\n${dosingInner}        </Dosing>\n`;

            interactionXml += `    <Prescribing>\n      <${prescribingDrug.type} reference="${prescribingDrug.id}">\n${drugChildren}      </${prescribingDrug.type}>\n    </Prescribing>\n`;
        } else {
            interactionXml +=
                "    <Prescribing>\n      <!-- Select a drug -->\n    </Prescribing>\n";
        }

        // Prescribed drugs
        if (selectedPrescribedDrugs.length > 0) {
            interactionXml += "    <Prescribed>\n";
            selectedPrescribedDrugs.forEach((d) => {
                interactionXml += `      <${d.type} reference="${d.id}" />\n`;
            });
            interactionXml += "    </Prescribed>\n";
        }

        // Health Issue Codes
        if (selectedHealthIssues.length > 0) {
            interactionXml += "    <HealthIssueCodes>\n";
            selectedHealthIssues.forEach((h) => {
                interactionXml += `      <HealthIssueCode code="${h.code}" codeType="ICD10" />\n`;
            });
            interactionXml += "    </HealthIssueCodes>\n";
        }

        // Allergies
        if (selectedAllergies.length > 0) {
            interactionXml += "    <Allergies>\n";
            selectedAllergies.forEach((d) => {
                interactionXml += `      <${d.type} reference="${d.id}" />\n`;
            });
            interactionXml += "    </Allergies>\n";
        }

        // Interaction flags
        if (includeReferences) interactionXml += "    <References />\n";
        if (includeCautionaryLabels)
            interactionXml += "    <CautionaryLabels />\n";
        if (duplicateTherapy) interactionXml += "    <DuplicateTherapy />\n";
        if (duplicateIngredient)
            interactionXml += "    <DuplicateIngredient />\n";

        interactionXml += "  </Interaction>";

        setXmlOutput(`<Request>\n${interactionXml}\n${patientXml}\n</Request>`);
    }, [
        gender,
        age,
        weight,
        height,
        bsa,
        pregMonth,
        nursing,
        prescribingDrug,
        dose,
        unit,
        route,
        form,
        frequency,
        durationValue,
        durationUnit,
        indication,
        initialDose,
        maintenanceDose,
        selectedHealthIssues,
        selectedPrescribedDrugs,
        selectedAllergies,
        includeReferences,
        includeCautionaryLabels,
        duplicateTherapy,
        duplicateIngredient,
    ]);

    const handleRun = async () => {
        const formData = new URLSearchParams();
        formData.append("endpoint", endpoint);
        formData.append("prescription_query", xmlOutput);
        formData.append("alert_filter_by_drug", "");
        formData.append("alert_filter_by_severity", "");

        try {
            const res = await fetch("/api/consume", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });
            const data = await res.json();

            if (data.error && !data.html_content) {
                alert(data.error);
            } else {
                window.open("/response-html");
            }
        } catch {
            alert(
                "Could not reach the FastAPI backend. Make sure it is running with: uvicorn main:app --reload",
            );
        }
    };

    // --- Reset ---
    const handleReset = () => {
        setGender("F");
        setAge("30");
        setWeight("60");
        setHeight("");
        setBsa("");
        setPregMonth("");
        setNursing(false);
        setPrescribingDrug(null);
        setDose("100");
        setUnit("mg");
        setRoute("");
        setForm("");
        setFrequency("");
        setDurationValue("");
        setDurationUnit("Day");
        setIndication("");
        setInitialDose(false);
        setMaintenanceDose(false);
        setSelectedHealthIssues([]);
        setSelectedPrescribedDrugs([]);
        setSelectedAllergies([]);
        setIncludeReferences(true);
        setIncludeCautionaryLabels(true);
        setDuplicateTherapy(false);
        setDuplicateIngredient(false);
    };

    // --- Combobox Options ---
    const drugOptions: ComboboxOption[] = useMemo(
        () =>
            drugs.map((d) => ({
                value: d.id,
                label: d.name,
                data: d as unknown as Record<string, unknown>,
            })),
        [drugs],
    );

    const healthOptions: ComboboxOption[] = useMemo(
        () =>
            healthIssues.map((h) => ({
                value: h.code,
                label: `${h.code} — ${h.label}`,
                data: h as unknown as Record<string, unknown>,
            })),
        [healthIssues],
    );

    const activeCount =
        (prescribingDrug ? 1 : 0) +
        selectedPrescribedDrugs.length +
        selectedHealthIssues.length +
        selectedAllergies.length;

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden relative">
            {/* Header */}
            <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
                        <FlaskConical className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-foreground tracking-tight">
                            MIMS Test Lab
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Drug Interaction Scenario Builder
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant="outline"
                        className={
                            apiConnected
                                ? "text-[hsl(var(--success))] border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 gap-1.5"
                                : "text-muted-foreground border-border gap-1.5"
                        }
                    >
                        {apiConnected ? (
                            <Wifi className="h-3 w-3" />
                        ) : (
                            <WifiOff className="h-3 w-3" />
                        )}
                        {apiConnected ? "API Connected" : "Demo Mode"}
                    </Badge>

                    {activeCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="gap-1 tabular-nums"
                        >
                            {activeCount} active
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 px-2.5 text-xs text-muted-foreground"
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Reset
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 min-h-0">
                {/* Left Panel: Builder */}
                <div className="overflow-y-auto border-r border-border">
                    <div className="p-6 space-y-6">
                        {/* Step 1: Patient Profile */}
                        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                            <PatientProfile
                                gender={gender}
                                setGender={setGender}
                                age={age}
                                setAge={setAge}
                                weight={weight}
                                setWeight={setWeight}
                                height={height}
                                setHeight={setHeight}
                                bsa={bsa}
                                setBsa={setBsa}
                                pregMonth={pregMonth}
                                setPregMonth={setPregMonth}
                                nursing={nursing}
                                setNursing={setNursing}
                            />
                        </div>

                        {/* Step 2: Prescribing Drug */}
                        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                            <PrescribingDrug
                                drugOptions={drugOptions}
                                prescribingDrug={prescribingDrug}
                                setPrescribingDrug={setPrescribingDrug}
                                dose={dose}
                                setDose={setDose}
                                unit={unit}
                                setUnit={setUnit}
                                route={route}
                                setRoute={setRoute}
                                form={form}
                                setForm={setForm}
                                frequency={frequency}
                                setFrequency={setFrequency}
                                durationValue={durationValue}
                                setDurationValue={setDurationValue}
                                durationUnit={durationUnit}
                                setDurationUnit={setDurationUnit}
                                indication={indication}
                                setIndication={setIndication}
                                initialDose={initialDose}
                                setInitialDose={setInitialDose}
                                maintenanceDose={maintenanceDose}
                                setMaintenanceDose={setMaintenanceDose}
                            />
                        </div>

                        {/* Step 3: Clinical Context */}
                        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                            <ClinicalContext
                                healthOptions={healthOptions}
                                drugOptions={drugOptions}
                                selectedHealthIssues={selectedHealthIssues}
                                setSelectedHealthIssues={
                                    setSelectedHealthIssues
                                }
                                selectedPrescribedDrugs={
                                    selectedPrescribedDrugs
                                }
                                setSelectedPrescribedDrugs={
                                    setSelectedPrescribedDrugs
                                }
                                selectedAllergies={selectedAllergies}
                                setSelectedAllergies={setSelectedAllergies}
                            />
                        </div>

                        {/* Step 4: Interaction Options */}
                        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-accent">
                                    <Settings2 className="h-4 w-4 text-accent-foreground" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                                    Interaction Options
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="references"
                                        checked={includeReferences}
                                        onCheckedChange={(c) =>
                                            setIncludeReferences(!!c)
                                        }
                                    />
                                    <Label
                                        htmlFor="references"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Include References
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="cautionaryLabels"
                                        checked={includeCautionaryLabels}
                                        onCheckedChange={(c) =>
                                            setIncludeCautionaryLabels(!!c)
                                        }
                                    />
                                    <Label
                                        htmlFor="cautionaryLabels"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Cautionary Labels
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="dupTherapy"
                                        checked={duplicateTherapy}
                                        onCheckedChange={(c) =>
                                            setDuplicateTherapy(!!c)
                                        }
                                    />
                                    <Label
                                        htmlFor="dupTherapy"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Duplicate Therapy
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="dupIngredient"
                                        checked={duplicateIngredient}
                                        onCheckedChange={(c) =>
                                            setDuplicateIngredient(!!c)
                                        }
                                    />
                                    <Label
                                        htmlFor="dupIngredient"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Duplicate Ingredient
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Endpoint info */}
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                                Target Endpoint
                            </p>
                            <code className="text-xs font-mono text-foreground break-all leading-relaxed">
                                {endpoint}
                            </code>
                        </div>
                    </div>
                </div>

                {/* Right Panel: XML Preview & Response */}
                <div className="p-4 min-h-0 flex flex-col overflow-hidden">
                    <div className="flex-1 min-h-0 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <XmlPreview
                            xmlOutput={xmlOutput}
                            setXmlOutput={setXmlOutput}
                            onRun={handleRun}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
