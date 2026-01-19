import { useState, useCallback } from "react";
import { CampaignForm, type CampaignFormData } from "@/components/CampaignForm";
import { ResultsDisplay, ErrorDisplay } from "@/components/ResultsDisplay";

const WEBHOOK_URL = "https://slashingly-unprecedented-mae.ngrok-free.dev/webhook/outbound-campaign";

type ViewState = "idle" | "loading" | "success" | "error";

const Index = () => {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = useCallback(async (data: CampaignFormData) => {
    setViewState("loading");
    setError("");
    setResults(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const text = await response.text();
      
      if (!text.trim()) {
        setResults({});
        setViewState("success");
        return;
      }

      try {
        const json = JSON.parse(text);
        if (typeof json === "object" && json !== null && !Array.isArray(json)) {
          const flatResults: Record<string, string> = {};
          Object.entries(json).forEach(([key, value]) => {
            flatResults[key] = String(value);
          });
          setResults(flatResults);
          setViewState("success");
        } else {
          throw new Error("Unexpected response format");
        }
      } catch {
        throw new Error("Invalid JSON response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setViewState("error");
    }
  }, []);

  const handleRunAgain = useCallback(() => {
    setViewState("idle");
    setResults(null);
    setError("");
  }, []);

  const handleRetry = useCallback(() => {
    setViewState("idle");
    setError("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <span className="text-sm font-medium text-foreground">Outbound Campaign</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Main Container */}
        <div className="bg-card border border-border rounded-lg container-shadow p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Launch Campaign
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure targeting parameters to generate personalized outreach.
            </p>
          </div>

          {/* Form */}
          <CampaignForm onSubmit={handleSubmit} isLoading={viewState === "loading"} />
        </div>

        {/* Results */}
        {viewState === "success" && (
          <div className="mt-6">
            <ResultsDisplay results={results} onRunAgain={handleRunAgain} />
          </div>
        )}

        {viewState === "error" && (
          <div className="mt-6">
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
