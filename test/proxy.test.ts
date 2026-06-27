import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { ROUTES } from "@/constants/routes";

const SESSION_COOKIE = "wecargo_session";

function request(path: string, withSession: boolean): NextRequest {
  const req = new NextRequest(new URL(`https://app.example.com${path}`));
  if (withSession) req.cookies.set(SESSION_COOKIE, "any-value");
  return req;
}

describe("proxy auth gate", () => {
  it("redirects unauthenticated dashboard requests to login", () => {
    const res = proxy(request("/dashboard/admin", false));
    expect(res.status).toBe(307); // Next redirect
    const location = res.headers.get("location")!;
    const url = new URL(location);
    expect(url.pathname).toBe(ROUTES.login);
  });

  it("preserves the originally requested path in ?next=", () => {
    const res = proxy(request("/dashboard/super-admin/users", false));
    const url = new URL(res.headers.get("location")!);
    expect(url.searchParams.get("next")).toBe("/dashboard/super-admin/users");
  });

  it("passes through requests that carry a session cookie", () => {
    const res = proxy(request("/dashboard/admin", true));
    // NextResponse.next() does not issue a redirect.
    expect(res.headers.get("location")).toBeNull();
  });

  it("only gates the /dashboard subtree via its matcher", async () => {
    const { config } = await import("@/proxy");
    expect(config.matcher).toContain("/dashboard/:path*");
  });
});
