import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-10 lg:min-h-screen">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <BarChart3 className="h-7 w-7 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>

        <p className="mt-2 text-slate-500">
          Portfolio views, visitors and insights are coming soon.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
