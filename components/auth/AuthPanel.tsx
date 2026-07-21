import { Sparkles, FileText, Palette, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Upload your resume",
    text: "AI turns your PDF into a complete portfolio in seconds.",
  },
  {
    icon: Palette,
    title: "Pick a template",
    text: "Modern, minimal, developer or creative — switch anytime.",
  },
  {
    icon: Globe,
    title: "Publish your link",
    text: "Share your own /portfolio/username URL with the world.",
  },
];


export default function AuthPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 lg:flex">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-400" />
          <span className="text-xl font-bold text-white">
            Portfolio Studio
          </span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Your resume,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              reborn as a portfolio.
            </span>
          </h2>

          <ul className="mt-10 space-y-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-slate-500">
          © {new Date().getFullYear()} Portfolio Studio
        </p>
      </div>

      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
