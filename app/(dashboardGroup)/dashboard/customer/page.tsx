"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  PackageOpen,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useMyPayments, useMyRentals } from "@/hooks/use-customer";
import { useAuth } from "@/app/providers/AuthProvider";
import { formatCurrency, formatDate } from "@/lib/format";
import { RentalStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewModal } from "@/app/(dashboardGroup)/_components/review-modal";
import type { IRentalOrder } from "@/lib/types";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { data: rentals, isLoading: rentalsLoading } = useMyRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();

  const activeRentals =
    rentals?.filter((r) => ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(r.status)) ?? [];
  const returnedRentals =
    rentals?.filter((r) => r.status === "RETURNED") ?? [];
  const totalSpent =
    payments
      ?.filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const pendingPayment =
    payments?.filter((p) => p.status === "PENDING").length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your rentals, make payments, and leave reviews.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Rentals"
          value={activeRentals.length}
          icon={CalendarCheck}
          accent="primary"
        />
        <StatCard
          label="Completed Rentals"
          value={returnedRentals.length}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={Wallet}
          accent="violet"
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayment}
          icon={CreditCard}
          accent="amber"
        />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">My Rentals</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/gear">
              <ShoppingBag className="h-4 w-4" />
              Rent More Gear
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          {rentalsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : rentals && rentals.length > 0 ? (
            <div className="space-y-3">
              {rentals.map((rental) => (
                <RentalRow key={rental.id} rental={rental} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No rentals yet"
              description="Browse the catalog and rent your first piece of gear today."
              action={
                <Button asChild>
                  <Link href="/gear">Browse Gear</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">Payment History</h2>
        <div className="mt-4">
          {paymentsLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : payments && payments.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          {payment.rentalOrder?.gearItem?.name ?? payment.rentalOrderId.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">{payment.method}</td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No payments yet"
              description="Payments you make for your rentals will appear here."
              icon={PackageOpen}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function RentalRow({ rental }: { rental: IRentalOrder }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <PackageOpen className="h-6 w-6 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {rental.gearItem?.name ?? "Rental order"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(rental.startDate)} → {formatDate(rental.endDate)} ·{" "}
              {rental.quantity} item{rental.quantity > 1 ? "s" : ""} ·{" "}
              {formatCurrency(rental.totalAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RentalStatusBadge status={rental.status} />
          <RentalAction rental={rental} />
        </div>
      </CardContent>
    </Card>
  );
}

function RentalAction({ rental }: { rental: IRentalOrder }) {
  if (rental.status === "CONFIRMED") {
    return (
      <Button size="sm" asChild>
        <Link href={`/dashboard/customer/orders/${rental.id}/pay`}>
          <CreditCard className="h-4 w-4" />
          Pay Now
        </Link>
      </Button>
    );
  }
  if (rental.status === "RETURNED") {
    return <ReviewModal rental={rental} />;
  }
  return null;
}
