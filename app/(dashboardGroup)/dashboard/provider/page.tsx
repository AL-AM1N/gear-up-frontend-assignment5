"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CircleDollarSign,
  Clock,
  ImageIcon,
  Package,
  Plus,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";
import { useProviderGear, useDeleteGear, useProviderOrders } from "@/hooks/use-provider";
import { useAuth } from "@/app/providers/AuthProvider";
import { formatCurrency } from "@/lib/format";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { data: gear, isLoading: gearLoading } = useProviderGear();
  const { data: orders, isLoading: ordersLoading } = useProviderOrders();
  const deleteGear = useDeleteGear();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const availableCount = gear?.filter((g) => g.isAvailable).length ?? 0;
  const pendingOrders =
    orders?.filter((o) => ["PLACED", "CONFIRMED", "PAID"].includes(o.status)) ?? [];
  const expectedEarnings =
    orders
      ?.filter((o) => ["CONFIRMED", "PAID", "PICKED_UP", "RETURNED"].includes(o.status))
      .reduce((sum, o) => sum + o.totalAmount, 0) ?? 0;

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from your inventory?`)) return;
    setDeletingId(id);
    try {
      await deleteGear.mutateAsync(id);
      toast.success("Gear removed from inventory.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete gear.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}. Manage your
            gear and incoming orders.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/provider/orders">
              <Clock className="h-4 w-4" />
              Orders
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/provider/gear/new">
              <Plus className="h-4 w-4" />
              Add Gear
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Listed Items" value={gear?.length ?? 0} icon={Package} accent="primary" />
        <StatCard label="Available" value={availableCount} icon={Wallet} accent="emerald" />
        <StatCard label="Active Orders" value={pendingOrders.length} icon={Clock} accent="amber" />
        <StatCard label="Expected Earnings" value={formatCurrency(expectedEarnings)} icon={CircleDollarSign} accent="violet" />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">My Inventory</h2>
        <div className="mt-4">
          {gearLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))}
            </div>
          ) : gear && gear.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gear.map((item) => (
                <Card key={item.id} className="flex flex-col overflow-hidden">
                  <div className="relative flex h-36 items-center justify-center bg-muted/60 text-muted-foreground">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10" />
                    )}
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge variant="secondary" className="bg-white/90 dark:bg-white/10 backdrop-blur">
                        {item.category?.name ?? "Gear"}
                      </Badge>
                      {item.isAvailable ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="destructive">Hidden</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.brand} · {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-primary">
                        {formatCurrency(item.pricePerDay)}
                        <span className="text-xs font-normal text-muted-foreground">/day</span>
                      </p>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-auto flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/dashboard/provider/gear/${item.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        loading={deletingId === item.id}
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No gear listed yet"
              description="Add your first item so customers can start renting from you."
              action={
                <Button asChild>
                  <Link href="/dashboard/provider/gear/new">
                    <Plus className="h-4 w-4" />
                    Add Gear
                  </Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent Orders</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/provider/orders">View all</Link>
          </Button>
        </div>
        <div className="mt-4">
          {ordersLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : orders && orders.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Gear</th>
                      <th className="px-4 py-3 font-medium">Dates</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3">{order.customer?.name ?? "Customer"}</td>
                        <td className="px-4 py-3">{order.gearItem?.name ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {order.startDate.slice(0, 10)} → {order.endDate.slice(0, 10)}
                        </td>
                        <td className="px-4 py-3">
                          <RentalStatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No orders yet"
              description="When customers rent your gear, their orders will show up here."
            />
          )}
        </div>
      </section>
    </div>
  );
}
