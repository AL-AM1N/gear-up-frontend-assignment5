import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { IGearItem } from "@/lib/types";
import { ShoppingBag } from "lucide-react";

interface GearCardProps {
  gear: IGearItem;
  compact?: boolean;
}

export function GearCard({ gear, compact = false }: GearCardProps) {
  return (
    <Link href={`/gear/${gear.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/60">
          {gear.image ? (
            <Image
              src={gear.image}
              alt={gear.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 dark:bg-white/10 backdrop-blur">
              {gear.category?.name ?? "Gear"}
            </Badge>
            {!gear.isAvailable && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>
        </div>
        <CardContent className={compact ? "p-4" : "p-5"}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-foreground">
                {gear.name}
              </h3>
              <p className="text-xs text-muted-foreground">{gear.brand}</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-primary">
              {formatCurrency(gear.pricePerDay)}
              <span className="text-xs font-normal text-muted-foreground">
                /day
              </span>
            </p>
          </div>
          {!compact && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {gear.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
