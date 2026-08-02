"use client";

import Link from "next/link";
import { ArrowLeft, CalendarRange } from "lucide-react";
import { useAdminRentals } from "@/hooks/use-admin";
import { formatCurrency, formatDate } from "@/lib/format";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRentalsPage() {
  const { data: rentals, isLoading } = useAdminRentals();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">All Rentals</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every rental order across the platform.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : rentals && rentals.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Gear</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Dates</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{rental.customer?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {rental.customer?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">{rental.gearItem?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {rental.gearItem?.provider?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
                      </td>
                      <td className="px-4 py-3">
                        <RentalStatusBadge status={rental.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(rental.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No rentals yet"
            description="Rental orders placed by customers will appear here."
            icon={CalendarRange}
          />
        )}
      </div>
    </div>
  );
}
