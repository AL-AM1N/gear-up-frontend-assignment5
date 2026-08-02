import { DashboardSidebar } from "@/app/(dashboardGroup)/_components/dashboard-sidebar";
import { getMe } from "@/service/getMe";
import type { IRole } from "@/lib/types";

const ROLES: IRole[] = ["CUSTOMER", "PROVIDER", "ADMIN"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();

  const user = me?.data?.user ?? null;
  const role: IRole | undefined = ROLES.includes(user?.role)
    ? (user.role as IRole)
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6">
      {role && user ? (
        <DashboardSidebar role={role} userName={user.name} />
      ) : null}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
