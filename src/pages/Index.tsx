import { useState, useCallback } from "react";
import { CampaignForm, type CampaignFormData } from "@/components/CampaignForm";
import { ResultsDisplay, ErrorDisplay } from "@/components/ResultsDisplay";
import { Zap, Target, Mail } from "lucide-react";

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
          // Flatten to string values for display
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Outbound Campaign Launcher</h1>
              <p className="text-sm text-muted-foreground">Powered by n8n Workflow Automation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Launch Your Outbound Campaign
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Define your target audience and let automation find prospects, score them, and draft personalized emails.
          </p>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-4 py-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Smart Targeting</h3>
              <p className="text-sm text-muted-foreground">AI-powered prospect discovery</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lead Scoring</h3>
              <p className="text-sm text-muted-foreground">Prioritize high-fit prospects</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email Drafts</h3>
              <p className="text-sm text-muted-foreground">Personalized outreach ready</p>
            </div>
          </div>
        </section>

        {/* Form Card */}
        <section className="card-elevated rounded-xl p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-1">Campaign Configuration</h3>
            <p className="text-muted-foreground">Fill in the details below to start your outbound campaign.</p>
          </div>
          <CampaignForm onSubmit={handleSubmit} isLoading={viewState === "loading"} />
        </section>

        {/* Results */}
        {viewState === "success" && (
          <section>
            <ResultsDisplay results={results} onRunAgain={handleRunAgain} />
          </section>
        )}

        {viewState === "error" && (
          <section>
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Built with n8n workflow automation
        </div>
      </footer>
    </div>
  );
};

export default Index;
