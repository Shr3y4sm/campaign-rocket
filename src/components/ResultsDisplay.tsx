import { CheckCircle2, ExternalLink, RefreshCw, AlertCircle, Info } from "lucide-react";

interface ResultsDisplayProps {
  results: Record<string, string> | null;
  onRunAgain: () => void;
}

export function ResultsDisplay({ results, onRunAgain }: ResultsDisplayProps) {
  if (!results) return null;

  const entries = Object.entries(results);
  const isEmpty = entries.length === 0;

  const isUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusIcon = (key: string, value: string) => {
    if (key.toLowerCase() === "status" && value.toLowerCase() === "success") {
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    }
    return null;
  };

  if (isEmpty) {
    return (
      <div className="card-elevated rounded-xl p-8 text-center animate-slide-up">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <Info className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Data Returned</h3>
        <p className="text-muted-foreground mb-6">
          The workflow completed but didn't return any data.
        </p>
        <button
          onClick={onRunAgain}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-input bg-card text-foreground font-medium hover:bg-secondary transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Run Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-elevated rounded-xl overflow-hidden animate-slide-up">
      <div className="px-6 py-4 border-b border-border bg-success/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Campaign Launched Successfully</h3>
            <p className="text-sm text-muted-foreground">Your outbound campaign is now running</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <div className="flex items-center gap-2 sm:w-1/3">
              {getStatusIcon(key, value)}
              <span className="text-sm font-medium text-muted-foreground">
                {formatKey(key)}
              </span>
            </div>
            <div className="sm:w-2/3">
              {isUrl(value) ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline break-all"
                >
                  <span>{value}</span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
              ) : (
                <span className="text-foreground">{value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-muted/30 border-t border-border">
        <button
          onClick={onRunAgain}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-input bg-card text-foreground font-medium hover:bg-secondary transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Run Another Campaign
        </button>
      </div>
    </div>
  );
}

export function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="card-elevated rounded-xl p-8 text-center animate-slide-up border border-destructive/20 bg-destructive/5">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Something Went Wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
