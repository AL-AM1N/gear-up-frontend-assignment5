import { GearGridSkeleton } from "@/components/shared/gear-grid-skeleton";

export default function GearLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="h-8 w-48 skeleton-premium rounded" />
      <div className="mt-6">
        <GearGridSkeleton count={8} />
      </div>
    </div>
  );
}
