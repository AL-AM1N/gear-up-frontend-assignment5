import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { IRole, ISidebarItem } from "@/lib/types";

export const sidebarMenuItems: Record<IRole, ISidebarItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Rentals", href: "/dashboard/customer", icon: CalendarCheck },
    { label: "Payments", href: "/dashboard/customer", icon: CreditCard },
  ],
  PROVIDER: [
    { label: "Overview", href: "/dashboard/provider", icon: LayoutDashboard },
    { label: "My Gear", href: "/dashboard/provider", icon: Package },
    {
      label: "Orders",
      href: "/dashboard/provider/orders",
      icon: ListOrdered,
    },
    { label: "Add Gear", href: "/dashboard/provider/gear/new", icon: Package },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Gear", href: "/dashboard/admin/gear", icon: Package },
    { label: "Rentals", href: "/dashboard/admin/rentals", icon: CalendarCheck },
    { label: "Moderation", href: "/dashboard/admin", icon: ShieldCheck },
  ],
};
