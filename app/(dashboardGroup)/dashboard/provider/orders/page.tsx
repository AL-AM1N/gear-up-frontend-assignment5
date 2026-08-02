"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, CheckCheck, CircleCheckBig, HandPlatter } from "lucide-react";
import { useProviderOrders, useUpdateOrderStatus } from "@/hooks/use-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { IRentalOrder, IRentalStatus } from "@/lib/types";

export default function ProviderOrdersPage() {
  const { data: orders, isLoading } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStatus = async (order: IRentalOrder, status: IRentalStatus) => {
    setBusyId(order.id);
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success(`Order marked as ${status.toLowerCase().replace(/_/g, " ")}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update the order.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/provider">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Incoming Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the rental orders placed for your gear.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {order.gearItem?.name ?? "Gear item"}
                      </p>
                      <RentalStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Rented by{" "}
                      <span className="font-medium text-foreground">
                        {order.customer?.name ?? "a customer"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(order.startDate)} → {formatDate(order.endDate)} ·{" "}
                      {order.quantity} item{order.quantity > 1 ? "s" : ""} ·{" "}
                      {formatCurrency(order.totalAmount)} · Order #
                      {order.id.slice(0, 10)}
                    </p>
                  </div>

                  <OrderActions
                    status={order.status}
                    busy={busyId === order.id}
                    onConfirm={() => handleStatus(order, "CONFIRMED")}
                    onPickedUp={() => handleStatus(order, "PICKED_UP")}
                    onReturned={() => handleStatus(order, "RETURNED")}
                    onCancel={() => handleStatus(order, "CANCELLED")}
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders yet"
            description="When customers rent your gear, their orders will appear here."
          />
        )}
      </div>
    </div>
  );
}

function OrderActions({
  status,
  busy,
  onConfirm,
  onPickedUp,
  onReturned,
  onCancel,
}: {
  status: IRentalStatus;
  busy: boolean;
  onConfirm: () => void;
  onPickedUp: () => void;
  onReturned: () => void;
  onCancel: () => void;
}) {
  if (status === "PLACED") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" loading={busy} onClick={onConfirm}>
          <CheckCheck className="h-4 w-4" />
          Confirm Order
        </Button>
        <Button size="sm" variant="outline" loading={busy} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" disabled>
          Awaiting customer payment
        </Button>
        <Button size="sm" variant="outline" loading={busy} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  if (status === "PAID") {
    return (
      <Button size="sm" loading={busy} onClick={onPickedUp}>
        <HandPlatter className="h-4 w-4" />
        Mark Picked Up
      </Button>
    );
  }

  if (status === "PICKED_UP") {
    return (
      <Button size="sm" loading={busy} onClick={onReturned}>
        <CircleCheckBig className="h-4 w-4" />
        Mark Returned
      </Button>
    );
  }

  return <p className="text-xs text-muted-foreground">No actions available</p>;
}
