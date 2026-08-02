import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "primary" | "emerald" | "blue" | "amber" | "violet";
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            accentMap[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
