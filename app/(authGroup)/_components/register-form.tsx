"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, Store, UserRound, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { registerSchema, type IRegisterFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      phone: "",
      address: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: IRegisterFormValues) => {
    setServerError(null);
    try {
      const payload: Record<string, unknown> = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      };
      if (values.phone) payload.phone = values.phone;
      if (values.address) payload.address = values.address;

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Account created successfully! Please log in.");
      router.push("/auth/login");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join GearUp as a customer or a gear provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-1.5 block">I want to</Label>
            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                active={selectedRole === "CUSTOMER"}
                icon={<UserRound className="h-5 w-5" />}
                title="Rent gear"
                subtitle="Customer"
                onClick={() => setValue("role", "CUSTOMER")}
              />
              <RoleOption
                active={selectedRole === "PROVIDER"}
                icon={<Store className="h-5 w-5" />}
                title="Lend gear"
                subtitle="Provider"
                onClick={() => setValue("role", "PROVIDER")}
              />
            </div>
            {errors.role && (
              <p className="mt-1 text-xs text-destructive">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Alex Smith"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {selectedRole === "PROVIDER" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  autoComplete="tel"
                  placeholder="+880 1XXXXXXXXX"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Pickup address</Label>
                <Input
                  id="address"
                  placeholder="Shop / store location"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </>
          )}

          <Button type="submit" className="w-full" size="lg">
            <UserPlus className="h-4 w-4" />
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function RoleOption({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 px-4 py-4 text-center transition-colors",
        active
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40",
      )}
    >
      <span className={cn(active && "text-primary")}>{icon}</span>
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs">{subtitle}</span>
    </button>
  );
}
