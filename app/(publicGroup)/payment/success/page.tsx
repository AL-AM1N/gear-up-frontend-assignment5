"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, LayoutDashboard, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
          <div className="mx-auto h-16 w-16 skeleton-premium rounded-full" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-10 text-center shadow-sm">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Payment successful!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for your payment. Your rental order has been confirmed and
          is ready for pickup.
        </p>
        {orderId && (
          <p className="mt-4 rounded-lg bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Order #{orderId.slice(0, 12)}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard/customer">
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gear">
              <ShoppingBag className="h-4 w-4" />
              Browse More Gear
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
