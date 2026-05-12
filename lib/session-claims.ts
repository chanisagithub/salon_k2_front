import type { Session } from "next-auth";

type SessionWithClaims = {
  accessToken?: unknown;
  roles?: unknown;
};

export function getSessionAccessToken(session: Session | null): string | undefined {
  const accessToken = (session as SessionWithClaims | null)?.accessToken;
  return typeof accessToken === "string" ? accessToken : undefined;
}

export function sessionHasRole(session: Session | null, role: string): boolean {
  const roles = (session as SessionWithClaims | null)?.roles;
  return Array.isArray(roles) && roles.some((item) => item === role);
}
