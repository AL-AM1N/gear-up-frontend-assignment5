"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useCreateReview } from "@/hooks/use-customer";
import { reviewSchema, type IReviewFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RatingStars } from "@/components/shared/rating-stars";
import type { IRentalOrder } from "@/lib/types";

export function ReviewModal({ rental }: { rental: IRentalOrder }) {
  const [open, setOpen] = useState(false);
  const createReview = useCreateReview();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<IReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  const rating = watch("rating");

  useEffect(() => {
    if (!open) reset({ rating: 5, comment: "" });
  }, [open, reset]);

  const onSubmit = async (values: IReviewFormValues) => {
    try {
      await createReview.mutateAsync({
        gearItemId: rental.gearItemId,
        rating: values.rating,
        comment: values.comment,
      });
      toast.success("Review submitted! Thank you for your feedback.");
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit the review.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Star className="h-4 w-4" />
          Leave Review
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Review {rental.gearItem?.name ?? "this gear"}
          </DialogTitle>
          <DialogDescription>How was your rental experience?</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Rating</Label>
            <RatingStars
              value={rating}
              onChange={(value) => setValue("rating", value)}
            />
            {errors.rating && (
              <p className="text-xs text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              rows={4}
              placeholder="Share your experience..."
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-xs text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createReview.isPending}>
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
