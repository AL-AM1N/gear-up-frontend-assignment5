"use client";

import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Critical error</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Something went seriously wrong. You can try to recover by reloading
            the application.
          </p>
          <p className="sr-only">{error.message}</p>
          <Button
            className="mt-6"
            onClick={() => {
              reset();
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      </body>
    </html>
  );
}
