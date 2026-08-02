"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
  IConfirmPaymentPayload,
  ICreatePaymentIntentPayload,
  ICreatePaymentIntentResponse,
  ICreateRentalPayload,
  ICreateReviewPayload,
  IPayment,
  IRentalOrder,
  IReview,
} from "@/lib/types";

export function useMyRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: () =>
      apiFetch<IRentalOrder[]>("/rentals").then((res) => res.data),
  });
}

export function useRentalById(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: () =>
      apiFetch<IRentalOrder>(`/rentals/${id}`).then((res) => res.data),
    enabled: Boolean(id),
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => apiFetch<IPayment[]>("/payments").then((res) => res.data),
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateRentalPayload) =>
      apiFetch<IRentalOrder>("/rentals", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (payload: ICreatePaymentIntentPayload) =>
      apiFetch<ICreatePaymentIntentResponse>("/payments/create", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: (payload: IConfirmPaymentPayload) =>
      apiFetch<{ success: boolean }>("/payments/confirm", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateReviewPayload) =>
      apiFetch<IReview>("/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}
