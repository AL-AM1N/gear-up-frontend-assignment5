import type { IRole } from "@/lib/types";

export const USER_COOKIE = "gearup_user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: IRole;
}

export function decodeJWT(token: string): AuthUser | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(json);
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role as IRole,
    };
  } catch {
    return null;
  }
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getStoredUser(): AuthUser | null {
  if (!isClient()) return null;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${USER_COOKIE}=`))
    ?.split("=")[1];
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (!isClient()) return;
  const value = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${USER_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
}

export function clearStoredUser(): void {
  if (!isClient()) return;
  document.cookie = `${USER_COOKIE}=; path=/; max-age=0`;
}

export function roleDashboard(role: IRole): string {
  switch (role) {
    case "CUSTOMER":
      return "/dashboard/customer";
    case "PROVIDER":
      return "/dashboard/provider";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
  }
}

export function roleLabel(role: IRole): string {
  switch (role) {
    case "CUSTOMER":
      return "Customer";
    case "PROVIDER":
      return "Provider";
    case "ADMIN":
      return "Admin";
    default:
      return role;
  }
}
