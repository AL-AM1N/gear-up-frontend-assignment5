"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { IGearItem, IRentalOrder, IUser, IUserStatus } from "@/lib/types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiFetch<IUser[]>("/admin/users").then((res) => res.data),
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ["admin", "gear"],
    queryFn: () =>
      apiFetch<IGearItem[]>("/admin/gear").then((res) => res.data),
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin", "rentals"],
    queryFn: () =>
      apiFetch<IRentalOrder[]>("/admin/rentals").then((res) => res.data),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: IUserStatus }) =>
      apiFetch<IUser>(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
