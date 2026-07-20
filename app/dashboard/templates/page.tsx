"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and modern portfolio for developers.",
    preview: (
      <div className="w-full h-56 bg-slate-950 p-6 flex flex-col justify-center">
        <div className="w-14 h-14 rounded-full bg-blue-500 mb-4" />
        <div className="h-4 w-2/3 bg-white/90 rounded mb-2" />
        <div className="h-3 w-1/2 bg-blue-400 rounded mb-4" />
        <div className="flex gap-2">
          <div className="h-2 w-16 bg-slate-700 rounded-full" />
          <div className="h-2 w-12 bg-slate-700 rounded-full" />
          <div className="h-2 w-14 bg-slate-700 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    id: "developer",
    name: "Developer",
    description: "Terminal style theme with developer focused design.",
    preview: (
      <div className="w-full h-56 bg-zinc-950 p-6 font-mono flex flex-col justify-center">
        <div className="h-3 w-24 bg-green-400 rounded mb-3" />
        <div className="h-5 w-3/4 bg-zinc-100 rounded mb-2" />
        <div className="h-3 w-1/2 bg-green-400/70 rounded mb-4" />
        <div className="border border-zinc-700 rounded p-3">
          <div className="h-2 w-full bg-zinc-700 rounded mb-2" />
          <div className="h-2 w-2/3 bg-zinc-700 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant light layout.",
    preview: (
      <div className="w-full h-56 bg-white p-6 flex flex-col justify-center border-b">
        <div className="h-5 w-1/2 bg-neutral-800 rounded mb-2" />
        <div className="h-3 w-1/3 bg-neutral-400 rounded mb-5" />
        <div className="h-px w-full bg-neutral-200 mb-5" />
        <div className="h-2 w-full bg-neutral-200 rounded mb-2" />
        <div className="h-2 w-5/6 bg-neutral-200 rounded mb-2" />
        <div className="h-2 w-2/3 bg-neutral-200 rounded" />
      </div>
    ),
  },
  {
    id: "creative",
    name: "Creative",
    description: "Creative colorful portfolio with gradients.",
    preview: (
      <div className="w-full h-56 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-6 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 ring-2 ring-fuchsia-400 mb-4" />
        <div className="h-4 w-2/3 bg-gradient-to-r from-fuchsia-400 to-purple-400 rounded mb-2" />
        <div className="h-3 w-1/3 bg-purple-300/60 rounded" />
      </div>
    ),
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();

      if (data.success) {
        setPortfolio(data.portfolio);
        setSelectedTemplate(data.portfolio.template);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function saveTemplate() {
    try {
      setSaving(true);

      const res = await fetch("/api/portfolio/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: selectedTemplate,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Template Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex items-center justify-between mb-10">

        <h1 className="text-4xl font-bold">
          Choose Template
        </h1>

        <button
          onClick={saveTemplate}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Save Template"}
        </button>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

        {templates.map((template) => (

          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition

              ${
                selectedTemplate === template.id
                  ? "border-blue-600"
                  : "border-gray-300"
              }
            `}
          >

            {template.preview}

            <div className="p-5">

              <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold">
                  {template.name}
                </h2>

                {selectedTemplate === template.id && (
                  <Check className="text-green-600" />
                )}

              </div>

              <p className="text-gray-500 mt-3">
                {template.description}
              </p>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-12 flex gap-5">

        <button
          onClick={() => router.push("/dashboard/preview")}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Preview
        </button>

      </div>

    </main>
  );
}