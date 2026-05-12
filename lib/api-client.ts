import { getSession } from "next-auth/react";
import { getSessionAccessToken } from "@/lib/session-claims";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7080/api/v1";

export async function clientFetch(path: string, options: RequestInit = {}) {
  const session = await getSession();
  const headers = new Headers(options.headers);
  const accessToken = getSessionAccessToken(session);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}
