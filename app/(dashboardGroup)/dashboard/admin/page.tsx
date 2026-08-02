"use client";

import Link from "next/link";
import {
  CalendarRange,
  Package,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useAdminGear, useAdminRentals, useAdminUsers } from "@/hooks/use-admin";
import { useAuth } from "@/app/providers/AuthProvider";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { RentalStatusBadge } from "@/components/shared/status-badge";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: users } = useAdminUsers();
  const { data: gear } = useAdminGear();
  const { data: rentals } = useAdminRentals();

  const blockedUsers = users?.filter((u) => u.status === "BLOCKED").length ?? 0;
  const unavailableGear = gear?.filter((g) => !g.isAvailable).length ?? 0;
  const totalRentalValue =
    rentals
      ?.filter((r) => r.status !== "CANCELLED")
      .reduce((sum, r) => sum + r.totalAmount, 0) ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {user?.name?.split(" ")[0] ?? "Admin"}. Moderate the GearUp
          platform.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered Users"
          value={users?.length ?? 0}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Blocked Users"
          value={blockedUsers}
          icon={ShieldAlert}
          accent="amber"
        />
        <StatCard
          label="Listed Gear"
          value={gear?.length ?? 0}
          icon={Package}
          accent="blue"
        />
        <StatCard
          label="Rental Order Value"
          value={formatCurrency(totalRentalValue)}
          icon={CalendarRange}
          accent="violet"
        />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">Quick Links</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <AdminLink
            href="/dashboard/admin/users"
            icon={<Users className="h-5 w-5" />}
            title="Manage Users"
            description="Suspend or reactivate user accounts."
            accent="bg-primary/10 text-primary"
          />
          <AdminLink
            href="/dashboard/admin/gear"
            icon={<Package className="h-5 w-5" />}
            title="Manage Gear"
            description={`${unavailableGear} item${unavailableGear > 1 ? "s" : ""} currently unavailable.`}
            accent="bg-blue-100 text-blue-700"
          />
          <AdminLink
            href="/dashboard/admin/rentals"
            icon={<CalendarRange className="h-5 w-5" />}
            title="All Rentals"
            description="Review every rental order across the platform."
            accent="bg-violet-100 text-violet-700"
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">Latest Rentals</h2>
        <div className="mt-4">
          {rentals && rentals.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Gear</th>
                      <th className="px-4 py-3 font-medium">Provider</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.slice(0, 5).map((rental) => (
                      <tr key={rental.id} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3">{rental.customer?.name ?? "—"}</td>
                        <td className="px-4 py-3">{rental.gearItem?.name ?? "—"}</td>
                        <td className="px-4 py-3">{rental.gearItem?.provider?.name ?? "—"}</td>
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
            <p className="text-sm text-muted-foreground">No rentals yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function AdminLink({
  href,
  icon,
  title,
  description,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent}`}>
        {icon}
      </span>
      <p className="mt-4 font-semibold group-hover:text-primary">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <span className="mt-3 inline-block text-sm font-medium text-primary">
        Manage →
      </span>
    </Link>
  );
}
