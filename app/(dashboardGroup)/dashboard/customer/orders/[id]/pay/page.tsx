"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useRentalById } from "@/hooks/use-customer";
import { useCreatePaymentIntent, useConfirmPayment } from "@/hooks/use-customer";
import { stripePromise } from "@/lib/stripe";
import { formatCurrency, formatDate } from "@/lib/format";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: rental, isLoading } = useRentalById(id);
  const createIntent = useCreatePaymentIntent();
  const startedRef = useRef(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);

  useEffect(() => {
    if (!rental) return;
    if (startedRef.current) return;
    if (rental.status === "PLACED" || rental.status === "CONFIRMED") {
      startedRef.current = true;
      createIntent.mutate(
        { rentalOrderId: rental.id, method: "STRIPE" },
        {
          onSuccess: (data) => setClientSecret(data.clientSecret),
          onError: (err) =>
            setIntentError(
              err instanceof Error ? err.message : "Could not start the payment.",
            ),
        },
      );
    }
  }, [rental, createIntent]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Button className="mt-6" variant="outline" asChild>
          <Link href="/dashboard/customer">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const alreadyPaid = rental.status === "PAID" || rental.payment?.status === "COMPLETED";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/customer">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Complete Payment</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            {rental.gearItem?.name ?? "Rental order"}
          </CardTitle>
          <CardDescription>
            {formatDate(rental.startDate)} → {formatDate(rental.endDate)} ·{" "}
            {rental.quantity} item{rental.quantity > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-3">
            <RentalStatusBadge status={rental.status} />
            <span className="text-sm text-muted-foreground">
              {rental.gearItem?.brand ?? ""}
            </span>
          </div>
          <p className="text-2xl font-bold">
            {formatCurrency(rental.totalAmount)}
          </p>
        </CardContent>
      </Card>

      <div className="mt-6">
        {alreadyPaid ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <p className="text-lg font-semibold">Payment already completed</p>
              <p className="text-sm text-muted-foreground">
                This order has already been paid. No further action is needed.
              </p>
              <Button className="mt-2" asChild>
                <Link href="/dashboard/customer">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        ) : rental.status !== "PLACED" && rental.status !== "CONFIRMED" ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Payment is not available for an order in the{" "}
                <span className="font-medium">{rental.status}</span> status.
              </p>
            </CardContent>
          </Card>
        ) : intentError ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </span>
              <p className="text-base font-semibold">Could not start payment</p>
              <p className="text-sm text-muted-foreground">{intentError}</p>
            </CardContent>
          </Card>
        ) : clientSecret ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Card details
              </CardTitle>
              <CardDescription>
                Use any test card, e.g.{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                  4242 4242 4242 4242
                </code>
                , any future expiry and CVC.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                <CheckoutForm
                  rentalOrderId={rental.id}
                  amount={rental.totalAmount}
                  onCompleted={() => {
                    window.location.href = `/payment/success?order=${rental.id}`;
                  }}
                />
              </Elements>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center gap-3 p-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Preparing secure checkout...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({
  rentalOrderId,
  amount,
  onCompleted,
}: {
  rentalOrderId: string;
  amount: number;
  onCompleted: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmPayment = useConfirmPayment();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?order=${rentalOrderId}`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await confirmPayment.mutateAsync({
          paymentIntentId: paymentIntent.id,
          rentalOrderId,
        });
        toast.success("Payment successful!");
        onCompleted();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Payment was completed but the order could not be updated. Please contact support.",
        );
        setProcessing(false);
      }
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={!stripe || !elements}
        loading={processing}
      >
        <CreditCard className="h-4 w-4" />
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  );
}
