import type { IApiResponse } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function refreshSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface ApiFetchOptions extends RequestInit {
  retried?: boolean;
}

const AUTH_ERROR_PATTERN =
  /you are not logged in|jwt expired|invalid token|invalid signature|jwt malformed|user not found\. please log in|session expired|please log in|your account has been blocked/i;

export function isDefinitiveAuthError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.status === 401) return true;
  if (error.status !== 500) return false;
  return AUTH_ERROR_PATTERN.test(error.message);
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<IApiResponse<T>> {
  const { retried, ...init } = options;

  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401 && !retried) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, retried: true });
    }
  }

  const json = (await res.json().catch(() => null)) as IApiResponse<T> | null;

  const isAuthError =
    typeof json?.message === "string" &&
    AUTH_ERROR_PATTERN.test(json.message) &&
    (res.status === 401 || res.status === 500);

  if (isAuthError && !retried) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, retried: true });
    }
  }

  if (!res.ok) {
    throw new ApiError(
      json?.message || "Something went wrong. Please try again.",
      res.status,
      json ?? null,
    );
  }

  return json as IApiResponse<T>;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
