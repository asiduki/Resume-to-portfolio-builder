"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Globe,
  Loader2,
  Monitor,
  Pencil,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DEVICES = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "390px" },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

export default function PreviewPage() {
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<{
    username: string;
    published: boolean;
    template: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [device, setDevice] = useState<DeviceId>("desktop");
  const [publishing, setPublishing] = useState(false);

  const [frameKey, setFrameKey] = useState(0);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      setLoading(true);
      setLoadError(null);

      const res = await fetch("/api/portfolio");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(
          res.status === 404
            ? "No portfolio found. Upload your resume first to generate one."
            : data.message || "Failed to load your portfolio."
        );
        return;
      }

      setPortfolio(data.portfolio);
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

      if (!data.success) {
        alert(data.message);
        return;
      }

      setPortfolio(data.portfolio);
      setFrameKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />

        <p className="text-lg text-slate-700">{loadError}</p>

        <div className="flex gap-3">
          <button
            onClick={fetchPortfolio}
            className="flex items-center gap-2 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Retry
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-slate-100">
      <div className="bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold text-slate-900">
              Preview
            </h1>

            <span
              className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
                ${
                  portfolio.published
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }
              `}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  portfolio.published ? "bg-green-500" : "bg-slate-400"
                }`}
              />
              {portfolio.published ? "Published" : "Draft"}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {DEVICES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setDevice(id)}
                title={label}
                aria-label={`${label} preview`}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors
                  ${
                    device === id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }
                `}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/edit")}
              className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium"
            >
              <Pencil size={15} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={togglePublish}
              disabled={publishing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50
                ${
                  portfolio.published
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              `}
            >
              {publishing ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : portfolio.published ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </button>

            {portfolio.published && (
              <button
                onClick={() =>
                  window.open(`/portfolio/${portfolio.username}`, "_blank")
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Globe size={15} />
                <span className="hidden sm:inline">View Live</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div
          className="mx-auto h-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg transition-[max-width] duration-300"
          style={{ maxWidth: DEVICES.find((d) => d.id === device)!.width }}
        >
          <iframe
            key={frameKey}
            src={`/portfolio/${portfolio.username}?preview=1`}
            title="Portfolio preview"
            className="h-full w-full"
          />
        </div>
      </div>
    </main>
  );
}
