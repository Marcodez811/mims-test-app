import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Code2, Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface XmlPreviewProps {
    xmlOutput: string;
    setXmlOutput: (v: string) => void;
    onRun: () => Promise<void>;
    loading: boolean;
}

export function XmlPreview({
    xmlOutput,
    setXmlOutput,
    onRun,
    loading,
}: XmlPreviewProps) {
    const [copied, setCopied] = useState(false);
    const [running, setRunning] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(xmlOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRun = async () => {
        setRunning(true);
        try {
            await onRun();
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5 rounded-t-lg">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Code2 className="h-3.5 w-3.5" />
                    XML Request
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-7 px-2.5 text-xs text-muted-foreground"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 mr-1" />
                        ) : (
                            <Copy className="h-3.5 w-3.5 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleRun}
                        disabled={loading || running}
                        className="h-7 px-3 text-xs font-semibold"
                    >
                        {running ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                            <Play className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Execute
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-foreground rounded-b-lg relative">
                <Textarea
                    value={xmlOutput}
                    onChange={(e) => setXmlOutput(e.target.value)}
                    className="w-full h-full bg-transparent text-[hsl(160,60%,65%)] font-mono text-xs border-0 resize-none p-4 focus-visible:ring-0 leading-relaxed rounded-b-lg"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
