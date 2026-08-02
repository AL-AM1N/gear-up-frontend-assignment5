import { Badge } from "@/components/ui/badge";
import type { IPaymentStatus, IRentalStatus } from "@/lib/types";

const rentalStatusConfig: Record<
  IRentalStatus,
  {
    label: string;
    variant: "warning" | "info" | "purple" | "success" | "gray" | "destructive";
  }
> = {
  PLACED: { label: "Placed", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "info" },
  PAID: { label: "Paid", variant: "purple" },
  PICKED_UP: { label: "Picked Up", variant: "success" },
  RETURNED: { label: "Returned", variant: "gray" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

const paymentStatusConfig: Record<
  IPaymentStatus,
  { label: string; variant: "warning" | "success" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "success" },
  FAILED: { label: "Failed", variant: "destructive" },
};

export function RentalStatusBadge({ status }: { status: IRentalStatus }) {
  const config = rentalStatusConfig[status] ?? rentalStatusConfig.PLACED;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: IPaymentStatus }) {
  const config = paymentStatusConfig[status] ?? paymentStatusConfig.PENDING;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
