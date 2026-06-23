import Link from "next/link";
import { logout } from "@/features/auth/actions";
import type { CurrentUser } from "@/features/auth";
import type { NavItem } from "@/features/dashboard/navigation";

/**
 * Minimal dashboard chrome: role-aware sidebar nav + sign out. Intentionally
 * unstyled scaffolding — visual design comes later. `nav` is already filtered
 * to the viewer's permissions by getNavForRole().
 */
export function DashboardShell({
  user,
  nav,
  areaLabel,
  children,
}: {
  user: CurrentUser;
  nav: NavItem[];
  areaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, borderRight: "1px solid #ddd", padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>WECARGO</div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>{areaLabel}</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <span style={{ fontSize: 13, color: "#666" }}>
            {user.name ?? user.email ?? user.phone ?? user.id} · {user.role}
          </span>
          <form action={logout}>
            <button type="submit">Sign out</button>
          </form>
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}
