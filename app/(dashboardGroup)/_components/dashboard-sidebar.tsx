"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { sidebarMenuItems } from "@/app/(dashboardGroup)/_config/sidebar-menu";
import { cn } from "@/lib/utils";
import type { IRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/AuthProvider";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface DashboardSidebarProps {
  role: IRole;
  userName: string;
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-background/50 backdrop-blur-xl backdrop-saturate-150 lg:flex">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{userName}</p>
          <p className="text-xs text-muted-foreground">
            {role === "CUSTOMER"
              ? "Customer"
              : role === "PROVIDER"
                ? "Provider"
                : "Admin"}
          </p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebarMenuItems[role].map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
