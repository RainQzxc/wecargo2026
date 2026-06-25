"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/features/auth/actions";
import type { CurrentUser } from "@/features/auth";

export interface ShellNavItem {
  label: string;
  href: string;
}

function useActiveHref(nav: ShellNavItem[], pathname: string): string {
  // Return the href of the most specific match (longest prefix)
  let best = "";
  for (const item of nav) {
    const match = pathname === item.href || pathname.startsWith(item.href + "/");
    if (match && item.href.length > best.length) {
      best = item.href;
    }
  }
  return best;
}

function SidebarContent({
  user,
  nav,
  areaLabel,
  activeHref,
  onNavigate,
}: {
  user: CurrentUser;
  nav: ShellNavItem[];
  areaLabel: string;
  activeHref: string;
  onNavigate?: () => void;
}) {
  const displayName = user.name ?? user.email ?? user.phone ?? "—";
  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex flex-col h-full select-none">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 shrink-0">
        <Image
          src="/logo wecargo for black bg.png"
          alt="WECARGO"
          width={976}
          height={270}
          className="h-7 w-auto object-contain"
          priority
        />
        <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1.5">{areaLabel}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {nav.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/6 mb-1.5">
          <div className="size-8 rounded-full bg-brand/25 flex items-center justify-center shrink-0 text-brand text-sm font-bold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-medium truncate">{displayName}</p>
            <p className="text-white/40 text-[11px] truncate">
              {user.role.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-[13px] text-white/50 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
          >
            Гарах
          </button>
        </form>
      </div>
    </div>
  );
}

export function DashboardShell({
  user,
  nav,
  areaLabel,
  children,
}: {
  user: CurrentUser;
  nav: ShellNavItem[];
  areaLabel: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const activeHref = useActiveHref(nav, pathname);
  const displayName = user.name ?? user.email ?? user.phone ?? "—";

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-ink">
        <SidebarContent
          user={user}
          nav={nav}
          areaLabel={areaLabel}
          activeHref={activeHref}
        />
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-ink shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
              aria-label="Хаах"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent
              user={user}
              nav={nav}
              areaLabel={areaLabel}
              activeHref={activeHref}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="h-14 flex items-center gap-3 px-4 bg-white border-b border-neutral-200 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-md hover:bg-neutral-100 text-ink-3 transition-colors"
            aria-label="Цэс нээх"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Image
            src="/logo wecargo for white bg.png"
            alt="WECARGO"
            width={976}
            height={270}
            className="lg:hidden h-6 w-auto object-contain"
          />

          <div className="flex-1" />

          <span className="hidden sm:block text-[13px] text-ink-3 truncate max-w-40">
            {displayName}
          </span>

          <form action={logout}>
            <button
              type="submit"
              className="text-[13px] text-ink-3 hover:text-ink px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
            >
              Гарах
            </button>
          </form>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
