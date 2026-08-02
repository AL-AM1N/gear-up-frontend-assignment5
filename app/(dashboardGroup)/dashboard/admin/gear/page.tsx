"use client";

import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { useAdminGear } from "@/hooks/use-admin";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGearPage() {
  const { data: gear, isLoading } = useAdminGear();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">All Gear</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every gear item listed on the platform.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : gear && gear.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Gear</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gear.map((item) => (
                    <tr key={item.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <Link
                          href={`/gear/${item.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {item.brand}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">
                          {item.category?.name ?? "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.provider?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatCurrency(item.pricePerDay)}
                        <span className="text-xs font-normal text-muted-foreground">
                          /day
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        {item.isAvailable ? (
                          <Badge variant="success">Available</Badge>
                        ) : (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No gear listed"
            description="No gear items have been listed on the platform yet."
            icon={PackageSearch}
          />
        )}
      </div>
    </div>
  );
}
