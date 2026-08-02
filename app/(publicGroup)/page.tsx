"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarCheck2, CalendarDays, CreditCard, Search, ShieldCheck, Sparkles, Store } from "lucide-react";
import { useCategories, useGearItems } from "@/hooks/use-gear";
import { Button } from "@/components/ui/button";
import { GearCard } from "@/components/shared/gear-card";
import { GearGridSkeleton } from "@/components/shared/gear-grid-skeleton";
import { RatingStars } from "@/components/shared/rating-stars";

export default function HomePage() {
  const featured = useGearItems({ limit: 8, sortBy: "createdAt", sortOrder: "desc" });
  const categories = useCategories();

  return (
    <div>
      <section className="relative">
        <Image
          src="https://images.unsplash.com/photo-1728997907990-e8546a7fdc01?q=80&w=1948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sports and outdoor gear"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
              🏋️ Rent Sports &amp; Outdoor Gear Instantly
            </p>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Gear up for your next adventure,{" "}
              <span className="text-primary">without buying gear</span>
            </h1>
            <p className="mt-5 text-lg text-white/85">
              Browse sports and outdoor equipment from trusted local providers,
              pick your rental dates, and check out securely — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/gear">
                  Browse Gear
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/auth/register">Become a Provider</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                title: "Flexible dates",
                desc: "Rent by the day for any length of trip.",
              },
              {
                icon: ShieldCheck,
                title: "Trusted providers",
                desc: "Vetted gear shops in your community.",
              },
              {
                icon: CreditCard,
                title: "Secure payments",
                desc: "Powered by Stripe checkout.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass rounded-xl border p-5"
              >
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Find the right gear for your activity.
        </p>
        <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
            {categories.isLoading &&
            Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-24 w-32 shrink-0 skeleton-premium rounded-xl"
              />
            ))}
            {categories.data?.map((category) => (
              <Link
                key={category.id}
                href={`/gear?categoryId=${category.id}`}
                className="group flex w-32 shrink-0 flex-col justify-between rounded-xl border border-border bg-background/40 p-4 backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
              <span className="text-sm font-semibold group-hover:text-primary">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {category._count?.gearItems ?? 0} items
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured gear</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Newest additions to the rental market.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/gear">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6">
          {featured.isLoading ? (
            <GearGridSkeleton />
          ) : featured.isError ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
              Failed to load gear. Please make sure the GearUp backend is
              running and try again.
            </p>
          ) : featured.data?.items.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.data.items.map((gear) => (
                <GearCard key={gear.id} gear={gear} compact />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No gear available yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Renting gear in three easy steps
          </h2>
          <p className="mt-2 text-muted-foreground">
            No more buying gear you use once a year. Rent exactly what you need,
            only when you need it.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Search,
              step: "Step 1",
              title: "Browse the catalog",
              desc: "Explore bikes, tents, cameras, and more from trusted local providers near you.",
            },
            {
              icon: CalendarCheck2,
              step: "Step 2",
              title: "Pick your dates",
              desc: "Choose the rental period and quantity that fits your trip, then check out securely.",
            },
            {
              icon: Sparkles,
              step: "Step 3",
              title: "Rent & enjoy",
              desc: "Pick up your gear, hit the trail, and return it when you're done — hassle free.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass rounded-xl border p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-background/40 p-8 backdrop-blur-md sm:grid-cols-4">
          {[
            {
              label: "Gear items listed",
              value: `${featured.data?.meta?.total ?? "500"}+`,
            },
            {
              label: "Categories",
              value: `${categories.data?.length ?? 30}+`,
            },
            { label: "Trusted providers", value: "50+" },
            { label: "Rentals completed", value: "1k+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/25 via-background to-background px-6 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight">
            Turn your gear into income
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
            Have bikes, cameras, or camping equipment gathering dust? List them
            on GearUp and earn every time someone rents them.
          </p>
          <Button size="lg" className="relative mt-8" asChild>
            <Link href="/auth/register">
              <Store className="h-4 w-4" />
              Become a Provider
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Loved by renters
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            What people say about GearUp
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              name: "Sofia M.",
              role: "Weekend camper",
              quote:
                "Rented a full camping setup for a weekend trip in minutes. Pickup was smooth and the gear was spotless.",
              rating: 5,
            },
            {
              name: "Daniel R.",
              role: "Mountain biker",
              quote:
                "Renting a high-end bike for a trail day costs a fraction of buying one. Fast booking and great condition.",
              rating: 5,
            },
            {
              name: "Amina K.",
              role: "Event organizer",
              quote:
                "GearUp saved me on a last-minute event. Found tents and chairs from local providers with secure checkout.",
              rating: 4,
            },
          ].map((item) => (
            <div key={item.name} className="glass rounded-xl border p-6">
              <RatingStars value={item.rating} readonly size={16} />
              <p className="mt-4 text-sm leading-relaxed">“{item.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {item.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
