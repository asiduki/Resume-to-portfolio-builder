"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ToolbarButton from "./ToolbarButton";

interface Props {
  profileImage?: string;
  showToast: (message: string) => void;
}

export default function ProfileImageButton({ profileImage, showToast }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(profileImage || "");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpload(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/portfolio/profile-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Upload failed");
        return;
      }

      setImage(data.image);
      showToast("Profile image updated!");
      router.refresh();
    } catch {
      showToast("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);

      const res = await fetch("/api/portfolio/profile-image", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Delete failed");
        return;
      }

      setImage("");
      showToast("Profile image removed");
      router.refresh();
    } catch {
      showToast("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <ToolbarButton
        icon={<Camera size={18} />}
        label="Profile Image"
        onClick={() => setOpen(true)}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Image
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Preview */}
              <div className="mt-5 flex justify-center">
                {image ? (
                  <Image
                    src={image}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <ImageIcon size={40} />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading || deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {image ? "Replace" : "Upload"}
                </button>

                {image && (
                  <button
                    onClick={handleDelete}
                    disabled={uploading || deleting}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                )}
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                JPG or PNG, max 2MB
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
