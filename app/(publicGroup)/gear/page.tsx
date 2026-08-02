"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCategories, useGearItems } from "@/hooks/use-gear";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { GearCard } from "@/components/shared/gear-card";
import { GearGridSkeleton } from "@/components/shared/gear-grid-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";

const LIMIT = 12;

function GearBrowser() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const filters = useMemo(() => {
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    return {
      searchTerm: searchParams.get("search") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
      page,
      limit: LIMIT,
    };
  }, [searchParams]);

  const gearQuery = useGearItems(filters);
  const categories = useCategories();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const applySearch = () => {
    updateParams({ search });
  };

  const clearFilters = () => {
    setSearch("");
    router.replace(pathname);
  };

  const hasFilters = [...searchParams.keys()].length > 0;

  const meta = gearQuery.data?.meta;
  const page = filters.page;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Gear</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta?.total
              ? `${meta.total} item${meta.total > 1 ? "s" : ""} available to rent`
              : "Find the perfect gear for your next adventure."}
          </p>
        </div>
        <form
          className="flex w-full gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            applySearch();
          }}
        >
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, brand, description..."
              className="pl-9"
            />
          </div>
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <Card className="h-fit w-full shrink-0 lg:w-64">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={filters.categoryId ?? ""}
                onChange={(e) =>
                  updateParams({ categoryId: e.target.value || null })
                }
                placeholder="All categories"
              >
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={filters.brand ?? ""}
                onChange={(e) => updateParams({ brand: e.target.value || null })}
                placeholder="e.g. Decathlon"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Price per day ($)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    updateParams({ minPrice: e.target.value || null })
                  }
                  placeholder="Min"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="number"
                  min="0"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    updateParams({ maxPrice: e.target.value || null })
                  }
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select
                id="sortBy"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  updateParams({ sortBy, sortOrder });
                }}
              >
                <option value="createdAt-desc">Newest first</option>
                <option value="pricePerDay-asc">Price: low to high</option>
                <option value="pricePerDay-desc">Price: high to low</option>
                <option value="name-asc">Name: A to Z</option>
              </Select>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-destructive"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex-1">
          {gearQuery.isLoading ? (
            <GearGridSkeleton count={8} />
          ) : gearQuery.isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
              Failed to load gear. Please make sure the GearUp backend is
              running and try again.
            </div>
          ) : gearQuery.data?.items.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {gearQuery.data.items.map((gear) => (
                  <GearCard key={gear.id} gear={gear} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  page={page}
                  totalPages={meta?.totalPages ?? 1}
                  onPageChange={(p) => updateParams({ page: String(p) })}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No gear matches your filters"
              description="Try adjusting your search or clearing the filters to see more results."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function GearPage() {
  return (
    <Suspense fallback={<GearGridSkeleton count={8} />}>
      <GearBrowser />
    </Suspense>
  );
}
