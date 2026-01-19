import { useState } from "react";
import { z } from "zod";
import { Loader2, Rocket } from "lucide-react";

const formFields = [
  {
    label: "Campaign Objective",
    name: "objective",
    type: "text",
    placeholder: "e.g. Book 5 qualified discovery calls",
  },
  {
    label: "Target Profile",
    name: "target_profile",
    type: "text",
    placeholder: "e.g. Early-stage B2B SaaS (10–50 employees)",
  },
  {
    label: "Industry Keywords",
    name: "industry_keywords",
    type: "text",
    placeholder: "e.g. B2B SaaS",
  },
  {
    label: "Target Location",
    name: "location",
    type: "text",
    placeholder: "e.g. United States",
  },
  {
    label: "Decision Maker Roles",
    name: "role_keywords",
    type: "text",
    placeholder: "e.g. Founder, Head of Growth",
  },
  {
    label: "Minimum Prospect Score",
    name: "score_threshold",
    type: "number",
    placeholder: "e.g. 70",
  },
  {
    label: "Email Batch Size",
    name: "batch_size",
    type: "number",
    placeholder: "e.g. 5",
  },
] as const;

const campaignSchema = z.object({
  objective: z.string().trim().min(1, "Campaign objective is required").max(500),
  target_profile: z.string().trim().min(1, "Target profile is required").max(500),
  industry_keywords: z.string().trim().min(1, "Industry keywords are required").max(200),
  location: z.string().trim().min(1, "Target location is required").max(200),
  role_keywords: z.string().trim().min(1, "Decision maker roles are required").max(300),
  score_threshold: z.coerce.number().min(0, "Score must be 0 or higher").max(100, "Score cannot exceed 100"),
  batch_size: z.coerce.number().min(1, "Batch size must be at least 1").max(100, "Batch size cannot exceed 100"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => Promise<void>;
  isLoading: boolean;
}

export function CampaignForm({ onSubmit, isLoading }: CampaignFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    objective: "",
    target_profile: "",
    industry_keywords: "",
    location: "",
    role_keywords: "",
    score_threshold: "",
    batch_size: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = campaignSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(result.data);
  };

  const resetForm = () => {
    setFormData({
      objective: "",
      target_profile: "",
      industry_keywords: "",
      location: "",
      role_keywords: "",
      score_threshold: "",
      batch_size: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {formFields.map((field) => (
          <div
            key={field.name}
            className={field.name === "objective" || field.name === "target_profile" ? "md:col-span-2" : ""}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-foreground mb-2"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={isLoading}
              className={`
                w-full px-4 py-3 rounded-lg border bg-card text-foreground
                placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${errors[field.name] ? "border-destructive ring-2 ring-destructive/20" : "border-input"}
              `}
            />
            {errors[field.name] && (
              <p className="mt-1.5 text-sm text-destructive animate-fade-in">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-gradient flex-1 md:flex-none px-8 py-3 rounded-lg text-primary-foreground font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Launching Campaign...</span>
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              <span>Launch Campaign</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={resetForm}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg border border-input bg-card text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export type { CampaignFormData };
