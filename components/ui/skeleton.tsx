import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton-premium overflow-hidden rounded-md", className)}
    />
  );
}

export { Skeleton };
