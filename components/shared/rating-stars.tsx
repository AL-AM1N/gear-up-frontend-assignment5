"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export function RatingStars({
  value,
  onChange,
  readonly = false,
  size = 18,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);

  const display = readonly ? value : hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(display);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange?.(star)}
            className={cn(
              "transition-colors",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default",
            )}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-300 dark:fill-slate-600 dark:text-slate-600",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
