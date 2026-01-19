import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const formFields = [
  {
    label: "Campaign Objective",
    name: "objective",
    type: "text",
    placeholder: "Book 5 qualified discovery calls",
  },
  {
    label: "Target Profile",
    name: "target_profile",
    type: "text",
    placeholder: "Early-stage B2B SaaS (10–50 employees)",
  },
  {
    label: "Industry Keywords",
    name: "industry_keywords",
    type: "text",
    placeholder: "B2B SaaS",
  },
  {
    label: "Target Location",
    name: "location",
    type: "text",
    placeholder: "United States",
  },
  {
    label: "Decision Maker Roles",
    name: "role_keywords",
    type: "text",
    placeholder: "Founder, Head of Growth",
  },
  {
    label: "Minimum Prospect Score",
    name: "score_threshold",
    type: "number",
    placeholder: "70",
  },
  {
    label: "Email Batch Size",
    name: "batch_size",
    type: "number",
    placeholder: "5",
  },
] as const;

const campaignSchema = z.object({
  objective: z.string().trim().min(1, "Required").max(500),
  target_profile: z.string().trim().min(1, "Required").max(500),
  industry_keywords: z.string().trim().min(1, "Required").max(200),
  location: z.string().trim().min(1, "Required").max(200),
  role_keywords: z.string().trim().min(1, "Required").max(300),
  score_threshold: z.coerce.number().min(0, "Min 0").max(100, "Max 100"),
  batch_size: z.coerce.number().min(1, "Min 1").max(100, "Max 100"),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formFields.map((field) => (
        <div key={field.name}>
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
              w-full px-4 py-3 rounded-md border bg-background text-foreground
              placeholder:text-muted-foreground
              focus:outline-none focus:border-primary input-glow
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${errors[field.name] ? "border-destructive" : "border-border"}
            `}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-destructive">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium btn-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <span>Launch Campaign</span>
          )}
        </button>
      </div>
    </form>
  );
}

export type { CampaignFormData };
