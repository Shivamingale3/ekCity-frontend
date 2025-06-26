;

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

interface PasswordCriteria {
  label: string;
  validator: (password: string) => boolean;
  met: boolean;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [criteria, setCriteria] = useState<PasswordCriteria[]>([
    {
      label: "6-15 chars",
      validator: (p) => p.length >= 6 && p.length <= 15,
      met: false,
    },
    {
      label: "1 uppercase",
      validator: (p) => /[A-Z]/.test(p),
      met: false,
    },
    {
      label: "1 lowercase",
      validator: (p) => /[a-z]/.test(p),
      met: false,
    },
    {
      label: "1 number",
      validator: (p) => /\d/.test(p),
      met: false,
    },
    {
      label: "1 special",
      validator: (p) =>
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(p) &&
        (p.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g) || []).length === 1,
      met: false,
    },
  ]);

  useEffect(() => {
    setCriteria((prev) =>
      prev.map((criterion) => ({
        ...criterion,
        met: criterion.validator(password),
      }))
    );
  }, [password]);

  const strengthPercentage = Math.round(
    (criteria.filter((c) => c.met).length / criteria.length) * 100
  );

  const getStrengthColor = () => {
    if (strengthPercentage < 40) return "bg-destructive";
    if (strengthPercentage < 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all", getStrengthColor())}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>

      <ul className="flex flex-wrap justify-between items-center text-xs">
        {criteria.map((criterion, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center space-x-1 whitespace-nowrap",
              criterion.met
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "h-1 w-1 rounded-full flex-shrink-0",
                criterion.met
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-muted-foreground"
              )}
            />
            <span>{criterion.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
