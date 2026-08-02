"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/use-gear";
import { useAddGear, useUpdateGear } from "@/hooks/use-provider";
import { gearSchema, type IGearFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { IGearItem } from "@/lib/types";

interface GearFormProps {
  mode: "create" | "edit";
  initial?: IGearItem;
}

export function GearForm({ mode, initial }: GearFormProps) {
  const router = useRouter();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const addGear = useAddGear();
  const updateGear = useUpdateGear();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IGearFormValues>({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      brand: initial?.brand ?? "",
      pricePerDay: initial?.pricePerDay ?? undefined,
      quantity: initial?.quantity ?? 1,
      image: initial?.image ?? "",
      categoryId: initial?.categoryId ?? "",
      isAvailable: initial?.isAvailable ?? true,
    },
  });

  const imageUrl = watch("image");

  const onSubmit = async (values: IGearFormValues) => {
    setServerError(null);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        brand: values.brand,
        pricePerDay: values.pricePerDay,
        quantity: values.quantity,
        image: values.image || undefined,
        categoryId: values.categoryId,
        ...(mode === "edit" ? { isAvailable: values.isAvailable } : {}),
      };

      if (mode === "create") {
        await addGear.mutateAsync(payload);
        toast.success("Gear listed successfully!");
      } else {
        await updateGear.mutateAsync({ id: initial!.id, payload });
        toast.success("Gear updated successfully!");
      }
      router.push("/dashboard/provider");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save gear.";
      setServerError(message);
      toast.error(message);
    }
  };

  const busy = addGear.isPending || updateGear.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="name">Gear name</Label>
          <Input
            id="name"
            placeholder="e.g. Wilson Pro Staff Tennis Racket"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe the gear, its condition, and what's included..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" placeholder="e.g. Wilson" {...register("brand")} />
          {errors.brand && (
            <p className="text-xs text-destructive">{errors.brand.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            id="categoryId"
            placeholder={
              categoriesLoading ? "Loading categories..." : "Select a category"
            }
            disabled={categoriesLoading}
            {...register("categoryId")}
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pricePerDay">Price per day (USD)</Label>
          <Input
            id="pricePerDay"
            type="number"
            step="0.01"
            min="0"
            placeholder="25.00"
            {...register("pricePerDay")}
          />
          {errors.pricePerDay && (
            <p className="text-xs text-destructive">
              {errors.pricePerDay.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quantity">Available quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            step="1"
            {...register("quantity")}
          />
          {errors.quantity && (
            <p className="text-xs text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            placeholder="https://example.com/gear.jpg"
            {...register("image")}
          />
          {errors.image && (
            <p className="text-xs text-destructive">{errors.image.message}</p>
          )}
          {imageUrl && (
            <div className="mt-2 aspect-[4/3] max-h-56 overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Gear preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.3";
                }}
              />
            </div>
          )}
        </div>

        {mode === "edit" && (
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 md:col-span-2">
            <input
              type="checkbox"
              checked={watch("isAvailable") ?? true}
              onChange={(e) => setValue("isAvailable", e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-medium">
              Available for rent
            </span>
            <span className="text-xs text-muted-foreground">
              (uncheck to temporarily hide this item from customers)
            </span>
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="lg" loading={busy}>
          {busy ? "Saving..." : mode === "create" ? "List Gear" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/dashboard/provider")}
          disabled={busy}
        >
          Cancel
        </Button>
      </div>

      {categoriesLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading categories...
        </div>
      )}
    </form>
  );
}
