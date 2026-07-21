"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  BarChart3,
  Check,
  Copy,
  Eye,
  Globe,
  LayoutTemplate,
  Loader2,
  Pencil,
  RefreshCw,
} from "lucide-react";

import ResumeUploadCard from "@/components/dashboard/ResumeUploadCard";

interface ProfileUser {
  name: string;
  username: string | null;
  email: string;
  image: string;
  createdAt: string;
}

interface PortfolioSummary {
  username: string;
  published: boolean;
  updatedAt: string;
  template: string;
  profileImage: string;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setLoadError(null);

      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(data.message || "Failed to load your dashboard.");
        return;
      }

      setUser(data.user);
      setPortfolio(data.portfolio);
      setHasPortfolio(!!data.portfolio);
    } catch (err) {
      console.error(err);
      setLoadError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish() {
    if (!portfolio) return;

    try {
      setPublishing(true);

      const res = await fetch("/api/portfolio/publish", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !portfolio.published }),
      });

      const data = await res.json();

      if (data.success) {
        setPortfolio({ ...portfolio, published: data.portfolio.published });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  async function copyUrl() {
    if (!portfolio) return;

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/portfolio/${portfolio.username}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />

        <p className="text-lg text-slate-700">{loadError}</p>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!hasPortfolio) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-10 lg:min-h-screen">
        <ResumeUploadCard />
      </main>
    );
  }

  const quickActions = [
    { href: "/dashboard/edit", label: "Continue Editing", icon: Pencil },
    { href: "/dashboard/preview", label: "Preview Portfolio", icon: Eye },
    { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>

        <p className="mt-1 text-slate-500">
          Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src={user?.image || "/avatar.png"}
              alt="Avatar"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover border border-slate-200"
            />

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {user?.name}
              </p>
              {user?.username && (
                <p className="truncate text-sm text-slate-500">
                  @{user.username}
                </p>
              )}
              <p className="truncate text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="mt-5 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit Profile
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Portfolio Status</h2>

            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                portfolio!.published
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  portfolio!.published ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              {portfolio!.published ? "Published" : "Draft"}
            </span>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Template</dt>
              <dd className="font-medium capitalize text-slate-900">
                {portfolio!.template}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-slate-500">Last updated</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(portfolio!.updatedAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
            <Globe size={15} className="shrink-0 text-slate-400" />

            <Link
              href={`/portfolio/${portfolio!.username}`}
              target="_blank"
              className="min-w-0 flex-1 truncate text-sm text-blue-600 hover:underline"
            >
              /portfolio/{portfolio!.username}
            </Link>

            <button
              onClick={copyUrl}
              aria-label="Copy portfolio URL"
              className="shrink-0 rounded p-1.5 text-slate-500 hover:bg-slate-200"
            >
              {copied ? (
                <Check size={15} className="text-green-600" />
              ) : (
                <Copy size={15} />
              )}
            </button>
          </div>

          <button
            onClick={togglePublish}
            disabled={publishing}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
              portfolio!.published
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {publishing ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : portfolio!.published ? (
              "Unpublish"
            ) : (
              "Publish"
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="font-semibold text-slate-900">Quick Actions</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50"
              >
                <Icon className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
