"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
  ICategory,
  ICreateGearPayload,
  IGearItem,
  IRentalOrder,
  IRentalStatus,
  IUpdateGearPayload,
} from "@/lib/types";

export function useProviderGear() {
  return useQuery({
    queryKey: ["provider", "gear"],
    queryFn: () => apiFetch<IGearItem[]>("/provider/gear").then((res) => res.data),
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: ["provider", "orders"],
    queryFn: () =>
      apiFetch<IRentalOrder[]>("/provider/orders").then((res) => res.data),
  });
}

export function useAddGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateGearPayload) =>
      apiFetch<IGearItem>("/provider/gear", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateGearPayload }) =>
      apiFetch<IGearItem>(`/provider/gear/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`/provider/gear/${id}`, { method: "DELETE" }).then(
        (res) => res.data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: IRentalStatus }) =>
      apiFetch<IRentalOrder>(`/provider/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      apiFetch<ICategory>("/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
