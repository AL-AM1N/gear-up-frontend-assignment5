"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGearItem } from "@/hooks/use-gear";
import { GearForm } from "@/app/(dashboardGroup)/_components/gear-form";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: gear, isLoading, isError } = useGearItem(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/provider">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Edit Gear</h1>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError || !gear ? (
          <div className="rounded-xl border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load this gear item. It may have been removed.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/dashboard/provider">Back to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <GearForm mode="edit" initial={gear} />
        )}
      </div>
    </div>
  );
}
