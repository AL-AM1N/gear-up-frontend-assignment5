import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-4 w-4" />
          </span>
          <span className="font-bold">GearUp</span>
          <span className="text-sm text-muted-foreground">
            Rent Sports &amp; Outdoor Gear Instantly
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/gear" className="hover:text-foreground">
            Browse Gear
          </Link>
          <Link href="/auth/register" className="hover:text-foreground">
            Become a Provider
          </Link>
          <Link href="/auth/login" className="hover:text-foreground">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
