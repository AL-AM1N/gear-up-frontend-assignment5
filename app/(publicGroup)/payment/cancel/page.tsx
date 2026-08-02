"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-10 text-center shadow-sm">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <XCircle className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Payment cancelled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was cancelled. Your order is still active — you can try
          again whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard/customer">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gear">Browse Gear</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
