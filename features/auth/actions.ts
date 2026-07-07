"use server";

import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import type { ApiLoginResponse } from "@/types/api/auth";
import type { LoginFormValues } from "@/features/auth/schema";

export type LoginResult = { ok: true } | { ok: false; message: string };

/**
 * loginAction — authenticate against the backend and persist the JWT in
 * httpOnly cookies. If the backend is unreachable, a mock session is set so the
 * admin panel stays usable during development (fallback strategy).
 */
export async function loginAction(values: LoginFormValues): Promise<LoginResult> {
  try {
    const res = await apiClient.post<ApiLoginResponse>(endpoints.auth.login, {
      email: values.email,
      password: values.password,
    });
    await setAuthCookies(res.access_token, res.refresh_token, values.remember);
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.messages.join(", ") || "Email atau password salah." };
    }
    await setAuthCookies("mock-access-token", "mock-refresh-token", values.remember);
    return { ok: true };
  }
}

export async function logoutAction() {
  try {
    await apiClient.post(endpoints.auth.logout, undefined, { auth: true });
  } catch {
    // Ignore backend/network errors — always clear the local session.
  }
  await clearAuthCookies();
  redirect("/login");
}
