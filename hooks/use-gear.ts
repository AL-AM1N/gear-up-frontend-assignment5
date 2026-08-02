"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch, buildQueryString } from "@/lib/api";
import type { IApiMeta, ICategory, IGearItem } from "@/lib/types";

export interface IGearFilters {
  searchTerm?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export function useGearItems(filters: IGearFilters) {
  const qs = buildQueryString({
    searchTerm: filters.searchTerm,
    categoryId: filters.categoryId,
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
    limit: filters.limit,
  });

  return useQuery({
    queryKey: ["gear", qs],
    queryFn: () =>
      apiFetch<IGearItem[]>("/gear" + qs).then((res) => ({
        items: res.data,
        meta: res.meta as IApiMeta,
      })),
  });
}

export function useGearItem(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () =>
      apiFetch<IGearItem>(`/gear/${id}`).then((res) => res.data),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiFetch<ICategory[]>("/categories").then((res) => res.data),
  });
}
