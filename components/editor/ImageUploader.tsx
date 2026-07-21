"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

/**
 * Generic image field for the editor. Uploads to /api/portfolio/image and
 * hands the resulting URL to onChange — persisting it is the caller's job
 * (it rides along with the normal portfolio save/autosave).
 */
export default function ImageUploader({
  label,
  value,
  onChange,
  hint,
  aspect = "video",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  /** Preview shape: "video" (16:9, project shots) or "square" (avatars). */
  aspect?: "video" | "square";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/portfolio/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Upload failed");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    // Fire-and-forget cleanup; the field clears either way and the change
    // persists through the normal save flow.
    fetch("/api/portfolio/image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: value }),
    }).catch(() => {});

    onChange("");
  }

  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div
          className={`relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50
            ${aspect === "square" ? "h-32 w-32" : "aspect-video w-full max-w-sm"}
          `}
        >
          
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/50 opacity-0 transition-opacity hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Replace
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              aria-label={`Remove ${label}`}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              <X size={14} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300
            text-slate-400 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-50
            ${aspect === "square" ? "h-32 w-32" : "aspect-video w-full max-w-sm"}
          `}
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <ImageIcon size={24} />
          )}
          <span className="text-xs font-medium">
            {uploading ? "Uploading..." : "Upload image"}
          </span>
        </button>
      )}

      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
