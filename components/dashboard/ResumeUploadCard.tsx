"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";

// Resume upload flow, shown on the dashboard home when the user has no
// portfolio yet. Same POST /api/resume/upload contract as before.
export default function ResumeUploadCard() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a resume.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage("Portfolio generated successfully!");

      setTimeout(() => {
        router.push(`/portfolio/${data.portfolio.username}`);
      }, 1500);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-center text-slate-900">
        AI Portfolio Generator
      </h1>

      <p className="text-center text-slate-500 mt-2">
        Upload your resume and let AI build your portfolio.
      </p>

      <div className="mt-10">
        <label
          htmlFor="resume"
          className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
        >
          <Upload className="h-12 w-12 text-blue-500" />

          <p className="mt-4 font-medium text-slate-900">
            Click to upload Resume
          </p>

          <p className="text-sm text-slate-500 mt-1">PDF only</p>

          <input
            id="resume"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {file && (
          <div className="mt-5 flex items-center gap-3 rounded-lg bg-slate-100 p-4">
            <FileText className="text-green-600" />
            <span className="truncate text-slate-900">{file.name}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Generating Portfolio...
            </div>
          ) : (
            "Generate Portfolio"
          )}
        </button>

        {message && (
          <div className="mt-6 rounded-lg bg-slate-100 p-4 text-center text-slate-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
