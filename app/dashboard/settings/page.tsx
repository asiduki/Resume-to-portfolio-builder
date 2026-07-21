import Link from "next/link";
import { ChevronRight, Settings, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Settings className="h-7 w-7 text-slate-700" />
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      <Link
        href="/dashboard/profile"
        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
            <User className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Profile</p>
            <p className="text-sm text-slate-500">
              Name, username, email and profile photo
            </p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400" />
      </Link>

      <p className="mt-8 text-center text-sm text-slate-400">
        More settings coming soon.
      </p>
    </main>
  );
}
