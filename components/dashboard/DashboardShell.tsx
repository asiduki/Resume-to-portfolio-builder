"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Eye,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Pencil,
  Settings,
  User,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/edit", label: "Edit Portfolio", icon: Pencil },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/preview", label: "Preview", icon: Eye },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [profile, setProfile] = useState<{
    name: string;
    username: string | null;
    image: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.success) {
          setProfile(data.user);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(href)
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-slate-200 p-3">
      {profile && (
        <Link
          href="/dashboard/profile"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
        >
          <Image
            src={profile.image || "/avatar.png"}
            alt="Avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {profile.name}
            </p>
            {profile.username && (
              <p className="truncate text-xs text-slate-500">
                @{profile.username}
              </p>
            )}
          </div>
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
    
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/dashboard" className="text-lg font-bold text-slate-900">
            Portfolio Studio
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          {nav}
          {footer}
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link href="/dashboard" className="text-lg font-bold text-slate-900">
          Portfolio Studio
        </Link>

        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <span className="text-lg font-bold text-slate-900">
                Portfolio Studio
              </span>

              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto py-4">
              {nav}
              {footer}
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
