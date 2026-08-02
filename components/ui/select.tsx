import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.ComponentProps<"select"> {
  placeholder?: string;
}

function Select({ className, placeholder, children, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-10 w-full appearance-none rounded-md border border-border bg-background/50 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
}

export { Select };
