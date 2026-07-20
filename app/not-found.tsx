import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6 text-center">
      <h1 className="text-7xl font-bold text-blue-500">404</h1>

      <p className="text-2xl font-semibold mt-4">Page not found</p>

      <p className="text-slate-400 mt-2 max-w-md">
        The page you are looking for doesn&apos;t exist, or the portfolio has
        not been published yet.
      </p>

      <Link
        href="/"
        className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
