import { ExternalLink, RotateCcw, AlertCircle } from "lucide-react";

interface ResultsDisplayProps {
  results: Record<string, string> | null;
  onRunAgain: () => void;
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return value.startsWith("http://") || value.startsWith("https://");
  } catch {
    return false;
  }
}

export function ResultsDisplay({ results, onRunAgain }: ResultsDisplayProps) {
  const isEmpty = !results || Object.keys(results).length === 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 container-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-medium text-foreground">Results</h3>
        <button
          onClick={onRunAgain}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Run again
        </button>
      </div>

      {isEmpty ? (
        <p className="text-sm text-muted-foreground">No data returned</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {formatKey(key)}
              </span>
              {isUrl(value) ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1.5 break-all"
                >
                  {value}
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              ) : (
                <p className="text-sm text-foreground">{value}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-card border border-destructive/30 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground mb-1">
            Request Failed
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm px-4 py-2 rounded-md border border-border text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
