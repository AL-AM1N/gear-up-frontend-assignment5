import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <PackageSearch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-3xl font-bold tracking-tight">404</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The page or gear item you are looking for does not exist or has been
          removed.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/gear">Browse Gear</Link>
          </Button>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
