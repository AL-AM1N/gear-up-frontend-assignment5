"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, ShoppingBag, Truck, UserRound } from "lucide-react";
import { useGearItem } from "@/hooks/use-gear";
import { useCreateRental } from "@/hooks/use-customer";
import { useAuth } from "@/app/providers/AuthProvider";
import { rentalSchema, type IRentalFormValues } from "@/lib/validations";
import { daysBetween, formatCurrency, formatDate, todayISO } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RatingStars } from "@/components/shared/rating-stars";
import { roleDashboard } from "@/lib/auth";

export default function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: gear, isLoading, isError } = useGearItem(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] skeleton-premium rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 skeleton-premium rounded" />
            <div className="h-4 w-1/3 skeleton-premium rounded" />
            <div className="h-24 skeleton-premium rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !gear) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold">Gear not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This gear item may have been removed or the link is incorrect.
        </p>
        <Button className="mt-6" variant="outline" asChild>
          <Link href="/gear">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </Button>
      </div>
    );
  }

  const averageRating = gear.reviews?.length
    ? gear.reviews.reduce((sum, r) => sum + r.rating, 0) / gear.reviews.length
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/gear"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all gear
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted/60">
          {gear.image ? (
            <Image
              src={gear.image}
              alt={gear.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-16 w-16" />
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 dark:bg-white/10 backdrop-blur">
              {gear.category?.name ?? "Gear"}
            </Badge>
            {gear.isAvailable && gear.quantity > 0 ? (
              <Badge variant="success">Available</Badge>
            ) : (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{gear.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Brand: {gear.brand}</span>
              <span className="flex items-center gap-1">
                <RatingStars value={averageRating} readonly size={15} />
                <span>
                  ({gear.reviews?.length ?? 0}{" "}
                  {gear.reviews?.length === 1 ? "review" : "reviews"})
                </span>
              </span>
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold text-primary">
            {formatCurrency(gear.pricePerDay)}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            {gear.quantity} unit{gear.quantity > 1 ? "s" : ""} available for
            rent
          </div>

          <p className="mt-5 whitespace-pre-line text-foreground/90">
            {gear.description}
          </p>

          {gear.provider && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <UserRound className="h-5 w-5 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {gear.provider.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gear provider · {gear.provider.address || "Local pickup"}
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6">
            <RentNowPanel gearId={gear.id} pricePerDay={gear.pricePerDay} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">Reviews</h2>
        {gear.reviews?.length ? (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gear.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {review.customer?.name ?? "Customer"}
                    </p>
                    <RatingStars value={review.rating} readonly size={14} />
                  </div>
                  <p className="mt-3 text-sm text-foreground/90">
                    {review.comment}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            No reviews yet. Rent this gear and be the first to leave a review!
          </p>
        )}
      </section>
    </div>
  );
}

function RentNowPanel({
  gearId,
  pricePerDay,
}: {
  gearId: string;
  pricePerDay: number;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const createRental = useCreateRental();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      quantity: 1,
      startDate: todayISO(),
      endDate: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const quantity = watch("quantity");

  const days =
    startDate && endDate && new Date(endDate) > new Date(startDate)
      ? daysBetween(startDate, endDate)
      : 0;
  const total = days * pricePerDay * (Number(quantity) || 0);

  const onSubmit = async (values: IRentalFormValues) => {
    if (!user) {
      toast.info("Please log in to rent this gear");
      router.push(`/auth/login?next=/gear/${gearId}`);
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error(
        user.role === "PROVIDER"
          ? "Providers cannot rent gear. Use a customer account to rent."
          : "Admins cannot rent gear. Use a customer account to rent.",
      );
      router.push(roleDashboard(user.role));
      return;
    }

    setSubmitting(true);
    try {
      const rental = await createRental.mutateAsync({
        gearItemId: gearId,
        quantity: values.quantity,
        startDate: values.startDate,
        endDate: values.endDate,
      });
      toast.success("Rental order placed successfully!");
      router.push(`/dashboard/customer/orders/${rental.id}/pay`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to place the rental order.";
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4 text-primary" />
          Rent this gear
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                min={todayISO()}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-xs text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                type="date"
                min={startDate || todayISO()}
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {days > 0
                ? `${days} day${days > 1 ? "s" : ""} × ${formatCurrency(
                    pricePerDay,
                  )} × ${quantity || 0}`
                : "Select your dates"}
            </span>
            <span className="text-lg font-bold text-primary">
              {days > 0 ? formatCurrency(total) : "—"}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={submitting}
          >
            {user ? "Rent Now" : "Login to Rent"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
