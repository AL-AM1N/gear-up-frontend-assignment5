import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GearForm } from "@/app/(dashboardGroup)/_components/gear-form";
import { Button } from "@/components/ui/button";

export default function NewGearPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/provider">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">List New Gear</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new item to your inventory that customers can rent.
      </p>
      <div className="mt-6">
        <GearForm mode="create" />
      </div>
    </div>
  );
}
